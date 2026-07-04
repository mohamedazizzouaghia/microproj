import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New incident reported in Amphi A", time: "5m ago" },
    { id: 2, text: "System maintenance scheduled", time: "1h ago" },
    { id: 3, text: "Club 'Robotics' requested approval", time: "2h ago" }
  ]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 h-16 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <div className="text-xl font-semibold text-gray-800">
          Welcome back!
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-gray-500 hover:text-accent transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{notifications.length} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <p className="text-sm text-gray-700 font-medium">{notif.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
                  <button onClick={() => setNotifications([])} className="text-sm text-accent font-semibold hover:text-accent/80 transition-colors">Mark all as read</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md">
            <UserIcon className="w-5 h-5" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
