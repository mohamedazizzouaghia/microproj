import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Events from './pages/Events';
import Reservations from './pages/Reservations';
import Clubs from './pages/Clubs';
import Incidents from './pages/Incidents';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SystemLogs from './pages/SystemLogs';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="events" element={<Events />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/logs" element={<SystemLogs />} />
          <Route path="admin/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
