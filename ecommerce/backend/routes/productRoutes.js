import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// GET all products
router.get("/products", getProducts);

// GET single product
router.get("/products/:id", getProductById);

// CREATE product (Admin only)
router.post("/products", protect, admin, createProduct);

// UPDATE product (Admin only)
router.put("/products/:id", protect, admin, updateProduct);

// DELETE product (Admin only)
router.delete("/products/:id", protect, admin, deleteProduct);

export default router;
