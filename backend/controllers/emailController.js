import * as emailService from '../services/emailService.js';

/**
 * Send appointment confirmation emails
 */
export const sendConfirmationEmails = async (req, res, next) => {
  try {
    const emailData = req.body;
    
    const result = await emailService.sendConfirmationEmails(emailData);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Confirmation emails sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation emails',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Send appointment reminder emails
 */
export const sendReminderEmails = async (req, res, next) => {
  try {
    const emailData = req.body;
    
    const result = await emailService.sendReminderEmails(emailData);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Reminder emails sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async (req, res, next) => {
  try {
    const testResult = await emailService.testEmailConfiguration();
    
    res.status(200).json({
      success: true,
      data: testResult,
      message: 'Email configuration test completed'
    });
  } catch (error) {
    next(error);
  }
};