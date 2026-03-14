import React from 'react'
import Backdrop from '../Components/Backdrop'
import Navbar from '../Components/Navbar'
import StatusPage from '../Components/StatusPage'
import Footer from '../Components/Footer'

const Status = () => {
  return (
    <div>
      <Backdrop/>
      <Navbar/>
      <StatusPage/>
      <Footer opt1={"/"} opt2={"/book"} opt3={"/status"}/>
    </div>
  )
}

export default Status
