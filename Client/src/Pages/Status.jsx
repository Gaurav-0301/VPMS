import React, { useState } from 'react'
import Backdrop from '../Components/Backdrop'
import Navbar from '../Components/Navbar'
import StatusPage from '../Components/StatusPage'
import Footer from '../Components/Footer'
import axios from 'axios'
import toast from 'react-hot-toast'

const Status = () => {
  const[searchQuery,setSearchQuery]=useState("");
  const[statusData,setStatusData]=useState(null);

  const handleSearch=async()=>{
    try {
      console.log(searchQuery)
     const response= await axios.get(` https://vpms-4neo.onrender.com/status/${searchQuery}`);
     const result= await response.data;
          console.log(result)
     if(result.success){
      console.log(result.data)
      setStatusData(result.data);
     }else{
      toast(result.data);
      setStatusData(null);
     }
    } catch (error) {
     console.log("Error fetching status",error)
    }
  }
  return (
    <div>
      <Backdrop/>
      <Navbar opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
      <StatusPage 
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery} 
    onSearch={handleSearch} 
    statusData={statusData} 
/>
      <Footer opt1={"/"} opt2={"/book"} opt3={"/status"}/>
    </div>
  )
}

export default Status
