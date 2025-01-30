import React from 'react';

const DashboardCalendarTile = ({ date, isHighlighted, visitDetails, onClick }) => {
  return (
    <div
      className={`p-2 border rounded cursor-pointer ${
        isHighlighted ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="text-sm font-bold">
        {date.toLocaleDateString('en-GB', { weekday: 'short' })}
      </div>
      <div className="text-xs">
        {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </div>
      {visitDetails && (
        <div className="mt-2 text-xs text-gray-700">
          <p>{visitDetails.consultationType}</p>
          <p>{visitDetails.doctorName}</p>
          <p>{visitDetails.clinicName}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCalendarTile;
