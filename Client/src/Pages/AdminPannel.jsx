import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Analysis from '../Sections/Analysis'

const AdminPannel = () => {
  return (
    <>
      <Navbar opt1={"AdminPannel"}  link1={"/admin"} />
      <Analysis/>
      <Footer opt1={"AdminPannel"}  link1={"/admin"} />
    </>
  )
}

export default AdminPannel
