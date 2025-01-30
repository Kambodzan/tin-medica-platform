import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DetailsModal from '../components/DetailsModal';
import { useAuth } from '../contexts/AuthContext';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [DetailsModalData, setDetailsModalData] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        console.log(user.id);
        const userUuid = user.id;
        const response = await fetch(`http://localhost:5000/prescriptions/${userUuid}`);
        console.log(response);
        const data = await response.json();
        setPrescriptions(data.prescriptions || []);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeIndex={5} />
        <div className="flex-grow flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <p>Loading prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeIndex={5} />

      {/* Główna zawartość */}
      <div className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <div className="flex-grow p-8 bg-gray-100 overflow-hidden flex flex-col">
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <p className="mt-4">Below you can check your prescriptions.</p>

          {/* List */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full">
            {prescriptions.length > 0 ? (
              <ul className="space-y-4">
                {prescriptions.map((item, index) => (
                  <li key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{item.date}</p>
                        <p className="text-lg font-bold">Kod recepty: {item.code}</p>
                        <p className="text-sm text-gray-700">{item.doctor}</p>
                        <p className="text-sm text-gray-500">{item.clinic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{item.status}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={() => {
                          console.log("dziala");
                          setDetailsModalData(item);
                          setDetailsModalOpen(true);
                        }}
                      >
                        Zobacz receptę
                      </button>
                      <button className="text-blue-500 hover:underline">Zamów lek online</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No prescriptions found.</p>
            )}
          </div>
        </div>
      </div>

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        data={DetailsModalData || {}}
        title="Prescription Details"
      />
    </div>
  );
};

export default Prescriptions;
