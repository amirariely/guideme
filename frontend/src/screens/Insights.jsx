import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { useApp } from '../context/AppContext'

const MOCK_WEEK = [
  { day: 'Mon', feeds: 7, sleep: 14 },
  { day: 'Tue', feeds: 6, sleep: 13 },
  { day: 'Wed', feeds: 8, sleep: 15 },
  { day: 'Thu', feeds: 7, sleep: 12 },
  { day: 'Fri', feeds: 6, sleep: 14 },
  { day: 'Sat', feeds: 8, sleep: 16 },
  { day: 'Sun', feeds: 7, sleep: 15 },
]
const MAX_SLEEP = 16

export default function Insights() {
  const { state } = useApp()
  const { baby } = state

  return (
    <div className="flex flex-col h-full bg-cream">
      <StatusBar />

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">
        <h1 className="font-serif text-2xl text-midnight mb-1 px-1">
          {baby.name ? `${baby.name}'s Insights` : 'Insights'}
        </h1>
        <p className="text-xs text-steel mb-5 px-1">This week's overview</p>

        {/* Sleep chart */}
        <div className="card mb-4">
          <p className="section-title mb-4">Sleep This Week</p>
          <div className="flex items-end justify-between gap-1.5 h-20">
            {MOCK_WEEK.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-sage to-sage-light rounded-t-lg rounded-b transition-all"
                  style={{ height: `${(d.sleep / MAX_SLEEP) * 100}%` }}
                />
                <span className="text-[9px] text-steel font-medium">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-mist/30">
            <div>
              <p className="text-[10px] text-steel uppercase tracking-wide font-bold">Avg / day</p>
              <p className="text-xl font-bold text-midnight">14.1h</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-steel uppercase tracking-wide font-bold">Recommended</p>
              <p className="text-xl font-bold text-midnight">14–17h</p>
            </div>
          </div>
        </div>

        {/* Feed summary */}
        <div className="card mb-4">
          <p className="section-title mb-3">Feeding Summary</p>
          <div className="flex gap-3">
            {[
              { label: 'Avg feeds/day', value: '7.0', icon: '🍼' },
              { label: 'Total this week', value: '49',  icon: '📊' },
            ].map(s => (
              <div key={s.label} className="flex-1 bg-cream rounded-xl p-3">
                <p className="text-xl mb-1">{s.icon}</p>
                <p className="text-xl font-bold text-midnight">{s.value}</p>
                <p className="text-[10px] text-steel">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI accuracy */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">AI Accuracy</p>
            <span className="text-xs font-semibold text-sage-dark bg-sage-light px-2.5 py-1 rounded-full">
              Getting smarter
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-mist-light rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sage to-sage-dark rounded-full" style={{ width: '60%' }} />
            </div>
            <span className="text-base font-bold text-midnight">60%</span>
          </div>
          <p className="text-xs text-steel mt-2">
            Needs more feedback sessions to improve. Keep rating cry interpretations! 🎯
          </p>
        </div>

        {/* Upcoming milestones */}
        <div className="card">
          <p className="section-title mb-3">Upcoming Milestones</p>
          {[
            { icon: '😊', label: 'First social smile', age: '6–8 weeks', done: false },
            { icon: '👁️', label: 'Tracks objects visually', age: '2–3 months', done: false },
            { icon: '🗣️', label: 'Cooing & vocalizing', age: '2 months', done: true },
          ].map(m => (
            <div key={m.label} className="flex items-center gap-3 py-2.5 border-b border-mist/20 last:border-0">
              <span className="text-xl">{m.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${m.done ? 'text-mist line-through' : 'text-midnight'}`}>
                  {m.label}
                </p>
                <p className="text-xs text-steel">{m.age}</p>
              </div>
              {m.done && <span className="text-sage-dark text-lg">✓</span>}
            </div>
          ))}
        </div>

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
