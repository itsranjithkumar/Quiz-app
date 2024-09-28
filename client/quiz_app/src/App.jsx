import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { checkAuth, logout } from './features/auth/authSlice';
import RegisterPage from './pages/register-page';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import { Toaster } from "@/components/ui/toaster";
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'admin') {
    return children;
  }
  return <Navigate to="/unauthorized" />;
}

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function LogoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to="/login" replace />;
}

function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/:username" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
