/**
 * Role-Based Access Control Middleware
 * Usage: authorize("seller") or authorize("buyer", "seller")
 */
export const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: "Forbidden: insufficient permissions",
        });
    }
    next();
};
