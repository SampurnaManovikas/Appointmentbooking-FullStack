import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import ClientInformation from './ClientInformation';
import { CheckCircle, Circle, AlertCircle, ArrowLeft } from 'lucide-react';
import { validateFormData } from './utils/validation';
import { createBooking } from './services/bookingService';
import { sendAppointmentEmails } from './services/emailService';

interface AppointmentData {
  date: Date | null;
  time: string;
  sessionType: 'in-person' | 'video' | 'phone';
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

const AppointmentBooking: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: null,
    time: '',
    sessionType: 'in-person',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  });

  useEffect(() => {
    console.log('Step changed to:', step);
  }, [step]);

  const handleDateSelection = (date: Date): void => {
    setAppointmentData({ ...appointmentData, date, time: '' });
    setErrors([]);
  };

  const handleTimeSelection = (time: string): void => {
    setAppointmentData({ ...appointmentData, time });
    setErrors([]);
  };

  const handleSessionTypeChange = (type: 'in-person' | 'video' | 'phone'): void => {
    setAppointmentData({ ...appointmentData, sessionType: type });
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
    setErrors([]);
  };

  const handleNext = async (): Promise<void> => {
    setErrors([]);

    if (step === 1 && !appointmentData.date) {
      setErrors(['Please select a date']);
      return;
    }

    if (step === 2 && !appointmentData.time) {
      setErrors(['Please select a time slot']);
      return;
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      const validation = validateFormData({
        clientName: appointmentData.clientName,
        clientPhone: appointmentData.clientPhone,
        clientEmail: appointmentData.clientEmail,
        date: appointmentData.date,
        time: appointmentData.time,
      });

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      await handleBookingSubmission();
    }
  };

  const handleBookingSubmission = async (): Promise<void> => {
    setLoading(true);
    try {
      const bookingData = {
        date: appointmentData.date!.toISOString().split('T')[0],
        time: appointmentData.time,
        clientName: appointmentData.clientName,
        clientPhone: appointmentData.clientPhone.replace(/\D/g, ''),
        clientEmail: appointmentData.clientEmail,
        sessionType: appointmentData.sessionType,
        notes: appointmentData.notes,
      };

      const createdBooking = await createBooking(bookingData);

      const emailData = {
        clientName: appointmentData.clientName,
        clientEmail: appointmentData.clientEmail,
        clientPhone: appointmentData.clientPhone,
        appointmentDate: appointmentData.date!.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        appointmentTime: appointmentData.time,
        sessionType: appointmentData.sessionType,
        notes: appointmentData.notes,
      };

      const emailResults = await sendAppointmentEmails(emailData);

      const confirmationData = {
        ...appointmentData,
        bookingId: createdBooking.id,
        emailStatus: emailResults,
      };

      localStorage.setItem('appointmentData', JSON.stringify(confirmationData));

      navigate('/confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors(['Failed to create booking. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setErrors([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Book an Appointment with Dr. Kiran S. Sawekar</h1>
          <Link to="/" className="text-white hover:text-blue-100 transition-colors flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((currentStep) => (
            <React.Fragment key={currentStep}>
              <div className="flex items-center">
                {step >= currentStep ? (
                  <CheckCircle className="h-8 w-8 text-blue-500" />
                ) : (
                  <Circle className="h-8 w-8 text-gray-300" />
                )}
                <span className={`ml-2 text-sm font-medium ${step >= currentStep ? 'text-blue-500' : 'text-gray-500'}`}>
                  {currentStep === 1 && 'Date Selection'}
                  {currentStep === 2 && 'Time & Type'}
                  {currentStep === 3 && 'Your Information'}
                </span>
              </div>
              {currentStep !== 3 && (
                <div className={`flex-1 h-0.5 mx-4 ${step > currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step content */}
        <div>
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Date</h2>
              <Calendar selectedDate={appointmentData.date} onDateSelect={handleDateSelection} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select a Time</h2>
              <TimeSlots
                selectedTime={appointmentData.time}
                onTimeSelect={handleTimeSelection}
                selectedDate={appointmentData.date}
              />

              <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Session Type</h2>
              <div className="flex flex-wrap gap-4">
                {['in-person', 'video', 'phone'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSessionTypeChange(type as 'in-person' | 'video' | 'phone')}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      appointmentData.sessionType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <span className="capitalize">{type.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h2>
              <ClientInformation data={appointmentData} onChange={handleClientInfoChange} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-md ${
              step === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className={`px-6 py-2 rounded-md ${
              loading
                ? 'bg-blue-300 text-white cursor-wait'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors`}
          >
            {step < 3 ? 'Next' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
