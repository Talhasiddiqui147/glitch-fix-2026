'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer('');
    setSources([]);

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setAnswer(data.answer);
    setSources(data.sources || []);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">WikiAgent 🤖</h1>

      <input
        type="text"
        placeholder="Ask a factual question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full max-w-md border p-2 rounded"
      />

      <button
        onClick={askQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Ask'}
      </button>

      {answer && (
        <div className="max-w-xl mt-6">
          <p className="mb-2">{answer}</p>

          {sources.length > 0 && (
            <div>
              <h2 className="font-semibold">Sources:</h2>
              {sources.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  className="text-blue-600 underline block"
                >
                  {url}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}