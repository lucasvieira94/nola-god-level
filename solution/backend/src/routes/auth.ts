import express from "express";
import {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", authMiddleware, getProfile);

export default router;
