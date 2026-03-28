import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import { Camera, User, Phone, Mail, BookOpen, Users, RefreshCcw } from 'lucide-react';

const VisitorRegistration = () => {
  // 1. State Management: Storing form data in one simple object
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

  // 2. Refs: Accessing the HTML video and canvas elements directly
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 3. Fetch Staff: Get the list of hosts from your backend
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`https://gatekeeper-05sf.onrender.com/staffdata`);
        if (res.data.success) {
          // Filtering to only show people who can host visitors
          setHosts(res.data.data.filter(p => p.role === 'Host'));
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchStaff();
    return () => stopCamera(); // Cleanup on close
  }, []);

  // 4. Camera Logic: Start the webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, // Front camera
        audio: false 
      });
      setIsStreaming(true);
      // Wait a split second for React to show the <video> tag
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 150);
    } catch (err) {
      alert("Please allow camera access in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  // 5. Capture Logic: Take the photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Mirroring the image so it looks natural
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      setPhoto(canvas.toDataURL('image/png'));
      stopCamera();
    }
  };

  // 6. Submit Logic: Send everything to the backend
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!photo) return alert("A visitor photo is required!");

    setLoading(true);
    try {
      const res = await axios.post(`https://gatekeeper-05sf.onrender.com/register`, {
        ...formData,
        url: photo
      });
      if (res.data.success) {
        alert("Success! Reference ID: " + res.data.data.refId);
        // Reset form for next user
        setFormData({ name: '', number: '', purpose: '', hostId: '', hostName: '', email: '' });
        setPhoto(null);
      }
    } catch (err) {
      alert("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden h-[85vh]">
        
        {/* Left Side: Form */}
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

            <InputField label="Purpose of Visit" icon={<BookOpen size={16}/>} value={formData.purpose} onChange={v => setFormData({...formData, purpose: v})} />
            <InputField label="Email Address" icon={<Mail size={16}/>} type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 mt-4 transition"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </form>
        </div>

        {/* Right Side: Camera */}
        <div className="w-full md:w-[40%] bg-gray-900 flex flex-col items-center justify-center p-8 border-l border-gray-800">
          <div className="w-full aspect-square max-w-[280px] bg-gray-800 rounded-full border-4 border-gray-700 overflow-hidden flex items-center justify-center relative shadow-inner">
            {photo ? (
              <img src={photo} alt="Visitor" className="w-full h-full object-cover" />
            ) : isStreaming ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <Camera size={48} className="text-gray-600" />
            )}
          </div>

          <div className="mt-6">
            {!isStreaming && !photo && (
              <button onClick={startCamera} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Open Camera</button>
            )}
            {isStreaming && (
              <button onClick={capturePhoto} className="bg-green-500 text-white px-8 py-2 rounded-full font-bold text-sm shadow-lg">Capture Selfie</button>
            )}
            {photo && (
              <button onClick={() => { setPhoto(null); startCamera(); }} className="text-gray-400 flex items-center gap-2 text-sm font-medium">
                <RefreshCcw size={14} /> Try Again
              </button>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-widest font-bold">Security Verification</p>
        </div>

      </div>
    </div>
  );
};

// Sub-component for clean code
const InputField = ({ label, icon, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      type={type} required value={value} 
      onChange={e => onChange(e.target.value)} 
      className="p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500 transition" 
      placeholder={`Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default VisitorRegistration;