import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Phone, Mail, FileText, Users, X } from 'lucide-react';
import Navbar from './Navbar';

const VisitorRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    purpose: '',
    phone: '',
    host: '',
    email: '',
    photo: null
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 1. Initialize Camera Stream
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow camera access to take a photo.");
      setIsCameraActive(false);
    }
  };

  // 2. Capture Snapshot from Video
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      setFormData({ ...formData, photo: imageData });
      
      // Stop the camera stream to save resources
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  return (
    
    <div className="my-5 max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Visitor Registration</h2>
        <X className="text-slate-400 cursor-pointer" />
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">L</div>
        <p className="text-sm text-blue-700">
          <span className="font-bold">What happens next?</span> Your selected host will receive your request and can approve or reject it from their dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <InputField icon={<User size={18}/>} label="Full Name" placeholder="John Doe" />
          <InputField icon={<FileText size={18}/>} label="Purpose of Visit" placeholder="Meeting, Delivery, etc." />
          <InputField icon={<Phone size={18}/>} label="Phone Number" placeholder="+1 234 567 890" />
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Users size={18}/> Select Host
             </label>
             <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Select an employee</option>
             </select>
          </div>
          <InputField icon={<Mail size={18}/>} label="Email (Optional)" placeholder="john@example.com" />
        </div>

        {/* Camera Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Camera size={18}/> Capture Photo
          </label>
          <div className="relative aspect-video bg-slate-400 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300">
            {!formData.photo && !isCameraActive && (
              <button onClick={startCamera} className="bg-[#00A36C] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#008f5d] transition-all">
                <Camera size={18}/> Start Camera
              </button>
            )}
            
            {isCameraActive && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#00A36C] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#008f5d]">
                  <Camera size={18}/> Capture
                </button>
              </>
            )}

            {formData.photo && (
              <div className="relative w-full h-full">
                <img src={formData.photo} alt="Captured" className="w-full h-full object-cover" />
                <button onClick={() => setFormData({...formData, photo: null})} className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500">
                  <X size={18}/>
                </button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
      
      <button className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
        Book Visit
      </button>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ icon, label, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      type="text" 
      placeholder={placeholder} 
      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

export default VisitorRegistration;