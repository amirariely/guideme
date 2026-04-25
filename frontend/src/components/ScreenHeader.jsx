import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Shared header used on every protected screen
// Always shows sleep zone toggle + notification bell
export default function ScreenHeader({ title, subtitle, showBack = false }) {
  const navigate = useNavigate()
  const { state, toggleSleepZone } = useApp()
  const isDark = state.sleepZoneActive

  const textPri = isDark ? 'text-white'   : 'text-midnight'
  const textSec = isDark ? 'text-white/50': 'text-steel'
  const iconBtn = isDark ? 'bg-white/10'  : 'bg-white border border-mist/40'

  return (
    <div className="flex items-center justify-between px-6 pb-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base active:scale-90 transition-transform ${iconBtn} ${textPri}`}
          >←</button>
        )}
        <div>
          {title && <h1 className={`font-serif text-2xl ${textPri}`}>{title}</h1>}
          {subtitle && <p className={`text-xs ${textSec} mt-0.5`}>{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleSleepZone}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-transform ${iconBtn}`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-transform ${iconBtn}`}
        >
          🔔
        </button>
      </div>
    </div>
  )
}
