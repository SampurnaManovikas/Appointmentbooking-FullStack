// In-memory storage for demo purposes
// In production, replace with a proper database (MongoDB, PostgreSQL, etc.)
let bookings = [
  {
    id: '1',
    date: '2024-12-20',
    time: '10:00 AM',
    clientName: 'John Smith',
    clientPhone: '5551234567',
    clientEmail: 'john@example.com',
    sessionType: 'in-person',
    notes: 'First consultation',
    status: 'confirmed',
    createdAt: new Date('2024-12-15T10:00:00Z'),
    updatedAt: new Date('2024-12-15T10:00:00Z')
  },
  {
    id: '2',
    date: '2024-12-20',
    time: '2:00 PM',
    clientName: 'Jane Doe',
    clientPhone: '5559876543',
    clientEmail: 'jane@example.com',
    sessionType: 'video',
    notes: 'Follow-up appointment',
    status: 'confirmed',
    createdAt: new Date('2024-12-15T11:00:00Z'),
    updatedAt: new Date('2024-12-15T11:00:00Z')
  }
];

/**
 * Generate unique ID for bookings
 */
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Get all bookings for a specific date
 */
const getBookingsByDate = async (date) => {
  return bookings.filter(booking => 
    booking.date === date && booking.status !== 'cancelled'
  );
};

/**
 * Get booked time slots for a specific date
 */
const getBookedTimeSlots = async (date) => {
  const dateBookings = await getBookingsByDate(date);
  return dateBookings.map(booking => booking.time);
};

/**
 * Check if a time slot is available
 */
const isTimeSlotAvailable = async (date, time) => {
  const bookedSlots = await getBookedTimeSlots(date);
  return !bookedSlots.includes(time);
};

/**
 * Create a new booking
 */
const createBooking = async (bookingData) => {
  const newBooking = {
    id: generateId(),
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

/**
 * Get booking by ID
 */
const getBookingById = async (id) => {
  return bookings.find(booking => booking.id === id);
};

/**
 * Update booking status
 */
const updateBookingStatus = async (id, status) => {
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return null;
  }
  
  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status,
    updatedAt: new Date()
  };
  
  return bookings[bookingIndex];
};

/**
 * Delete booking
 */
const deleteBooking = async (id) => {
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return false;
  }
  
  bookings.splice(bookingIndex, 1);
  return true;
};

/**
 * Get all bookings (for admin purposes)
 */
const getAllBookings = async () => {
  return bookings;
};

module.exports = {
  getBookingsByDate,
  getBookedTimeSlots,
  isTimeSlotAvailable,
  createBooking,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAllBookings
};