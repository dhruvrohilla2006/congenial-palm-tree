import { Router } from "express";
import upload from "../libs/multer.cjs";
import {
  createFood,
  deleteFood,
  foodHome,
  getAllFoods,
  getFoodById,
  updateFood,
} from "../Controller/food.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { roleMiddleware } from "../Middleware/role.middleware.js";

const router = Router();

router.post("/foodimage", upload.array("images"), foodHome);
router.get("/", getAllFoods);
router.get("/:id", getFoodById);

// Admin-only routes with image upload
router.post(
  "/",
  authMiddleware,
  roleMiddleware,
  upload.array("images"),
  createFood,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware,
  upload.single("image"),
  updateFood,
);
router.delete("/:id", authMiddleware, roleMiddleware, deleteFood);

export default router;
