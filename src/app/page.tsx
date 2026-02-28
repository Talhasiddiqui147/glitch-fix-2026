"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Search, Brain, BookOpen, Layers, Zap, ArrowRight, User, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const WikiAgentLanding = () => {
  // 1. State Management
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(1);
  const [steps, setSteps] = useState<string[]>([]);

  // 2. Search Logic
  const askQuestion = async (override?: string) => {
    const query = (override || question).trim();
    if (!query) return;

    setLoading(true);
    setAnswer('');
    setSteps(["🔍 Analyzing intent...", "🌐 Fetching Wiki Data...", "🤖 Synthesizing..."]);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();

      setAnswer(data.answer);
      setSources(data.sources || []);
      setImage(data.image || null);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') askQuestion();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold">W</div>
            <span className="font-bold text-xl tracking-tight">WikiAgent</span>
          </div>
          <button
  onClick={() => router.push('/history')}
  className="text-sm font-semibold bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg"
>
  History
</button>
          <Link href="/about">
  <button className="...">About us</button>
</Link>

<Link href="/source">
  <button className="...">View Source</button>
</Link>

<Link href="https://github.com/yourrepo" target="_blank">
  <button className="...">GitHub link</button>
</Link>
          
        </div>
      </nav>

      {/* Hero & Search Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight mb-6">
              Intelligence <span className="text-blue-600 italic font-serif font-normal">figured out for you</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect the world's knowledge with agentic precision. Ask anything, and let the agent synthesize the facts.
            </p>
          </div>

          {/* THE SEARCH BOX (THE CORE FIX) */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-2 group focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <Search className="ml-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="What would you like to research?"
              className="flex-1 px-2 py-4 outline-none text-lg font-medium"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={() => askQuestion()}
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Search"}
            </button>
          </div>
        </div>
      </section>

      {/* Results Display */}
      <section className="py-12 bg-white min-h-[400px]">
        <div className="max-w-5xl mx-auto px-6">
          {loading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Agent Execution Trace</p>
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-blue-500/70 mb-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {answer && !loading && (
            <div className="grid md:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-bold mb-6 border-b pb-4">{question}</h3>
                <p className="text-lg leading-relaxed text-gray-700 font-serif text-justify whitespace-pre-wrap">
                  {answer}
                </p>
                {sources.length > 0 && (
                  <div className="mt-8">
                    <a href={sources[0]} target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-2 bg-blue-50 w-fit px-4 py-2 rounded-lg">
                      Source Reference <ArrowRight size={16} />
                    </a>
                  </div>
                )}
              </div>
              <div className="relative">
                {image && (
                  <img src={image} alt="Research" className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white rotate-1" />
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WikiAgentLanding;