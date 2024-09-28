import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components
import Home from './pages/Home'; // Import the Home component
import SignupPage from './pages/SignupPage'; // Import the SignupPage component
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Home />} /> {/* Route for the home page */}
        <Route path="/register" element={<SignupPage />} /> {/* Route for the signup page */}
        <Route path="/login" element={<LoginPage />} /> {/* Route for the login page */}
      </Routes>
    </Router>
  );
}

export default App;
