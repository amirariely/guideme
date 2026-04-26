import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'

export default function PartnerInvite() {
  const navigate = useNavigate()
  const { state } = useApp()
  const isDark = state.sleepZoneActive
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const bg      = isDark ? 'bg-[#0D1117]' : 'bg-cream'
  const textPri = isDark ? 'text-white'   : 'text-midnight'
  const textSec = isDark ? 'text-white/50': 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'

  const handleInvite = async () => {
    if (!email.trim()) return
    setLoading(true)
    // TODO Stage 2: call partner.invite(email)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <ScreenHeader title="Invite Partner" showBack />

      <div className="flex-1 flex flex-col px-6">
        {!sent ? (
          <>
            {/* Illustration */}
            <div className="flex flex-col items-center text-center mb-8 mt-4">
              <div className="text-6xl mb-4">👫</div>
              <h2 className={`font-serif text-2xl mb-2 ${textPri}`}>
                Parent as a team
              </h2>
              <p className={`text-sm leading-relaxed ${textSec}`}>
                Invite your co-parent to share {state.baby.name ? `${state.baby.name}'s` : "your baby's"} profile. 
                They'll see all activities, get AI alerts, and stay perfectly in sync — no handover explanations needed.
              </p>
            </div>

            {/* Features */}
            <div className={`rounded-2xl border p-4 mb-6 ${cardBg}`}>
              {[
                { icon: '🔄', text: 'Real-time activity sync' },
                { icon: '🧠', text: 'Shared AI cry alerts' },
                { icon: '🔔', text: 'Both get smart reminders' },
                { icon: '📊', text: 'Shared insights & milestones' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-3 py-2.5 border-b border-mist/20 last:border-0">
                  <span className="text-lg">{f.icon}</span>
                  <p className={`text-sm font-medium ${textPri}`}>{f.text}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="section-title block mb-2">Partner's Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleInvite}
              disabled={!email.trim() || loading}
              className="btn-primary disabled:opacity-40"
            >
              {loading ? 'Sending invite…' : 'Send Invite 💌'}
            </button>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 pb-20">
            <div className="text-6xl">✉️</div>
            <h2 className={`font-serif text-2xl ${textPri}`}>Invite sent!</h2>
            <p className={`text-sm ${textSec} max-w-[240px]`}>
              We sent an invite to <strong className={textPri}>{email}</strong>. 
              Once they sign up, you'll be automatically linked.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 px-6 py-3 bg-sage-dark text-white rounded-2xl font-semibold text-sm active:scale-95 transition-transform"
            >
              Back to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
