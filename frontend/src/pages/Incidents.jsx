import React, { useState, useEffect } from 'react';
import api from '../api';
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newIncident, setNewIncident] = useState({ title: '', description: '', location: '', category: 'MAINTENANCE', priority: 'MEDIUM' });
  const role = localStorage.getItem('role') || 'STUDENT';

  const categories = ['MAINTENANCE', 'SECURITY', 'CLEANING', 'OTHER'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/api/incidents');
      setIncidents(res.data || []);
    } catch (err) {
      console.warn('Backend /api/incidents failed');
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newIncident.title,
        description: newIncident.description,
        location: newIncident.location,
        category: newIncident.category,
        priority: newIncident.priority,
        status: 'OPEN',
        reportedBy: localStorage.getItem('email') || 'anonymous'
      };
      await api.post('/api/incidents', payload);
      toast.success('Incident reported successfully!');
      setShowForm(false);
      setNewIncident({ title: '', description: '', location: '', category: 'MAINTENANCE', priority: 'MEDIUM' });
      fetchIncidents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to report incident');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/incidents/${id}/status?status=${newStatus}`);
      toast.success('Status updated!');
      fetchIncidents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident?')) return;
    try {
      await api.delete(`/api/incidents/${id}`);
      toast.success('Incident deleted!');
      fetchIncidents();
    } catch (err) {
      toast.error('Failed to delete incident');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'RESOLVED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CLOSED': return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-accent" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      RESOLVED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      OPEN: 'bg-orange-100 text-orange-700',
    };
    return <span className={`${styles[status] || styles.OPEN} px-3 py-1 rounded-full text-xs font-semibold`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      LOW: 'bg-gray-100 text-gray-600',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      HIGH: 'bg-orange-100 text-orange-700',
      URGENT: 'bg-red-100 text-red-700',
    };
    return <span className={`${styles[priority] || styles.MEDIUM} px-2 py-0.5 rounded-full text-xs font-semibold`}>{priority}</span>;
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Reported Incidents</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-accent/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Report Incident
        </button>
      </div>

      {incidents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No incidents reported. Everything is running smoothly!
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map(incident => (
            <div key={incident.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">{getStatusIcon(incident.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800">{incident.title}</h3>
                    {getPriorityBadge(incident.priority)}
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{incident.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{incident.description}</p>
                  {incident.location && <p className="text-xs text-gray-400 mt-1">📍 {incident.location}</p>}
                  <div className="text-xs text-gray-400 mt-2 font-medium">
                    Reported on {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString() : 'N/A'}
                    {incident.reportedBy && ` by ${incident.reportedBy}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {role === 'ADMIN' ? (
                  <>
                    <select
                      className="bg-gray-50 border border-gray-200 text-sm font-semibold rounded-lg focus:ring-primary focus:border-primary block p-2 cursor-pointer shadow-sm outline-none"
                      value={incident.status}
                      onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(incident.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  getStatusBadge(incident.status)
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Incident Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Report an Incident</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newIncident.title}
                  onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Broken chair in Room 101"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newIncident.location}
                  onChange={e => setNewIncident({ ...newIncident, location: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Block C - Room 201"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newIncident.category}
                    onChange={e => setNewIncident({ ...newIncident, category: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newIncident.priority}
                    onChange={e => setNewIncident({ ...newIncident, priority: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows="4"
                  value={newIncident.description}
                  onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Provide more details..."
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-accent/30">Submit Report</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
