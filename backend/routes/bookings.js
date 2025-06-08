const express = require('express');
const router = express.Router();
const { validateBooking, validateDateQuery } = require('../middleware/validation');
const bookingController = require('../controllers/bookingController');

// Get all bookings for a specific date
router.get('/date/:date', validateDateQuery, bookingController.getBookingsByDate);

// Get all booked time slots for a specific date
router.get('/slots/:date', validateDateQuery, bookingController.getBookedSlots);

// Create a new booking
router.post('/', validateBooking, bookingController.createBooking);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status (cancel, confirm, etc.)
router.patch('/:id/status', bookingController.updateBookingStatus);

// Delete booking (admin only)
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;