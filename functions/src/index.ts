// functions/src/index.ts

import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { logger } from "firebase-functions";

// Initialize the Firebase Admin SDK
admin.initializeApp();

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
