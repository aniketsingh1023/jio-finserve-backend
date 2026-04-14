import express from "express";
import { getCurrentUser, updateProfile, getAllUsers, deleteUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get("/me", getCurrentUser);

// Update current user profile
router.put("/me", updateProfile);

// Admin routes
router.get("/admin/all", getAllUsers);
router.delete("/:id/admin", deleteUser);

export default router;
