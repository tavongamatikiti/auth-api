import express from "express";
import {
  deleteProfile,
  forgotPassword,
  login,
  logout,
  register,
  resendOTP,
  resetPassword,
  updateProfile,
  verifyOTP,
} from "../controllers/authController.js";
import authenticate from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/logout", authenticate, logout);
router
  .route("/:id")
  .delete(authenticate, deleteProfile)
  .put(authenticate, updateProfile);
router.post("/resend-otp", resendOTP);

export default router;
