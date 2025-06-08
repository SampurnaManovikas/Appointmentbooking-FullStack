import express from 'express';
import { validateBooking, validateDateQuery } from '../middleware/validation.js';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

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

export default router;