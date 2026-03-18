import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Login from '../Components/Login'

const LoginPage = () => {
  return (
    <>
     <Navbar opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
      <Login/>
      <Footer opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
    </>
  )
}

export default LoginPage
