import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RecordEmotion from './pages/RecordEmotion';
import WriteDiary from './pages/WriteDiary';
import WeeklyReport from './pages/WeeklyReport';
import GeminiTest from './pages/GeminiTest';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/record" element={<PrivateRoute><RecordEmotion /></PrivateRoute>} />
        <Route path="/write-diary" element={<PrivateRoute><WriteDiary /></PrivateRoute>} />
        <Route path="/weekly-report" element={<PrivateRoute><WeeklyReport /></PrivateRoute>} />
        <Route path="/GeminiTest" element={<PrivateRoute><GeminiTest /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
