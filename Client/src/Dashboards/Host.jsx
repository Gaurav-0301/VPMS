import React from 'react'
import HostPage from '../Pages/HostPage'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const Host = () => {
  return (
  <>
    <Navbar opt1={"Host"}  link1={"/host"} />
      <HostPage/>
      <Footer opt1={"Host"}  link1={"/host"}/>
    </>
  )
}

export default Host
