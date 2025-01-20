import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ activeIndex }) => {
  const { logout } = useAuth(); // Pobierz funkcję logout z kontekstu
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Wyloguj użytkownika
    navigate('/login'); // Przekieruj na stronę logowania
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'fa-regular fa-chart-tree-map' },
    { label: 'Appointments', href: '/appointments', icon: 'fa-regular fa-calendar' },
    { label: 'Referrals', href: '/refferals', icon: 'fa-regular fa-paper-plane-top' },
    { label: 'Tests', href: '/tests', icon: 'fa-regular fa-microscope' },
    { label: 'History', href: '/history', icon: 'fa-regular fa-clock-rotate-left' },
    { label: 'Prescriptions', href: '/prescriptions', icon: 'fa-regular fa-tablets' },
    { label: 'DoctorsPanel', href: '/clients', icon: 'fas fa-user-md' },
    { label: 'Profile', href: '/profile', icon: 'fa-regular fa-circle-user' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white h-full min-h-screen border-r">
      <div className="flex items-center justify-center h-14 border-b">
        <div><strong>Medical Platform</strong></div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 border-l-4 pr-6 ${
                  index === activeIndex
                    ? 'text-blue-500 border-blue-500'
                    : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-blue-400'
                }`}
              >
                <span className="inline-flex justify-center items-center ml-4">
                  {/* Ikona Font Awesome */}
                  <i className={`${item.icon} text-lg`}></i>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Logout Item */}
          <li>
            <button
              onClick={handleLogout}
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-blue-400 pr-6 w-full text-left"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <i className="fa-regular fa-arrow-right-from-bracket"></i> {/* Ikona wylogowania */} 
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  activeIndex: PropTypes.number.isRequired,
};

export default Sidebar;
