import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Camera, User, Phone, Mail, BookOpen, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';


const VisitorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    purpose: '',
    hostId: '',
    hostName: '',
    email: ''
  });

  const [photo, setPhoto] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`https://gatekeeper-05sf.onrender.com/staffdata`);
        if (res.data.success) {
          // Ensure we handle cases where 'role' might be lowercase or missing
          setHosts(res.data.data.filter(p => p.role?.toLowerCase() === 'host'));
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      setIsStreaming(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 150);
    } catch (err) {
      toast.error("Camera access denied. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL('image/jpeg', 0.7)); // Compressed to JPEG to save space
      stopCamera();
    }
  };

const handleRegister = async (e) => {
  e.preventDefault();
  
  // Validation checks before sending
  if (!photo) return toast.error("A visitor photo is required!");
  if (!formData.hostId) return toast.error("Please select a host!");

  setLoading(true);
  try {
    // We construct the payload to match your Schema EXACTLY
    const payload = {
      name: formData.name,
      number: formData.number,
      purpose: formData.purpose,
      email: formData.email,
      url: photo,          // Matches your schema's 'url' field
      host: formData.hostName, // Your schema requires 'host' (String)
      hostId: formData.hostId, // Your schema requires 'hostId' (ObjectId)
    };

    const res = await axios.post(`https://gatekeeper-05sf.onrender.com/register`, payload);
    
    if (res.data.success) {
      toast.success("Success! Reference ID: " + res.data.data.refId);
      // Reset form
      setFormData({ name: '', number: '', purpose: '', hostId: '', hostName: '', email: '' });
      setPhoto(null);
    }
  } catch (err) {
    // If it's a 400, this will show the specific validation error
    const errorMsg = err.response?.data?.message || "Registration failed. Check your connection.";
    toast.error(errorMsg);
    console.error("Submission Error:", err.response?.data);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center p-4 text-black">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
        <div className="flex-1 p-10 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Registration</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Full Name" icon={<User size={16}/>} value={formData.name} onChange={v => setFormData({...formData, name: v})} />
              <InputField label="Phone Number" icon={<Phone size={16}/>} value={formData.number} onChange={v => setFormData({...formData, number: v})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Select Host</label>
              <select 
                required className="p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500"
                value={formData.hostId} 
                onChange={e => {
                  const h = hosts.find(x => x._id === e.target.value);
                  setFormData({...formData, hostId: e.target.value, hostName: h?.name || ''});
                }}
              >
                <option value="">-- Choose Employee --</option>
                {hosts.map(h => <option key={h._id} value={h._id}>{h.name} ({h.dept})</option>)}
              </select>
            </div>
            <InputField label="Purpose" icon={<BookOpen size={16}/>} value={formData.purpose} onChange={v => setFormData({...formData, purpose: v})} />
            <InputField label="Email" icon={<Mail size={16}/>} type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "Processing..." : "Complete Registration"}
            </button>
          </form>
        </div>
        <div className="w-full md:w-[40%] bg-gray-900 flex flex-col items-center justify-center p-8">
          <div className="w-full aspect-square max-w-[280px] bg-gray-800 rounded-full border-4 border-gray-700 overflow-hidden flex items-center justify-center relative shadow-inner">
            {photo ? <img src={photo} alt="Visitor" className="w-full h-full object-cover" /> : 
             isStreaming ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" /> : 
             <Camera size={48} className="text-gray-600" />}
          </div>
          <div className="mt-6">
            {!isStreaming && !photo && <button onClick={startCamera} className="bg-white text-black px-6 py-2 rounded-full font-bold">Open Camera</button>}
            {isStreaming && <button onClick={capturePhoto} className="bg-green-500 text-white px-8 py-2 rounded-full font-bold">Capture</button>}
            {photo && <button onClick={() => { setPhoto(null); startCamera(); }} className="text-gray-400 flex items-center gap-2"><RefreshCcw size={14} /> Retake</button>}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">{icon} {label}</label>
    <input type={type} required value={value} onChange={e => onChange(e.target.value)} className="p-3 bg-gray-50 border rounded-xl" placeholder={`Enter ${label}`} />
  </div>
);

export default VisitorRegistration;