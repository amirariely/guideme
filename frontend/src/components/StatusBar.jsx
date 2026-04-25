import { useApp } from '../context/AppContext'

export default function StatusBar({ light = false }) {
  const { state } = useApp()
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  const textColor = light || state.sleepZoneActive
    ? 'text-white/80'
    : 'text-midnight'

  return (
    <div className={`h-[60px] flex items-end justify-between px-7 pb-2 flex-shrink-0 ${textColor}`}>
      <span className="text-[15px] font-semibold">{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="4.5" y="4" width="3" height="8" rx="1" />
          <rect x="9" y="2" width="3" height="10" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-3.5a5.5 5.5 0 014.5 2.35l-1.5 1.5A3.5 3.5 0 008 8a3.5 3.5 0 00-3 1.85L3.5 8.35A5.5 5.5 0 018 6zm0-3.5a9 9 0 017.1 3.55L13.6 7.6A7 7 0 008 5a7 7 0 00-5.6 2.6L.9 6.05A9 9 0 018 2.5z"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.35"/>
          <rect x="1.5" y="2.5" width="15" height="7" rx="1.5" />
          <path d="M22.5 4v4a2 2 0 000-4z" opacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}
