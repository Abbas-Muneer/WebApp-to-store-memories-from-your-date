import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import AcceptInvite from './pages/AcceptInvite';
import Home from './pages/Home';
import AllDates from './pages/AllDates';
import UploadDate from './pages/UploadDate';
import InvitePartner from './pages/InvitePartner';
import Profile from './pages/Profile';
import { isAuthenticated } from './utils/auth';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? '/home' : '/login'} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dates" element={<AllDates />} />
          <Route path="/upload" element={<UploadDate />} />
          <Route path="/invite" element={<InvitePartner />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
