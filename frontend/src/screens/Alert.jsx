import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'

const CRY_TYPES = [
  {
    id: 'hunger',
    icon: '🍼',
    label: 'Hunger',
    confidence: 87,
    color: 'from-orange-400 to-amber-500',
    action: 'Prepare a bottle or offer breast now',
    tips: ["Baby's last feed was 3h ago", 'Crying pattern: short bursts, rhythmic', 'May also be rooting or sucking fists'],
  },
  {
    id: 'fatigue',
    icon: '😴',
    label: 'Fatigue',
    confidence: 72,
    color: 'from-blue-400 to-indigo-500',
    action: 'Dim the lights and reduce stimulation',
    tips: ['Baby has been awake for 1h 40min', 'Try swaddling or gentle rocking', 'Avoid eye contact to reduce stimulation'],
  },
  {
    id: 'discomfort',
    icon: '🤒',
    label: 'Discomfort',
    confidence: 61,
    color: 'from-rose-400 to-pink-500',
    action: 'Check for gas, check diaper, check temperature',
    tips: ['Check diaper first', 'Try tummy massage for gas relief', 'Ensure clothing isn\'t too tight'],
  },
]

export default function Alert() {
  const navigate = useNavigate()
  const { addActivity } = useApp()
  const [dismissed, setDismissed]   = useState(false)
  const [confirmed, setConfirmed]   = useState(null)
  const detected = CRY_TYPES[0] // In Stage 4 this comes from the AI engine

  const handleConfirm = async (wasCorrect, actual) => {
    // TODO Stage 4: POST /api/cry-events/:id/feedback
    setConfirmed(wasCorrect ? 'correct' : 'incorrect')
    addActivity({
      type: 'cry',
      icon: detected.icon,
      label: `Cry · ${detected.label}`,
      detail: `AI confidence ${detected.confidence}%`,
      time: 'just now',
    })
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <StatusBar />

      <ScreenHeader title="AI Alert" showBack />
      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">

        {/* Alert banner */}
        <div className={`rounded-3xl bg-gradient-to-br ${detected.color} p-5 mb-5 text-white relative overflow-hidden`}>
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">Cry Detected</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{detected.icon}</span>
              <div>
                <p className="font-serif text-3xl">{detected.label}</p>
                <p className="text-white/70 text-sm">{detected.confidence}% confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested action */}
        <div className="card mb-4">
          <p className="section-title mb-2">Suggested Action</p>
          <p className="text-midnight font-semibold text-base leading-snug">{detected.action}</p>
        </div>

        {/* Tips */}
        <div className="card mb-4">
          <p className="section-title mb-3">Why GuideMe thinks this</p>
          <div className="flex flex-col gap-2">
            {detected.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-sage-dark mt-0.5 font-bold text-sm">•</span>
                <p className="text-sm text-steel leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other possibilities */}
        <p className="section-title mb-3 px-1">Other Possibilities</p>
        <div className="flex flex-col gap-2 mb-6">
          {CRY_TYPES.slice(1).map(ct => (
            <div key={ct.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{ct.icon}</span>
                <span className="text-sm font-medium text-midnight">{ct.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 bg-mist-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage rounded-full"
                    style={{ width: `${ct.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-steel w-8 text-right">{ct.confidence}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {!confirmed ? (
          <div className="card">
            <p className="section-title mb-3">Was GuideMe right?</p>
            <p className="text-xs text-steel mb-3">Your feedback trains the AI to know your baby better.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(true, detected.id)}
                className="flex-1 py-3 rounded-xl bg-sage-light text-sage-dark font-semibold text-sm active:scale-95 transition-transform"
              >
                ✓ Yes, correct
              </button>
              <button
                onClick={() => handleConfirm(false, null)}
                className="flex-1 py-3 rounded-xl bg-rose-light text-rose font-semibold text-sm active:scale-95 transition-transform"
              >
                ✗ Not quite
              </button>
            </div>
          </div>
        ) : (
          <div className={`card text-center py-5 ${confirmed === 'correct' ? 'bg-sage-light/50' : 'bg-rose-light/50'}`}>
            <p className="text-2xl mb-1">{confirmed === 'correct' ? '🙏' : '📝'}</p>
            <p className="text-sm font-semibold text-midnight">
              {confirmed === 'correct' ? 'Thanks! GuideMe is learning.' : 'Got it — we\'ll improve.'}
            </p>
          </div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
