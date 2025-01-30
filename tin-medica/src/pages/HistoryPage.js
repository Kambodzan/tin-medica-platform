import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import DetailsModal from '../components/DetailsModal';

const HistoryPage = () => {
  const { user } = useAuth();
  const itemsPerPage = 4;
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [DetailsModalData, setDetailsModalData] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/medical-history/${user.id}`);
        const data = await response.json();
        setMedicalHistory(data.medicalHistory || []);
      } catch (error) {
        console.error('Failed to fetch medical history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [user.id]);

  const totalPages = Math.ceil(medicalHistory.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleIconClick = (index) => {
    setDetailsModalData(medicalHistory[index]);
    setIsDetailsModalOpen(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = medicalHistory.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={4} />
        <div className="flex-grow flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <p>Loading medical history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={4} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Główna sekcja */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold">Historia</h1>
          <p className="mt-4">Poniżej możesz sprawdzić historię swoich wizyt.</p>

          {/* Lista */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            <ul className="space-y-4">
              {currentItems.map((item, index) => (
                <li
                  key={index}
                  className="p-4 border rounded-lg flex items-center bg-gray-50 shadow-sm"
                >
                  {/* Ikona */}
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
                    <i className="fa-regular fa-user-doctor fa-2xl text-blue-500"></i>
                  </div>

                  {/* Szczegóły wizyty */}
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">
                      {item.consultation_date || 'Brak daty'}
                    </p>
                    <h3 className="text-lg font-bold">
                      {item.consultation_doctor || 'Nieznany lekarz'}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {item.clinic || 'Brak adresu'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.specialization || 'Brak specjalizacji'}
                    </p>
                  </div>

                  {/* Ikona z trzema kropkami */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleIconClick(index)}
                  >
                    <i className="fa-solid fa-ellipsis-vertical text-2xl leading-none pt-3 text-gray-500 hover:text-gray-700"></i>
                  </div>
                </li>
              ))}
            </ul>
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

      {/* DetailsModal */}
      {isDetailsModalOpen && DetailsModalData && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          data={DetailsModalData}
          title="Szczegóły wizyty"
        />
      )}
    </div>
  );
};

export default HistoryPage;
