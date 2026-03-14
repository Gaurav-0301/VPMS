import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
Link
const Card = ({ title, desc, btn,link}) => {
  const navigate=useNavigate();
  const handleclick=()=>{
    navigate({link})
  }
  return (
    <div className="relative group overflow-hidden rounded-2xl border bg-white border-black p-8 transition-all duration-300 hover:shadow-2xl hover:bg-white/15">
     
     
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        {/* Title with Gradient Text */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {title}
        </h2>

        {/* Description with better readability */}
        <p className="text-slate-600  leading-relaxed max-w-[240px]">
          {desc}
        </p>

        {/* Call to Action Button */}
        <div className="pt-4">
          <Link className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-500/25 active:scale-95"
          to={link}>
            {btn}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card
