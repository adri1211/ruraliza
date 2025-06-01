import React from 'react';
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatSubscriptionButton from '../components/ChatSubscriptionButton'

const RootLayout = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <ChatSubscriptionButton />
      </div>
    </AuthProvider>
  )
}

export default RootLayout