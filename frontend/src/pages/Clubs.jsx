import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, ExternalLink, Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Tech' });
  const role = localStorage.getItem('role') || 'STUDENT';

  const categories = ['Tech', 'Business', 'Social', 'Sports', 'Arts', 'Science', 'Other'];

  const fetchClubs = async () => {
    try {
      const res = await api.get('/api/clubs');
      setClubs(res.data || []);
    } catch (err) {
      console.warn('Backend /api/clubs failed');
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClub) {
        await api.put(`/api/clubs/${editingClub.id}`, formData);
        toast.success('Club updated!');
      } else {
        await api.post('/api/clubs', formData);
        toast.success('Club created!');
      }
      setShowForm(false);
      setEditingClub(null);
      setFormData({ name: '', description: '', category: 'Tech' });
      fetchClubs();
    } catch (err) {
      console.error(err);
      toast.error(editingClub ? 'Failed to update club' : 'Failed to create club');
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setFormData({ name: club.name, description: club.description, category: club.category });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await api.delete(`/api/clubs/${id}`);
      toast.success('Club deleted!');
      fetchClubs();
    } catch (err) {
      toast.error('Failed to delete club');
    }
  };

  const handleJoin = async (clubId) => {
    try {
      await api.post(`/api/clubs/${clubId}/join`, { userId: 1 });
      toast.success('Successfully joined the club!');
      fetchClubs();
    } catch (error) {
      console.error(error);
      toast.error('Failed to join club.');
    }
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
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">University Clubs</h1>
        {role === 'ADMIN' && (
          <button
            onClick={() => { setEditingClub(null); setFormData({ name: '', description: '', category: 'Tech' }); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all"
          >
            <Plus className="w-4 h-4" /> New Club
          </button>
        )}
      </div>

      {clubs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No clubs found. {role === 'ADMIN' ? 'Create one to get started!' : 'Check back later!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => (
            <div key={club.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                {role === 'ADMIN' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(club)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(club.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{club.name}</h3>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium mb-3">
                {club.category}
              </span>
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{club.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-sm font-medium text-gray-500">{club.memberCount || 0} Members</span>
                <button
                  onClick={() => handleJoin(club.id)}
                  className="text-accent hover:text-accent/80 font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  Join <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{editingClub ? 'Edit Club' : 'Create Club'}</h2>
              <button onClick={() => { setShowForm(false); setEditingClub(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Robotics Club"
                />
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
                  placeholder="Describe the club..."
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/30">
                  {editingClub ? 'Save Changes' : 'Create Club'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingClub(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;
