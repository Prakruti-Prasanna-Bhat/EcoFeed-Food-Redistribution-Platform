import React from 'react';
import { TrendingUp, PieChart as PieChartIcon, Filter, Search } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { motion } from 'motion/react';

export function PlatformAnalytics() {
  // Impact trend data
  const impactData = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 520 },
    { month: 'Mar', value: 580 },
    { month: 'Apr', value: 550 },
    { month: 'May', value: 680 },
    { month: 'Jun', value: 850 },
  ];

  // Food waste distribution data
  const wasteData = [
    { name: 'Bakery', value: 35, color: '#16a34a' },
    { name: 'Cooked', value: 28, color: '#3b82f6' },
    { name: 'Veg', value: 22, color: '#f59e0b' },
    { name: 'Meat', value: 15, color: '#ef4444' },
  ];

  // Global impact registry data
  const registryData = [
    {
      id: 1,
      listing: 'Baguette Surplus (20kg)',
      source: 'Artisan Bakas',
      receiver: 'Local Food Bank',
      status: 'Completed',
      co2: '+12.4kg',
    },
    {
      id: 2,
      listing: 'Baguette Surplus (20kg)',
      source: 'Artisan Bakas',
      receiver: 'Local Food Bank',
      status: 'Completed',
      co2: '+12.4kg',
    },
    {
      id: 3,
      listing: 'Baguette Surplus (20kg)',
      source: 'Artisan Bakas',
      receiver: 'Local Food Bank',
      status: 'Completed',
      co2: '+12.4kg',
    },
    {
      id: 4,
      listing: 'Baguette Surplus (20kg)',
      source: 'Artisan Bakas',
      receiver: 'Local Food Bank',
      status: 'Completed',
      co2: '+12.4kg',
    },
    {
      id: 5,
      listing: 'Baguette Surplus (20kg)',
      source: 'Artisan Bakas',
      receiver: 'Local Food Bank',
      status: 'Completed',
      co2: '+12.4kg',
    },
  ];

  return (
    <div className="p-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Community Impact Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Community Impact Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={impactData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#16a34a" 
                strokeWidth={3}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Food Waste Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Food Waste Distribution</h3>
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={280}>
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {wasteData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Impact Registry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Global Impact Registry</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Listing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CO₂ Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registryData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {row.listing}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {row.receiver}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-green-600">
                      {row.co2}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1-5</span> of <span className="font-medium">237</span> entries
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
