import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import Toggle from '../components/Toggle'
import { StepDots } from './Onboard1'

const PERMISSIONS = [
  {
    key: 'microphone',
    icon: '🎙️',
    title: 'Cry Analysis (Microphone)',
    desc: "GuideMe listens in the background and interprets your baby's cries in real time.",
    required: true,
  },
  {
    key: 'notifications',
    icon: '🔔',
    title: 'Smart Alerts (Notifications)',
    desc: 'Get instant alerts when a cry is detected, and reminders for feeding and medication.',
    required: false,
  },
]

export default function Onboard3() {
  const navigate = useNavigate()
  const { state, updatePermissions, saveBabyProfile, savePermissions } = useApp()
  const { permissions, baby } = state
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleToggle = async (key) => {
    if (key === 'microphone' && !permissions.microphone) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        updatePermissions({ microphone: true })
      } catch {
        alert("Microphone access was denied. Please allow it in your browser settings.")
      }
    } else {
      updatePermissions({ [key]: !permissions[key] })
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    setError(null)
    try {
      // Save baby profile to DB
      await saveBabyProfile(baby)
      // Save permissions to DB
      await savePermissions(permissions)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <StatusBar />
      <div className="flex-1 flex flex-col px-7 overflow-y-auto phone-scroll">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/onboard/2')}
            className="w-8 h-8 bg-white border border-mist/40 rounded-xl flex items-center justify-center text-sm text-steel active:scale-90 transition-transform">←</button>
          <div className="flex-1"><StepDots current={3} /></div>
        </div>

        <h1 className="font-serif text-[28px] text-midnight leading-tight mb-1">
          Enable GuideMe's<br />superpowers 🧠
        </h1>
        <p className="text-steel text-sm mb-8">
          These permissions let GuideMe work for you — even when you're not looking at your phone.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {PERMISSIONS.map(perm => (
            <div key={perm.key} className="bg-white border border-mist/40 rounded-2xl p-4 flex items-start gap-4">
              <span className="text-3xl mt-0.5">{perm.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[15px] font-semibold text-midnight">{perm.title}</p>
                  <Toggle on={permissions[perm.key]} onToggle={() => handleToggle(perm.key)} />
                </div>
                <p className="text-xs text-steel mt-1.5 leading-relaxed">{perm.desc}</p>
                {perm.required && !permissions[perm.key] && (
                  <p className="text-xs text-rose mt-1.5 font-medium">⚠️ Required for cry interpretation</p>
                )}
              </div>
            </div>
          ))}

          <div className="mt-2 bg-mist-light rounded-2xl p-4">
            <p className="text-xs text-steel leading-relaxed">
              🔒 <strong>Your privacy is our priority.</strong> Audio is processed locally on your device or anonymized before reaching our servers. We never store raw audio recordings.
            </p>
          </div>
        </div>
      </div>

      <div className="px-7 pb-10 pt-4 flex-shrink-0">
        <button onClick={handleFinish} disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Saving…' : permissions.microphone ? 'Start GuideMe 🌿' : 'Continue without AI'}
        </button>
      </div>
    </div>
  )
}
