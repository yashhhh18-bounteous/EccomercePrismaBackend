import { Router } from "express";
import {
  addFeatured,
  getFeatured,
  removeFeatured,
} from "../controllers/featured.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { addFeaturedBulk } from "../controllers/featured.controller";

const router = Router();

/**
 * Public
 */
router.get("/", getFeatured);

/**
 * Seller Only
 */




router.post(
  "/bulk",
  protect,
  authorize("seller"),
  addFeaturedBulk
);
router.post(
  "/",
  protect,
  authorize("seller"),
  addFeatured
);

router.delete(
  "/:productId",
  protect,
  authorize("seller"),
  removeFeatured
);

export default router;