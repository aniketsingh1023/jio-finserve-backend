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
import { adminMiddleware } from "../middleware/admin.middleware";
import { loanDocumentsUpload } from "../middleware/upload.middleware";

const router = express.Router();

// User routes
router.post("/", authMiddleware, loanDocumentsUpload, createLoanApplication);
router.get("/my", authMiddleware, getMyApplications);
router.get("/:id", authMiddleware, getLoanApplicationById);

// Admin routes
router.get("/admin/all", adminMiddleware, getAllApplications);
router.put("/:id/admin", adminMiddleware, updateApplicationStatus);
router.delete("/:id/admin", adminMiddleware, deleteLoanApplication);

export default router;