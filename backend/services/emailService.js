import nodemailer from "nodemailer";

// Email configuration
const createTransporter = () => {
  // Create transporter without logging sensitive config details
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Admin email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sampurnamanovikas@gmail.com";
const CLINIC_NAME =
  process.env.CLINIC_NAME || "Sampurna Manovikas Private Limited";
const CLINIC_ADDRESS =
  process.env.CLINIC_ADDRESS ||
  "347, Chikkegowdanapalya, 3rd block, Banashankari Stage 6, Bengaluru, Karnataka 560062";
const CLINIC_PHONE = process.env.CLINIC_PHONE || "+91 90081 02777";

/**
 * Format date for email display
 */
const formatDateForEmail = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get session type display text
 */
const getSessionTypeText = (sessionType) => {
  switch (sessionType) {
    case "in-person":
      return "In-Person Appointment";
    case "video":
      return "Video Call Appointment";
    case "phone":
      return "Phone Call Appointment";
    default:
      return "Appointment";
  }
};

/**
 * Generate client confirmation email HTML
 */
const generateClientEmailHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Confirmed!</h1>
          <p>Your appointment has been successfully scheduled</p>
        </div>
        
        <div class="content">
          <p>Dear ${data.clientName},</p>
          
          <p>Thank you for booking an appointment with ${CLINIC_NAME}. Your appointment has been confirmed with the following details:</p>
          
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            <div class="detail-row">
              <span class="label">Date:</span> 
              <span class="value">${formatDateForEmail(
                data.appointmentDate
              )}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> 
              <span class="value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Session Type:</span> 
              <span class="value">${getSessionTypeText(data.sessionType)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID:</span> 
              <span class="value">${data.bookingId}</span>
            </div>
            ${
              data.notes
                ? `
            <div class="detail-row">
              <span class="label">Notes:</span> 
              <span class="value">${data.notes}</span>
            </div>
            `
                : ""
            }
          </div>
          
          <h3>Important Information:</h3>
          <ul>
            <li>Please arrive 15 minutes early for in-person appointments</li>
            <li>For video calls, you'll receive a meeting link 30 minutes before your appointment</li>
            <li>For phone appointments, Mr. Kiran will call you at ${
              data.clientPhone
            }</li>
            <li>To reschedule or cancel, please contact us at least 24 hours in advance</li>
          </ul>
          
          <h3>Contact Information:</h3>
          <p>
            <strong>${CLINIC_NAME}</strong><br>
            ${CLINIC_ADDRESS}<br>
            Phone: ${CLINIC_PHONE}<br>
            Email: ${ADMIN_EMAIL}
          </p>
          
          <div class="footer">
            <p>If you have any questions or need to make changes to your appointment, please don't hesitate to contact us.</p>
            <p>We look forward to seeing you!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate admin notification email HTML
 */
const generateAdminEmailHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Appointment Booking</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Appointment Booking</h1>
          <p>A new appointment has been scheduled</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <strong>⚠️ Action Required:</strong> A new appointment has been booked and requires your attention.
          </div>
          
          <div class="booking-details">
            <h3>Appointment Details</h3>
            <div class="detail-row">
              <span class="label">Date:</span> 
              <span class="value">${formatDateForEmail(
                data.appointmentDate
              )}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span> 
              <span class="value">${data.appointmentTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Session Type:</span> 
              <span class="value">${getSessionTypeText(data.sessionType)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID:</span> 
              <span class="value">${data.bookingId}</span>
            </div>
          </div>
          
          <div class="booking-details">
            <h3>Client Information</h3>
            <div class="detail-row">
              <span class="label">Name:</span> 
              <span class="value">${data.clientName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> 
              <span class="value">${data.clientEmail}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span> 
              <span class="value">${data.clientPhone}</span>
            </div>
            ${
              data.notes
                ? `
            <div class="detail-row">
              <span class="label">Notes:</span> 
              <span class="value">${data.notes}</span>
            </div>
            `
                : ""
            }
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the appointment details</li>
            <li>Add to your calendar</li>
            <li>Prepare any necessary materials</li>
            <li>Contact the client if needed</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate OTP email HTML
 */
const generateOTPEmailHTML = (otp, fullName, type = "Email Verification") => {
  const isPasswordReset = type === "Password Reset";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${type} - OTP</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-container { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #667eea; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 20px 0; padding: 15px; background: #f8f9ff; border-radius: 5px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${type}</h1>
          <p>${
            isPasswordReset
              ? "Reset your password"
              : "Please verify your email address"
          }</p>
        </div>
        
        <div class="content">
          <p>Dear ${fullName},</p>
          
          <p>${
            isPasswordReset
              ? "You have requested to reset your password. Please use the OTP code below to proceed:"
              : `Thank you for registering with ${CLINIC_NAME}. To complete your registration, please verify your email address using the OTP code below:`
          }</p>
          
          <div class="otp-container">
            <h3>Your ${
              isPasswordReset ? "Password Reset" : "Verification"
            } Code</h3>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes</p>
          </div>
          
          <div class="warning">
            <strong>Security Notice:</strong> This OTP is confidential. Do not share it with anyone.
          </div>
          
          <p>If you didn't request this ${
            isPasswordReset ? "password reset" : "verification"
          }, please ignore this email.</p>
          
          <div class="footer">
            <p>Best regards,<br>${CLINIC_NAME}</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send confirmation emails to both client and admin
 */
export const sendConfirmationEmails = async (emailData) => {
  const transporter = createTransporter();

  const results = {
    clientEmailSent: false,
    adminEmailSent: false,
    errors: [],
  };

  try {
    // Test the transporter first
    await transporter.verify();
  } catch (error) {
    console.error("Email transporter verification failed:", error);
    results.errors.push(`Email configuration error: ${error.message}`);
    return results;
  }

  try {
    // Send email to client
    const clientMailOptions = {
      from: `"${CLINIC_NAME}" <${process.env.SMTP_USER}>`,
      to: emailData.clientEmail,
      subject: `Appointment Confirmation - ${CLINIC_NAME}`,
      html: generateClientEmailHTML(emailData),
      text: `Dear ${
        emailData.clientName
      }, your appointment has been confirmed for ${formatDateForEmail(
        emailData.appointmentDate
      )} at ${emailData.appointmentTime}. Booking ID: ${emailData.bookingId}`,
    };

    const clientResult = await transporter.sendMail(clientMailOptions);
    results.clientEmailSent = true;
  } catch (error) {
    console.error("Failed to send client email:", error);
    results.errors.push(`Client email failed: ${error.message}`);
  }

  try {
    // Send notification to admin
    const adminMailOptions = {
      from: `"${CLINIC_NAME} Booking System" <${process.env.SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Appointment Booking - ${formatDateForEmail(
        emailData.appointmentDate
      )} at ${emailData.appointmentTime}`,
      html: generateAdminEmailHTML(emailData),
      text: `New appointment booked: ${
        emailData.clientName
      } on ${formatDateForEmail(emailData.appointmentDate)} at ${
        emailData.appointmentTime
      }. Contact: ${emailData.clientEmail}, ${emailData.clientPhone}`,
    };

    const adminResult = await transporter.sendMail(adminMailOptions);
    results.adminEmailSent = true;
  } catch (error) {
    console.error("Failed to send admin email:", error);
    results.errors.push(`Admin email failed: ${error.message}`);
  }

  return results;
};

/**
 * Send OTP email
 */
export const sendOTPEmail = async (
  email,
  otp,
  fullName,
  type = "Email Verification"
) => {
  const transporter = createTransporter();

  try {
    const subject =
      type === "Email Verification"
        ? `Email Verification - ${CLINIC_NAME}`
        : `Password Reset - ${CLINIC_NAME}`;

    const message =
      type === "Email Verification"
        ? `Dear ${fullName}, your email verification code is: ${otp}. This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.`
        : `Dear ${fullName}, your password reset code is: ${otp}. This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.`;

    const mailOptions = {
      from: `"${CLINIC_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: subject,
      html: generateOTPEmailHTML(otp, fullName, type),
      text: message,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "OTP email sent successfully",
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/**
 * Send reminder emails (for future use)
 */
export const sendReminderEmails = async (emailData) => {
  // Implementation for reminder emails
  // This can be used for automated reminders before appointments
  return { reminderSent: true };
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return {
      success: true,
      message: "Email configuration is valid and ready to send emails",
    };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return {
      success: false,
      message: "Email configuration failed",
      error: error.message,
    };
  }
};
