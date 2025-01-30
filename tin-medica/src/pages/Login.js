import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import MessageBox from '../components/PopUpAlertComponent';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
  
      if (response.data.token) {
        login({
          token: response.data.token,
          ...response.data.user, // Rozpakowanie danych użytkownika
        });
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setShowSuccessPopup(true);
      } else {
        setErrorMessage('Invalid login credentials. Please try again.');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred during login. Please try again.'
      );
    }
  };  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

        {errorMessage && (
          <div className="w-full mt-2 text-sm text-center text-red-500">{errorMessage}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Register
          </a>
        </div>
      </div>

      {showSuccessPopup && (
        <div>
          <MessageBox type="success" message={successMessage} />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
