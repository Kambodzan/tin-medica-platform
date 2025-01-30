import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-white h-14 flex items-center justify-between px-4 border-b">
      <div></div>
      
      {/* Sekcja języka, imienia i profilowego zdjęcia */}
      <div className="flex items-center space-x-4">
        
        {/* Imię i nazwisko */}
        {user ? (
          <>
            <span className="text-black font-medium">
              {user.firstName} {user.lastName}
            </span>
            {/* Zdjęcie profilowe */}
            {!user.profilePicture ? (
            <i
              className="fa-regular fa-circle-user text-2xl scale-105 text-gray-800 cursor-pointer"
              onClick={handleClick}
            ></i>
          ) : (
            <img
              src={user.profilePicture}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
              onClick={handleClick}
            />
          )}

          </>
        ) : (
          <span className="text-gray-500">Nie zalogowano</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
