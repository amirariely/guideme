import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import { StepDots } from './Onboard1'

// MULTI-SELECT feeding options
const FEEDING_OPTIONS = [
  { value: 'breast',   label: '🤱 Breast'   },
  { value: 'formula',  label: '🍼 Formula'  },
  { value: 'mixed',    label: '🔄 Mixed'    },
  { value: 'pumping',  label: '🧴 Pumping'  },
  { value: 'solid',    label: '🥣 Solid food' },
]

const SENSITIVITIES = ['Reflux', 'Colic', 'Tongue-tie', 'Lactose intolerance']
const SOOTHING      = ['Pacifier', 'White noise', 'Rocking', 'Car ride', 'Swaddling', 'Skin-to-skin']
const ROUTINE       = [
  { value: 'strict',    label: '📅 Strict schedule' },
  { value: 'on-demand', label: '🌊 On-demand / Flow' },
]

function ChipGroup({ options, selected, onToggle, isObject = false, multi = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const value    = isObject ? opt.value : opt
        const label    = isObject ? opt.label : opt
        const isSelected = multi
          ? Array.isArray(selected) && selected.includes(value)
          : selected === value
        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`chip ${isSelected ? 'chip-selected' : ''}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default function Onboard2() {
  const navigate = useNavigate()
  const { state, updateBaby } = useApp()
  const { baby } = state

  // feedingMethod is now an array for multi-select
  const feedingMethods = Array.isArray(baby.feedingMethod)
    ? baby.feedingMethod
    : baby.feedingMethod ? [baby.feedingMethod] : []

  const toggleFeedingMethod = (value) => {
    const current = Array.isArray(baby.feedingMethod) ? baby.feedingMethod : []
    updateBaby({
      feedingMethod: current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value],
    })
  }

  const toggleArray = (field, value) => {
    const arr = baby[field] || []
    updateBaby({ [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] })
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <StatusBar />

      <div className="flex-1 flex flex-col px-7 overflow-y-auto phone-scroll pb-4">
        {/* Back + dots */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/onboard/1')}
            className="w-8 h-8 bg-white border border-mist/40 rounded-xl flex items-center justify-center text-sm text-steel active:scale-90 transition-transform"
          >←</button>
          <div className="flex-1"><StepDots current={2} /></div>
        </div>

        <h1 className="font-serif text-[28px] text-midnight leading-tight mb-1">
          Help us know {baby.name || 'your baby'} better
        </h1>
        <p className="text-steel text-sm mb-8">
          The more you share, the more personalized our guidance becomes.
        </p>

        <div className="flex flex-col gap-7">

          {/* Feeding — MULTI SELECT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="section-title">Feeding Method</label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mist-light text-steel">Select all that apply</span>
            </div>
            <ChipGroup
              options={FEEDING_OPTIONS}
              selected={feedingMethods}
              isObject
              multi
              onToggle={toggleFeedingMethod}
            />
            {feedingMethods.length > 1 && (
              <p className="text-xs text-steel mt-2">✓ {feedingMethods.length} methods selected</p>
            )}
          </div>

          {/* Sensitivities */}
          <div>
            <label className="section-title block mb-3">Medical Sensitivities</label>
            <ChipGroup
              options={SENSITIVITIES}
              selected={baby.sensitivities}
              onToggle={v => toggleArray('sensitivities', v)}
            />
          </div>

          {/* Soothing */}
          <div>
            <label className="section-title block mb-3">What soothes {baby.name || 'your baby'}?</label>
            <ChipGroup
              options={SOOTHING}
              selected={baby.soothingPrefs}
              onToggle={v => toggleArray('soothingPrefs', v)}
            />
          </div>

          {/* Sensory */}
          <div>
            <label className="section-title block mb-3">Sensory Profile</label>
            <div className="flex flex-col gap-2">
              {[
                { key: 'sensitiveToLight', label: 'Sensitive to light', icon: '💡' },
                { key: 'sensitiveToNoise', label: 'Sensitive to noise', icon: '🔊' },
              ].map(item => (
                <div key={item.key} className="bg-white border border-mist/40 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-midnight">{item.icon} {item.label}</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#4E7A4D] cursor-pointer"
                    checked={baby[item.key] || false}
                    onChange={e => updateBaby({ [item.key]: e.target.checked })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Routine */}
          <div>
            <label className="section-title block mb-3">Parenting Style</label>
            <ChipGroup
              options={ROUTINE}
              selected={baby.routinePreference}
              isObject
              multi={false}
              onToggle={v => updateBaby({ routinePreference: v })}
            />
          </div>
        </div>
      </div>

      <div className="px-7 pb-10 pt-4 flex-shrink-0 flex flex-col gap-2">
        <button onClick={() => navigate('/onboard/3')} className="btn-primary">Continue</button>
        <button onClick={() => navigate('/onboard/3')} className="btn-secondary">Skip for now</button>
      </div>
    </div>
  )
}
