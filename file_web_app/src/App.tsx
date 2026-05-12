import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPages';
import DocumentsPage from './pages/DocumentPage';
import RemindersPage from './pages/ReminderPage';
import UsersPage from './pages/UsersPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading || (!!token && !isAuthenticated)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#1e293b'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const token = sessionStorage.getItem('token');

  if ((!isAuthenticated && (isLoading || !!token)) || (!user && isLoading)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        color: '#1e293b'
      }}>
        Loading...
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route
            path="users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="reports"
            element={
              <AdminRoute>
                <ReportsPage />
              </AdminRoute>
            }
          />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
