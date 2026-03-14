import React, { useState } from 'react'
import Backdrop from '../Components/Backdrop'
import Navbar from '../Components/Navbar'
import StatusPage from '../Components/StatusPage'
import Footer from '../Components/Footer'
import axios from 'axios'

const Status = () => {
  const[searchQuery,setSearchQuery]=useState("");
  const[statusData,setStatusData]=useState(null);

  const handleSearch=async()=>{
    try {
      console.log(searchQuery)
     const response= await axios.get(`http://localhost:2724/status/${searchQuery}`);
     const result= await response.data;
          console.log(result)
     if(result.success){
      console.log(result.data)
      setStatusData(result.data);
     }else{
      alert(result.data);
      setStatusData(null);
     }
    } catch (error) {
     console.log("Error fetching status",error)
    }
  }
  return (
    <div>
      <Backdrop/>
      <Navbar/>
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
