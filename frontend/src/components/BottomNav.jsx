import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home',      path: '/home' },
  { icon: '📋', label: 'Dashboard', path: '/dashboard' },
  null, // FAB
  { icon: '💬', label: 'Ask AI',    path: '/chat' },
  { icon: '👤', label: 'Profile',   path: '/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const isDark = state.sleepZoneActive

  const base     = isDark ? 'bg-[#0D1117]/95 border-white/10' : 'bg-cream/95 border-mist/40'
  const active   = isDark ? 'text-sage-light' : 'text-sage-dark'
  const inactive = isDark ? 'text-white/35'   : 'text-mist'

  return (
    <div className={`flex-shrink-0 flex items-center border-t backdrop-blur-xl ${base} pb-7 pt-2 z-50`}>
      {NAV_ITEMS.map((item) => {
        if (!item) {
          return (
            <button key="fab" onClick={() => navigate('/log')} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-sage-dark rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-[0_6px_20px_rgba(78,122,77,0.45)] active:scale-95 transition-transform -mt-5">+</div>
              <span className={`text-[10px] font-semibold ${isDark ? 'text-sage-light' : 'text-sage-dark'}`}>Log</span>
            </button>
          )
        }
        const isActive = location.pathname === item.path
        return (
          <button key={item.path} onClick={() => navigate(item.path)} className="flex-1 flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <span className="text-[20px]">{item.icon}</span>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? active : inactive}`}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
