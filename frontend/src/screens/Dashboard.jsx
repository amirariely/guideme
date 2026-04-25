import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import MicWaveform from '../components/MicWaveform'

const ICON_BG = {
  feeding:  'bg-orange-50',
  sleep:    'bg-blue-50',
  diaper:   'bg-purple-50',
  cry:      'bg-red-50',
  medicine: 'bg-green-50',
  growth:   'bg-yellow-50',
}

function getBabyAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  const now   = new Date()
  const weeks = Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 7))
  if (weeks < 4) return `${weeks}w old`
  const months = Math.floor(weeks / 4.3)
  return `${months} month${months !== 1 ? 's' : ''} old`
}

function getLastActivity(activities, type) {
  const found = activities.find(a => a.type === type)
  return found ? found.time : '—'
}

export default function Home() {
  const navigate = useNavigate()
  const { state, toggleSleepZone } = useApp()
  const { baby, activities, sleepZoneActive, permissions } = state

  const isDark  = sleepZoneActive
  const bg      = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri = isDark ? 'text-white'                 : 'text-midnight'
  const textSec = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'
  const iconBtn = isDark ? 'bg-white/10'                : 'bg-white border border-mist/40'

  return (
    <div className={`flex flex-col h-full ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <div className="flex-1 overflow-y-auto phone-scroll pb-2">

        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-4">
          <div>
            <p className={`text-xs font-medium ${textSec}`}>Good morning 👋</p>
            <h1 className={`font-serif text-2xl ${textPri}`}>
              {baby.name ? `${baby.name}'s Day` : 'Home'}
            </h1>
            {baby.dob && <p className={`text-xs ${textSec} mt-0.5`}>{getBabyAge(baby.dob)}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleSleepZone} className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-transform ${iconBtn}`}>
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => navigate('/notifications')} className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 transition-transform ${iconBtn}`}>
              🔔
            </button>
          </div>
        </div>

        {/* Monitoring card */}
        <div
          onClick={() => permissions.microphone ? navigate('/alert') : navigate('/profile')}
          className="mx-5 mb-4 rounded-3xl p-5 bg-gradient-to-br from-midnight to-slate relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-sage/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#7DD98A]" style={{ animation: 'pulse-dot 1.5s infinite' }} />
              <span className="text-[11px] font-semibold text-[#7DD98A] tracking-wide uppercase">
                {permissions.microphone ? 'Listening · Active' : 'AI Monitoring Off'}
              </span>
            </div>
            <p className="font-serif text-white text-xl mb-1">
              {permissions.microphone ? 'All quiet right now' : 'Enable microphone'}
            </p>
            <p className="text-white/40 text-xs">
              {permissions.microphone
                ? `GuideMe is watching over ${baby.name || 'your baby'}`
                : 'Tap here to go to permissions settings'}
            </p>
            {/* Real mic waveform — only renders when mic is on */}
            {permissions.microphone && <MicWaveform />}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mx-5 mb-4">
          {[
            { icon: '🍼', label: 'Last Feed',  value: getLastActivity(activities, 'feeding') },
            { icon: '😴', label: 'Last Sleep', value: getLastActivity(activities, 'sleep') },
          ].map(stat => (
            <div key={stat.label} className={`flex-1 rounded-2xl border p-4 ${cardBg}`}>
              <div className="text-xl mb-2">{stat.icon}</div>
              <p className={`text-[10px] font-semibold ${textSec} uppercase tracking-wide`}>{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${textPri}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Activity feed */}
        <div className="flex items-center justify-between px-6 mb-3">
          <p className={`text-[15px] font-semibold ${textPri}`}>Recent Activity</p>
          <button onClick={() => navigate('/dashboard')} className="text-sage-dark text-[13px] font-medium active:opacity-70">
            See all
          </button>
        </div>

        <div className="flex flex-col gap-2.5 px-5">
          {activities.slice(0, 4).map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/activity/${item.id}`)}
              className={`flex items-center gap-3.5 rounded-2xl border p-3.5 cursor-pointer active:scale-[0.99] transition-transform ${cardBg}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${ICON_BG[item.type] || 'bg-gray-50'}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-semibold truncate ${textPri}`}>{item.label}</p>
                <p className={`text-xs truncate ${textSec}`}>{item.detail}</p>
              </div>
              <p className={`text-xs flex-shrink-0 ${textSec}`}>{item.time}</p>
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
