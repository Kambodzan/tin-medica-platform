import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Prescriptions from './pages/Prescriptions';
import Referrals from './pages/Referrals';
import Tests from './pages/Tests';
import HistoryPage from './pages/HistoryPage';
import Appointments from './pages/Appointments';
import DoctorsPanel from './pages/DoctorsPanel';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute>
                <Referrals />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
