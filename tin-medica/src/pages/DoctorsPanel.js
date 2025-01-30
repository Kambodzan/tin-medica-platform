import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BookingSteps from '../components/AppointmentBooking';
import dayjs from 'dayjs';

const Appointments = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [popupMessage, setPopupMessage] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDateClick = (date) => {
    setPopupMessage(`Kliknięto w datę: ${date.format('DD-MM-YYYY')}`);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  const renderCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek, 'day')) {
      const isToday = day.isSame(dayjs(), 'day');
      const currentDay = day;
      days.push(
        <div
          key={currentDay.format('YYYY-MM-DD')}
          onClick={() => handleDateClick(currentDay)}
          className={`flex flex-col justify-between items-center border-b-[1px] border-r-[1px] border-gray-200 p-1.5 transition-colors duration-300 hover:bg-gray-100 cursor-pointer ${
            currentDay.isSame(currentDate, 'month') ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          <span
            className={`text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full ${
              isToday ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {currentDay.format('D')}
          </span>
          {isToday && (
            <span className="hidden lg:block text-xl font-medium text-blue-500"><i class="fa-solid fa-dash fa-2xl"></i></span>
          )}
        </div>
      );
      day = day.add(1, 'day');
    }

    return days;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={1} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow flex flex-col p-4">
          {/* Nagłówek */}
          <div className="pb-4">
            <h1 className="text-2xl font-bold">Panel Lekarski</h1>
            <p className="text-gray-600 mt-2">Kliknij w datę, aby sprawdzić szczegóły.</p>
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default Appointments;
