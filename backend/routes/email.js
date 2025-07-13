import express from 'express';
import { validateEmailData } from '../middleware/validation.js';
import * as emailController from '../controllers/emailController.js';

const router = express.Router();

// Send appointment confirmation emails
router.post('/send-confirmation', validateEmailData, emailController.sendConfirmationEmails);

// Send appointment reminder emails (for future use)
router.post('/send-reminder', validateEmailData, emailController.sendReminderEmails);

// Test email configuration
router.post('/test', emailController.testEmailConfiguration);

export default router;