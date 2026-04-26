import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'

const MOCK_WEEK = [
  { day: 'Mon', sleep: 14 },
  { day: 'Tue', sleep: 13 },
  { day: 'Wed', sleep: 15 },
  { day: 'Thu', sleep: 12 },
  { day: 'Fri', sleep: 14 },
  { day: 'Sat', sleep: 16 },
  { day: 'Sun', sleep: 15 },
]
const MAX_SLEEP = 16

const FILTER_OPTIONS = [
  { key: 'all',      label: 'All',      icon: '📋' },
  { key: 'feeding',  label: 'Feeding',  icon: '🍼' },
  { key: 'sleep',    label: 'Sleep',    icon: '😴' },
  { key: 'diaper',   label: 'Diaper',   icon: '🚼' },
  { key: 'medicine', label: 'Medicine', icon: '💊' },
  { key: 'cry',      label: 'Cry',      icon: '😢' },
  { key: 'growth',   label: 'Growth',   icon: '📏' },
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'type',   label: 'Group by type' },
]

const ICON_BG = {
  feeding:  'bg-orange-50',
  sleep:    'bg-blue-50',
  diaper:   'bg-purple-50',
  cry:      'bg-red-50',
  medicine: 'bg-green-50',
  growth:   'bg-yellow-50',
}

// Group activities by type for "group by type" sort
function groupByType(activities) {
  const groups = {}
  activities.forEach(a => {
    if (!groups[a.type]) groups[a.type] = []
    groups[a.type].push(a)
  })
  return groups
}

