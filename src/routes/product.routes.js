import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, } from "../controllers/product.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { createProductSchema } from "../validators/product.validator";
import { validate } from "../middleware/validate.middleware";
const router = Router();
/**
 * Public Routes
 */
router.get("/", getProducts);
router.get("/:id", getProductById);
/**
 * Seller Only Routes
 */
router.post("/", protect, authorize("seller"), validate(createProductSchema), createProduct);
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);
export default router;
