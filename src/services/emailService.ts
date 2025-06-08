import { apiClient } from './apiService';

export interface EmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  sessionType: string;
  notes?: string;
  bookingId: string;
}

export interface EmailResult {
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  errors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Send appointment confirmation emails
 */
export const sendAppointmentEmails = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    const response = await apiClient.post<ApiResponse<EmailResult>>(
      '/email/send-confirmation', 
      emailData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error sending emails:', error);
    
    // Return failed status if API call fails
    return {
      clientEmailSent: false,
      adminEmailSent: false,
      errors: [error instanceof Error ? error.message : 'Failed to send emails']
    };
  }
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ success: boolean; message: string }>>(
      '/email/test', 
      {}
    );
    
    return response.data;
  } catch (error) {
    console.error('Error testing email configuration:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Email test failed'
    };
  }
};