import { Router } from "express";
import { register, login } from "../Controller/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { roleMiddleware } from "../Middleware/role.middleware.js";

const router = Router();

router.get("/", async (request, response) => {
  try {
    return response.status(200).json({
      message: "Hello From Auth Route",
    });
  } catch (error) {
    console.log("Error at register api /");
    return response.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/register", register);
router.get("/login", login);
router.get(
  "/checkAuth",
  authMiddleware,
  roleMiddleware,
  async (request, response) => {
    try {
      return response.status(200).json({
        message: "You are authenticated and have the required role",
        userId: request.userId,
        role: request.role,
      });
    } catch (error) {
      console.log("Error at checkAuth api /checkAuth");
      return response.status(500).json({
        message: "Server Error",
      });
    }
  },
);

export default router;
