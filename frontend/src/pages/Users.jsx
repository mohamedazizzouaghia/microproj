import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Trash2, Mail, Briefcase, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', department: 'Computer Science', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/users', formData);
      setFormData({ firstName: '', lastName: '', email: '', department: 'Computer Science', role: 'STUDENT' });
      setShowModal(false);
      fetchUsers();
      toast.success('User created successfully');
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">User Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shadow-sm">
                {user.firstName ? user.firstName.charAt(0) : 'U'}
              </div>
              <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">{user.firstName} {user.lastName}</h3>
            
            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{user.department || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            No users found. Click 'New User' to create one!
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john.doe@esprit.tn" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. IT" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="ADMIN">Admin</option>
                    <option value="STUDENT">Student</option>
                    <option value="PROFESSOR">Professor</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/30">
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors">
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

export default Users;
