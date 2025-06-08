import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0-6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const today = new Date();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isDateSelected = (date: Date) => {
    return selectedDate && 
      date.getDate() === selectedDate.getDate() && 
      date.getMonth() === selectedDate.getMonth() && 
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear();
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {calendarDays.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => !isPastDate(date) && !isWeekend(date) && onDateSelect(date)}
                disabled={isPastDate(date) || isWeekend(date)}
                className={`w-full h-full flex items-center justify-center rounded-full text-sm
                  ${isDateSelected(date) ? 'bg-blue-600 text-white' : 
                    isToday(date) ? 'border border-blue-500 text-blue-600' : 
                    isPastDate(date) ? 'text-gray-300 cursor-not-allowed' :
                    isWeekend(date) ? 'text-gray-300 cursor-not-allowed' :
                    'text-gray-700 hover:bg-blue-50'
                  } transition-colors`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border border-blue-500 mr-1"></div>
          <span className="text-gray-600">Today</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;