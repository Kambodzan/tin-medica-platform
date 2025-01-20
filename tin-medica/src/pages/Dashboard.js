import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardCalendarTile from '../components/DashboardCalendarTile';
import LastVisitCard from '../components/LastVisitCard'; // Import komponentu
import TestTable from '../components/TestTable'; // Import TestTable
import ReferralTiles from '../components/ReferralTiles';

const Dashboard = () => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const handleTileClick = (date) => {
    alert(`Edit events for: ${date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`);
  };

  const handleDetailsClick = (visit) => {
    alert(`Details for: ${visit}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={0} />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col p-4 bg-gray-100">
          {/* Header */}
          <div className="flex-shrink-0 mb-4">
            <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
            <p className="text-gray-600">This is the main content of the page.</p>
          </div>

          {/* Main Grid */}
          <div
            className="flex-grow grid grid-cols-3 grid-rows-3 gap-4 pb-8"
            style={{
              gridTemplateRows: 'repeat(3, 50%)', // Równomierny podział wysokości
              gridTemplateColumns: 'repeat(3, 1fr)', // Równomierny podział szerokości
            }}
          >
            {/* Schedule Section */}
            <div className="col-span-2 bg-white p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Schedule for the week</h2>
                  <a href="#" className="text-blue-500 text-sm font-medium">Show more</a>
                </div>
              <div className="grid grid-cols-7 gap-2 flex-grow">
                {days.map((date) => (
                  <DashboardCalendarTile
                    key={date.toISOString()}
                    date={date}
                    onClick={() => handleTileClick(date)}
                  />
                ))}
              </div>
            </div>

            {/* Last Visits Section */}
            <div className="bg-white p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Last Visits</h2>
                  <a href="#" className="text-blue-500 text-sm font-medium">Show more</a>
                </div>
              <div className="flex-grow flex flex-col justify-between space-y-2">
                <LastVisitCard
                  title="Cardiologist"
                  date="20 stycznia 2025"
                  time="14:00"
                  name="Jan Kowalski"
                  address="ul. Przykladowa 123, Warszawa"
                  onDetailsClick={() => handleDetailsClick("Wizyta 1")}
                />
                <LastVisitCard
                  title="Orthopedic Surgeon"
                  date="21 stycznia 2025"
                  time="16:00"
                  name="Anna Nowak"
                  address="ul. Przykładna 456, Kraków"
                  onDetailsClick={() => handleDetailsClick("Wizyta 2")}
                />
                <LastVisitCard
                  title="Family Doctor"
                  date="22 stycznia 2025"
                  time="10:00"
                  name="Piotr Zieliński"
                  address="ul. Przykładkowa 789, Gdańsk"
                  onDetailsClick={() => handleDetailsClick("Wizyta 3")}
                />
              </div>
            </div>

            {/* Single Yellow Section */}
            <div className="bg-white flex items-center justify-center h-full">
              {/* <h3 className="text-xl font-bold mb-4">Tests</h3> */}
              <TestTable type="TEST" />
            </div>

            <div className="bg-white flex items-center justify-center h-full">
              <div className="w-full h-full p-4">
                {/* Nagłówek w lewym górnym rogu */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Referrals</h2>
                  <a href="#" className="text-blue-500 text-sm font-medium">Show more</a>
                </div>

                {/* Siatka z kafelkami */}
                <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)] pb-4">
                      <ReferralTiles 
                      title="Referrals 1"
                      doctor="Dr. Kowalski"
                      issueDate="2025-01-20"
                      urgent="Yes"
                      />
                      <ReferralTiles 
                        title="Referrals 2"
                        doctor="Dr. Zieliński"
                        issueDate="2025-01-19"
                        urgent="No"
                      />
                      <ReferralTiles 
                        title="Referrals 3"
                        doctor="Dr. Lewandowski"
                        issueDate="2025-01-18"
                        urgent="No"
                      />
                      <ReferralTiles 
                        title="Referrals 4"
                        doctor="Dr. Kamińska"
                        issueDate="2025-01-17"
                        urgent="Yes"
                      />
                </div>
              </div>
            </div>

            <div className="bg-white flex items-center justify-center h-full">
              <TestTable tye="PRESCRIPTION" />
            </div>

            {/* Merged Green Section */}
            {/* <div className="col-span-2 bg-green-300 flex items-center justify-center">
              Merged Green
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
