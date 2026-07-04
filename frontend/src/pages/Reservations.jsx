import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const mockRooms = ['Amphi A', 'Amphi B', 'Block C - 101', 'Block C - 102', 'Lab 1', 'Lab 2'];
const mockReservations = [
  { id: 1, room: 'Amphi A', date: '2026-06-15', time: '10:00 - 12:00', purpose: 'Web Dev Workshop' },
  { id: 2, room: 'Lab 1', date: '2026-06-16', time: '14:00 - 16:00', purpose: 'AI Training' },
];

const Reservations = () => {
  const [view, setView] = useState('list'); // list or calendar
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ room: mockRooms[0], date: '', time: '', purpose: '' });
  const [reservations, setReservations] = useState(mockReservations);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get('/api/reservations');
        if (res.data && res.data.length > 0) setReservations(res.data);
      } catch (err) {
        console.warn('Backend /api/reservations failed, using mock data');
      }
    };
    fetchReservations();
  }, []);

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      // Assuming eventId and studentId are 1 for now, or adapt based on newRes
      const payload = {
         roomName: newRes.room,
         date: newRes.date,
         purpose: newRes.purpose,
         eventId: 1,
         studentId: 1
      };
      await api.post('/api/reservations', payload);
      
      const res = await api.get('/api/reservations');
      if (res.data) setReservations(res.data);
      
      setShowModal(false);
      toast.success('Room reserved successfully!');
    } catch (err) {
      toast.error('Failed to reserve room.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Room Reservations</h1>
        <div className="flex gap-3">
          <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
            <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
              <List className="w-5 h-5" />
            </button>
            <button onClick={() => setView('calendar')} className={`p-2 rounded-md transition-colors ${view === 'calendar' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}>
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all">
            New Reservation
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-semibold">Room</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Time</th>
                <th className="p-4 font-semibold">Purpose</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    {res.roomName || res.room}
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      {res.date}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {res.time}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{res.purpose}</td>
                  <td className="p-4 text-right">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Confirmed</span>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No reservations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center h-96">
          <p className="text-gray-500 flex flex-col items-center gap-4">
            <CalendarIcon className="w-16 h-16 text-gray-300" />
            <span>Calendar view coming soon. Please use list view.</span>
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Room</h2>
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
                <select 
                  value={newRes.room} 
                  onChange={e => setNewRes({...newRes, room: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {mockRooms.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newRes.date} 
                    onChange={e => setNewRes({...newRes, date: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    required 
                    value={newRes.time} 
                    onChange={e => setNewRes({...newRes, time: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Club Meeting" 
                  value={newRes.purpose} 
                  onChange={e => setNewRes({...newRes, purpose: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-colors">Book</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
