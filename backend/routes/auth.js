import express from "express";
import {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  getCurrentUser,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  validateRegister,
  validateLogin,
  validateOTP,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/verify-otp", validateOTP, verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/logout", logout);

// Forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-reset-otp", verifyPasswordResetOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getCurrentUser);

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validateProfileUpdate, updateProfile);

export default router;
