import React, { useEffect, useState } from 'react';
import TabSwitcher from '../Components/TabSwitcher';
import PendingView from '../Sections/PendingView';
import HistoryView from '../Sections/HistoryView';
import axios from 'axios';

const HostPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  // 1. Fetch Data on Mount (Empty dependency array to prevent infinite loop)
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get("http://localhost:2724/visitordata");
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
     
      const response = await axios.put(`http://localhost:2724/statusupdate/${id}`, { 
        status: newStatus 
      });

      if (response.data.success) {
        // Update local state so UI reflects change immediately without refresh
        setVisitors(prev => 
          prev.map(v => v._id === id ? { ...v, status: newStatus } : v)
        );
        
        if (newStatus === "Approved") {
          alert("Meeting approved! Mail sent to visitor.");
        }
      }
    } catch (error) {
      console.error("handleStatus error:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Host Dashboard</h1>
        <p className="text-slate-500 font-medium">Manage your visitor approvals and check-in history.</p>
      </header>

      <TabSwitcher 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        // Showing only the count for the logged-in context
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