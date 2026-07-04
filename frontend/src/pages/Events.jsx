import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Calendar as CalendarIcon, MapPin, X, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', capacity: 100, category: 'SEMINAR', status: 'UPCOMING' });
  const role = localStorage.getItem('role') || 'STUDENT';

  const categories = ['SEMINAR', 'WORKSHOP', 'COMPETITION', 'SOCIAL', 'OTHER'];

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents(res.data || []);
    } catch (err) {
      console.warn('Backend /api/events failed');
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/events', {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        capacity: parseInt(formData.capacity),
        registeredCount: 0,
        category: formData.category,
        status: formData.status,
        organizerId: 1
      });
      toast.success('Event created!');
      setShowForm(false);
      setFormData({ title: '', description: '', date: '', capacity: 100, category: 'CONFERENCE', status: 'UPCOMING' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      toast.success('Event deleted!');
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register?userId=1`);
      toast.success('Registered for event!');
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to register');
    }
  };

  const filteredEvents = events.filter(e => e.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getCategoryColor = (cat) => {
    const colors = {
      CONFERENCE: 'bg-blue-100 text-blue-700',
      WORKSHOP: 'bg-purple-100 text-purple-700',
      SPORTS: 'bg-green-100 text-green-700',
      CULTURAL: 'bg-pink-100 text-pink-700',
      ACADEMIC: 'bg-yellow-100 text-yellow-700',
      OTHER: 'bg-gray-100 text-gray-700',
    };
    return colors[cat] || colors.OTHER;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Events</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          {role === 'ADMIN' && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> New Event
            </button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No events found. {role === 'ADMIN' ? 'Create one to get started!' : 'Check back later!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer" onClick={() => setSelectedEvent(event)}>
              <div className="h-48 overflow-hidden relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <CalendarIcon className="w-16 h-16 text-primary/30" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                  {event.date}
                </div>
                {event.category && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{event.registeredCount || 0} / {event.capacity || '∞'} registered</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status === 'UPCOMING' ? 'bg-green-100 text-green-700' : event.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {event.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all scale-100">
            <div className="h-48 relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <CalendarIcon className="w-20 h-20 text-primary/30" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedEvent.title}</h2>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <CalendarIcon className="w-5 h-5 mr-3 text-accent" />
                  <span className="font-medium">{selectedEvent.date}</span>
                </div>
                {selectedEvent.category && (
                  <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 mr-3 text-accent" />
                    <span className="font-medium">{selectedEvent.category}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{selectedEvent.description}</p>
              <p className="text-sm text-gray-500 mb-8">
                {selectedEvent.registeredCount || 0} / {selectedEvent.capacity || '∞'} registered
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleRegister(selectedEvent.id)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/30"
                >
                  Register
                </button>
                {role === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(selectedEvent.id)}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-xl font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Event</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Tech Talk: AI Future"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Describe the event..."
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/30">Create Event</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
