import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'
import Toggle from '../components/Toggle'

export default function Profile() {
  const navigate = useNavigate()
  const { state, updatePermissions, savePermissions, toggleSleepZone, logout } = useApp()
  const { baby, user, permissions, sleepZoneActive } = state

  const isDark  = sleepZoneActive
  const bg      = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri = isDark ? 'text-white'                 : 'text-midnight'
  const textSec = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'

  const handlePermissionToggle = async (key) => {
    if (key === 'microphone' && !permissions.microphone) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        const newPerms = { ...permissions, microphone: true }
        updatePermissions({ microphone: true })
        await savePermissions(newPerms)
      } catch {
        alert("Microphone access was denied.")
      }
    } else {
      const newPerms = { ...permissions, [key]: !permissions[key] }
      updatePermissions({ [key]: !permissions[key] })
      await savePermissions(newPerms)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className={`flex flex-col h-full ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />
      <ScreenHeader title="Profile" />

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">

        {/* User card */}
        <div className={`rounded-2xl border p-4 mb-5 flex items-center gap-4 ${cardBg}`}>
          <div className="w-14 h-14 bg-gradient-to-br from-sage-light to-sage rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">👩</div>
          <div className="flex-1">
            <p className={`font-serif text-xl ${textPri}`}>{user?.name || 'Your Account'}</p>
            <p className={`text-xs ${textSec}`}>{user?.email || 'No email set'}</p>
          </div>
        </div>

        {/* Baby card */}
        <div className={`rounded-2xl border p-4 mb-5 ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="section-title">Baby Profile</p>
            <button onClick={() => navigate('/onboard/1')} className="text-xs text-sage-dark font-semibold">Edit</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-rose-light rounded-xl flex items-center justify-center text-2xl flex-shrink-0">👶</div>
            <div>
              <p className={`font-semibold ${textPri}`}>{baby.name || 'Baby'}</p>
              <p className={`text-xs ${textSec}`}>
                {baby.dob ? new Date(baby.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date of birth not set'}
              </p>
              {Array.isArray(baby.feedingMethod) && baby.feedingMethod.length > 0 && (
                <p className={`text-xs ${textSec} capitalize mt-0.5`}>Feeding: {baby.feedingMethod.join(', ')}</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Permissions */}
        <div className={`rounded-2xl border p-4 mb-5 ${cardBg}`}>
          <p className="section-title mb-4">AI Permissions</p>
          {[
            { key: 'microphone',    icon: '🎙️', label: 'Cry Analysis',  desc: 'Microphone access for ambient monitoring' },
            { key: 'notifications', icon: '🔔', label: 'Smart Alerts',  desc: 'Push notifications for cry events & reminders' },
          ].map(perm => (
            <div key={perm.key} className="flex items-center gap-3 py-3 border-b border-mist/20 last:border-0">
              <span className="text-xl">{perm.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${textPri}`}>{perm.label}</p>
                <p className={`text-xs ${textSec}`}>{perm.desc}</p>
              </div>
              <Toggle on={permissions[perm.key]} onToggle={() => handlePermissionToggle(perm.key)} />
            </div>
          ))}
        </div>

        {/* App settings */}
        <div className={`rounded-2xl border p-4 mb-5 ${cardBg}`}>
          <p className="section-title mb-4">App Settings</p>
          <div className="flex items-center gap-3 py-3">
            <span className="text-xl">🌙</span>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${textPri}`}>Sleep Zone</p>
              <p className={`text-xs ${textSec}`}>Dark ambient mode for nighttime use</p>
            </div>
            <Toggle on={sleepZoneActive} onToggle={toggleSleepZone} />
          </div>
        </div>

        {/* Partner sync */}
        <div className={`rounded-2xl border p-4 mb-5 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${textPri}`}>👫 Partner Sync</p>
              <p className={`text-xs ${textSec} mt-0.5`}>Invite your co-parent to share access</p>
            </div>
            <button onClick={() => navigate('/partner-invite')} className="text-xs bg-sage-dark text-white px-3 py-1.5 rounded-lg font-semibold active:scale-95 transition-transform">Invite</button>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-200 text-red-400 font-semibold text-sm active:scale-98 transition-transform">
          Sign Out
        </button>

        <p className={`text-center text-[10px] ${textSec} mt-4`}>
          GuideMe v0.2.0 · Not a medical device · General Wellness App
        </p>
        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}
