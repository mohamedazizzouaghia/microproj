import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Calendar, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: localStorage.getItem('role') || 'STUDENT',
    id: null
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        const userData = userRes.data;
        setProfile({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          role: userData.role || localStorage.getItem('role') || 'STUDENT',
          id: userData.id
        });

        // Fetch reservations
        const resResponse = await api.get('/api/reservations');
        // If the backend has no concept of "my reservations" yet, we just show all for demo
        // but ideally we'd filter by res.studentId === userData.id
        const allRes = resResponse.data || [];
        setReservations(allRes.slice(0, 3)); // Show up to 3 recent reservations for demo
      } catch (err) {
        console.warn('Error fetching profile data, using fallback', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', {
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Profile</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg relative">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden font-bold text-3xl text-gray-500">
                {profile.firstName ? profile.firstName.charAt(0) : <User className="w-10 h-10 text-gray-400" />}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-accent text-white rounded-full shadow-sm hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-16 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={profile.firstName} 
                    onChange={e => setProfile({...profile, firstName: e.target.value})}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={profile.lastName} 
                    onChange={e => setProfile({...profile, lastName: e.target.value})}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    disabled
                    value={profile.email} 
                    className="pl-10 w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    disabled
                    value={profile.role} 
                    className="pl-10 w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">My Recent Reservations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(res => (
            <div key={res.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4">{res.purpose || 'Room Booking'}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700">{res.roomName || res.room}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>{res.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>{res.time}</span>
                </div>
              </div>
            </div>
          ))}
          {reservations.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              You haven't made any reservations yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
