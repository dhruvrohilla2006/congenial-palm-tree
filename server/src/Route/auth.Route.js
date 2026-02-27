import { Router } from "express";
import { register, login } from "../Controller/auth.controller.js";

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

export default router;
