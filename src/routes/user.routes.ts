import express from "express";
import { getCurrentUser, updateProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get("/me", getCurrentUser);

// Update current user profile
router.put("/me", updateProfile);

export default router;
