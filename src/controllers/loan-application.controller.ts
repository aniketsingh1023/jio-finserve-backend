import { prisma } from "../lib/prisma";
import { AppError, handleError } from "../utils/errors";

/**
 * POST /api/loan-applications
 * Create a new loan application
 */
export const createLoanApplication = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const {
      fullName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      pincode,
      loanType,
      loanAmount,
      companyName,
      monthlyIncome,
      existingEmi,
      primaryBank,
      cibilScore,
      bankStatementPdf,
      aadharNumber,
      panNumber,
      aadharFrontImage,
      aadharBackImage,
      aadharPdf,
      panCardImage,
      panCardPdf,
      nomineeName,
      nomineeRelation,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !loanType ||
      !loanAmount
    ) {
      throw new AppError(
        "Missing required fields: fullName, email, phone, loanType, loanAmount",
        400
      );
    }

    // Create loan application
    const loanApplication = await prisma.loanApplication.create({
      data: {
        userId,
        fullName,
        email,
        phone,
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
        address: address || null,
        city: city || null,
        pincode: pincode || null,
        loanType,
        loanAmount: parseFloat(loanAmount),
        companyName: companyName || null,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        existingEmi: existingEmi ? parseFloat(existingEmi) : null,
        primaryBank: primaryBank || null,
        cibilScore: cibilScore || null,
        bankStatementPdf: bankStatementPdf || null,
        aadharNumber: aadharNumber || null,
        panNumber: panNumber || null,
        aadharFrontImage: aadharFrontImage || null,
        aadharBackImage: aadharBackImage || null,
        aadharPdf: aadharPdf || null,
        panCardImage: panCardImage || null,
        panCardPdf: panCardPdf || null,
        nomineeName: nomineeName || null,
        nomineeRelation: nomineeRelation || null,
        paymentMethod: paymentMethod || null,
        cardNumber: cardNumber || null,
        expiryDate: expiryDate || null,
        cvv: cvv || null,
        status: "Pending",
      },
    });

    res.status(201).json({
      message: "Loan application created successfully",
      application: loanApplication,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * GET /api/loan-applications/my
 * Get all loan applications for the current logged-in user
 */
export const getMyApplications = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const applications = await prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceId: true,
        loanType: true,
        loanAmount: true,
        status: true,
        createdAt: true,
        fullName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        address: true,
        city: true,
        pincode: true,
        companyName: true,
        monthlyIncome: true,
        existingEmi: true,
        primaryBank: true,
        cibilScore: true,
        bankStatementPdf: true,
        aadharNumber: true,
        panNumber: true,
        aadharFrontImage: true,
        aadharBackImage: true,
        panCardImage: true,
        nomineeName: true,
        nomineeRelation: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
      count: applications.length,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * GET /api/loan-applications/:id
 * Get a specific loan application by ID
 */
export const getLoanApplicationById = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const application = await prisma.loanApplication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    res.status(200).json({
      message: "Application retrieved successfully",
      application,
    });
  } catch (err) {
    return handleError(err, res);
  }
};
