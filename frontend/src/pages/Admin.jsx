import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const Admin = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleComingSoon = () => {
    toast('This feature is coming soon!', { icon: '🚧' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/users')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30 group"
        >
          <Users className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">Manage Users</h3>
          <p className="text-gray-500 text-sm mt-1">Approve or suspend student accounts.</p>
        </div>
        
        <div 
          onClick={() => navigate('/admin/logs')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:border-green-500/30 group"
        >
          <Activity className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">System Logs</h3>
          <p className="text-gray-500 text-sm mt-1">View API gateway and service logs.</p>
        </div>
        
        <div 
          onClick={() => navigate('/admin/settings')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-400 group"
        >
          <Settings className="w-8 h-8 text-gray-700 mb-4 group-hover:rotate-45 transition-transform duration-500" />
          <h3 className="text-lg font-bold text-gray-800">Settings</h3>
          <p className="text-gray-500 text-sm mt-1">Configure global application settings.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
