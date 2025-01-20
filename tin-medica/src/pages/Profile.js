import React from 'react';
// import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Profile = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={7} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold">Profile settings here</h1>
          <p className="mt-4">This is your profile.</p>

          {/* Test Grid */}
          <div className="flex-grow mt-8 overflow-hidden">
            <div
              className="grid w-full h-full grid-cols-3 gap-4"
              style={{
                gridTemplateRows: 'repeat(3, 50%)', // Trzy równe rzędy
              }}
            >
              <div className="bg-red-300 flex items-center justify-center h-full">
                Box 1
              </div>
              <div className="bg-yellow-300 flex items-center justify-center h-full">
                Box 2
              </div>
              <div className="bg-green-300 flex items-center justify-center h-full">
                Box 3
              </div>
              <div className="bg-blue-300 flex items-center justify-center h-full">
                Box 4
              </div>
              <div className="bg-purple-300 flex items-center justify-center h-full">
                Box 5
              </div>
              <div className="bg-pink-300 flex items-center justify-center h-full">
                Box 6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
