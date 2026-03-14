import React from 'react';
import { Search, Clock, User, QrCode, X } from 'lucide-react';

const StatusPage = ({ statusData, onSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="min-h-screen text-black bg-slate-50 flex flex-col items-center pt-8 px-6">
      
      {/* Search Section */}
      <div className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Check Pass Status</h2>
          <X className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Enter your registered phone number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg font-medium"
            />
          </div>
          <button 
            onClick={onSearch}
            className="bg-[#1a1a1a] text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all font-semibold shadow-lg shadow-slate-200"
          >
            <Search size={20} /> Search
          </button>
        </div>
      </div>

      {/* Results Section - Only renders if data exists */}
      {statusData && (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Message */}
          {statusData.status === 'Pending' && (
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-t-3xl border-b-0 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
              <p className="text-sm text-orange-800 font-medium">
                Waiting for <span className="font-bold">{statusData.hostName}</span> to approve your request...
              </p>
            </div>
          )}

          {/* Status Main Card */}
          <div className={`bg-white ${statusData.status === 'Pending' ? 'rounded-b-3xl' : 'rounded-3xl'} border border-slate-100 shadow-xl overflow-hidden`}>
            
            {/* Status Bar */}
            <div className="bg-blue-50/50 px-8 py-5 border-b border-blue-50 flex justify-between items-center">
              <div className="flex items-center gap-3 text-blue-600">
                <Clock size={22} />
                <span className="text-xl font-bold tracking-tight">Status: {statusData.status}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Ref: {statusData.refId}</span>
            </div>

            {/* Content Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Visitor Details */}
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {statusData.photo ? (
                    <img src={statusData.photo} alt="Visitor" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{statusData.visitorName}</h3>
                  <p className="text-slate-500 text-sm font-medium">{statusData.purpose}</p>
                  
                  <div className="pt-4 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Host Information</p>
                    <p className="text-slate-800 font-semibold">{statusData.hostName}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code/Placeholder Section */}
              <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
                {statusData.status === 'Approved' ? (
                  <>
                    <QrCode size={80} className="text-slate-800" />
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Pass Active</p>
                  </>
                ) : (
                  <>
                    <QrCode size={64} className="text-slate-300 grayscale opacity-40" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter px-4">
                      Pass will be available once approved
                    </p>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;