export default function CombinedDashboard() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { baby, activities, sleepZoneActive } = state

  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort,   setActiveSort]   = useState('newest')
  const [showSort,     setShowSort]     = useState(false)
  const [activeTab,    setActiveTab]    = useState('activities') // 'activities' | 'insights'

  const isDark   = sleepZoneActive
  const bg       = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri  = isDark ? 'text-white'                 : 'text-midnight'
  const textSec  = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg   = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'
  const tabBg    = isDark ? 'bg-white/10'                : 'bg-mist-light'
  const tabActive = isDark ? 'bg-white/20 text-white'    : 'bg-white text-midnight shadow-sm'
  const tabInactive = isDark ? 'text-white/40'           : 'text-steel'

  // Filter
  const filtered = activeFilter === 'all'
    ? activities
    : activities.filter(a => a.type === activeFilter)

  // Sort
  let sorted = [...filtered]
  if (activeSort === 'newest') sorted = sorted.sort((a, b) => b.timestamp - a.timestamp)
  if (activeSort === 'oldest') sorted = sorted.sort((a, b) => a.timestamp - b.timestamp)

  const grouped = activeSort === 'type' ? groupByType(filtered) : null

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <ScreenHeader
        title={baby.name ? `${baby.name}'s Dashboard` : 'Dashboard'}
        subtitle={`${activities.length} activities logged`}
      />

      {/* Tab switcher */}
      <div className={`mx-5 mb-3 flex rounded-xl p-1 flex-shrink-0 ${tabBg}`}>
        {[
          { key: 'activities', label: '📋 Activities' },
          { key: 'insights',   label: '📊 Insights'   },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${activeTab === tab.key ? tabActive : tabInactive}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll pb-2">

        {/* ── ACTIVITIES TAB ── */}
        {activeTab === 'activities' && (
          <>
            {/* Filter chips */}
            <div className="flex gap-2 px-5 overflow-x-auto phone-scroll pb-1 mb-3 flex-shrink-0">
              {FILTER_OPTIONS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all active:scale-95 ${
                    activeFilter === f.key
                      ? 'bg-sage-dark border-sage-dark text-white'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white/60'
                        : 'bg-white border-mist/40 text-steel'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between px-5 mb-3">
              <p className={`text-xs ${textSec}`}>
                {filtered.length} {activeFilter === 'all' ? 'total' : activeFilter} activities
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowSort(s => !s)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isDark ? 'bg-white/10 border-white/10 text-white/70' : 'bg-white border-mist/40 text-steel'
                  }`}
                >
                  <span>⇅</span>
                  <span>{SORT_OPTIONS.find(s => s.key === activeSort)?.label}</span>
                </button>
                {showSort && (
                  <div className={`absolute right-0 top-9 z-20 rounded-2xl border shadow-xl overflow-hidden w-44 ${isDark ? 'bg-[#1C2B3A] border-white/10' : 'bg-white border-mist/40'}`}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setActiveSort(opt.key); setShowSort(false) }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          activeSort === opt.key
                            ? isDark ? 'bg-white/10 text-white' : 'bg-sage-light/50 text-sage-dark'
                            : isDark ? 'text-white/70 hover:bg-white/5' : 'text-midnight hover:bg-cream'
                        }`}
                      >
                        {activeSort === opt.key && '✓ '}{opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity list */}
            <div className="px-5 flex flex-col gap-2.5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <span className="text-4xl">📭</span>
                  <p className={`text-sm ${textSec}`}>No {activeFilter} activities yet</p>
                  <button onClick={() => navigate('/log')} className="px-5 py-2.5 bg-sage-dark text-white text-sm font-semibold rounded-xl active:scale-95 transition-transform">
                    Log one now
                  </button>
                </div>
              ) : activeSort === 'type' ? (
                // Grouped view
                Object.entries(grouped).map(([type, items]) => (
                  <div key={type} className="mb-2">
                    <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 px-1 ${textSec}`}>
                      {FILTER_OPTIONS.find(f => f.key === type)?.icon} {type} · {items.length}
                    </p>
                    {items.map(item => (
                      <ActivityRow key={item.id} item={item} isDark={isDark} textPri={textPri} textSec={textSec} cardBg={cardBg} navigate={navigate} />
                    ))}
                  </div>
                ))
              ) : (
                sorted.map(item => (
                  <ActivityRow key={item.id} item={item} isDark={isDark} textPri={textPri} textSec={textSec} cardBg={cardBg} navigate={navigate} />
                ))
              )}
            </div>
          </>
        )}

        {/* ── INSIGHTS TAB ── */}
        {activeTab === 'insights' && (
          <div className="px-5 flex flex-col gap-4">

            {/* Sleep chart */}
            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <p className="section-title mb-4">Sleep This Week</p>
              <div className="flex items-end justify-between gap-1.5 h-20">
                {MOCK_WEEK.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-sage to-sage-light rounded-t-lg"
                      style={{ height: `${(d.sleep / MAX_SLEEP) * 100}%` }}
                    />
                    <span className={`text-[9px] font-medium ${textSec}`}>{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-mist/30">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${textSec}`}>Avg / day</p>
                  <p className={`text-xl font-bold ${textPri}`}>14.1h</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${textSec}`}>Recommended</p>
                  <p className={`text-xl font-bold ${textPri}`}>14–17h</p>
                </div>
              </div>
            </div>

            {/* Feed summary */}
            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <p className="section-title mb-3">Feeding Summary</p>
              <div className="flex gap-3">
                {[
                  { label: 'Avg feeds/day', value: '7.0', icon: '🍼' },
                  { label: 'Total this week', value: '49', icon: '📊' },
                ].map(s => (
                  <div key={s.label} className={`flex-1 rounded-xl p-3 ${isDark ? 'bg-white/5' : 'bg-cream'}`}>
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className={`text-xl font-bold ${textPri}`}>{s.value}</p>
                    <p className={`text-[10px] ${textSec}`}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI accuracy */}
            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="section-title">AI Accuracy</p>
                <span className="text-xs font-semibold text-sage-dark bg-sage-light px-2.5 py-1 rounded-full">Getting smarter</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-mist-light rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sage to-sage-dark rounded-full" style={{ width: '75%' }} />
                </div>
                <span className={`text-base font-bold ${textPri}`}>75%</span>
              </div>
              <p className={`text-xs ${textSec} mt-2`}>Good accuracy — keep rating cry interpretations to improve further 🎯</p>
            </div>

            {/* Milestones */}
            <div className={`rounded-2xl border p-4 ${cardBg}`}>
              <p className="section-title mb-3">Upcoming Milestones</p>
              {[
                { icon: '😊', label: 'First social smile',    age: '6–8 weeks',  done: false },
                { icon: '👁️', label: 'Tracks objects visually', age: '2–3 months', done: false },
                { icon: '🗣️', label: 'Cooing & vocalizing',  age: '2 months',   done: true  },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-3 py-2.5 border-b border-mist/20 last:border-0">
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${m.done ? 'line-through opacity-40' : ''} ${textPri}`}>{m.label}</p>
                    <p className={`text-xs ${textSec}`}>{m.age}</p>
                  </div>
                  {m.done && <span className="text-sage-dark text-lg">✓</span>}
                </div>
              ))}
            </div>

            <div className="h-4" />
          </div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}

function ActivityRow({ item, isDark, textPri, textSec, cardBg, navigate }) {
  return (
    <div
      onClick={() => navigate(`/activity/${item.id}`)}
      className={`flex items-center gap-3.5 rounded-2xl border p-3.5 cursor-pointer active:scale-[0.99] transition-transform mb-1 ${cardBg}`}
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
  )
}
