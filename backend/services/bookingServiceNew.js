import Booking from "../models/Booking.js";

/**
 * Get all bookings for a specific date
 */
export const getBookingsByDate = async (date) => {
  try {
    return await Booking.find({
      date: date,
      status: { $ne: "cancelled" },
    }).populate("user", "fullName email phoneNumber");
  } catch (error) {
    console.error("Error getting bookings by date:", error);
    throw new Error("Failed to get bookings");
  }
};

/**
 * Get booked time slots for a specific date
 */
export const getBookedTimeSlots = async (date) => {
  try {
    const bookings = await getBookingsByDate(date);
    return bookings.map((booking) => booking.time);
  } catch (error) {
    console.error("Error getting booked time slots:", error);
    throw new Error("Failed to get booked time slots");
  }
};

/**
 * Check if a time slot is available
 */
export const isTimeSlotAvailable = async (date, time) => {
  try {
    const bookedSlots = await getBookedTimeSlots(date);
    return !bookedSlots.includes(time);
  } catch (error) {
    console.error("Error checking time slot availability:", error);
    throw new Error("Failed to check time slot availability");
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    await newBooking.populate("user", "fullName email phoneNumber");
    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  try {
    return await Booking.findById(id).populate(
      "user",
      "fullName email phoneNumber"
    );
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    throw new Error("Failed to get booking");
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id, status) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate("user", "fullName email phoneNumber");

    return booking;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }
};

/**
 * Delete booking (soft delete by setting status to cancelled)
 */
export const deleteBooking = async (id) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled", updatedAt: new Date() },
      { new: true }
    );

    return booking;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
};

/**
 * Get all bookings for a user
 */
export const getBookingsByUser = async (userId) => {
  try {
    return await Booking.find({
      user: userId,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw new Error("Failed to get user bookings");
  }
};

/**
 * Get upcoming bookings
 */
export const getUpcomingBookings = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    return await Booking.find({
      date: { $gte: today },
      status: { $in: ["confirmed", "pending"] },
    })
      .populate("user", "fullName email phoneNumber")
      .sort({ date: 1, time: 1 });
  } catch (error) {
    console.error("Error getting upcoming bookings:", error);
    throw new Error("Failed to get upcoming bookings");
  }
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async () => {
  try {
    return await Booking.find({})
      .populate("user", "fullName email phoneNumber")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting all bookings:", error);
    throw new Error("Failed to get all bookings");
  }
};
