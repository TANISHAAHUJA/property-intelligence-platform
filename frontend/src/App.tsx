import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PropertyDetails from './pages/PropertyDetails';
import Analysis from './pages/Analysis';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Hooks
import { useAuth } from './hooks/useAuth';

// Types
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            {user ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/analysis/:id" element={<Analysis />} />
              </>
            ) : (
              <Route path="/dashboard" element={<Login />} />
            )}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;