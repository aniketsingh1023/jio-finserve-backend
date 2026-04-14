import { Router } from "express";
import {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
  updateContactStatus,
} from "../controllers/contact.controller";

const router = Router();

router.post("/", createContactMessage);
router.get("/", getAllContactMessages);
router.delete("/:id", deleteContactMessage);
router.put("/:id", updateContactStatus);

export default router;