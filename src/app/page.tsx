'use client';

import { useState, KeyboardEvent } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const askQuestion = async (queryOverride?: string) => {
    const activeQuery = queryOverride || question;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);
    setImage(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: activeQuery.trim() }),
      });

      if (!res.ok) throw new Error('WikiAgent failed to reach the vault.');

      const data = await res.json();
      
      setAnswer(data.answer || "No summary found for this query.");
      setSources(data.sources || []);
      setImage(data.image || null);

      // Add to history if successful and not already present
      if (data.answer && !history.includes(activeQuery)) {
        setHistory(prev => [activeQuery, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError("Connection error: Ensure the Genkit server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') askQuestion();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-[#202122] font-serif selection:bg-blue-100">
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-sm border-x border-gray-200 p-8 md:p-12">
        
        {/* Header */}
        <header className="border-b border-gray-300 pb-2 mb-8 flex justify-between items-baseline">
          <h1 className="text-4xl font-normal">WikiAgent</h1>
          <span className="text-xs text-gray-500 italic uppercase tracking-tighter font-sans">Hackathon 2026 Edition</span>
        </header>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What would you like to know?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>
          <button
            onClick={() => askQuestion()}
            disabled={loading}
            className={`px-6 py-2.5 font-sans font-bold border border-gray-400 transition-all ${
              loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#f8f9fa] hover:bg-white hover:border-blue-500 active:bg-blue-50 text-gray-700 shadow-sm'
            }`}
          >
            {loading ? 'Synthesizing...' : 'Search Wiki'}
          </button>
        </div>

        {/* Recent Search History (Optimization) */}
        {history.length > 0 && (
          <div className="mb-10 flex gap-2 items-center overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest mr-2">Recent:</span>
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => { setQuestion(item); askQuestion(item); }}
                className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-600 px-3 py-1 border border-gray-200 rounded-full whitespace-nowrap transition-colors font-sans"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-sm font-sans">
            {error}
          </div>
        )}

        {/* Results */}
        <main className="relative min-h-[300px]">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-full rounded"></div>
              <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {image && (
                <div className="float-right ml-6 mb-4 p-1 border border-gray-300 shadow-sm bg-white max-w-[280px]">
                  <img src={image} alt="Topic" className="w-full h-auto grayscale-[15%] hover:grayscale-0 transition-all" />
                  <p className="text-[10px] text-gray-400 mt-1 text-center font-sans">MediaWiki Image Asset</p>
                </div>
              )}

              {answer && (
                <article className="text-justify leading-relaxed text-[18px] text-[#202122] antialiased">
                  {answer}
                </article>
              )}

              {sources.length > 0 && (
                <footer className="mt-12 pt-4 border-t border-gray-200 text-sm font-sans italic">
                  <span className="font-bold text-gray-600 not-italic">Reference: </span>
                  <a
                    href={sources[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline decoration-blue-300 underline-offset-4"
                  >
                    {sources[0]}
                  </a>
                </footer>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}