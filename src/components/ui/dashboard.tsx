'use client';

import { useState, useEffect, useMemo } from 'react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [vault, setVault] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // 1. Persist Vault Data (Optimization: UX Persistence)
  useEffect(() => {
    const savedVault = localStorage.getItem('crypto-vault');
    if (savedVault) setVault(JSON.parse(savedVault));

    const fetchMarket = async () => {
      try {
        // Using a public API or your local mock server
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Vault Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  useEffect(() => {
    localStorage.setItem('crypto-vault', JSON.stringify(vault));
  }, [vault]);

  // 2. Action Handlers
  const toggleVault = (coin: Coin) => {
    setVault(prev => 
      prev.find(item => item.id === coin.id)
        ? prev.filter(item => item.id !== coin.id)
        : [...prev, coin]
    );
  };

  const filteredCoins = useMemo(() => 
    coins.filter(c => c.name.toLowerCase().includes(search.toLowerCase())), 
  [coins, search]);

  const totalValue = useMemo(() => 
    vault.reduce((acc, curr) => acc + curr.current_price, 0), 
  [vault]);

  return (
    <div className="flex min-h-screen bg-[#05070a] text-slate-200 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0a0d14] border-r border-slate-800 p-6 flex flex-col hidden lg:flex">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-emerald-500 rounded shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          <h1 className="font-bold text-xl tracking-tighter text-white uppercase">CryptoVault</h1>
        </div>
        <nav className="space-y-2 flex-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Terminal</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            📊 Market Assets
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-200 transition-colors">
            🛡️ Security Audit
          </button>
        </nav>
        <div className="mt-auto p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase">System Status</p>
          <p className="text-xs text-emerald-500 font-mono mt-1 animate-pulse">● ENCRYPTED</p>
        </div>
      </aside>

      {/* Main Terminal Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Market Terminal</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time optimization: v2.0.4</p>
          </div>
          <div className="text-right bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault Value</span>
            <p className="text-2xl font-mono text-emerald-400">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </header>

        {/* Search & Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-6">
            <input 
              type="text" 
              placeholder="Search assets by name..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="bg-[#0a0d14] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-6">Asset</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">24h Change</th>
                    <th className="p-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    <tr><td colSpan={4} className="p-20 text-center animate-pulse text-slate-600">Initializing secure stream...</td></tr>
                  ) : filteredCoins.map(coin => (
                    <tr key={coin.id} className="hover:bg-slate-800/20 transition-all group">
                      <td className="p-6 flex items-center gap-3">
                        <span className="font-bold text-white uppercase">{coin.symbol}</span>
                        <span className="text-xs text-slate-500 hidden sm:inline">{coin.name}</span>
                      </td>
                      <td className="p-6 font-mono text-emerald-100">${coin.current_price.toLocaleString()}</td>
                      <td className={`p-6 font-mono text-sm ${coin.price_change_percentage_24h > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => toggleVault(coin)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                            vault.find(v => v.id === coin.id)
                            ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white'
                            : 'bg-emerald-500 text-[#05070a] hover:bg-white transition-colors shadow-lg shadow-emerald-500/10'
                          }`}
                        >
                          {vault.find(v => v.id === coin.id) ? 'Eject' : 'Secure'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secure Vault Sidebar */}
          <aside className="space-y-6">
            <h3 className="text-xl font-bold text-white px-2">Personal Vault</h3>
            <div className="bg-[#0a0d14] rounded-3xl border border-slate-800 p-6 min-h-[400px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />
              {vault.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                  <div className="text-4xl">🔒</div>
                  <p className="text-slate-500 text-sm italic">Vault empty. No assets currently secured in cold storage.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vault.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-900/80 p-4 rounded-2xl border border-slate-800 group hover:border-emerald-500/30 transition-all">
                      <div>
                        <p className="font-bold text-white text-xs uppercase">{item.symbol}</p>
                        <p className="text-[10px] text-slate-500">{item.name}</p>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-emerald-400 text-sm">${item.current_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}