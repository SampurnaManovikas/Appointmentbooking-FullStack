import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import ClientInformation from './ClientInformation';
import { CheckCircle, Circle, Loader2, Lock } from 'lucide-react';
import { createBooking } from './services/bookingService';
import { sendAppointmentEmails } from './services/emailService';
import { validateFormData, sanitizeBookingData } from './utils/validation';
import { useAuth } from './contexts/AuthContext';

interface AppointmentData {
  date: Date | null;
  time: string;
  sessionType: 'in-person' | 'video' | 'phone';
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: null,
    time: '',
    sessionType: 'in-person',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (authState.user) {
      setAppointmentData(prev => ({
        ...prev,
        clientName: authState.user?.fullName || '',
        clientPhone: authState.user?.phoneNumber || '',
        clientEmail: authState.user?.email || '',
      }));
    }
  }, [authState.user]);

  // Show loading while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in to your account to book an appointment.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleDateSelection = (date: Date) => {
    setAppointmentData({ ...appointmentData, date });
  };

  const handleTimeSelection = (time: string) => {
    setAppointmentData({ ...appointmentData, time });
  };

  const handleSessionTypeChange = (type: 'in-person' | 'video' | 'phone') => {
    setAppointmentData({ ...appointmentData, sessionType: type });
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleNext = async () => {
    // Clear any previous errors
    setError(null);
    
    if (step === 1 && !appointmentData.date) {
      setError('Please select a date');
      return;
    }
    
    if (step === 2 && !appointmentData.time) {
      setError('Please select a time slot');
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - submit the booking
      await handleBookingSubmission();
    }
  };

  const handleBookingSubmission = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      const validation = validateFormData(appointmentData);
      if (!validation.isValid) {
        setError(`Please fix the following errors:\n${validation.errors.join('\n')}`);
        setIsSubmitting(false);
        return;
      }

      // Sanitize and prepare booking data
      const sanitizedData = sanitizeBookingData({
        date: appointmentData.date!.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: appointmentData.time,
        clientName: appointmentData.clientName,
        clientPhone: appointmentData.clientPhone,
        clientEmail: appointmentData.clientEmail,
        sessionType: appointmentData.sessionType,
        notes: appointmentData.notes
      });

      // Create the booking
      const newBooking = await createBooking(sanitizedData);

      // Prepare email data
      const emailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        clientPhone: appointmentData.clientPhone,
        appointmentDate: appointmentData.date!.toISOString().split('T')[0],
        appointmentTime: appointmentData.time,
        sessionType: appointmentData.sessionType,
        notes: appointmentData.notes,
        bookingId: newBooking.id
      };

      // Send confirmation emails
      let emailResult;
      try {
        emailResult = await sendAppointmentEmails(emailData);
      } catch (emailError) {
        // Set a default email result indicating partial failure
        emailResult = {
          clientEmailSent: false,
          adminEmailSent: false,
          errors: ['Email sending failed']
        };
      }

      // Save booking data with email status for confirmation page
      const bookingDataForStorage = {
        ...appointmentData,
        bookingId: newBooking.id,
        emailStatus: {
          clientEmailSent: emailResult.clientEmailSent || false,
          adminEmailSent: emailResult.adminEmailSent || false,
          errors: emailResult.errors || []
        }
      };

      localStorage.setItem('appointmentData', JSON.stringify(bookingDataForStorage));

      // Navigate to confirmation page
      navigate('/confirmation');

    } catch (error) {
      let errorMessage = 'Failed to confirm booking. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('time slot is already booked')) {
          errorMessage = 'This time slot is no longer available. Please select a different time.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Connection error. Please try again in a moment.';
        } else {
          errorMessage = `Booking failed: ${error.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h1 className="text-xl font-bold text-white">Book an Appointment with Mr. Kiran S. Sawekar</h1>
      </div>
      
      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            {step >= 1 ? (
              <CheckCircle className="h-8 w-8 text-blue-500" />
            ) : (
              <Circle className="h-8 w-8 text-gray-300" />
            )}
            <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-blue-500' : 'text-gray-500'}`}>Date Selection</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            {step >= 2 ? (
              <CheckCircle className="h-8 w-8 text-blue-500" />
            ) : (
              <Circle className="h-8 w-8 text-gray-300" />
            )}
            <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-blue-500' : 'text-gray-500'}`}>Time & Type</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            {step >= 3 ? (
              <CheckCircle className="h-8 w-8 text-blue-500" />
            ) : (
              <Circle className="h-8 w-8 text-gray-300" />
            )}
            <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-blue-500' : 'text-gray-500'}`}>Your Information</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-red-700 whitespace-pre-line">{error}</span>
            </div>
          </div>
        )}
        
        {/* Step Content */}
        <div className="transition-all duration-300 ease-in-out">
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Date</h2>
              <Calendar 
                selectedDate={appointmentData.date} 
                onDateSelect={handleDateSelection} 
              />
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Time</h2>
                <TimeSlots 
                  selectedTime={appointmentData.time} 
                  onTimeSelect={handleTimeSelection}
                  selectedDate={appointmentData.date}
                />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Type</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => handleSessionTypeChange('in-person')}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      appointmentData.sessionType === 'in-person' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    In-Person
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSessionTypeChange('video')}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      appointmentData.sessionType === 'video' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video Call
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSessionTypeChange('phone')}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      appointmentData.sessionType === 'phone' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Call
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h2>
              <ClientInformation 
                data={appointmentData} 
                onChange={handleClientInfoChange} 
              />
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={`px-4 py-2 rounded-md ${
              step === 1 || isSubmitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
              isSubmitting
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {step === 3 ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              step === 3 ? 'Confirm Booking' : 'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;