import { useApp } from '../context/AppContext'
import { useEffect, useState } from 'react'

export default function PhoneShell({ children }) {
  const { state } = useApp()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // On real mobile — fullscreen, no shell
  if (isMobile) {
    return (
      <div className={`
        w-full min-h-screen
        transition-colors duration-500
        ${state.sleepZoneActive ? 'bg-[#0D1117]' : 'bg-cream'}
      `}>
        {children}
      </div>
    )
  }

  // On desktop — scale shell to fit screen height
  return (
    <div className="min-h-screen bg-[#0F1822] flex items-center justify-center p-4">
      <div
        style={{
          width: '390px',
          height: 'min(844px, calc(100vh - 32px))',
        }}
        className={`
          relative rounded-[54px] overflow-hidden
          shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_0_12px_#1A2535,0_0_0_13px_rgba(255,255,255,0.06),0_40px_120px_rgba(0,0,0,0.7)]
          transition-colors duration-500
          ${state.sleepZoneActive ? 'bg-[#0D1117]' : 'bg-cream'}
        `}
      >
        {/* Dynamic Island */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-[#0F1822] rounded-[20px] z-50" />

        {/* Screen content */}
        <div className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
