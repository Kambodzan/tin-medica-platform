import React from 'react';

const TestGrid = () => {
  return (
    <div className="h-screen bg-gray-100">
      <div
        className="grid h-full grid-cols-3 grid-rows-3 gap-4"
        style={{
          gridTemplateRows: '1fr 1fr 1fr',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        <div className="bg-red-300 h-full flex items-center justify-center">
          Box 1
        </div>
        <div className="bg-yellow-300 h-full flex items-center justify-center">
          Box 2
        </div>
        <div className="bg-green-300 h-full flex items-center justify-center">
          Box 3
        </div>
        <div className="bg-blue-300 h-full flex items-center justify-center">
          Box 4
        </div>
        <div className="bg-purple-300 h-full flex items-center justify-center">
          Box 5
        </div>
        <div className="bg-pink-300 h-full flex items-center justify-center">
          Box 6
        </div>
        <div className="bg-gray-300 h-full flex items-center justify-center">
          Box 7
        </div>
        <div className="bg-indigo-300 h-full flex items-center justify-center">
          Box 8
        </div>
        <div className="bg-teal-300 h-full flex items-center justify-center">
          Box 9
        </div>
      </div>
    </div>
  );
};

export default TestGrid;
