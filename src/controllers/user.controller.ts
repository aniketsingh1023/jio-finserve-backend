import { prisma } from "../lib/prisma";
import { AppError, handleError } from "../utils/errors";

/**
 * GET /api/users/me
 * Get current logged-in user profile
 */
export const getCurrentUser = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        pincode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * PUT /api/users/me
 * Update current logged-in user profile
 */
export const updateProfile = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { name, phone, gender, dob, address, city, pincode } = req.body;

    // Validate that at least one field is provided
    if (!name && !phone && !gender && !dob && !address && !city && !pincode) {
      throw new AppError("No fields to update provided", 400);
    }

    // Check if phone is already in use by another user
    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new AppError("Phone number already in use", 409);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(gender && { gender }),
        ...(dob && { dob: new Date(dob) }),
        ...(address && { address }),
        ...(city && { city }),
        ...(pincode && { pincode }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        pincode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * GET /api/users/admin/all
 * Get all users (admin endpoint)
 */
export const getAllUsers = async (_req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        pincode: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "All users retrieved successfully",
      users,
      count: users.length,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * DELETE /api/users/:id/admin
 * Delete user (admin endpoint)
 */
export const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new AppError("User id is required", 400);
    }

    const user = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
      },
    });

    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    return handleError(err, res);
  }
};
