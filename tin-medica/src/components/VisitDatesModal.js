import React, { useEffect, useState } from "react";
import axios from "axios";

const VisitDatesModal = ({ isModalVisible, closeModalHandler, date }) => {
  const [visitRecords, setVisitRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isModalVisible && date) {
      fetchVisitRecords();
    }
  }, [isModalVisible, date]);

  const fetchVisitRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/visit-dates?date=${date}`);
      setVisitRecords(response.data); // Zakładamy, że odpowiedź to lista wizyt
    } catch (error) {
      console.error("Error fetching visit dates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Visit Dates</h2>

        <button
          onClick={closeModalHandler}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          &times;
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : visitRecords.length > 0 ? (
          <div>
            <h3 className="font-semibold mb-2">Visit Details</h3>
            <ul className="list-disc pl-5">
              {visitRecords.map((visit) => (
                <li key={visit.id} className="mb-4">
                  <p><strong>Consultation Type:</strong> {visit.consultation_type}</p>
                  <p><strong>Doctor:</strong> {visit.doctor_name}</p>
                  <p><strong>Clinic:</strong> {visit.clinic_name}</p>
                  <p><strong>User:</strong> {visit.user_name}</p>
                  <p><strong>Date:</strong> {new Date(visit.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No visits found for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default VisitDatesModal;