import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'

export function StepDots({ current }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {[1, 2, 3].map(n => (
        <div key={n} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
          n < current ? 'bg-sage-light' : n === current ? 'bg-sage-dark' : 'bg-mist'
        }`} />
      ))}
    </div>
  )
}

export default function Onboard1() {
  const navigate = useNavigate()
  const { state, updateBaby, register } = useApp()
  const { baby, isAuthenticated } = state

  // Registration fields (only shown if not yet authenticated)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const canContinue = isAuthenticated
    ? baby.name.trim() && baby.dob
    : baby.name.trim() && baby.dob && name.trim() && email.trim() && password.length >= 6

  const handleContinue = async () => {
    setError(null)

    // If not yet authenticated, register first
    if (!isAuthenticated) {
      setLoading(true)
      try {
        await register(name, email, password)
      } catch (err) {
        setError(err.message || 'Registration failed')
        setLoading(false)
        return
      }
      setLoading(false)
    }

    navigate('/onboard/2')
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <StatusBar />
      <div className="flex-1 flex flex-col px-7 overflow-y-auto phone-scroll">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')}
            className="w-8 h-8 bg-white border border-mist/40 rounded-xl flex items-center justify-center text-sm text-steel active:scale-90 transition-transform">←</button>
          <div className="flex-1"><StepDots current={1} /></div>
        </div>

        <h1 className="font-serif text-[28px] text-midnight leading-tight mb-1">
          {isAuthenticated ? 'Edit baby profile 🍼' : 'Let\'s get started 🍼'}
        </h1>
        <p className="text-steel text-sm mb-6">
          {isAuthenticated ? 'Update your baby\'s details.' : 'Create your account and tell us about your baby.'}
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Account fields — only shown if not yet registered */}
          {!isAuthenticated && (
            <>
              <div>
                <label className="section-title block mb-2">Your Name</label>
                <input className="form-input" placeholder="e.g. Maya" value={name}
                  onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="section-title block mb-2">Email</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="section-title block mb-2">Password</label>
                <input className="form-input" type="password" placeholder="At least 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="h-px bg-mist/30 my-1" />
            </>
          )}

          {/* Baby fields */}
          <div>
            <label className="section-title block mb-2">Baby's Name</label>
            <input className="form-input" placeholder="e.g. Alma" value={baby.name}
              onChange={e => updateBaby({ name: e.target.value })} />
          </div>
          <div>
            <label className="section-title block mb-2">Date of Birth</label>
            <input className="form-input" type="date" value={baby.dob}
              onChange={e => updateBaby({ dob: e.target.value })} />
          </div>
          <div className="bg-white border border-mist/40 rounded-2xl p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-[15px] font-medium text-midnight">Was the baby born early?</p>
              <p className="text-xs text-steel mt-0.5">We'll calculate corrected age</p>
            </div>
            <input type="checkbox" className="mt-1 w-5 h-5 accent-[#4E7A4D] cursor-pointer"
              checked={baby.isPremature} onChange={e => updateBaby({ isPremature: e.target.checked })} />
          </div>
          {baby.isPremature && (
            <div className="float-in">
              <label className="section-title block mb-2">Original Due Date</label>
              <input className="form-input" type="date" value={baby.dueDateIfPremature}
                onChange={e => updateBaby({ dueDateIfPremature: e.target.value })} />
            </div>
          )}
        </div>
      </div>

      <div className="px-7 pb-10 pt-4 flex-shrink-0">
        <button onClick={handleContinue} disabled={!canContinue || loading}
          className="btn-primary disabled:opacity-40">
          {loading ? 'Creating account…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
