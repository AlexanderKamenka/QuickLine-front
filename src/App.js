import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BusinessesPage from './pages/BusinessesPage';
import ServicesPage from './pages/ServicesPage';
import QueuePage from './pages/QueuePage';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/businesses" element={<ProtectedRoute><BusinessesPage /></ProtectedRoute>} />
          <Route path="/businesses/:id/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="/queues" element={<ProtectedRoute><QueuePage /></ProtectedRoute>} />
        </Routes>
      </div>
  );
};

function App() {
  return (
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
  );
}

export default App;