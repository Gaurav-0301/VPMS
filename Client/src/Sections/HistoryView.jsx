import React from 'react';
import VisitorCard from '../Components/VisitorCard';
import { Clock } from 'lucide-react';

const HistoryView = ({ visitors }) => (
  <div className="flex flex-col w-full gap-4">
    {visitors.length > 0 ? (
      // We pass isHistory={true} so buttons are hidden and status is shown
      visitors.map(v => (
        <VisitorCard 
          key={v._id} 
          visitor={v} 
          isHistory={true} 
        />
      ))
    ) : (
      <div className="w-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <Clock className="text-slate-300" size={32} />
        </div>
        <p className="text-slate-400 font-black text-lg">No history found</p>
        <p className="text-slate-400 font-medium">Your past visitor logs will appear here.</p>
      </div>
    )}
  </div>
);

export default HistoryView;