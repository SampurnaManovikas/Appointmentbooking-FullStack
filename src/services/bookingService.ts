import { apiClient } from './apiService';

export interface Booking {
  id: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  sessionType: 'in-person' | 'video' | 'phone';
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  sessionType: 'in-person' | 'video' | 'phone';
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

/**
 * Get booked time slots for a specific date
 */
export const getBookedSlots = async (date: string): Promise<string[]> => {
  try {
    const response = await apiClient.get<ApiResponse<string[]>>(`/bookings/slots/${date}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return []; // Return empty array on error to prevent UI breaking
  }
};

/**
 * Get all bookings for a specific date
 */
export const getBookingsForDate = async (date: string): Promise<Booking[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Booking[]>>(`/bookings/date/${date}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
  try {
    // Sanitize phone number (remove formatting) and trim strings
    const sanitizedData = {
      ...bookingData,
      clientPhone: bookingData.clientPhone.replace(/\D/g, ''),
      clientName: bookingData.clientName.trim(),
      clientEmail: bookingData.clientEmail.trim().toLowerCase()
    };

    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', sanitizedData);
    
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  id: string, 
  status: 'confirmed' | 'cancelled'
): Promise<Booking | null> => {
  try {
    const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

/**
 * Check if a time slot is available
 */
export const isTimeSlotAvailable = async (date: string, time: string): Promise<boolean> => {
  try {
    const bookedSlots = await getBookedSlots(date);
    return !bookedSlots.includes(time);
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return true; // Assume available on error to prevent blocking bookings
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (): Promise<{ data: { bookings: any[] } }> => {
  try {
    const response = await apiClient.get<{ data: { bookings: any[] } }>('/bookings/my-bookings');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};