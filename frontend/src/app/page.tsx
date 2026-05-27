'use client';

import { useState } from 'react';
import { Users, Sprout, Camera, Bell, TrendingUp, Cloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const priceData = [
  { name: 'Jan', price: 2500 },
  { name: 'Feb', price: 2800 },
  { name: 'Mar', price: 2600 },
  { name: 'Apr', price: 3100 },
  { name: 'May', price: 3400 },
  { name: 'Jun', price: 3200 },
];

const advisories = [
  { id: 1, title: 'Irrigation Alert', message: 'Reduce irrigation due to expected rainfall', priority: 'high', time: '2h ago' },
  { id: 2, title: 'Fertilizer Application', message: 'Apply 2nd dose of urea for wheat crop', priority: 'normal', time: '4h ago' },
  { id: 3, title: 'Pest Warning', message: 'Armyworm detected nearby. Monitor crops.', priority: 'urgent', time: '1d ago' },
];

const marketPrices = [
  { crop: 'Rice', mandi: 'Pune', price: 3250, change: 2.5 },
  { crop: 'Wheat', mandi: 'Indore', price: 2400, change: -1.2 },
  { crop: 'Cotton', mandi: 'Nagpur', price: 6200, change: 3.8 },
  { crop: 'Maize', mandi: 'Bangalore', price: 2000, change: 1.5 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Farmers', value: '1,250', icon: Users, change: '+12%', color: 'bg-green-50 text-green-600' },
    { label: 'Active Farms', value: '1,850', icon: Sprout, change: '+8%', color: 'bg-blue-50 text-blue-600' },
    { label: 'Pest Reports', value: '320', icon: Camera, change: '-5%', color: 'bg-orange-50 text-orange-600' },
    { label: 'Unread Alerts', value: '12', icon: Bell, change: '', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">EcoFarm Dashboard</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['Dashboard', 'Farms', 'Weather', 'Market', 'Advisories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase() ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">F</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Price Trend - Rice</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="h-8 w-8" />
              <div>
                <p className="text-sm text-sky-100">Current Weather</p>
                <p className="text-3xl font-bold">32°C</p>
              </div>
            </div>
            <p className="text-sky-100 mb-4">Clear Sky</p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sky-400">
              <div className="text-center">
                <p className="text-xs text-sky-200">Humidity</p>
                <p className="font-semibold">65%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-sky-200">Wind</p>
                <p className="font-semibold">12 km/h</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-sky-200">Rain</p>
                <p className="font-semibold">0 mm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advisories & Market Prices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Advisories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Advisories</h2>
              <a href="#" className="text-sm text-green-600 hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {advisories.map((advisory) => (
                <div key={advisory.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    advisory.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                    advisory.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {advisory.priority === 'urgent' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{advisory.title}</p>
                    <p className="text-sm text-gray-500">{advisory.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{advisory.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    advisory.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    advisory.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {advisory.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Prices */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Market Prices</h2>
              <a href="#" className="text-sm text-green-600 hover:underline">View all</a>
            </div>
            <div className="space-y-3">
              {marketPrices.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.crop}</p>
                    <p className="text-sm text-gray-500">{item.mandi} Mandi</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">INR {item.price.toLocaleString()}</p>
                    <p className={`text-sm flex items-center gap-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className="h-3 w-3" />
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Camera, label: 'Detect Pest', color: 'bg-orange-500' },
              { icon: Sprout, label: 'Add Crop', color: 'bg-green-500' },
              { icon: Cloud, label: 'Weather', color: 'bg-sky-500' },
              { icon: TrendingUp, label: 'Prices', color: 'bg-indigo-500' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
