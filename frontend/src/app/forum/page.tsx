"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, MessageSquare, ThumbsUp, Send } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  location: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Samuel M.",
      location: "Central Province",
      content: "Has anyone tried the new organic fertilizer for maize? Seeing great results so far!",
      likes: 24,
      comments: 12,
      time: "2 hours ago"
    },
    {
      id: 2,
      author: "Elena R.",
      location: "Western Region",
      content: "Heavy rains expected next week. Make sure your drainage systems are clear to prevent waterlogging.",
      likes: 45,
      comments: 8,
      time: "5 hours ago"
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const post: Post = {
      id: Date.now(),
      author: "You",
      location: "Local Farm",
      content: newPostContent,
      likes: 0,
      comments: 0,
      time: "Just now"
    };

    setPosts([post, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/advisories" className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Advisories
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmers Forum</h1>
            <p className="text-gray-500">Connect and share knowledge with local farmers</p>
          </div>
        </div>

        {/* New Post Input Area */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share an update or ask a question..."
            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all resize-none h-24 text-gray-900"
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={handlePost}
              disabled={!newPostContent.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Post to Forum
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-100 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 border border-blue-100">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{post.author}</h3>
                  <p className="text-xs text-gray-500">{post.location} • {post.time}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all text-sm font-medium active:scale-95"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}