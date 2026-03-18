import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Route, Routes, Navigate } from 'react-router-dom'

import Book from './Pages/Book'
import Status from './Pages/Status'
import User from './Dashboards/User'
import Admin from './Dashboards/Admin'
import Host from './Dashboards/Host'
import Security from './Dashboards/Security'
import LoginPage from './Pages/LoginPage'

// Import the guard component
import ProtectedRoute from './Components/ProtectedRoutes' 

const App = () => {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<User />} />
        <Route path="/book" element={<Book />} />
        <Route path="/status" element={<Status/>} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboards */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="Admin">
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/host" 
          element={
            <ProtectedRoute allowedRole="Host">
              <Host />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/security" 
          element={
            <ProtectedRoute allowedRole="Security">
              <Security />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: Redirect unknown routes to Login or Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App;