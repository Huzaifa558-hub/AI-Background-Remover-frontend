import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import EnhancePage from './pages/EnhancePage'
import ReplaceBgPage from './pages/ReplaceBgPage'
import SmartCropPage from './pages/SmartCropPage'
import BatchPage from './pages/BatchPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/enhance"    element={<EnhancePage />} />
          <Route path="/replace-bg" element={<ReplaceBgPage />} />
          <Route path="/smart-crop" element={<SmartCropPage />} />
          <Route path="/batch"      element={<BatchPage />} />
          <Route path="/history"    element={<HistoryPage />} />
          {/* Catch-all — redirect to home */}
          <Route path="*"           element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
