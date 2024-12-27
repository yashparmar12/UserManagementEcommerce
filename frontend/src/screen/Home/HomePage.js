import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col justify-center items-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-white mb-6">Welcome to Our App</h1>
      <p className="text-xl text-white mb-8">Get started with your amazing journey</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300">
          Login
        </Link>
        <Link to = "/register" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300">
          Register
        </Link>
      </div>
    </div>
  </div>
  )
}

export default HomePage
