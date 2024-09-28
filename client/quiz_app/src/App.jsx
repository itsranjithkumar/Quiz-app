import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { checkAuth } from './features/auth/authSlice';
import SignupPage from './pages/SignupPage'; // Import the SignupPage component
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { Toaster } from "@/components/ui/toaster";
import NotFound from './pages/NotFound';
// import { RootState } from './app/store';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
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
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route 
          path="*" 
         element= {<NotFound/>} 
        />
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