import React from 'react'
import Navbar from '../Components/Navbar'
import VisitorRegistration from './../Components/VisitorRegistration';
import Backdrop from './../Components/Backdrop';
import Footer from '../Components/Footer';

const Book = () => {
  return (
    <>
    <Backdrop/>
    <Navbar opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
    <VisitorRegistration/>
    <Footer opt1={"Home"} opt2={"Book"} opt3={"Status"} link1={"/"} link2={"/book"} link3={"/status"}/>
      
    </>
  )
}

export default Book;
