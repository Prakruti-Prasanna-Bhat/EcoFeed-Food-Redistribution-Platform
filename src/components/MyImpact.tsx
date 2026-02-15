import React, { useState, useEffect } from 'react';
import { 
  Heart, Trash2, Wind, TrendingUp, Calendar, 
  Package, Leaf, BarChart3, PieChart as PieIcon 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export function MyImpact() {
  const { profile, user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // 1. REAL-TIME TRANSACTION FETCHING
      const q = query(
        collection(db, "transactions"),
        where("donorId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(20)
      );

      return onSnapshot(q, (snapshot) => {
        const txs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setHistory(txs);

        // 2. DYNAMIC CATEGORY CALCULATION
        const categoryMap: Record<string, number> = {};
        txs.forEach((t: any) => {
          categoryMap[t.category] = (categoryMap[t.category] || 0) + (t.amountClaimed || 0);
        });
        
        setCategoryStats(Object.keys(categoryMap).map(name => ({
          name, value: categoryMap[name]
        })));
      });
    }
  }, [user]);

  // ENVIRONMENTAL MATH: 1kg waste = 2.5kg CO2
  const wasteReduced = profile?.wasteReduced || 0;
  const co2SavedKg = wasteReduced * 2.5;
  
  const metrics = [
    { label: 'MEALS SHARED', value: (profile?.totalMeals || 0).toString(), icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'WASTE REDUCED', value: `${wasteReduced.toFixed(1)}kg`, icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'CO₂ PREVENTED', value: co2SavedKg > 1000 ? `${(co2SavedKg/1000).toFixed(2)}t` : `${co2SavedKg.toFixed(1)}kg`, icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'PEOPLE FED', value: profile?.receiverDonationCount || '0', icon: Leaf, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const COLORS = ['#00C897', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="p-8 space-y-12 max-w-[1440px] mx-auto animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Environmental Impact</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Real-time Data Transparency</p>
      </div>

      {/* CLEAN BOXED METRICS: Replicated from the preferred dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:translate-y-[-2px]">
            <div className="space-y-2">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">{m.label}</p>
              <p className="text-4xl font-black text-gray-900 leading-none">{m.value}</p>
            </div>
            <div className={`${m.bg} p-4 rounded-2xl`}>
              <m.icon className={`w-8 h-8 ${m.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* DONATION GROWTH TRENDS */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 border border-gray-50 shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3"><TrendingUp className="text-green-600 w-6 h-6" /> Impact Trajectory</h3>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Last 20 Donations</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '20px' }}
                />
                <Line type="monotone" dataKey="amountClaimed" stroke="#00C897" strokeWidth={5} dot={{ r: 6, fill: '#00C897', strokeWidth: 0 }} activeDot={{ r: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FOOD CATEGORY PIE CHART */}
        <div className="bg-white rounded-[3rem] p-12 border border-gray-50 shadow-sm space-y-10 flex flex-col items-center">
          <h3 className="text-xl font-black text-gray-900 w-full text-left flex items-center gap-3">
            <PieIcon className="text-blue-500 w-6 h-6" /> Categories
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryStats} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {categoryStats.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VERIFIED DONATION FEED */}
      <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3"><Calendar className="text-green-600 w-6 h-6" /> Verified History</h3>
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-bold">Your donation impacts will appear here.</p>
            </div>
          ) : (
            history.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white border border-gray-50 rounded-[2rem] hover:shadow-lg hover:border-green-100 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="bg-green-50 p-4 rounded-2xl group-hover:bg-green-100 transition-colors"><Package className="text-green-600 w-6 h-6" /></div>
                  <div>
                    <p className="font-black text-gray-900">Donated to {t.claimerName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.category} • {new Date(t.timestamp?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-black text-green-600 text-lg">+{t.amountClaimed} Portions</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Impact: Verified</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}