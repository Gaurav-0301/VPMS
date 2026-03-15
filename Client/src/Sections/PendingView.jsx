import React from 'react';
import VisitorCard from '../Components/VisitorCard';
import { Coffee } from 'lucide-react';

const PendingView = ({ visitors, onAction }) => (
  // Changed from grid-cols-2/3 to a single column flex container
  <div className="flex flex-col w-full gap-4">
    {visitors.length > 0 ? (
      visitors.map(v => (
        <VisitorCard 
          key={v._id} 
          visitor={v} 
          onAction={onAction} 
          isHistory={false} 
        />
      ))
    ) : (
      <div className="w-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <Coffee className="text-slate-300" size={32} />
        </div>
        <p className="text-slate-400 font-black text-lg">All caught up!</p>
        <p className="text-slate-400 font-medium">No pending requests at the moment.</p>
      </div>
    )}
  </div>
);

export default PendingView;