import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Try actual backend
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user?.role || 'STUDENT');
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Backend login failed:', error);
      toast.error('Invalid credentials or server offline.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 z-10 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">Esprit<span className="text-accent">Connect</span></h1>
          <p className="text-gray-500 font-medium">Welcome back! Please login to your account.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary" />
              Remember me
            </label>
            <a href="#" className="text-accent font-medium hover:text-accent/80 transition-colors">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white p-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg shadow-primary/30">
            <span>Sign In</span>
            <LogIn className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-8 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-accent font-semibold hover:text-accent/80 transition-colors">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
