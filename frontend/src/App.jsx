import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Placeholder components for future pages
const Marketplace = () => <div>Agro Marketplace Coming Soon...</div>;
const Notifications = () => <div>Notifications Page</div>;
const UserDashboard = () => <div>User Dashboard</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
