'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer('');
    setSources([]);
    setImage(null);

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setAnswer(data.answer);
    setSources(data.sources || []);
    setImage(data.image || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-serif p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold border-b pb-2 mb-6">
          WikiAgent
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search Wikipedia..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 border px-3 py-2"
          />
          <button
            onClick={askQuestion}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 border"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {image && (
          <img
            src={image}
            alt="Wikipedia Thumbnail"
            className="float-right ml-6 mb-4 w-64 border"
          />
        )}

        {answer && (
          <div className="text-justify leading-7 text-[17px]">
            {answer}
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-6 text-sm">
            <span className="font-semibold">Source: </span>
            <a
              href={sources[0]}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {sources[0]}
            </a>
          </div>
        )}

      </div>
    </div>
  );
}