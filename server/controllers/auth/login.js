import { User } from "../../schemas/user-schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUND = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const signAuthToken = (user) => {
  console.log(user);
  return jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "14d",
  });
};

export const loginController = async (request, response) => {
  try {
    console.log("hello");
    const { email, password } = request.body;

    const user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return response.status(401).json({ message: "password did not match" });
    }
    const token = signAuthToken(user);

    response.status(200).json({ message: "user found", user: user, token });
  } catch (err) {
    response.status(500).json({ message: "Internal Service Error" });
  }
};