import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'

const ACTIVITY_TYPES = [
  { type: 'feeding',  icon: '🍼', label: 'Feed'     },
  { type: 'sleep',    icon: '😴', label: 'Sleep'    },
  { type: 'diaper',   icon: '🚼', label: 'Diaper'   },
  { type: 'medicine', icon: '💊', label: 'Medicine' },
  { type: 'growth',   icon: '📏', label: 'Growth'   },
]

// Multi-select feeding types
const FEEDING_TYPES = ['Breast — Left', 'Breast — Right', 'Bottle', 'Solid Food', 'Pumped Milk']
const DIAPER_TYPES  = ['Wet', 'Dirty', 'Both', 'Dry']

export default function LogActivity() {
  const navigate = useNavigate()
  const { addActivity, state } = useApp()
  const isDark = state.sleepZoneActive

  const [selectedType,  setSelectedType]  = useState('feeding')
  const [selectedFeeds, setSelectedFeeds] = useState([])   // multi-select for feeding
  const [selectedSub,   setSelectedSub]   = useState('')   // single for others
  const [duration,      setDuration]      = useState(10)
  const [milkVolume,    setMilkVolume]    = useState('')   // ml for bottle/pumped milk
  const [notes,         setNotes]         = useState('')
  const [saved,         setSaved]         = useState(false)

  const bg      = isDark ? 'bg-[#0D1117]'              : 'bg-cream'
  const textPri = isDark ? 'text-white'                 : 'text-midnight'
  const textSec = isDark ? 'text-white/50'              : 'text-steel'
  const cardBg  = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-mist/40'

  const toggleFeed = (f) => {
    setSelectedFeeds(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  const handleTypeChange = (type) => {
    setSelectedType(type)
    setSelectedFeeds([])
    setSelectedSub('')
  }

  const handleSave = () => {
    const typeObj = ACTIVITY_TYPES.find(a => a.type === selectedType)
    
    // Build detail string for feeding
    let detail = ''
    if (selectedType === 'feeding') {
      let feedStr = selectedFeeds.length ? selectedFeeds.join(', ') : `${duration} min`
      // Add milk volume if bottle or pumped milk selected and volume is entered
      if ((selectedFeeds.includes('Bottle') || selectedFeeds.includes('Pumped Milk')) && milkVolume) {
        feedStr += ` · ${milkVolume}ml`
      }
      detail = feedStr
    } else {
      detail = selectedSub || `${duration} min`
    }

    addActivity({
      type:   selectedType,
      icon:   typeObj.icon,
      label:  typeObj.label + (selectedType === 'feeding' && selectedFeeds.length ? ` · ${selectedFeeds.join(' + ')}` : selectedSub ? ` · ${selectedSub}` : ''),
      detail,
      time:   'just now',
    })
    setSaved(true)
    setTimeout(() => navigate('/home'), 900)
  }

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />

      <ScreenHeader title="Log Activity" showBack />

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pb-4">

        {/* Activity type picker */}
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Activity Type</p>
        <div className="flex gap-2.5 overflow-x-auto phone-scroll pb-1 mb-6">
          {ACTIVITY_TYPES.map(a => (
            <button
              key={a.type}
              onClick={() => handleTypeChange(a.type)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-95 min-w-[70px] ${
                selectedType === a.type
                  ? 'border-sage bg-sage-light/50'
                  : isDark ? 'border-white/10 bg-white/5' : 'border-mist/40 bg-white'
              }`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className={`text-[11px] font-semibold ${selectedType === a.type ? 'text-sage-dark' : textSec}`}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Feeding — MULTI SELECT */}
        {selectedType === 'feeding' && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <p className={`text-[11px] font-bold uppercase tracking-widest ${textSec}`}>Feeding Type</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-white/50' : 'bg-mist-light text-steel'}`}>
                Select all that apply
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEEDING_TYPES.map(f => (
                <button
                  key={f}
                  onClick={() => toggleFeed(f)}
                  className={`px-4 py-2.5 rounded-full border-2 text-[13px] font-medium transition-all active:scale-95 ${
                    selectedFeeds.includes(f)
                      ? 'bg-sage border-sage text-white'
                      : isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-mist text-steel'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
        {/* Milk Volume — for Bottle or Pumped Milk */}
        {(selectedFeeds.includes('Bottle') || selectedFeeds.includes('Pumped Milk')) && (
          <div className="mb-5">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Milk Volume (ml)</p>
            <div className={`rounded-2xl border p-4 flex items-center justify-between ${cardBg}`}>
              <input 
                type="number"
                placeholder="e.g. 120"
                value={milkVolume}
                onChange={e => setMilkVolume(e.target.value)}
                className={`flex-1 bg-transparent font-sans text-lg font-semibold outline-none ${textPri}`}
              />
              <span className={`text-sm font-medium ml-2 ${textSec}`}>ml</span>
            </div>
          </div>
        )}

        {selectedFeeds.length > 1 && (
              <p className={`text-xs mt-2 ${textSec}`}>✓ {selectedFeeds.length} types selected</p>
            )}
          </div>
        )}

        {selectedType === 'diaper' && (
          <div className="mb-5">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Diaper Type</p>
            <div className="flex flex-wrap gap-2">
              {DIAPER_TYPES.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedSub(d)}
                  className={`px-4 py-2.5 rounded-full border-2 text-[13px] font-medium transition-all active:scale-95 ${
                    selectedSub === d
                      ? 'bg-sage border-sage text-white'
                      : isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-mist text-steel'
                  }`}
                >{d}</button>
              ))}
            </div>
          </div>
        )}

        {selectedType === 'medicine' && (
          <div className="mb-5">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Medicine Name</p>
            <input className="form-input" placeholder="e.g. Paracetamol 2.5ml" value={selectedSub} onChange={e => setSelectedSub(e.target.value)} />
          </div>
        )}

        {selectedType === 'growth' && (
          <div className="mb-5">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Measurement</p>
            <input className="form-input" placeholder="e.g. Weight: 5.2kg / Height: 58cm" value={selectedSub} onChange={e => setSelectedSub(e.target.value)} />
          </div>
        )}

        {/* Duration */}
        {(selectedType === 'feeding' || selectedType === 'sleep') && (
          <div className="mb-5">
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Duration</p>
            <div className={`rounded-2xl border p-4 flex items-center justify-between ${cardBg}`}>
              <span className={`text-sm font-medium ${textPri}`}>Duration</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setDuration(d => Math.max(1, d - 5))} className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold active:scale-90 transition-transform ${isDark ? 'bg-white/10 text-white' : 'bg-mist-light text-steel'}`}>−</button>
                <span className={`text-lg font-bold w-16 text-center ${textPri}`}>{duration} min</span>
                <button onClick={() => setDuration(d => d + 5)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold active:scale-90 transition-transform ${isDark ? 'bg-white/10 text-white' : 'bg-mist-light text-steel'}`}>+</button>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-5">
          <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 px-1 ${textSec}`}>Notes (optional)</p>
          <div className={`rounded-2xl border p-4 ${cardBg}`}>
            <textarea
              className={`w-full bg-transparent font-sans text-sm outline-none resize-none placeholder:text-mist ${textPri}`}
              placeholder="Any observations…"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-10 pt-3 flex-shrink-0 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className={`flex-1 py-4 rounded-2xl border text-sm font-semibold active:scale-98 transition-transform ${isDark ? 'border-white/10 text-white/60' : 'border-mist text-steel'}`}
        >Cancel</button>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex-[2] py-4 rounded-2xl font-semibold text-base text-white transition-all active:scale-98 ${saved ? 'bg-sage-dark/70' : 'bg-sage-dark shadow-[0_8px_24px_rgba(78,122,77,0.35)]'}`}
        >{saved ? '✓ Saved!' : 'Save Activity'}</button>
      </div>
    </div>
  )
}
