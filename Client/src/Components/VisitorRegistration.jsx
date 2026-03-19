import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Phone, Mail, FileText, Users, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
const API = import.meta.env.VITE_API_URL;
const VisitorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    number: '',
    host: '',   // Host Name (String)
    hostId: '', // Host ID (MongoDB ObjectId) - THIS FIXES THE ERROR
    email: '',
    url: null 
  });

  const [availableHosts, setAvailableHosts] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch all staff and filter for Hosts
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await axios.get(`https://gatekeeper-05sf.onrender.com/staffdata`);
        if (response.data.success) {
          const hostsOnly = response.data.data.filter(staff => staff.role === 'Host');
          setAvailableHosts(hostsOnly);
        }
      } catch (error) {
        console.error("Failed to load hosts:", error);
      }
    };
    fetchHosts();
  }, []);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast("Please allow camera access.");
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
      setFormData({ ...formData, url: imageData });
      
      const stream = video.srcObject;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleVisit = async (e) => {
    e.preventDefault();
    // Validation: Now checking for hostId specifically
    if (!formData.name || !formData.number || !formData.url || !formData.hostId) {
    toast.error("Please fill all required fields, select a host, and capture a photo.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(` ${API}/register`, formData);
      if (response.data.success) {
        toast.success("Visit booked! Ref ID: " + response.data.data.refId);
        // Reset form including hostId
        setFormData({ name: '', purpose: '', number: '', host: '', hostId: '', email: '', url: null });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5 max-w-4xl mx-auto p-6 text-black bg-white rounded-3xl shadow-sm border border-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Visitor Registration</h2>
        <X className="text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>

      <form onSubmit={handleVisit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          {/* UPDATED DYNAMIC HOST DROPDOWN */}
          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Users size={18}/> Select Host
             </label>
             <select 
               required
               value={formData.hostId} 
               onChange={(e) => {
                 const selectedHost = availableHosts.find(h => h._id === e.target.value);
                 setFormData({
                   ...formData, 
                   hostId: e.target.value, 
                   host: selectedHost ? selectedHost.name : '' 
                 });
               }}
               className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
             >
                <option value="">Select an employee</option>
                {availableHosts.map((host) => (
                  <option key={host._id} value={host._id}>
                    {host.name} ({host.dept})
                  </option>
                ))}
             </select>
          </div>

          <InputField 
            icon={<Mail size={18}/>} 
            label="Email (Mandatory)" 
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