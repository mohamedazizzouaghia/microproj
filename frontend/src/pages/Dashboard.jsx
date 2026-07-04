import React, { useEffect, useState } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, Calendar, AlertCircle } from 'lucide-react';

const COLORS = ['#1e3a5f', '#f97316', '#3b82f6', '#10b981'];

const mockStats = {
  usersCount: 1250,
  eventsCount: 45,
  clubsCount: 24,
  incidentsCount: 8,
  eventsData: [{ name: 'Jan', count: 4 }, { name: 'Feb', count: 7 }, { name: 'Mar', count: 12 }, { name: 'Apr', count: 8 }],
  clubsData: [{ name: 'Tech', value: 10 }, { name: 'Sports', value: 5 }, { name: 'Arts', value: 6 }, { name: 'Science', value: 3 }],
  incidentsData: [{ name: 'Week 1', count: 2 }, { name: 'Week 2', count: 1 }, { name: 'Week 3', count: 4 }, { name: 'Week 4', count: 1 }],
  reservationsData: [{ name: 'Mon', count: 15 }, { name: 'Tue', count: 22 }, { name: 'Wed', count: 18 }, { name: 'Thu', count: 25 }, { name: 'Fri', count: 30 }]
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, clubsRes, incidentsRes, reservationsRes] = await Promise.allSettled([
          api.get('/api/users/stats'),
          api.get('/api/events/stats'),
          api.get('/api/clubs/stats'),
          api.get('/api/incidents/stats'),
          api.get('/api/reservations/stats')
        ]);

        const newStats = { ...mockStats };

        if (usersRes.status === 'fulfilled') {
          newStats.usersCount = usersRes.value.data.totalUsers || 0;
        }
        if (eventsRes.status === 'fulfilled') {
          newStats.eventsCount = eventsRes.value.data.total || 0;
          if (eventsRes.value.data.byCategory) {
             newStats.eventsData = eventsRes.value.data.byCategory.map(c => ({ name: c.category, count: c.count }));
          }
        }
        if (clubsRes.status === 'fulfilled') {
          newStats.clubsCount = clubsRes.value.data.total || 0;
          if (clubsRes.value.data.byCategory) {
             newStats.clubsData = clubsRes.value.data.byCategory.map(c => ({ name: c.category, value: c.count }));
          }
        }
        if (incidentsRes.status === 'fulfilled') {
          newStats.incidentsCount = incidentsRes.value.data.open || 0;
          if (incidentsRes.value.data.byPriority) {
             newStats.incidentsData = Object.entries(incidentsRes.value.data.byPriority).map(([k, v]) => ({ name: k, count: v }));
          }
        }
        if (reservationsRes.status === 'fulfilled') {
           if (reservationsRes.value.data.byRoom) {
             newStats.reservationsData = reservationsRes.value.data.byRoom.map(r => ({ name: r.roomName, count: r.count }));
           }
        }
        
        setStats(newStats);
      } catch (err) {
        console.warn('Backend stats fetch failed, using mock data', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.usersCount} icon={Users} colorClass="bg-blue-500" />
        <StatCard title="Active Events" value={stats.eventsCount} icon={Calendar} colorClass="bg-accent" />
        <StatCard title="Total Clubs" value={stats.clubsCount} icon={Activity} colorClass="bg-primary" />
        <StatCard title="Open Incidents" value={stats.incidentsCount} icon={AlertCircle} colorClass="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Events Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Events Created (Monthly)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.eventsData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Clubs Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Clubs by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.clubsData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {stats.clubsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Incidents Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Reported Incidents</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.incidentsData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ r: 6, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Reservations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Room Reservations</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.reservationsData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
