import React from 'react';

const ReferralTiles = ({ title, doctor, issueDate, urgent }) => {
  return (
    <div className="bg-white border-l-gray-100 border-[1.5px] p-4 rounded h-full flex flex-col justify-between">
      <h3 className="font-bold text-sm mb-1">Referral to a diagnostic laboratory</h3>
      <p className="mb-0.5 text-sm">To: <span className="font-medium">{doctor}</span></p>
      <p className="mb-0.5 text-sm">Date of issue: <span className="font-medium">{issueDate}</span></p>
      <p className={`mb-1 text-sm ${urgent === "Yes" ? 'text-red-500 font-bold' : 'font-medium'}`}>Urgent?: <span>{urgent}</span></p>
    </div>
  );
};

export default ReferralTiles;
