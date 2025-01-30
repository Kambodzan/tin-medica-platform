import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const DetailsModal = ({ isOpen, onClose, data, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -50 }}
        className="bg-white rounded-2xl shadow-lg w-11/12 md:w-1/2 p-6"
      >
        <h2 className="text-xl font-semibold text-blue-500 mb-4">{title}</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="font-bold text-blue-500 capitalize">{key.replace(/_/g, ' ')}:</span> {value || 'N/A'}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Tests = () => {
  const { user } = useAuth();
  const itemsPerPage = 3;
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [DetailsModalData, setDetailsModalData] = useState(null);
  const [DetailsModalTitle, setDetailsModalTitle] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/tests/${user.id}`);
        const data = await response.json();
        setTests(data.tests || []);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user.id]);

  const totalPages = Math.ceil(tests.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOptionClick = (option, code) => {
    // Open the DetailsModal with test details
    const test = tests.find(test => test.test_code === code);
    setDetailsModalTitle(`Test ${code} Details`);
    setDetailsModalData(test || {});
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return dayjs(dateString).format('DD-MM-YYYY HH:mm');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = tests.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={3} />
        <div className="flex-grow flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <p>Loading tests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={3} />

      {/* Main content */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold">Medical Tests</h1>
          <p className="mt-4">Below you can check the details of your medical tests.</p>

          {/* List */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            {tests.length > 0 ? (
              <ul className="space-y-4">
                {currentItems.map((item, index) => (
                  <li key={index} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center">
                      {/* Test details */}
                      <div>
                        <p className="text-lg font-bold">{item.test_code || 'No code'}</p>
                        <h3 className="text-lg font-normal">{item.test_type}</h3>
                        <p className="text-sm text-gray-500">Reason: {item.reason}</p>
                        <p className="text-sm text-gray-500">Ordered by: {item.doctor_name}</p>
                      </div>
                      {/* Dates + Icon */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            <span className="font-bold">Ordered at:</span> {formatDate(item.ordered_at)}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-bold">Result at:</span> {formatDate(item.result_at)}
                          </p>
                        </div>
                        {/* Options icon */}
                        <i
                          className="fa-solid fa-ellipsis-vertical text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
                          style={{ alignSelf: 'center' }}
                          onClick={() =>
                            handleOptionClick('Options (Details, History, Delete)', item.test_code)
                          }
                        ></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tests found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Previous
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
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DetailsModal */}
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        data={DetailsModalData}
        title={DetailsModalTitle}
      />
    </div>
  );
};

export default Tests;
