import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'

export default function ActivityDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useApp()
  const { activities, sleepZoneActive } = state
  const isDark = sleepZoneActive

  const activity = activities.find(a => String(a.id) === String(id))

  const bg      = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri = isDark ? 'text-white'                 : 'text-midnight'
  const textSec = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'

  if (!activity) {
    return (
      <div className={`flex flex-col min-h-screen ${bg}`}>
        <StatusBar light={isDark} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🤷</span>
          <p className={`text-sm ${textSec}`}>Activity not found</p>
          <button onClick={() => navigate('/dashboard')} className="text-sage-dark text-sm font-semibold">
            Go home
          </button>
        </div>
      </div>
    )
  }

  const ICON_BG = {
    feeding:  'bg-orange-50',
    sleep:    'bg-blue-50',
    diaper:   'bg-purple-50',
    cry:      'bg-red-50',
    medicine: 'bg-green-50',
    growth:   'bg-yellow-50',
  }

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <ScreenHeader title="Activity Detail" showBack />

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">
        {/* Hero */}
        <div className={`rounded-3xl border p-6 mb-5 flex items-center gap-4 ${cardBg}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${ICON_BG[activity.type] || 'bg-gray-50'}`}>
            {activity.icon}
          </div>
          <div>
            <p className={`font-serif text-2xl ${textPri}`}>{activity.label}</p>
            <p className={`text-sm ${textSec} mt-0.5`}>{activity.time}</p>
          </div>
        </div>

        {/* Details */}
        <div className={`rounded-2xl border p-4 mb-4 ${cardBg}`}>
          <p className="section-title mb-3">Details</p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className={`text-sm ${textSec}`}>Type</span>
              <span className={`text-sm font-semibold capitalize ${textPri}`}>{activity.type}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${textSec}`}>Info</span>
              <span className={`text-sm font-semibold ${textPri}`}>{activity.detail}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-sm ${textSec}`}>When</span>
              <span className={`text-sm font-semibold ${textPri}`}>{activity.time}</span>
            </div>
          </div>
        </div>

        <p className={`text-xs text-center ${textSec} mt-6`}>
          Edit & delete functionality coming in Stage 2
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
