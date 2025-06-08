import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getBookedSlots } from './services/bookingService';

interface TimeSlotsProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate: Date | null;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedTime, onTimeSelect, selectedDate }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // All available time slots
  const allTimeSlots = [
    '9:00 AM',
    '10:00 AM', 
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM'
  ];

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) {
        setTimeSlots([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Format date for API call (YYYY-MM-DD)
        const dateString = selectedDate.toISOString().split('T')[0];
        
        // Fetch booked time slots for the selected date
        const bookedSlots = await getBookedSlots(dateString);
        
        // Create time slots array with availability status
        const slotsWithAvailability = allTimeSlots.map(time => ({
          time,
          available: !bookedSlots.includes(time)
        }));
        
        setTimeSlots(slotsWithAvailability);
      } catch (error) {
        console.error('Error fetching available time slots:', error);
        // Fallback: show all slots as available
        const fallbackSlots = allTimeSlots.map(time => ({
          time,
          available: true
        }));
        setTimeSlots(fallbackSlots);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading available time slots...</span>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a date first to view available time slots.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={`
              py-3 px-4 rounded-lg border flex items-center justify-center transition-all duration-200
              ${!slot.available 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 opacity-60' 
                : selectedTime === slot.time
                  ? 'bg-blue-100 text-blue-700 border-blue-500 shadow-sm transform scale-105'
                  : 'hover:bg-blue-50 text-gray-700 border-gray-200 hover:border-blue-300'
              }
            `}
            title={!slot.available ? 'This time slot is already booked' : 'Click to select this time slot'}
          >
            <Clock className={`w-4 h-4 mr-2 ${
              !slot.available 
                ? 'text-gray-400' 
                : selectedTime === slot.time 
                  ? 'text-blue-700' 
                  : 'text-gray-500'
            }`} />
            {slot.time}
            {!slot.available && (
              <span className="ml-1 text-xs">(Booked)</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 mr-1"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200 mr-1"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-100 mr-1 opacity-60"></div>
          <span className="text-gray-600">Already Booked</span>
        </div>
      </div>
      
      {timeSlots.filter(slot => !slot.available).length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Some time slots are already booked and unavailable for selection.
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;