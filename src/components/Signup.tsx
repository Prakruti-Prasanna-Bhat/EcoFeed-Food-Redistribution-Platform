import React, { useState } from 'react';
import { Leaf, Building2, MapPin, Mail, Lock, ChevronDown } from 'lucide-react';
import { signUpEcoFeed } from '../services/auth';

export function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'DONOR',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic Fix: Removed businessType entirely. 
      // Force Role to Uppercase to match the DB exactly
      await signUpEcoFeed(formData.email, formData.password, {
        role: formData.role.toUpperCase(),
        name: formData.name,
        address: formData.address
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-[1.2rem] flex items-center justify-center mb-4 shadow-xl shadow-green-100">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">Join EcoFeed</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <select 
              className="w-full pl-6 pr-10 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-700 appearance-none cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="DONOR">I am a Food Donor</option>
              <option value="RECEIVER">I am a Food Receiver (NGO)</option>
              <option value="COMPOSTER">I am a Composter</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex items-center group">
            <Building2 className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-green-600" />
            <input type="text" placeholder="Organization Name" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="relative flex items-center group">
            <MapPin className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-green-600" />
            <input type="text" placeholder="Physical Address" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" 
              onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div className="relative flex items-center group">
            <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-green-600" />
            <input type="email" placeholder="Email" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          
          <div className="relative flex items-center group">
            <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-green-600" />
            <input type="password" placeholder="Password" className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg mt-4 active:scale-95">
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 font-medium">Already have an account? <button type="button" onClick={onSwitch} className="text-green-600 font-bold hover:underline">Login here</button></p>
          </div>
        </form>
      </div>
    </div>
  );
}