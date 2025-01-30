import React, { useState } from 'react';
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

export default DetailsModal;