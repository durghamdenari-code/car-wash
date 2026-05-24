import { Routes, Route, Navigate } from 'react-router'
import DashboardLayout from './components/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Bookings from './pages/Bookings'
import Workers from './pages/Workers'
import Services from './pages/Services'
import Reviews from './pages/Reviews'
import Loyalty from './pages/Loyalty'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import Whatsapp from './pages/Whatsapp'

function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/whatsapp" element={<Whatsapp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<DashboardRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
