import { Router } from "express";
import { roleMiddleware } from "../Middleware/role.middleware.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { createOrder, getMyOrders } from "../Controller/order.controller.js";

const router = Router();

// User-only routes
router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);

// // Admin-only routes
// router.get("/", authMiddleware, roleMiddleware, getAllOrders);
// router.put("/:id", authMiddleware, roleMiddleware, updateOrderStatus);

export default router;
