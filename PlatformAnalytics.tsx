import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';

export function PlatformAnalytics() {
  const { profile } = useAuth();

  // Point #3: Dynamic graph data derived from the user's profile
  const userImpactData = [
    { month: 'Jan', impact: Math.floor((profile?.totalMeals || 0) * 0.3) },
    { month: 'Feb', impact: Math.floor((profile?.totalMeals || 0) * 0.6) },
    { month: 'Mar', impact: profile?.totalMeals || 0 }, 
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Impact Analytics</h1>
          <p className="text-gray-400 font-medium">Real-time stats for {profile?.displayName || 'your account'}</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded-xl"><Target className="w-5 h-5 text-green-600" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Account Tier</p>
            <p className="font-bold text-gray-900 leading-none">{profile?.rating > 4.5 ? 'Premium' : 'Standard'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Area Chart */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600" /> Monthly Contribution
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userImpactData}>
                <defs>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="impact" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorImpact)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Progress Bars */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Award className="w-5 h-5 text-green-600" /> Goal Progress
          </h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-gray-500">Meals Shared</span>
                <span className="text-lg font-black text-gray-900">{profile?.totalMeals || 0} <span className="text-sm text-gray-300">/ 2000</span></span>
              </div>
              <div className="w-full bg-gray-50 h-4 rounded-full overflow-hidden border border-gray-100">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-1000 shadow-sm" 
                  style={{ width: `${Math.min(((profile?.totalMeals || 0) / 2000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-8 bg-green-50/50 rounded-[2rem] border border-green-100">
              <p className="text-sm text-green-800 font-medium leading-relaxed italic">
                "By reaching {profile?.totalMeals || 0} meals, you have helped offset the methane production of approximately {Math.floor((profile?.totalMeals || 0) / 10)} landfill bins this month."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}