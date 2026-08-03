import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* Catch-all — redirect to home */}
          <Route path="*"        element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
