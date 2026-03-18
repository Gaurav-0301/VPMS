import React, { useState } from 'react';
import axios from 'axios';
import SecurityStats from './SecurityStats';
import QRScannerSection from '../Sections/QRScannerSection';
import toast from 'react-hot-toast';

const SecurityTerminal = () => {
  const [stats, setStats] = useState({ inside: 0, totalToday: 0, completed: 0 });

  // Handles the final Check-In/Out movement in the database
  const processMovement = async (action, refId) => {
    try {
      // Standardized to port 2724 to match your backend
      const res = await axios.put(`http://localhost:2724/visitor/movement/${refId}`, { action });
      
      if (res.data.success) {
        setStats(prev => {
          const isCheckIn = action === 'check-in';
          return {
            ...prev,
            inside: isCheckIn ? prev.inside + 1 : Math.max(0, prev.inside - 1),
            totalToday: isCheckIn ? prev.totalToday + 1 : prev.totalToday,
            completed: !isCheckIn ? prev.completed + 1 : prev.completed
          };
        });
        return true; // Success signal for the scanner modal
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Movement update failed";
      toast(msg);
      throw new Error(msg); // Stops the scanner from closing the modal on error
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen font-sans">
      <div className="mb-10 lg:flex lg:justify-between lg:items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Security Terminal</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Occupancy System
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <SecurityStats stats={stats} />
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex justify-center items-start">
          <QRScannerSection onMovement={processMovement} />
        </div>
      </div>
    </div>
  );
};

export default SecurityTerminal;