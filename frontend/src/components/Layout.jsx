import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'STUDENT';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
