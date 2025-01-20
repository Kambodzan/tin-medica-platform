import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (data) => {
    const { token, ...userInfo } = data;

    console.log('Logging in with user data:', userInfo); // Sprawdzenie danych użytkownika
    console.log('Received token:', token); // Sprawdzenie tokena

    setToken(token);
    setUser(userInfo);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    console.log('Checking saved data in localStorage:');
    console.log('Saved token:', savedToken);
    console.log('Saved user:', savedUser ? JSON.parse(savedUser) : null);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext updated:');
    console.log('Current user:', user);
    console.log('Current token:', token);
  }, [user, token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
