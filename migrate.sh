#!/bin/bash

# Migration script for Loan Application Schema Update
# Run this in the backend directory

echo "⏳ Running Prisma migration..."
npx prisma migrate dev --name add_payment_details_and_kyc_pdf

echo "✅ Migration completed!"
echo ""
echo "Next steps:"
echo "1. Test the updated profile screen"
echo "2. Test the new 5-step loan application form"
echo "3. Verify payment details are captured"
echo "4. Test file upload for Aadhar PDF and PAN PDF"
echo ""
echo "Backend API will automatically support the new fields."
