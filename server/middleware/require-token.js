import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const requireToken = (request, response, next) => {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "Token required" });
  }
  try {
    request.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
};
