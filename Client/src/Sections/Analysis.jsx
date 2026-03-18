import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Download, Trash2, Search, ArrowLeft, UserCheck, UserPlus, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import StaffForm from '../Components/StaffForm';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analysis = () => {
  const [currentView, setCurrentView] = useState('visitors'); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [logsDownloaded, setLogsDownloaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [visitorCount, setVisitorCount] = useState(0);
  const [staffCount, setStaffCount] = useState({ admin: 0, host: 0, security: 0 });
  const [visitors, setVisitors] = useState([]);
  const [staffData, setStaffData] = useState([]);

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const [vCount, sCount, vData, sData] = await Promise.all([
        axios.get("http://localhost:2724/numberofvisitor"),
        axios.get("http://localhost:2724/numberofstaff"),
        axios.get("http://localhost:2724/visitordata"), 
        axios.get("http://localhost:2724/staffdata")
      ]);

      if (vCount.data.success) setVisitorCount(vCount.data.data);
      if (sCount.data.success) setStaffCount(sCount.data.counts);
      if (vData.data.success) setVisitors(vData.data.data);
      if (sData.data.success) setStaffData(sData.data.data);
    } catch (error) {
      console.error("Dashboard Stats Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions ---
  const downloadLogs = () => {
    const dataToExport = currentView === 'visitors' ? visitors : staffData;

    if (!dataToExport || dataToExport.length === 0) {
      toast(`No ${currentView} records available to export.`);
      return;
    }

    try {
      // WHITELIST STRATEGY: Manually select ONLY text fields.
      // This completely avoids the 32767 character limit error caused by images.
      const cleanData = dataToExport.map((item) => {
        if (currentView === 'visitors') {
          return {
            "Visitor Name": item.name || 'N/A',
            "Contact": item.number || 'N/A',
            "Host": item.host || 'N/A',
            "Status": item.status || 'Pending',
            "Date": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
            "Time": item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'N/A'
          };
        } else {
          return {
            "Staff Name": item.name || 'N/A',
            "Email": item.email || 'N/A',
            "Department": item.dept || 'N/A',
            "Role": item.role || 'N/A'
          };
        }
      });

      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      
      // Auto-set column widths for a clean look
      worksheet['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, currentView.toUpperCase());
      
      const fileName = `Gatekeeper_${currentView}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      setLogsDownloaded(true);
      toast("Excel generated successfully! All image data was excluded to prevent errors.");
    } catch (error) {
      console.error("Export Logic Error:", error);
      toast("Critical Export Error. See console for details.");
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Remove access for this staff member?")) return;
    try {
      const res = await axios.delete(`http://localhost:2724/deletestaff/${id}`);
      if (res.data.success) {
        setStaffData(prev => prev.filter(s => s._id !== id));
        fetchData();
        toast(res.data.message);
      }
    } catch (error) { console.error("Delete Staff Error", error); }
  };

  const deletevisitor = async () => {
    if (!window.confirm("Permanently delete ALL visitor logs?")) return;
    try {
      const res = await axios.delete(`http://localhost:2724/deletevisitors`);
      if (res.data.success) {
        setVisitors([]);
        setVisitorCount(0);
        toast(res.data.message);
      }
    } catch (error) { console.error("Delete Visitor Error", error); }
  };

  // --- Filtering ---
  const filteredStaff = staffData.filter(s => {
    const matchesRole = selectedRole ? s.role === selectedRole : true;
    const matchesSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredVisitors = visitors.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.host?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900 font-sans">
      
      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative p-10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black mb-2">Add New Staff</h2>
            <p className="text-slate-500 mb-6">Create system access for team members.</p>
            <StaffForm onClose={() => setIsModalOpen(false)} onSuccess={(ns) => { setStaffData([...staffData, ns]); fetchData(); setIsModalOpen(false); }} />
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Adminstration System</h1>
          <p className="text-slate-500 font-medium">Real-time visitor monitoring and staff management.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
            <UserPlus size={18} /> Add Staff
          </button>
          <button onClick={downloadLogs} className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export Excel
          </button>
          <button 
            disabled={!logsDownloaded}
            onClick={deletevisitor}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${logsDownloaded ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <Trash2 size={18} /> Clear Records
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <RoleCard title="Total Visitors" count={visitorCount} icon={<Users size={28} />} color="bg-blue-600" isActive={currentView === 'visitors'} onClick={() => { setCurrentView('visitors'); setSelectedRole(null); }} />
        <RoleCard title="Admins" count={staffCount.admin} icon={<ShieldCheck size={28} />} color="bg-indigo-600" isActive={selectedRole === 'Admin'} onClick={() => { setSelectedRole('Admin'); setCurrentView('staff'); }} />
        <RoleCard title="Hosts" count={staffCount.host} icon={<UserCheck size={28} />} color="bg-violet-500" isActive={selectedRole === 'Host'} onClick={() => { setSelectedRole('Host'); setCurrentView('staff'); }} />
        <RoleCard title="Security" count={staffCount.security} icon={<ShieldCheck size={28} />} color="bg-teal-500" isActive={selectedRole === 'Security'} onClick={() => { setSelectedRole('Security'); setCurrentView('staff'); }} />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {currentView === 'staff' && (
              <button onClick={() => {setCurrentView('visitors'); setSelectedRole(null);}} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{currentView} List</h2>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${currentView}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                {currentView === 'visitors' ? (
                  <>
                    <th className="px-8 py-5">Visitor</th>
                    <th className="px-8 py-5">Host</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5">Time</th>
                  </>
                ) : (
                  <>
                    <th className="px-8 py-5">Staff Member</th>
                    <th className="px-8 py-5">Dept</th>
                    <th className="px-8 py-5 text-center">Role</th>
                    <th className="px-8 py-5">Manage</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(currentView === 'visitors' ? filteredVisitors : filteredStaff).map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white ${currentView === 'visitors' ? 'bg-blue-500' : 'bg-slate-800'}`}>
                        {item.name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-400">{currentView === 'visitors' ? item.number : item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-slate-600">
                    {currentView === 'visitors' ? `@${item.host}` : item.dept}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      item.status === 'Approved' || item.role === 'Admin' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {currentView === 'visitors' ? item.status : item.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {currentView === 'visitors' ? (
                      <span className="text-slate-500 font-bold text-sm">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                      </span>
                    ) : (
                      <button onClick={() => deleteStaff(item._id)} className="text-rose-500 font-bold text-xs hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RoleCard = ({ title, count, color, onClick, isActive, icon }) => (
  <div onClick={onClick} className={`bg-white p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${isActive ? 'border-blue-500 shadow-xl shadow-blue-50 scale-[1.03]' : 'border-transparent shadow-sm hover:border-slate-200'}`}>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800">{count}</h3>
    </div>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
      {icon}
    </div>
  </div>
);

export default Analysis;