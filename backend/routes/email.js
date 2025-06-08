const express = require('express');
const router = express.Router();
const { validateEmailData } = require('../middleware/validation');
const emailController = require('../controllers/emailController');

// Send appointment confirmation emails
router.post('/send-confirmation', validateEmailData, emailController.sendConfirmationEmails);

// Send appointment reminder emails (for future use)
router.post('/send-reminder', validateEmailData, emailController.sendReminderEmails);

// Test email configuration
router.post('/test', emailController.testEmailConfiguration);

module.exports = router;