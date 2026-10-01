import { User } from "../../schemas/user-schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isValidLocation } from "../../utils/location.js";

const SALT_ROUND = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const signAuthToken = (user) =>
  jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "14d",
  });

const publicAddress = (address) =>
  address?.street
    ? {
        street: address.street,
        details: address.details ?? "",
        lat: address.lat,
        lng: address.lng,
      }
    : null;

const publicUser = (user) => ({
  _id: user._id,
  email: user.email,
  role: user.role,
  address: publicAddress(user.address),
});

export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return response.status(401).json({ message: "password did not match" });
    }

    response.status(200).json({
      message: "user found",
      user: publicUser(user),
      token: signAuthToken(user),
    });
  } catch (err) {
    console.error("loginController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};

export const signUpController = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "email and password are required" });
    }

    if (await User.findOne({ email })) {
      return response.status(409).json({ message: "email already registered" });
    }

    const user = await User.create({
      email,
      password: await bcrypt.hash(password, SALT_ROUND),
    });

    response.status(201).json({
      message: "user created",
      user: publicUser(user),
      token: signAuthToken(user),
    });
  } catch (err) {
    console.error("signUpController error:", err);
    response.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAddressController = async (request, response) => {
  try {
    const { street, details = "", lat, lng } = request.body;

    if (typeof street !== "string" || !street.trim()) {
      return response.status(400).json({ message: "street is required" });
    }
    if (typeof details !== "string") {
      return response.status(400).json({ message: "details must be text" });
    }
    if (!isValidLocation({ lat, lng })) {
      return response.status(400).json({ message: "invalid location" });
    }

    // The token only carries email and role, so look the user up by email.
    const user = await User.findOneAndUpdate(
      { email: request.user.email },
      { address: { street: street.trim(), details: details.trim(), lat, lng } },
      { new: true },
    );
    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }

    response.status(200).json({ message: "address saved", user: publicUser(user) });
  } catch (err) {
    console.error("updateAddressController error:", err);
    response.status(500).json({ message: "Internal Service Error" });
  }
};
