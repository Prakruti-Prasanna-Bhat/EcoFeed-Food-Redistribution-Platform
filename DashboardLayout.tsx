import React, { useState, useEffect } from 'react';
import { Search, Bell, LayoutGrid, Users, TrendingUp, Leaf, LogOut, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logoutEcoFeed } from '../services/auth';
import { collection, query, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase'; 

export function DashboardLayout({ children, currentView, onViewChange }: any) {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          name: doc.data().name || doc.data().displayName,
          role: doc.data().role,
          id: doc.id
        }));
        setAllUsers(usersData);
      } catch (error) {
        console.error("Search fetch error:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col z-20">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EcoFeed</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {profile?.role === 'DONOR' && (
            <button onClick={() => onViewChange('donor')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'donor' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><LayoutGrid className="w-5 h-5" />Donor Portal</button>
          )}
          {profile?.role === 'RECEIVER' && (
            <button onClick={() => onViewChange('receiver')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'receiver' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Users className="w-5 h-5" />Receiver Hub</button>
          )}
          {profile?.role === 'COMPOSTER' && (
            <button onClick={() => onViewChange('composter')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'composter' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><Trash2 className="w-5 h-5" />Composter Hub</button>
          )}
          <button onClick={() => onViewChange('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'analytics' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}><TrendingUp className="w-5 h-5" />My Impact</button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 ml-8">
              <div className="flex items-center gap-4 pl-6 border-l border-gray-100 text-right">
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-none mb-1">{profile?.displayName || profile?.name}</div>
                  <div className="text-[10px] text-green-600 font-black uppercase tracking-widest">{profile?.role}</div>
                </div>
                <button onClick={() => logoutEcoFeed()} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><LogOut className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </header>
        <main className="overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}