import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';

// Configure multer for storing files in memory
const storage: StorageEngine = multer.memoryStorage();

// File filter to accept only PDFs
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Allow only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error(`Only PDF files are allowed. Received: ${file.mimetype}`));
  }
};

// Multer configurations
export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * Middleware for handling loan application file uploads
 * Accepts two PDF files: 'aadhar' and 'pan'
 */
export const loanDocumentsUpload = uploadPDF.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
]);
