import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const ICON_BG = {
  feeding:  'bg-orange-50',
  sleep:    'bg-blue-50',
  diaper:   'bg-purple-50',
  cry:      'bg-red-50',
  medicine: 'bg-green-50',
  growth:   'bg-yellow-50',
}

export default function AllActivities() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { activities, sleepZoneActive } = state
  const isDark = sleepZoneActive

  const bg      = isDark ? 'bg-[#0D1117]'         : 'bg-cream'
  const textPri = isDark ? 'text-white'            : 'text-midnight'
  const textSec = isDark ? 'text-white/50'         : 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <div className="flex items-center gap-3 px-6 pb-5 flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base active:scale-90 transition-transform ${
            isDark ? 'bg-white/10 text-white' : 'bg-white border border-mist/40 text-midnight'
          }`}
        >
          ←
        </button>
        <h1 className={`font-serif text-xl ${textPri}`}>All Activities</h1>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-20">
            <span className="text-5xl">📋</span>
            <p className={`text-sm font-medium ${textSec}`}>No activities logged yet</p>
            <button
              onClick={() => navigate('/log')}
              className="mt-2 px-5 py-2.5 bg-sage-dark text-white text-sm font-semibold rounded-xl active:scale-95 transition-transform"
            >
              Log first activity
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activities.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/activity/${item.id}`)}
                className={`flex items-center gap-3.5 rounded-2xl border p-3.5 cursor-pointer active:scale-[0.99] transition-transform ${cardBg}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${ICON_BG[item.type] || 'bg-gray-50'}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-semibold truncate ${textPri}`}>{item.label}</p>
                  <p className={`text-xs truncate ${textSec}`}>{item.detail}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className={`text-xs ${textSec}`}>{item.time}</p>
                  <span className={`text-[10px] ${textSec}`}>›</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
