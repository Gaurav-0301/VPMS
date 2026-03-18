import React from 'react'
import Navbar from '../Components/Navbar'
import Banner from '../Sections/Banner'
import Footer from '../Components/Footer'

const UserHome = () => {
  return (
    <>
      <Navbar opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
      <Banner/>
      <Footer opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
    </>
  )
}

export default UserHome
