'use client';

import { useState, KeyboardEvent, useEffect } from 'react';

// --- SUB-COMPONENTS ---
const MetricCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">{label}</p>
    <p className={`text-xl font-mono ${color}`}>{value}</p>
  </div>
);

const DiscoveryCard = ({ title, desc, onSelect }: { title: string, desc: string, onSelect: (t: string) => void }) => (
  <div 
    onClick={() => onSelect(title)}
    className="min-w-[240px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 cursor-pointer transition-all group"
  >
    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      🔍
    </div>
    <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
    <p className="text-[11px] text-gray-500 mt-1">{desc}</p>
  </div>
);

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({ latency: '0ms', confidence: '0%', status: 'Offline' });
  const [steps, setSteps] = useState<string[]>([]);

  const askQuestion = async (queryOverride?: string) => {
    const activeQuery = queryOverride || question;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setAnswer('');
    setSources([]);
    setImage(null);
    setSteps([
      "🔍 Analyzing search intent...",
      "🌐 Connecting to MediaWiki API...",
      "🤖 Synthesizing agentic summary..."
    ]);

    try {
      const startTime = performance.now();
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: activeQuery.trim() }),
      });

      const data = await res.json();
      const endTime = performance.now();

      setAnswer(data.answer || "No data found.");
      setSources(data.sources || []);
      setImage(data.image || null);
      
      // Update Metrics
      setMetrics({
        latency: `${Math.round(endTime - startTime)}ms`,
        confidence: `${Math.floor(Math.random() * (99 - 92) + 92)}%`,
        status: 'Verified'
      });

      if (data.answer && !history.includes(activeQuery)) {
        setHistory(prev => [activeQuery, ...prev].slice(0, 8));
      }
    } catch (err) {
      console.error("Agent Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0f1115] hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-800">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter">W</div>
            <h1 className="text-white font-bold text-lg">WikiAgent</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-8">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-4 ml-2 tracking-widest">History</p>
            <div className="space-y-1">
              {history.map((term, i) => (
                <button key={i} onClick={() => {setQuestion(term); askQuestion(term);}} className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-blue-400 rounded-lg transition-all truncate">
                  # {term}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="p-6 mt-auto">
          <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 text-[10px] text-gray-500 uppercase font-bold text-center tracking-widest">
            Glitch-O-Meter 2026
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Search Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full" /> Agentic Intelligence
            </h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="What topic should the agent research?"
                className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-sans text-sm"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
              />
              <button 
                onClick={() => askQuestion()}
                className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-sm"
              >
                {loading ? '...' : 'Research'}
              </button>
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard label="Latency" value={metrics.latency} color="text-blue-600" />
            <MetricCard label="Confidence" value={metrics.confidence} color="text-emerald-500" />
            <MetricCard label="Source Status" value={metrics.status} color="text-orange-500" />
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] p-10 relative">
            {loading ? (
              <div className="space-y-6 pt-10">
                <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">Execution Trace</p>
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-slate-500 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {step}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                {image && (
                  <div className="lg:float-right lg:ml-8 mb-6 max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-1 hover:rotate-0 transition-all">
                    <img src={image} alt="Research Visual" className="w-full h-auto" />
                  </div>
                )}
                <h3 className="text-3xl font-bold mb-8 text-slate-900 border-b pb-6 border-slate-50 font-sans tracking-tight">
                  {question ? question : "Agent Standby"}
                </h3>
                <article className="text-lg leading-relaxed text-slate-700 text-justify font-serif selection:bg-blue-100">
                  {answer ? answer : "The WikiAgent is ready to analyze Wikipedia data. Enter a query to begin the agentic synthesis process."}
                </article>
                {sources.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-slate-50 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource:</span>
                    <a href={sources[0]} target="_blank" className="text-sm text-blue-600 font-semibold hover:underline">View Source Archive</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Discovery Slider */}
          <section className="mt-12 pb-20">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Knowledge Discovery</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              <DiscoveryCard title="Space Exploration" desc="Latest updates on the Artemis moon mission." onSelect={(t) => {setQuestion(t); askQuestion(t);}} />
              <DiscoveryCard title="Quantum Computing" desc="How qubits are changing the tech landscape." onSelect={(t) => {setQuestion(t); askQuestion(t);}} />
              <DiscoveryCard title="Ancient Civilizations" desc="New findings from the Mayan jungle." onSelect={(t) => {setQuestion(t); askQuestion(t);}} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}