import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { LogIn, LogOut, QrCode, UserCheck, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const QRScannerSection = ({ onMovement }) => {
  const [visitor, setVisitor] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const scannerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        if (!document.getElementById("reader") || !isMounted.current) return;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 250, height: 250 } },
          async (text) => {
            // STOP/PAUSE library before React state updates to prevent DOM racing
            await html5QrCode.pause(true);
            if (!isMounted.current) return;

            setLoading(true);
            try {
              // Standardized endpoint
              const res = await axios.get(` https://vpms-4neo.onrender.com/securitycheck/${text}`);
              if (res.data.success) {
                setVisitor({ ...res.data.visitor, refId: text });
                setIsVerifying(true);
              }
            } catch (err) {
              toast("Invalid Pass");
              if (isMounted.current) html5QrCode.resume();
            } finally {
              if (isMounted.current) setLoading(false);
            }
          }
        );
      } catch (err) {
        console.warn("Scanner initialization skipped.");
      }
    };

    const timeout = setTimeout(startScanner, 500);

    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
      if (scannerRef.current) {
        scannerRef.current.stop()
          .then(() => scannerRef.current.clear())
          .catch(() => {}); 
      }
    };
  }, []);

  const handleMovement = async (type) => {
    try {
      // Execute the movement and wait for backend confirmation
      await onMovement(type, visitor.refId);
      
      setIsVerifying(false);
      setVisitor(null);
      
      setTimeout(() => {
        if (scannerRef.current && isMounted.current) {
          scannerRef.current.resume();
        }
      }, 500);
    } catch (error) {
      // Parent handles the alert, we just stop the UI from resetting
    }
  };

  return (
    <div className="w-full max-w-[380px] font-sans antialiased select-none">
      <div className="bg-[#0f1115] p-10 rounded-[50px] shadow-2xl border border-white/5">
        <div className="flex justify-between items-center mb-8 px-2">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Terminal Active
          </span>
          <QrCode size={18} className="text-slate-800" />
        </div>

        <div id="reader" className="rounded-[32px] overflow-hidden border border-white/5 bg-black min-h-[300px] relative flex flex-col items-center justify-center">
          {loading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-md">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Authorizing</span>
            </div>
          )}
        </div>
      </div>

      {isVerifying && visitor && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[1000] p-6">
          <div className="bg-white p-12 rounded-[60px] text-center w-full max-w-[420px] shadow-2xl border border-white/10 animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck size={36} className="text-blue-600" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{visitor.name}</h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Identity Verified</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleMovement("check-in")} disabled={visitor.isInside}
                className={`py-7 rounded-[32px] flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95
                ${visitor.isInside ? "bg-slate-100 text-slate-300" : "bg-emerald-500 text-white shadow-xl shadow-emerald-200/50 hover:bg-emerald-600"}`}>
                <LogIn size={22} /> IN
              </button>
              
              <button onClick={() => handleMovement("check-out")} disabled={!visitor.isInside}
                className={`py-7 rounded-[32px] flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95
                ${!visitor.isInside ? "bg-slate-100 text-slate-300" : "bg-slate-900 text-white shadow-xl shadow-slate-300/50 hover:bg-black"}`}>
                <LogOut size={22} /> OUT
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; border-radius: 32px !important; }
      `}</style>
    </div>
  );
};

export default QRScannerSection;