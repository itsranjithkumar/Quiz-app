import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components
import Home from './pages/Home'; // Import the Home component
import SignupPage from './pages/SignupPage'; // Import the SignupPage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Home />} /> {/* Route for the home page */}
        <Route path="/register" element={<SignupPage />} /> {/* Route for the signup page */}
      </Routes>
    </Router>
  );
}

export default App;
