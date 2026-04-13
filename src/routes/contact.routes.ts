import { Router } from "express";
import {
  createContactMessage,
  getAllContactMessages,
} from "../controllers/contact.controller";

const router = Router();

router.post("/", createContactMessage);
router.get("/", getAllContactMessages);

export default router;