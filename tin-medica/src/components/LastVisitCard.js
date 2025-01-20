import React from "react";

const LastVisitCard = ({ title, date, time, profileImage, name, address, onDetailsClick }) => {
  return (
    <div className="bg-white rounded-sm border-[1.5px] border-l-gray-100 p-4 flex items-start">
      {/* Left Section: Title, Date, and Time */}
      <div className="flex flex-col items-start">
        <p className="font-bold text-lg">{title}</p>
        <p className="text-sm text-gray-700">{date} {time}</p>
      </div>

      {/* Middle Section: Profile and Details */}
      <div className="flex items-center ml-4">
        {/* Profile Image or Icon */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <i className="fa-regular fa-user-doctor fa-2xl"></i>
          )}
        </div>

        {/* Name and Address */}
        <div className="ml-4">
          <p className="font-medium text-base text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      </div>

{/* Right Section: More Options Icon */}
<div className="ml-auto flex items-center">
  <button
    onClick={onDetailsClick}
    className="text-gray-600 hover:text-gray-800 focus:outline-none flex items-center justify-center h-full"
  >
    <i className="fa-solid fa-ellipsis-vertical text-2xl leading-none pt-3"></i>
  </button>
</div>

    </div>
  );
};

export default LastVisitCard;
