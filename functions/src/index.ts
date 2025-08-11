// functions/src/index.ts

import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";
import * as cloudinary from 'cloudinary';
import cors from 'cors';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Configure CORS to allow requests from your Vercel frontend
const corsHandler = cors({ origin: true });

// Configure Cloudinary with your credentials from the secure config
// Note: Using legacy functions.config() - consider migrating to environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "domqsb9le",
  api_key: process.env.CLOUDINARY_API_KEY || "454939533181921",
  api_secret: process.env.CLOUDINARY_API_SECRET || "KOpXJfR9GHb3wMZyO7WZeJDcWcI",
});

// Get your Gmail credentials from environment variables (for v2 functions)
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

// Create a "transporter" that knows how to log in and send emails via Gmail
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// This Cloud Function runs when a supplier document is updated
export const onSupplierApprove = onDocumentUpdated(
  "suppliers/{supplierId}",
  async (event) => {
    const newData = event.data?.after.data();
    const oldData = event.data?.before.data();

    // Check if documents exist
    if (!newData || !oldData) {
      logger.log("Document data is missing. Aborting.");
      return;
    }

    // Only run if the status just changed to "approved"
    if (newData.status === "approved" && oldData.status !== "approved") {
      const email = newData.email;
      const companyName = newData.companyName;

      if (!email || !companyName) {
        logger.log("Missing email or company name. Aborting.");
        return;
      }

      const passwordSetupLink = "https://masshura-uylw.vercel.app/set-password";

      const mailOptions = {
        from: `Maashura Admin <${gmailEmail}>`,
        to: email,
        subject: "Your Maashura Supplier Account is Approved!",
        html: `
          <h1>Congratulations, ${companyName}!</h1>
          <p>Your supplier account on Maashura has been approved.</p>
          <p>To get started, please set a password for your account by clicking the link below:</p>
          <a href="${passwordSetupLink}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Set Your Password</a>
        `,
      };

      try {
        await mailTransport.sendMail(mailOptions);
        logger.log(`Approval email sent to: ${email}`);
      } catch (error) {
        logger.error("Error sending email:", error);
      }
    }
  }
);

// --- Cloudinary Signature Function ---
export const getCloudinarySignature = onRequest((request, response) => {
  // Use the cors handler to manage security
  corsHandler(request, response, () => {
    const timestamp = Math.round((new Date()).getTime() / 1000);

    // Use the Cloudinary SDK to create a signature
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET || "KOpXJfR9GHb3wMZyO7WZeJDcWcI"
    );

    // Send the signature and timestamp back to the frontend
    response.json({ signature, timestamp });
  });
});
