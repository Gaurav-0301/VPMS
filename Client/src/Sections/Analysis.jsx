import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Download, Trash2, Search, ArrowLeft, UserCheck, UserPlus, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import StaffForm from '../Components/StaffForm';
import axios from 'axios';

const Analysis = () => {
  const [currentView, setCurrentView] = useState('visitors'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [logsDownloaded, setLogsDownloaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [staffCount, setStaffCount] = useState({
    admin: 0,
    host: 0,
    security: 0
  });

  const [visitors, setVisitors] = useState([]);
  const [staffData, setStaffData] = useState([]);

  const filteredStaff = selectedRole 
    ? staffData.filter(s => s.role === selectedRole)
    : staffData;

  const downloadLogs = () => {
    const dataToExport = currentView === 'visitors' ? visitors : staffData;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentView);
    XLSX.writeFile(workbook, `Gatekeeper_${currentView}_${new Date().toLocaleDateString()}.xlsx`);
    
    setLogsDownloaded(true);
    alert(`${currentView} logs downloaded. "Delete Records" is now enabled.`);
  };

  const handleAddNewStaff = (newStaff) => {
    setStaffData(prev => [...prev, newStaff]);
    setIsModalOpen(false); 
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [visitorRes, staffCountRes, visitorDataRes, staffDataRes] = await Promise.all([
          axios.get("http://localhost:2724/numberofvisitor"),
          axios.get("http://localhost:2724/numberofstaff"),
          axios.get("http://localhost:2724/visitordata"), // Ensure these endpoints exist
          axios.get("http://localhost:2724/staffdata")
        ]);

        if (visitorRes.data.success) setVisitorCount(visitorRes.data.data);
        if (staffCountRes.data.success) setStaffCount(staffCountRes.data.counts);
        if (visitorDataRes.data.success) setVisitors(visitorDataRes.data.data);
        if (staffDataRes.data.success) setStaffData(staffDataRes.data.data);
        
      } catch (error) {
        console.error("Dashboard Stats Fetch Error:", error);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array prevents infinite loops

  return (
    <div className="p-8 bg-slate-50 min-h-screen relative">
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all z-10"
            >
              <X size={20} className="text-slate-600" />
            </button>

            <div className="p-10 text-black">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Staff</h2>
                <p className="text-slate-500 text-sm font-medium">Create credentials for Admins, Hosts, or Security.</p>
              </div>

              <StaffForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={handleAddNewStaff} 
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-slate-500 font-medium mt-1">Manage users, analyze traffic, and export system data.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#059669] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#047857] transition-all shadow-lg shadow-emerald-100"
          >
            <UserPlus size={20} /> Add Staff
          </button>

          <button onClick={downloadLogs} className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={20} /> Export Logs
          </button>
          
          <button 
            disabled={!logsDownloaded}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${logsDownloaded ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <Trash2 size={20} /> Delete Records
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <RoleCard 
          title="Total Visitors" 
          count={visitorCount}
          icon={<Users size={32} />}
          color="bg-blue-600" 
          isActive={currentView === 'visitors'}
          onClick={() => { setCurrentView('visitors'); setSelectedRole(null); }} 
        />
        <RoleCard 
          title="Active Admins" 
          count={staffCount?.admin || 0} 
          icon={<ShieldCheck size={32} />}
          color="bg-indigo-600" 
          isActive={selectedRole === 'Admin'}
          onClick={() => { setSelectedRole('Admin'); setCurrentView('staff'); }} 
        />
        <RoleCard 
          title="Active Hosts" 
          count={staffCount?.host || 0} 
          icon={<UserCheck size={32} />}
          color="bg-violet-500" 
          isActive={selectedRole === 'Host'}
          onClick={() => { setSelectedRole('Host'); setCurrentView('staff'); }} 
        />
        <RoleCard 
          title="Security Team" 
          count={staffCount?.security || 0} 
          icon={<ShieldCheck size={32} />}
          color="bg-emerald-500" 
          isActive={selectedRole === 'Security'}
          onClick={() => { setSelectedRole('Security'); setCurrentView('staff'); }} 
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {currentView === 'staff' && (
              <button onClick={() => {setCurrentView('visitors'); setSelectedRole(null);}} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                <ArrowLeft className="text-black"size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === 'visitors' ? "Today's Visitor Logs" : `${selectedRole} Logs`}
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${currentView}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80 font-medium text-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400">
              <tr>
                {currentView === 'visitors' ? (
                  <>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Visitor Detail</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Host</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Check-In</th>
                  </>
                ) : (
                  <>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Staff Name</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Dept</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-center">Role</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentView === 'visitors' ? (
                visitors.map((v, index) => (
                  <tr key={v._id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">{v.name?.[0]}</div>
                        <div>
                          <p className="font-bold text-slate-800">{v.name}</p>
                          <p className="text-xs font-medium text-slate-400">{v.number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">@{v.host}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        v.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                        v.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-bold">{new Date(v.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))
              ) : (
                filteredStaff.map((s, index) => (
                  <tr key={s._id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${s.role === 'Admin' ? 'bg-indigo-600' : 'bg-slate-400'}`}>{s.name?.[0]}</div>
                        <div>
                          <p className="font-bold text-slate-800">{s.name}</p>
                          <p className="text-xs font-medium text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">{s.dept}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{s.role}</span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-rose-500 font-bold text-xs hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all">Remove Access</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ title, count, color, onClick, isActive, icon }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${
      isActive ? 'border-blue-500 shadow-2xl shadow-blue-50 scale-[1.02]' : 'border-transparent shadow-sm hover:border-slate-200'
    }`}
  >
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-4xl font-black text-slate-800">{count}</h3>
    </div>
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-transform group-hover:rotate-12`}>
      {icon}
    </div>
  </div>
);

export default Analysis;