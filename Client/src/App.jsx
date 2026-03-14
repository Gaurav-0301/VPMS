import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Book  from './Sections/Book'
import Status from './Pages/Status'
import User from './Dashboards/User'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/book" element={<Book />} />
         <Route path="/status" element={<Status/>} />
      </Routes>
    </>
  )
}

export default App