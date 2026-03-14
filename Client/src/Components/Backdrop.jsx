import React from 'react'

const Backdrop = () => {
  return (
   <>
    {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"></div>
   </>
  )
}

export default Backdrop
