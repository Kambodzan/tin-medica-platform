import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BookingSteps from '../components/AppointmentBooking';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import VisitDatesModal from "../components/VisitDatesModal"; 

const Appointments = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [popupMessage, setPopupMessage] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [isVisitModalVisible, setIsVisitModalVisible] = useState(false);

  const showVisitModal = () => {
    setIsVisitModalVisible(true);
  };

  const hideVisitModal = () => {
    setIsVisitModalVisible(false);
  };

  useEffect(() => {
    const fetchVisitDates = async () => {
      try {
        const response = await fetch(`http://localhost:5000/visit-dates-dates/${user.id}`);
        const data = await response.json();
        setHighlightedDates(data.visitDates || []);
      } catch (error) {
        console.error('Failed to fetch visit dates:', error);
      }
    };

    fetchVisitDates();
  }, [user.id]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
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
      const isHighlighted = highlightedDates.includes(day.format('YYYY-MM-DD'));
      const currentDay = day;

      days.push(
        <div
          key={currentDay.format('YYYY-MM-DD')}
          onClick={() => showVisitModal(currentDay)}
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
          {isHighlighted && (
            <span className="hidden lg:block text-xl font-medium text-blue-500">
              <i className="fa-solid fa-dash fa-2xl"></i>
            </span>
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
            <h1 className="text-2xl font-bold">Your appointments</h1>
            <p className="text-gray-600 mt-2">Kliknij w datę, aby sprawdzić szczegóły.</p>
          </div>

          {/* Popup */}
          {popupMessage && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg p-4 rounded-lg">
              <p className="text-gray-800 text-sm">{popupMessage}</p>
            </div>
          )}

          {/* Modal BookingSteps */}
          {showBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <BookingSteps onClose={() => setShowBooking(false)} />
            </div>
          )}

          {/* Kalendarz */}
          <section className="flex-grow h-full">
            <div className="w-full h-full bg-white p-4 border border-gray-200 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevMonth}
                    className="text-gray-500 rounded transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <h5 className="text-xl leading-8 font-semibold text-gray-900">
                    {currentDate.format('MMMM YYYY')}
                  </h5>
                  <button
                    onClick={handleNextMonth}
                    className="text-gray-500 rounded transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setShowBooking(true)}
                  className="py-2.5 px-5 rounded-lg bg-blue-500 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600"
                >
                  + New Appointment
                </button>
              </div>
              <div className="flex-grow relative overflow-hidden">
                <div className="grid grid-cols-7 divide-gray-200 border-b border-gray-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="p-3.5 flex items-center justify-center border-r border-gray-200"
                    >
                      <span className="text-sm font-medium text-gray-500">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 divide-gray-200 h-[calc(100%-3rem)]">
                  {renderCalendarDays()}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
