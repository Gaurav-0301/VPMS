import React, { useState, useRef } from 'react';
import { Camera, User, Phone, Mail, FileText, Users, X } from 'lucide-react';
import axios from 'axios';

const VisitorRegistration = () => {
  // 1. State Management - Keys now match Mongoose schema exactly
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    number: '',
    host: '',
    email: '',
    url: null // This stores the Base64 photo string
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 2. Camera Logic
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

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      // FIXED: Save to 'url' key to match the validation and schema
      setFormData({ ...formData, url: imageData });
      
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  // 3. API Submission Logic
  const handleVisit = async (e) => {
    e.preventDefault();
    
    // Debugging: Check what is actually being sent
    console.log("Submitting Data:", formData);

    // Validation
    if (!formData.name || !formData.number || !formData.url || !formData.host) {
      alert("Please fill all required fields and capture a photo.");
      return;
    }

    setLoading(true);

    try {
      // Send formData directly since keys already match schema
      const response = await axios.post(`http://localhost:2724/register`, formData);
      
      if (response.data.success) {
        alert("Visit booked successfully! Your Ref ID is: " + response.data.data.refId);
        // Reset Form
        setFormData({
          name: '',
          purpose: '',
          number: '',
          host: '',
          email: '',
          url: null
        });
      }
    } catch (error) {
      console.error("Registration error", error);
      const errorMsg = error.response?.data?.message || "Registration error. Please check your connection.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5 max-w-4xl mx-auto p-6 text-black bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Visitor Registration</h2>
        <X className="text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">i</div>
        <p className="text-sm text-blue-700 font-medium">
          <span className="font-bold text-blue-800">Process:</span> Your host will receive this request for approval.
        </p>
      </div>

      <form onSubmit={handleVisit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <InputField 
            icon={<User size={18}/>} 
            label="Full Name" 
            placeholder="John Doe" 
            value={formData.name}
            onChange={(val) => setFormData({...formData, name: val})}
          />
          <InputField 
            icon={<FileText size={18}/>} 
            label="Purpose of Visit" 
            placeholder="Meeting, Delivery, etc." 
            value={formData.purpose}
            onChange={(val) => setFormData({...formData, purpose: val})}
          />
          <InputField 
            icon={<Phone size={18}/>} 
            label="Phone Number" 
            placeholder="10-digit number" 
            value={formData.number}
            onChange={(val) => setFormData({...formData, number: val})}
          />
          
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Users size={18}/> Select Host
             </label>
             <select 
               required
               value={formData.host}
               onChange={(e) => setFormData({...formData, host: e.target.value})}
               className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
             >
                <option value="">Select an employee</option>
                <option value="IT_A">IT_A</option>
                <option value="Admin_HQ">Admin HQ</option>
             </select>
          </div>

          <InputField 
            icon={<Mail size={18}/>} 
            label="Email (Optional)" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={(val) => setFormData({...formData, email: val})}
          />
        </div>

        {/* Camera Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Camera size={18}/> Capture Photo
          </label>
          <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300">
            {!formData.url && !isCameraActive && (
              <button type="button" onClick={startCamera} className="bg-[#00A36C] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#008f5d] transition-all font-semibold">
                <Camera size={18}/> Start Camera
              </button>
            )}
            
            {isCameraActive && (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                <button type="button" onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#00A36C] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#008f5d] font-semibold">
                  <Camera size={18}/> Capture Snapshot
                </button>
              </>
            )}

            {formData.url && (
              <div className="relative w-full h-full">
                <img src={formData.url} alt="Captured" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, url: null})} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 shadow-sm hover:bg-white">
                  <X size={18}/>
                </button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full md:col-span-2 mt-4 py-4 ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100`}
        >
          {loading ? "Registering..." : "Book Visit"}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ icon, label, placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      required={label !== "Email (Optional)"}
      type="text" 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} 
      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-400"
    />
  </div>
);

export default VisitorRegistration;