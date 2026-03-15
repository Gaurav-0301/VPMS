import React from 'react';
import { Clock, History } from 'lucide-react';

const TabSwitcher = ({ activeTab, setActiveTab, pendingCount }) => (
  <div className="flex gap-3 bg-white p-2 rounded-[2rem] w-fit border border-slate-100 shadow-sm">
    <button 
      onClick={() => setActiveTab('pending')}
      className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] font-bold transition-all ${
        activeTab === 'pending' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'
      }`}
    >
      <Clock size={18} /> Pending 
      {pendingCount > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">{pendingCount}</span>}
    </button>
    <button 
      onClick={() => setActiveTab('history')}
      className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] font-bold transition-all ${
        activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'
      }`}
    >
      <History size={18} /> History
    </button>
  </div>
);

export default TabSwitcher;