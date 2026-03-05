import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
