import React, { useState } from 'react';
import { User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { validatePhoneInput, formatPhoneNumber, isValidPhoneNumber, isValidEmail } from './utils/validation';

interface ClientInformationProps {
  data: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ClientInformation: React.FC<ClientInformationProps> = ({ data, onChange }) => {
  const [phoneError, setPhoneError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  // Handle phone number input with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Validate and clean the input (only allow digits)
    const cleanedValue = validatePhoneInput(rawValue);
    
    // Limit to 10 digits
    if (cleanedValue.length > 10) {
      setPhoneError('Phone number cannot exceed 10 digits');
      return;
    }
    
    // Format the phone number for display
    const formattedValue = formatPhoneNumber(cleanedValue);
    
    // Clear error if input is valid or empty
    if (cleanedValue.length === 0) {
      setPhoneError('');
    } else if (cleanedValue.length === 10) {
      setPhoneError('');
    } else if (cleanedValue.length > 0 && cleanedValue.length < 10) {
      setPhoneError('Please enter a complete 10-digit phone number');
    }
    
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'clientPhone',
        value: formattedValue
      }
    };
    
    onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  // Handle phone number key press to prevent non-numeric input
  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  // Handle email validation
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    
    if (email && !isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g., example@mail.com)');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    onChange(e);
  };

  return (
    <div className="space-y-4">
      {/* Full Name Field */}
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={data.clientName}
            onChange={onChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Aarya K"
            required
          />
        </div>
      </div>
      
      {/* Phone Number Field */}
      <div>
        <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            value={data.clientPhone}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyPress}
            className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              phoneError 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="90000 90000"
            maxLength={14} // Formatted length: XXXXX XXXXX
            required
          />
        </div>
        {phoneError && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {phoneError}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter a 10-digit phone number (numbers only)
        </p>
      </div>
      
      {/* Email Address Field */}
      <div>
        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={data.clientEmail}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              emailError 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="aaryak@example.com"
            required
          />
        </div>
        {emailError && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            {emailError}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          We'll send your appointment confirmation to this email
        </p>
      </div>
      
      {/* Additional Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes (Optional)
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="notes"
            name="notes"
            value={data.notes}
            onChange={onChange}
            rows={4}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Any information you'd like to share before your appointment..."
          />
        </div>
      </div>
      
      {/* Privacy Notice */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Privacy Notice</h4>
        <p className="text-xs text-blue-700">
          Your personal information will be kept confidential and only used for appointment scheduling 
          and communication purposes. For more information, please review our privacy policy.
        </p>
      </div>
    </div>
  );
};

export default ClientInformation;