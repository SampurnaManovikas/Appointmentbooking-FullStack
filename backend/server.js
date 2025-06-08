import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';
import ClientInformation from './ClientInformation';
import { CheckCircle, Circle } from 'lucide-react';

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

  const handleNext = () => {
    if (step === 1 && !appointmentData.date) {
      alert('Please select a date');
      return;
    }
    
    if (step === 2 && !appointmentData.time) {
      alert('Please select a time slot');
      return;
    }

  if (step < 3) {
    setStep(step + 1);
  } else {
    // Save data
    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));

    // Send email
    await sendEmail();

    // Navigate to confirmation page
    navigate('/confirmation');
  }






    
    // if (step < 3) {
    //   setStep(step + 1);
    // } else {
    //   // Submit the form and navigate to confirmation
    //   localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
    //   navigate('/confirmation');
    // }
  };

const sendEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: appointmentData.clientEmail,
        subject: `Appointment Confirmation for ${appointmentData.clientName}`,
        text: `Dear ${appointmentData.clientName},

Your appointment is confirmed for ${appointmentData.date?.toDateString()} at ${appointmentData.time} via ${appointmentData.sessionType} session.

Thank you for booking with us!`,
      }),
    });

    if (!response.ok) throw new Error('Email sending failed');
    alert('Appointment confirmed and email sent!');
  } catch (error) {
    alert('Failed to send confirmation email.');
    console.error(error);
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
        <h1 className="text-xl font-bold text-white">Book an Appointment with Dr. Kiran S. Sawekar</h1>
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
            disabled={step === 1}
            className={`px-4 py-2 rounded-md ${
              step === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {step === 3 ? 'Confirm Booking' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
