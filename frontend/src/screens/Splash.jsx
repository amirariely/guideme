import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen h-full bg-midnight text-white">
      <StatusBar light />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
        {/* Logo */}
        <div className="float-in w-20 h-20 bg-gradient-to-br from-sage to-sage-dark rounded-3xl flex items-center justify-center text-4xl shadow-[0_16px_48px_rgba(78,122,77,0.45)]">
          🌿
        </div>

        <div className="float-in float-in-delay-1 text-center">
          <h1 className="font-serif text-[38px] leading-tight">GuideMe</h1>
          <p className="text-white/50 text-sm mt-1">Your ambient parenting companion</p>
        </div>

        <p className="float-in float-in-delay-2 text-white/35 text-xs text-center mt-2 leading-relaxed max-w-[240px]">
          Science-backed guidance for every moment of your parenting journey
        </p>
      </div>

      <div className="float-in float-in-delay-3 px-8 pb-12 flex flex-col gap-3">
        <button
          onClick={() => navigate('/onboard/1')}
          className="btn-primary"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          className="btn-secondary text-white/60"
        >
          I already have an account
        </button>
      </div>
    </div>
  )
}
