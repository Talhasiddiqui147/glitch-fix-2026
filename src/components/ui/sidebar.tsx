'use client';

import React from 'react';

interface SidebarProps {
  history: string[];
  onHistoryClick: (term: string) => void;
  activeTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onHistoryClick, activeTab }) => {
  return (
    <aside className="w-64 bg-[#0f1115] hidden md:flex flex-col h-screen sticky top-0 border-r border-gray-800 transition-all">
      {/* Brand Identity */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
            W
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">WikiAgent<span className="text-blue-500 text-xs ml-1">v2</span></h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] text-gray-500 uppercase font-bold mb-4 ml-2 tracking-widest">Main Menu</div>
        
        <NavItem icon="🏠" label="Research Hub" active={activeTab === 'hub'} />
        <NavItem icon="📊" label="System Metrics" active={activeTab === 'metrics'} />
        <NavItem icon="🔖" label="Saved Logs" active={activeTab === 'saved'} />
        <NavItem icon="⚙️" label="API Settings" active={activeTab === 'settings'} />

        {/* Dynamic History Section */}
        <div className="pt-8 text-[10px] text-gray-500 uppercase font-bold mb-4 ml-2 tracking-widest">Recent Queries</div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
          {history.length > 0 ? (
            history.map((term, i) => (
              <button
                key={i}
                onClick={() => onHistoryClick(term)}
                className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-blue-400 rounded-lg transition-colors truncate"
              >
                # {term}
              </button>
            ))
          ) : (
            <p className="px-4 text-xs text-gray-600 italic">No history yet...</p>
          )}
        </div>
      </nav>

      {/* Status Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">System Online</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">Glitch-O-Meter 2026 Hackathon Prototype</p>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active }: { icon: string, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all group ${
    active ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }`}>
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Sidebar;