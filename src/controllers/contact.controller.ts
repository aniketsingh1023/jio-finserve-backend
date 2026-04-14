import { prisma } from "../lib/prisma";
import { AppError, handleError } from "../utils/errors";

const nameRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const phoneRegex = /^[6-9]\d{9}$/;

export const createContactMessage = async (req: any, res: any) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name?.trim()) {
      throw new AppError("Name is required", 400);
    }

    if (!email?.trim()) {
      throw new AppError("Email is required", 400);
    }

    if (!phone?.trim()) {
      throw new AppError("Phone is required", 400);
    }

    if (!message?.trim()) {
      throw new AppError("Message is required", 400);
    }

    if (!nameRegex.test(name.trim())) {
      throw new AppError("Name can contain only letters and spaces", 400);
    }

    if (!emailRegex.test(email.trim().toLowerCase())) {
      throw new AppError("Email must be a valid @gmail.com address", 400);
    }

    if (!phoneRegex.test(String(phone).trim())) {
      throw new AppError("Phone number must be exactly 10 digits and start with 6-9", 400);
    }

    if (subject && subject.trim().length > 100) {
      throw new AppError("Subject must be under 100 characters", 400);
    }

    if (message.trim().length < 10) {
      throw new AppError("Message must be at least 10 characters long", 400);
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: String(phone).trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
        status: "Unread",
      },
    });

    res.status(201).json({
      message: "Contact message submitted successfully",
      data: contactMessage,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const getAllContactMessages = async (_req: any, res: any) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Contact messages fetched successfully",
      count: messages.length,
      data: messages,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const deleteContactMessage = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Contact message id is required", 400);
    }

    const message = await prisma.contactMessage.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Contact message deleted successfully",
      data: message,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

export const updateContactStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw new AppError("Contact message id is required", 400);
    }

    if (!status) {
      throw new AppError("Status is required", 400);
    }

    const validStatuses = ["Unread", "Read"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Status must be one of: ${validStatuses.join(", ")}`, 400);
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      message: "Contact message status updated successfully",
      data: message,
    });
  } catch (err) {
    return handleError(err, res);
  }
};