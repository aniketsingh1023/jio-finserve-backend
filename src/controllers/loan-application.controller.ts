import { prisma } from "../lib/prisma";
import { AppError, handleError } from "../utils/errors";

const nameRegex = /^[A-Za-z ]+$/;
const cityRegex = /^[A-Za-z ]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;
const aadharRegex = /^\d{12}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const cardRegex = /^\d{16}$/;
const cvvRegex = /^\d{3,4}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

// relaxed regex for optional business/bank text fields
const textFieldRegex = /^[A-Za-z0-9 .,&()\-]+$/;

const allowedLoanTypes = [
  "Personal",
  "Home",
  "Business",
  "Education",
  "Loan Against Property",
  "Loan Against Credit Card",
];

const allowedGenders = ["Male", "Female", "Other"];
const allowedPaymentMethods = ["Credit Card", "Debit Card"];

const isValidDateString = (value: string) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const isPositiveNumber = (value: any) => {
  if (value === undefined || value === null || value === "") return false;
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

const isNonNegativeNumber = (value: any) => {
  if (value === undefined || value === null || value === "") return false;
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

const validateLoanApplication = (body: any) => {
  const errors: string[] = [];

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
    aadharNumber,
    panNumber,
    nomineeName,
    nomineeRelation,
    paymentMethod,
    cardNumber,
    expiryDate,
    cvv,
  } = body;

  if (!fullName?.trim()) errors.push("Full name is required");
  if (!email?.trim()) errors.push("Email is required");
  if (!phone?.trim()) errors.push("Phone is required");
  if (!address?.trim()) errors.push("Address is required");
  if (!city?.trim()) errors.push("City is required");
  if (!pincode?.trim()) errors.push("Pincode is required");
  if (!loanType?.trim()) errors.push("Loan type is required");
  if (loanAmount === undefined || loanAmount === null || loanAmount === "") {
    errors.push("Loan amount is required");
  }
  if (!aadharNumber?.trim()) errors.push("Aadhar number is required");
  if (!panNumber?.trim()) errors.push("PAN number is required");
  if (!nomineeName?.trim()) errors.push("Nominee name is required");
  if (!paymentMethod?.trim()) errors.push("Payment method is required");
  if (!cardNumber?.trim()) errors.push("Card number is required");
  if (!expiryDate?.trim()) errors.push("Expiry date is required");
  if (!cvv?.trim()) errors.push("CVV is required");

  if (fullName && !nameRegex.test(fullName.trim())) {
    errors.push("Full name must contain only letters and spaces");
  }

  if (email && !emailRegex.test(email.trim())) {
    errors.push("Email must be a valid Gmail address");
  }

  if (phone && !phoneRegex.test(String(phone).trim())) {
    errors.push("Phone number must be exactly 10 digits and start with 6-9");
  }

  if (dob && !isValidDateString(dob)) {
    errors.push("Date of birth must be a valid date");
  }

  if (gender && !allowedGenders.includes(gender)) {
    errors.push("Gender must be Male, Female, or Other");
  }

  if (city && !cityRegex.test(city.trim())) {
    errors.push("City must contain only letters and spaces");
  }

  if (pincode && !pincodeRegex.test(String(pincode).trim())) {
    errors.push("Pincode must be exactly 6 digits");
  }

  if (loanType && !allowedLoanTypes.includes(loanType)) {
    errors.push("Invalid loan type");
  }

  if (!isPositiveNumber(loanAmount)) {
    errors.push("Loan amount must be a valid positive number");
  }

  // optional fields: validate only with relaxed format, and do not block common names
  if (companyName && !textFieldRegex.test(companyName.trim())) {
    errors.push("Company name contains invalid characters");
  }

  if (monthlyIncome !== undefined && monthlyIncome !== null && monthlyIncome !== "") {
    if (!isPositiveNumber(monthlyIncome)) {
      errors.push("Monthly income must be a positive number");
    }
  }

  if (existingEmi !== undefined && existingEmi !== null && existingEmi !== "") {
    if (!isNonNegativeNumber(existingEmi)) {
      errors.push("Existing EMI must be 0 or a positive number");
    }
  }

  if (primaryBank && !textFieldRegex.test(primaryBank.trim())) {
    errors.push("Primary bank contains invalid characters");
  }

  if (cibilScore !== undefined && cibilScore !== null && cibilScore !== "") {
    const score = Number(cibilScore);
    if (isNaN(score) || score < 300 || score > 900) {
      errors.push("CIBIL score must be between 300 and 900");
    }
  }

  if (aadharNumber && !aadharRegex.test(String(aadharNumber).trim())) {
    errors.push("Aadhar number must be exactly 12 digits");
  }

  if (panNumber && !panRegex.test(String(panNumber).trim().toUpperCase())) {
    errors.push("PAN number format is invalid");
  }

  if (nomineeName && !nameRegex.test(nomineeName.trim())) {
    errors.push("Nominee name must contain only letters and spaces");
  }

  if (nomineeRelation && !nameRegex.test(nomineeRelation.trim())) {
    errors.push("Nominee relation must contain only letters and spaces");
  }

  if (paymentMethod && !allowedPaymentMethods.includes(paymentMethod)) {
    errors.push("Payment method must be Credit Card or Debit Card");
  }

  if (cardNumber && !cardRegex.test(String(cardNumber).replace(/\s/g, ""))) {
    errors.push("Card number must be exactly 16 digits");
  }

  if (expiryDate && !expiryRegex.test(expiryDate.trim())) {
    errors.push("Expiry date must be in MM/YY format");
  }

  if (cvv && !cvvRegex.test(String(cvv).trim())) {
    errors.push("CVV must be 3 or 4 digits");
  }

  return errors;
};

/**
 * POST /api/loan-applications
 */
export const createLoanApplication = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const errors = validateLoanApplication(req.body);

    if (errors.length > 0) {
      throw new AppError(errors.join(", "), 400);
    }

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

    const loanApplication = await prisma.loanApplication.create({
      data: {
        userId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: String(phone).trim(),
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
        address: address.trim(),
        city: city.trim(),
        pincode: String(pincode).trim(),
        loanType,
        loanAmount: Number(loanAmount),
        companyName: companyName?.trim() || null,
        monthlyIncome:
          monthlyIncome !== "" && monthlyIncome != null
            ? Number(monthlyIncome)
            : null,
        existingEmi:
          existingEmi !== "" && existingEmi != null
            ? Number(existingEmi)
            : null,
        primaryBank: primaryBank?.trim() || null,
        cibilScore:
          cibilScore !== "" && cibilScore != null
            ? String(cibilScore)
            : null,
        bankStatementPdf: bankStatementPdf || null,
        aadharNumber: String(aadharNumber).trim(),
        panNumber: String(panNumber).trim().toUpperCase(),
        aadharFrontImage: aadharFrontImage || null,
        aadharBackImage: aadharBackImage || null,
        aadharPdf: aadharPdf || null,
        panCardImage: panCardImage || null,
        panCardPdf: panCardPdf || null,
        nomineeName: nomineeName.trim(),
        nomineeRelation: nomineeRelation?.trim() || null,
        paymentMethod,
        cardNumber: String(cardNumber).replace(/\s/g, ""),
        expiryDate: expiryDate.trim(),
        cvv: String(cvv).trim(),
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
        updatedAt: true,
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
        aadharPdf: true,
        panCardImage: true,
        panCardPdf: true,
        nomineeName: true,
        nomineeRelation: true,
        paymentMethod: true,
        cardNumber: true,
        expiryDate: true,
        cvv: true,
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
 */
export const getLoanApplicationById = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!id) {
      throw new AppError("Application id is required", 400);
    }

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