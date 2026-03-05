import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

/**
 * Buyer-only route
 */
router.get("/buyer-area", protect, authorize("buyer"), (_req, res) => {
  res.json({
    message: "Welcome buyer 🛒",
  });
});

/**
 * Seller-only route
 */
router.get("/seller-area", protect, authorize("seller"), (_req, res) => {
  res.json({
    message: "Welcome seller 🏪",
  });
});

/**
 * Shared route
 */
router.get(
  "/shared",
  protect,
  authorize("buyer", "seller"),
  (_req, res) => {
    res.json({
      message: "Welcome buyer or seller 🤝",
    });
  }
);

export default router;