import React, { useEffect, useState } from 'react';

/**
 * Komponent MessageBox - Wyświetla komunikaty o błędach i sukcesach z animacją.
 *
 * @param {string} type - Typ komunikatu: 'success', 'error', 'info', 'warning'.
 * @param {string} message - Treść komunikatu.
 */
const MessageBox = ({ type, message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    }
  }, [message]);

  if (!message) return null; // Nie renderuj, jeśli brak komunikatu

  const types = {
    success: {
      background: 'bg-emerald-500',
      text: 'text-emerald-500',
      label: 'Success',
    },
    error: {
      background: 'bg-red-500',
      text: 'text-red-500',
      label: 'Error',
    },
    info: {
      background: 'bg-blue-500',
      text: 'text-blue-500',
      label: 'Info',
    },
    warning: {
      background: 'bg-yellow-400',
      text: 'text-yellow-400',
      label: 'Warning',
    },
  };

  const { background, text, label } = types[type] || types.info;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md">
        <div className={`flex items-center justify-center w-12 ${background}`}>
          <svg
            className="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
          </svg>
        </div>

        <div className="px-4 py-2 -mx-3">
          <div className="mx-3">
            <span className={`font-semibold ${text}`}>{label}</span>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
