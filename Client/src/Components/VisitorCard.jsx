import React from 'react';
import { Check, X, Phone, FileText, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';

const VisitorCard = ({ visitor, onAction, isHistory }) => {
  const isApproved = visitor.status === 'Approved';

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-4 sm:p-6 shadow-sm hover:shadow-md transition-all group mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Section: Photo & Identity */}
        <div className="flex items-center gap-5 flex-1 w-full">
          <div className="relative flex-shrink-0">
            <img 
              src={visitor.url} 
              alt="visitor" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-slate-50" 
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-black text-lg sm:text-xl text-slate-800 tracking-tight">
                {visitor.name}
              </h4>
              {isHistory && (
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {isApproved ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                  {visitor.status}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-widest">
              Ref: {visitor.refId || 'pending'}
            </p>
          </div>
        </div>

        {/* Middle Section: Details (Horizontal on Desktop) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 flex-[1.5] w-full border-y sm:border-y-0 sm:border-x border-slate-50 py-4 sm:py-0 sm:px-8">
          <DetailItem icon={<Phone size={16}/>} label="Contact" text={visitor.number} />
          <DetailItem icon={<FileText size={16}/>} label="Purpose" text={visitor.purpose} />
          {isHistory && (
             <DetailItem icon={<Calendar size={16}/>} label="Date" text={new Date().toLocaleDateString()} />
          )}
        </div>

        {/* Right Section: Actions (Only shown if NOT history) */}
        {!isHistory ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => onAction(visitor._id, 'Approved')}
              className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100"
            >
              <Check size={18} /> Approve
            </button>
            <button 
              onClick={() => onAction(visitor._id, 'Rejected')}
              className="p-3.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="hidden sm:block text-slate-300">
             {/* Spacing to keep layout consistent in history tab */}
             <div className="w-10"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, text }) => (
  <div className="flex flex-col gap-1 min-w-[120px]">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
      {icon} {label}
    </span>
    <span className="text-sm font-semibold text-slate-600 truncate max-w-[150px]">
      {text}
    </span>
  </div>
);

export default VisitorCard;