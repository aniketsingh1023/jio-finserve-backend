import express from "express";
import {
  createLoanApplication,
  getMyApplications,
  getLoanApplicationById,
  getAllApplications,
  updateApplicationStatus,
  deleteLoanApplication,
} from "../controllers/loan-application.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { loanDocumentsUpload } from "../middleware/upload.middleware";

const router = express.Router();

// All loan application routes require authentication
router.use(authMiddleware);

// Create a new loan application with file uploads for PDFs
router.post("/", loanDocumentsUpload, createLoanApplication);

// Get all applications for the current user
router.get("/my", getMyApplications);

// Get a specific application by ID
router.get("/:id", getLoanApplicationById);

// Admin routes
router.get("/admin/all", getAllApplications);
router.put("/:id/admin", updateApplicationStatus);
router.delete("/:id/admin", deleteLoanApplication);

export default router;
