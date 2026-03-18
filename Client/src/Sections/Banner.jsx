import React from 'react';
import Card from '../Components/Card';



const Banner = () => {
  
  return (
    // Removed justify-center, added pt-12 to control exact top spacing
    <div className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-12 md:pt-20 overflow-hidden bg-slate-50">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Hero Header Section - Now tightly aligned to top */}
        <div className="text-center mb-12 space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block px-3 py-1 mb-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[12px] font-bold tracking-widest uppercase">
            Smarter Workplace Management
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Gatekeeper</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Digital visitor management for a smarter, safer workplace.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-4xl">
          
          {/* Left Card: Registration */}
          <div className="group relative transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute  rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <Card 
              btn={"Book Pass"} 
              title={"New Visitor"} 
              desc={"Register your visit and request instant approval from the host."} 
              link={"/book"} 
              className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-8"
            />
          </div>

          {/* Right Card: Status */}
          <div className="group relative transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute  rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <Card 
              btn={"Check Status"} 
              title={"Track Request"} 
              desc={"View your active digital pass or monitor your approval status."} 
              link={"/status"} 
              className="relative h-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-8"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Banner;
