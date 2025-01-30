import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardCalendarTile from '../components/DashboardCalendarTile';
import LastVisitCard from '../components/LastVisitCard';
import TestTable from '../components/TestTable';
import ReferralTiles from '../components/ReferralTiles';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth(); // Pobieramy dane użytkownika
  const [data, setData] = useState(null); // Ustawienie początkowego stanu na null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/dashboard/${user.id}`);
        const result = await response.json();
        setData(result); // Zapisanie pełnej odpowiedzi w stanie
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={0} />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Dodajemy bezpieczne sprawdzenie, czy dane istnieją
  if (!data) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={0} />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p>Error: Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const handleTileClick = (date) => {
    alert(
      `Edit events for: ${date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })}`
    );
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
          </div>

          {/* Main Grid */}
          <div
            className="flex-grow grid grid-cols-3 grid-rows-3 gap-4 pb-8"
            style={{
              gridTemplateRows: 'repeat(3, 50%)',
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            {/* Schedule Section */}
            <div className="col-span-2 bg-white p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Schedule for the week</h2>
                <a href="#" className="text-blue-500 text-sm font-medium">
                  Show more
                </a>
              </div>
              <div className="grid grid-cols-7 gap-2 flex-grow">
                {days.map((date) => {
                  const matchingVisit = data.visitDates?.find(
                    (visit) => new Date(visit.visit_date).toDateString() === date.toDateString()
                  );
                  return (
                    <DashboardCalendarTile
                      key={date.toISOString()}
                      date={date}
                      isHighlighted={!!matchingVisit}
                      visitDetails={
                        matchingVisit
                          ? {
                              consultationType: matchingVisit.consultation_type,
                              doctorName: matchingVisit.doctor_name,
                              clinicName: matchingVisit.clinic_name,
                            }
                          : null
                      }
                      onClick={() => handleTileClick(date)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Last Visits Section */}
            <div className="bg-white p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Last Visits</h2>
                <a href="#" className="text-blue-500 text-sm font-medium">
                  Show more
                </a>
              </div>
              <div className="flex-grow flex flex-col justify-between space-y-2">
                {data.lastVisits &&
                  data.lastVisits.map((visit, index) => (
                    <LastVisitCard
                      key={index}
                      title={visit.speciality}
                      date={new Date(visit.consultation_date).toLocaleDateString()}
                      time={new Date(visit.consultation_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      name={visit.doctor_name}
                      address={`${visit.clinic_name}, ${visit.clinic_address}`}
                      onDetailsClick={() => handleDetailsClick(`Visit ${index + 1}`)}
                    />
                  ))}
              </div>
            </div>

            {/* Tests Section */}
            <div className="bg-white flex items-center justify-center h-full">
              <TestTable tests={data.tests} type="TEST" />
            </div>

            {/* Referrals Section */}
            <div className="bg-white flex items-center justify-center h-full">
              <div className="w-full h-full p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Referrals</h2>
                  <a href="#" className="text-blue-500 text-sm font-medium">
                    Show more
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)] pb-4">
                  {data.referrals &&
                    data.referrals.map((referral, index) => (
                      <ReferralTiles
                        key={index}
                        title={referral.reason}
                        doctor={referral.referred_to}
                        issueDate={new Date(referral.issue_date).toLocaleDateString()}
                        urgent={referral.urgent ? 'Yes' : 'No'}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Prescriptions Section */}
            <div className="bg-white flex items-center justify-center h-full">
              <TestTable prescriptions={data.prescriptions} type="PRESCRIPTION" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
