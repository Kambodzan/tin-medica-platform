import React from 'react';

const DashboardCalendarTile = ({ id, date, onClick }) => {
  const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const dayDetails = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div
      className="bg-white rounded-sm border-[0.5px] cursor-pointer hover:bg-gray-100 transition-colors duration-300"
      onClick={onClick} // Wywołanie funkcji onClick z identyfikatorem
    >
      <div className="bg-blue-500 text-white text-center py-2">
        <h3 className="text-base font-bold">{dayOfWeek}</h3>
      </div>
      <div className="p-8 text-center">
        <p className="text-sm font-medium">{dayDetails}</p>
        <p className="text-xs">Click to edit</p>
      </div>
    </div>
  );
};

export default DashboardCalendarTile;
