import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Trash2, Wind, TrendingUp, Calendar, 
  Package, Leaf, BarChart3, PieChart as PieIcon, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export function PlatformAnalytics() {
  const { profile, user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "transactions"),
        where("donorId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(15)
      );

      return onSnapshot(q, (snapshot) => {
        const txs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setHistory(txs);

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

  const wasteReduced = profile?.wasteReduced || 0;
  const co2SavedKg = wasteReduced * 2.5; 
  
  // BOXED METRICS: Preserved from Donor Portal
  const metrics = [
    { label: 'TOTAL MEALS', value: (profile?.totalMeals || 0).toString(), icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'WASTE DIVERTED', value: `${wasteReduced.toFixed(1)}kg`, icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'CO₂ PREVENTED', value: co2SavedKg > 1000 ? `${(co2SavedKg/1000).toFixed(2)}t` : `${co2SavedKg.toFixed(1)}kg`, icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'COMMUNITY REACH', value: profile?.receiverDonationCount || '0', icon: Leaf, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const COLORS = ['#00C897', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="p-8 space-y-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Environmental Impact</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Real-Time Data Transparency for {profile?.displayName || 'Bakery'}</p>
      </div>

      {/* 📊 ROW 1: BOXED STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-between hover:translate-y-[-4px] transition-all">
            <div className="space-y-2">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">{m.label}</p>
              <p className="text-4xl font-black text-gray-900 leading-none">{m.value}</p>
            </div>
            <div className={`${m.bg} p-4 rounded-2xl`}><m.icon className={`w-8 h-8 ${m.color}`} /></div>
          </div>
        ))}
      </div>

      {/* 📉 ROW 2: VISUAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* IMPACT TRAJECTORY (Smooth Area Chart) */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3"><TrendingUp className="text-[#00C897]" /> Impact Trajectory</h3>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Growth Trend</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.slice().reverse()}>
                <defs>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C897" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00C897" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" hide />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                />
                <Area type="monotone" dataKey="amountClaimed" stroke="#00C897" strokeWidth={5} fillOpacity={1} fill="url(#colorImpact)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY SPLIT (Professional Pie Chart) */}
        <div className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-gray-900 w-full mb-8 flex items-center gap-3">
            <PieIcon className="text-blue-500" /> Category Split
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryStats} innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value">
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full mt-10">
            {categoryStats.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📜 ROW 3: VERIFIED HISTORY */}
      <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3"><Calendar className="text-green-600" /> Verified Impact History</h3>
        <div className="grid gap-4">
          {history.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold italic">No donations verified yet.</p>
            </div>
          ) : (
            history.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-7 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all group">
                <div className="flex items-center gap-6">
                  <div className="bg-green-50 p-5 rounded-2xl group-hover:bg-green-100 transition-colors"><Package className="text-green-600 w-6 h-6" /></div>
                  <div>
                    <p className="font-black text-gray-900 text-lg leading-tight">Shared with {t.claimerName}</p>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{t.category} • {new Date(t.timestamp?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-black text-green-600 text-2xl">+{t.amountClaimed}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Portions Saved</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}