import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (id: number, role: "buyer" | "seller") => {
  return jwt.sign(
    { id, role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};