import express from "express";
import {
  validateBooking,
  validateDateQuery,
} from "../middleware/validation.js";
import { protect, restrictTo } from "../middleware/auth.js";
import * as bookingController from "../controllers/bookingController.js";

const router = express.Router();

// Public routes
// Get all bookings for a specific date
router.get(
  "/date/:date",
  validateDateQuery,
  bookingController.getBookingsByDate
);

// Get all booked time slots for a specific date
router.get("/slots/:date", validateDateQuery, bookingController.getBookedSlots);

// Protected routes (require authentication)
// Create a new booking
router.post("/", protect, validateBooking, bookingController.createBooking);

// Get current user's bookings
router.get("/my-bookings", protect, bookingController.getUserBookings);

// Get booking by ID (user can only see their own bookings)
router.get("/:id", protect, bookingController.getBookingById);

// Update booking status (user can only update their own bookings)
router.patch("/:id/status", protect, bookingController.updateBookingStatus);

// Admin routes (require admin role)
// Get all bookings
router.get("/", protect, restrictTo("admin"), bookingController.getAllBookings);

// Get upcoming bookings
router.get(
  "/admin/upcoming",
  protect,
  restrictTo("admin"),
  bookingController.getUpcomingBookings
);

// Delete booking (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  bookingController.deleteBooking
);

export default router;
