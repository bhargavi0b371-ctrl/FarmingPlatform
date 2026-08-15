"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Upload, 
  Play, 
  MoreVertical, 
  MessageSquareText, 
  Users, 
  PlayCircle 
} from 'lucide-react';
import TopNav from '../components/TopNav';
import api from '../../lib/api';

interface Advisory {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

const categories = ['All', 'Crops', 'Pests', 'Irrigation', 'Soil', 'Machinery', 'Organic'];
const fallbackAdvisories: Advisory[] = [
  {
    id: '1',
    title: 'Fertilizer timing update',
    description: 'Apply urea in the next 2 days for best results.',
    priority: 'high',
    created_at: '2026-05-26'
  },
  {
    id: '2',
    title: 'Pest monitoring',
    description: 'Regularly inspect maize fields for fall armyworm.',
    priority: 'medium',
    created_at: '2026-05-25'
  },
  {
    id: '3',
    title: 'Irrigation notice',
    description: 'Hold irrigation due to expected rain tomorrow.',
    priority: 'low',
    created_at: '2026-05-24'
  }
];

const videos = [
  { 
    id: 1, 
    title: "Modern Irrigation Systems: A Complete Guide", 
    duration: "12:30", 
    views: "1.2k", 
    color: "bg-blue-200", 
    category: "Irrigation",
    channel: "AgriTech Solutions",
    time: "2 days ago"
  },
  { 
    id: 2, 
    title: "Identifying Pests in Corn Fields", 
    duration: "05:45", 
    views: "850", 
    color: "bg-yellow-200", 
    category: "Pests",
    channel: "Crop Doctor",
    time: "5 hours ago"
  },
  { 
    id: 3, 
    title: "Organic Composting at Home", 
    duration: "08:15", 
    views: "3.4k", 
    color: "bg-green-200", 
    category: "Organic",
    channel: "Sustainable Farmer",
    time: "1 week ago"
  },
  { 
    id: 4, 
    title: "Maximize Wheat Yield with these Tips", 
    duration: "10:20", 
    views: "2.1k", 
    color: "bg-orange-200", 
    category: "Crops",
    channel: "National Agro Institute",
    time: "3 days ago"
  },
  { 
    id: 5, 
    title: "Soil pH Testing: Why it Matters", 
    duration: "04:50", 
    views: "1.5k", 
    color: "bg-purple-200", 
    category: "Soil",
    channel: "Soil Science Lab",
    time: "1 day ago"
  },
];

export default function AdvisoriesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [advisories, setAdvisories] = useState<Advisory[]>(fallbackAdvisories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);
  useEffect(() => {
    async function loadAdvisories() {
      try {
        const response = await api.advisories.getAll();
        if (response.success && Array.isArray(response.data)) {
          setAdvisories(response.data);
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch advisories');
      } finally {
        setLoading(false);
      }
    }
    loadAdvisories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advisories</h1>
              <p className="text-sm text-gray-600">Actionable recommendations for your crops and fields.</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl relative hidden sm:block mx-auto">
            <input 
              type="text" 
              placeholder="Search farming guides..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
              <Upload className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium hidden md:inline">Upload</span>
            </button>
            <TopNav />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Ask AI & Forum Support Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/ai" className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-md hover:border-green-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                    <MessageSquareText className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Ask AI Assistant</h2>
                    <p className="text-gray-500 text-sm">Get instant agricultural advice</p>
                  </div>
                </div>
              </Link>

              <Link href="/forum" className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Farmers Forum</h2>
                    <p className="text-gray-500 text-sm">Connect with the community</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Latest Advisories Feed */}
            <section className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Latest Advisories</h2>
                  <p className="text-sm text-gray-500">Newest guidance from the advisory engine.</p>
                </div>
                {!loading && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {advisories.length} found
                  </span>
                )}
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Loading advisories...</p>
              ) : error ? (
                <p className="text-sm text-red-500 text-center py-8">{error}</p>
              ) : (
                <div className="space-y-4">
                  {advisories.map((advisory) => (
                    <article key={advisory.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{advisory.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{advisory.created_at ?? 'Recent'}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          advisory.priority === 'high' ? 'bg-orange-100 text-orange-700' : 
                          advisory.priority === 'medium' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {advisory.priority}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-gray-700">
                        {advisory.description}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar Section */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
              <div className="rounded-3xl bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">Trusted Guidance</p>
                <p className="mt-2 text-sm text-slate-600">See recommendations based on weather, soil, and pest conditions.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Next steps</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Check field alerts daily</li>
                  <li>• Review crop-specific notes</li>
                  <li>• Schedule irrigation and spraying</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Video Guides Header */}
        <div className="mb-6 flex items-center gap-3">
          <PlayCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">AgriTube Video Guides</h2>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredVideos.map((video) => (
            <div key={video.id} className="cursor-pointer group">
              <div className={`aspect-video w-full rounded-2xl ${video.color} relative flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 mb-4`}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                <Play className="w-12 h-12 text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-3 right-3 px-1.5 py-0.5 bg-black/80 text-white text-[10px] rounded font-bold">
                  {video.duration}
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-red-600 w-0 group-hover:w-full transition-all duration-500" />
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-sm border-2 border-white shadow-sm">
                  {video.channel[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1.5 space-y-1">
                    <p className="hover:text-gray-900">{video.channel}</p>
                    <div className="flex items-center gap-1">
                      {video.views} views • {video.time}
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full h-fit">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Play className="w-12 h-12 text-gray-200 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
            <p className="text-gray-500">Try a different category</p>
          </div>
        )}
      </main>
    </div>
  );
}