import express from "express";
import {
  createLoanApplication,
  getMyApplications,
  getLoanApplicationById,
} from "../controllers/loan-application.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All loan application routes require authentication
router.use(authMiddleware);

// Create a new loan application
router.post("/", createLoanApplication);

// Get all applications for the current user
router.get("/my", getMyApplications);

// Get a specific application by ID
router.get("/:id", getLoanApplicationById);

export default router;
