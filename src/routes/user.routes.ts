import express from "express";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// User self routes
router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, updateProfile);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllUsers);
router.delete("/:id/admin", adminMiddleware, deleteUser);

export default router;