import React, { useEffect, useState } from 'react';
import TabSwitcher from '../Components/TabSwitcher';
import PendingView from '../Sections/PendingView';
import HistoryView from '../Sections/HistoryView';
import axios from 'axios';
import toast from 'react-hot-toast';

const HostPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch only visitors assigned to THIS host
 useEffect(() => {
  const fetchVisitorData = async () => {
    try {
      // 1. Grab the ID we saved during Login
      const currentHostId = localStorage.getItem("userId");

      // 2. Attach it to the request so the backend knows who is asking
      const response = await axios.get(` https://gatekeeper-05sf.onrender.com/visitordata?hostId=${currentHostId}`);
      
      if (response.data.success) {
        setVisitors(response.data.data);
      }
    } catch (error) {
      console.error("Visitor data error in hostpage:", error);
    }
  };
  fetchVisitorData();
}, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await axios.put(`https://gatekeeper-05sf.onrender.com/statusupdate/${id}`, { 
        status: newStatus 
      });

      if (response.data.success) {
        setVisitors(prev => 
          prev.map(v => v._id === id ? { ...v, status: newStatus } : v)
        );
        
        if (newStatus === "Approved") {
        toast.success("Meeting approved! Mail sent to visitor.");
        }
      }
    } catch (error) {
      console.error("handleStatus error:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Host Dashboard</h1>
        {/* Added dynamic greeting using saved name */}
        <p className="text-slate-500 font-medium">
          Welcome back, {localStorage.getItem("userName") || "Host"}. Manage your specific visitor requests.
        </p>
      </header>

      <TabSwitcher 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={visitors.filter(v => v.status === 'Pending').length} 
      />

      <div className="mt-8">
        {activeTab === 'pending' ? (
          <PendingView 
            visitors={visitors.filter(v => v.status === 'Pending')} 
            onAction={handleStatusUpdate} 
          />
        ) : (
          <HistoryView 
            visitors={visitors.filter(v => v.status !== 'Pending')} 
          />
        )}
      </div>
    </div>
  );
};

export default HostPage;