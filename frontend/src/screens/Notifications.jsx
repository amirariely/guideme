import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: '🍼', title: 'Feeding reminder',       body: "It's been 3 hours since the last feed.",           time: '5m ago',   read: false },
  { id: 2, icon: '😴', title: 'Nap window approaching', body: 'Baby has been awake for 1h 40min — nap window is near.', time: '20m ago', read: false },
  { id: 3, icon: '🧠', title: 'AI detected a cry',      body: 'Interpreted as: Hunger (87% confidence). Tap to view.', time: '1h ago',  read: false, link: '/alert' },
  { id: 4, icon: '💊', title: 'Medication reminder',    body: 'Vitamin D drops scheduled for this morning.',     time: '3h ago',   read: true  },
  { id: 5, icon: '🌿', title: 'Welcome to GuideMe!',    body: "You're all set. GuideMe is now watching over your baby.", time: 'Yesterday', read: true },
]

export default function Notifications() {
  const navigate = useNavigate()
  const { state } = useApp()
  const isDark = state.sleepZoneActive

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleTap = (n) => {
    markOneRead(n.id)
    if (n.link) navigate(n.link)
  }

  const bg       = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri  = isDark ? 'text-white'                 : 'text-midnight'
  const textSec  = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg   = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'
  const unreadBg = isDark ? 'bg-sage-dark/20 border-sage/30' : 'bg-sage-light/30 border-sage/30'

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <div className="flex items-center justify-between px-6 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-base active:scale-90 transition-transform ${isDark ? 'bg-white/10 text-white' : 'bg-white border border-mist/40 text-midnight'}`}>←</button>
          <div>
            <h1 className={`font-serif text-xl ${textPri}`}>Notifications</h1>
            {unreadCount > 0 && <p className={`text-xs ${textSec}`}>{unreadCount} unread</p>}
          </div>
        </div>
        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
            unreadCount > 0
              ? isDark
                ? 'text-white bg-white/15 active:bg-white/25'
                : 'text-sage-dark bg-sage-light/50 active:bg-sage-light'
              : isDark
                ? 'text-white/25 cursor-default'
                : 'text-mist cursor-default'
          }`}
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleTap(n)}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 mb-2.5 transition-transform active:scale-[0.99] cursor-pointer ${
              !n.read ? unreadBg : cardBg
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-cream'}`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-[13px] font-semibold truncate ${textPri}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-sage-dark flex-shrink-0" />}
              </div>
              <p className={`text-xs mt-0.5 leading-relaxed ${textSec}`}>{n.body}</p>
              <p className={`text-[10px] mt-1.5 ${textSec}`}>{n.time}</p>
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
