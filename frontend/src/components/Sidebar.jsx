import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, AlertTriangle, User, Shield, Tent } from 'lucide-react';

const Sidebar = ({ role }) => {
  const links = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Tent },
    { name: 'Reservations', path: '/reservations', icon: Calendar },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (role === 'ADMIN') {
    links.push({ name: 'Users', path: '/users', icon: Users });
    links.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <div className="w-64 bg-primary text-white flex flex-col h-full border-r border-gray-200 shadow-xl z-10 transition-all duration-300">
      <div className="p-6 border-b border-primary/50 bg-primary/90">
        <h1 className="text-2xl font-bold tracking-wider text-white">
          Esprit<span className="text-accent">Connect</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/30 translate-x-1'
                  : 'hover:bg-primary-light hover:text-accent hover:translate-x-1 text-gray-300'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary/50 text-xs text-gray-400 text-center bg-primary/90">
        &copy; 2026 EspritConnect
      </div>
    </div>
  );
};

export default Sidebar;
