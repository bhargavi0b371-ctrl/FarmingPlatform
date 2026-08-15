"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, Send, Sparkles, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your agricultural assistant. How can I help you with your crops, pests, or field management today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: "I'm currently processing your query. Please note that I'm in beta mode; for specific chemical or fertilizer advice, always consult with a local agronomist.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto h-[85vh] flex flex-col">
        <Link href="/advisories" className="inline-flex items-center gap-2 text-green-600 font-semibold mb-6 hover:text-green-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Advisories
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden flex flex-col flex-1">
          {/* Header */}
          <div className="p-6 border-b bg-green-50/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-0">
                Agri-AI Assistant
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </h1>
              <p className="text-sm text-gray-500 font-medium m-0">Expert agricultural advice 24/7</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'ai' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {msg.sender === 'ai' ? <Bot className="w-5 h-5 text-green-600" /> : <User className="w-5 h-5 text-blue-600" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${msg.sender === 'ai' ? 'bg-white rounded-tl-none border-gray-100 text-gray-800' : 'bg-green-600 rounded-tr-none border-green-500 text-white'}`}>
                  <p className="text-sm leading-relaxed m-0">{msg.text}</p>
                  <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 border-t bg-white">
            <form className="relative flex items-center" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about fertilizer, pests, weather..." 
                className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white focus:border-green-500 transition-all text-gray-900"
              />
              <button type="submit" className="absolute right-2 p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50" disabled={!inputValue.trim()}>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}