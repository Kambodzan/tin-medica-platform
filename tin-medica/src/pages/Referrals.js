import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const Referrals = () => {
  const { user } = useAuth();
  const itemsPerPage = 3;
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(`http://localhost:5000/referrals/${user.id}`);
        const data = await response.json();
        setReferrals(data.referrals || []);
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user.id]);

  const totalPages = Math.ceil(referrals.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = referrals.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={2} />
        <div className="flex-grow flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <p>Loading referrals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={2} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold">Referrals</h1>
          <p className="mt-4">Below you can check your referrals.</p>

          {/* Lista skierowań */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            {referrals.length > 0 ? (
              <ul className="space-y-4">
                {currentItems.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 shadow-sm flex justify-between items-center"
                  >
                    {/* Szczegóły skierowania */}
                    <div>
                      <p className="text-lg font-bold">Issued by: {item.referred_by}</p>
                      <p className="text-sm text-gray-500">To: {item.referred_to}</p>
                      <p className="text-sm text-gray-500">Reason: {item.reason}</p>
                      <p className="text-sm text-gray-500">Note: {item.note}</p>
                      <p
                        className={`mt-2 text-sm font-bold ${
                          item.is_urgent ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        {item.is_urgent ? 'Urgent' : 'Normal'}
                      </p>
                    </div>
                    {/* Przycisk */}
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Umów wizytę
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No referrals found.</p>
            )}
          </div>

          {/* Paginacja */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Poprzednia
              </button>
            )}

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Następna
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
