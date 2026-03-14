import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserHome from './Pages/UserHome'

import Book  from './Sections/Book'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/book" element={<Book />} />
      </Routes>
    </>
  )
}

export default App