import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import PhoneShell from './components/PhoneShell'

import Splash             from './screens/Splash'
import Login              from './screens/Login'
import Onboard1           from './screens/Onboard1'
import Onboard2           from './screens/Onboard2'
import Onboard3           from './screens/Onboard3'
import Home               from './screens/Dashboard'
import CombinedDashboard  from './screens/CombinedDashboard'
import LogActivity        from './screens/LogActivity'
import Alert              from './screens/Alert'
import Chat               from './screens/Chat'
import Profile            from './screens/Profile'
import ActivityDetail     from './screens/ActivityDetail'
import Notifications      from './screens/Notifications'
import PartnerInvite      from './screens/PartnerInvite'

function RequireAuth({ children }) {
  const { state } = useApp()
  if (state.loading) return <LoadingScreen />
  return state.isAuthenticated ? children : <Navigate to="/" replace />
}

function LoadingScreen() {
  return (
    <div className="flex flex-col h-full bg-midnight items-center justify-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-sage to-sage-dark rounded-2xl flex items-center justify-center text-3xl shadow-lg">🌿</div>
      <p className="text-white/50 text-sm">Loading…</p>
    </div>
  )
}

function AppRoutes() {
  const { state } = useApp()

  // If loading, show loading screen everywhere
  if (state.loading) {
    return <PhoneShell><LoadingScreen /></PhoneShell>
  }

  return (
    <PhoneShell>
      <Routes>
        {/* Public */}
        <Route path="/" element={
          state.isAuthenticated ? <Navigate to="/home" replace /> : <Splash />
        } />
        <Route path="/login"           element={<Login />} />
        <Route path="/onboard/1"       element={<Onboard1 />} />
        <Route path="/onboard/2"       element={<Onboard2 />} />
        <Route path="/onboard/3"       element={<Onboard3 />} />

        {/* Protected */}
        <Route path="/home"            element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/dashboard"       element={<RequireAuth><CombinedDashboard /></RequireAuth>} />
        <Route path="/log"             element={<RequireAuth><LogActivity /></RequireAuth>} />
        <Route path="/alert"           element={<RequireAuth><Alert /></RequireAuth>} />
        <Route path="/chat"            element={<RequireAuth><Chat /></RequireAuth>} />
        <Route path="/profile"         element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/activity/:id"    element={<RequireAuth><ActivityDetail /></RequireAuth>} />
        <Route path="/notifications"   element={<RequireAuth><Notifications /></RequireAuth>} />
        <Route path="/partner-invite"  element={<RequireAuth><PartnerInvite /></RequireAuth>} />

        {/* Legacy redirects */}
        <Route path="/activities"      element={<Navigate to="/dashboard" replace />} />
        <Route path="/insights"        element={<Navigate to="/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
