import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateSignup, validateLogin } from "../validators/auth.validator";
import { AppError, handleError } from "../utils/errors";

// Load from env
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * POST /api/auth/signup
 * Register a new user
 */
export const signup = async (req: any, res: any) => {
  try {
    console.log("========== SIGNUP REQUEST START ==========");
    console.log("Signup route hit");
    console.log("Request body:", req.body);

    const { email, password, name, phone } = req.body;

    // Validate request body
    const validation = validateSignup(req.body);
    console.log("Signup validation result:", validation);

    if (!validation.isValid) {
      console.log("Signup validation failed");
      throw new AppError("Validation failed", 400, validation.errors);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    // Hash password
    console.log("Hashing password for:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create user
    console.log("Creating user in database...");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
      },
    });
    console.log("User created successfully:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("JWT token generated successfully");

    // Remove password from response
    const { password: _, ...safeUser } = user;

    console.log("Sending signup success response");
    console.log("=========== SIGNUP REQUEST END ===========");

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Signup error occurred:");
    console.error(err);
    console.log("=========== SIGNUP REQUEST FAILED ==========");
    return handleError(err, res);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export const login = async (req: any, res: any) => {
  try {
    console.log("=========== LOGIN REQUEST START ===========");
    console.log("Login route hit");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    // Validate request body
    const validation = validateLogin(req.body);
    console.log("Login validation result:", validation);

    if (!validation.isValid) {
      console.log("Login validation failed");
      throw new AppError("Validation failed", 400, validation.errors);
    }

    // Find user by email
    console.log("Looking up user by email:", email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("No user found for email:", email);
      throw new AppError("Invalid email or password", 401);
    }

    console.log("User found:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Compare passwords
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password does not match for email:", email);
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("JWT token generated successfully");

    // Remove password from response
    const { password: _, ...safeUser } = user;

    console.log("Sending login success response");
    console.log("============ LOGIN REQUEST END ============");

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login error occurred:");
    console.error(err);
    console.log("============ LOGIN REQUEST FAILED ==========");
    return handleError(err, res);
  }
};