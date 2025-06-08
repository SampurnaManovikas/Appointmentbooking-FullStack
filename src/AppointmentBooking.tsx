import React, { useState } from 'react';
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

const AppointmentBooking: React.FC = () => {
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

  const handleDateSelection = (date: Date) => {
    setAppointmentData({ ...appointmentData, date, time: '' });
    setErrors([]);
  };

  const handleTimeSelection = (time: string) => {
    setAppointmentData({ ...appointmentData, time });
    setErrors([]);
  };

  const handleSessionTypeChange = (type: 'in-person' | 'video' | 'phone') => {
    setAppointmentData({ ...appointmentData, sessionType: type });
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData({ ...appointmentData, [name]: value });
    setErrors([]);
  };

  const handleNext = async () => {
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
      setStep(step + 1);
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

  const handleBookingSubmission = async () => {
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

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Book an Appointment with Dr. Kiran S. Sawekar</h1>
          <Link to="/" className="text-white hover:text-blue-100 transition-colors flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </div>
      </div>
      {/* Body */}
      <div className="p-6">
        {/* Progress Bar */}
        {/* ... (unchanged) */}
        {/* Error display */}
        {/* ... (unchanged) */}
        {/* Step content */}
        {/* ... (unchanged) */}
        {/* Navigation */}
        {/* ... (unchanged) */}
      </div>
    </div>
  );
};

export default AppointmentBooking;
