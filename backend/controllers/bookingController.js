const bookingService = require('../services/bookingService');
const emailService = require('../services/emailService');

/**
 * Get all bookings for a specific date
 */
const getBookingsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const bookings = await bookingService.getBookingsByDate(date);
    
    res.status(200).json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booked time slots for a specific date
 */
const getBookedSlots = async (req, res, next) => {
  try {
    const { date } = req.params;
    const bookedSlots = await bookingService.getBookedTimeSlots(date);
    
    res.status(200).json({
      success: true,
      data: bookedSlots
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;
    
    // Check if time slot is available
    const isAvailable = await bookingService.isTimeSlotAvailable(
      bookingData.date, 
      bookingData.time
    );
    
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please select another time.'
      });
    }
    
    // Create the booking
    const newBooking = await bookingService.createBooking(bookingData);
    
    // Send confirmation emails asynchronously
    emailService.sendConfirmationEmails({
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      appointmentDate: bookingData.date,
      appointmentTime: bookingData.time,
      sessionType: bookingData.sessionType,
      notes: bookingData.notes,
      bookingId: newBooking.id
    }).catch(error => {
      console.error('Email sending failed:', error);
      // Don't fail the booking if email fails
    });
    
    res.status(201).json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await bookingService.updateBookingStatus(id, status);
    
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete booking
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await bookingService.deleteBooking(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookingsByDate,
  getBookedSlots,
  createBooking,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};