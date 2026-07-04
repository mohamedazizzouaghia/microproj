import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.warn('Backend register failed, using mock');
      toast.success('Mock Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 z-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-500 font-medium">Join EspritConnect today!</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@esprit.tn"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-4 bg-accent hover:bg-accent/90 text-white p-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-accent/30">
            <span>Sign Up</span>
            <UserPlus className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
