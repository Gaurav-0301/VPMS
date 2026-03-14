import React from 'react'
import Navbar from '../Components/Navbar'
import VisitorRegistration from './../Components/VisitorRegistration';
import Backdrop from './../Components/Backdrop';
import Footer from '../Components/Footer';

const Book = () => {
  return (
    <>
    <Backdrop/>
    <Navbar/>
    <VisitorRegistration/>
    <Footer opt1={"/"} opt2={"/book"} opt3={"/status"}/>
      
    </>
  )
}

export default Book;
