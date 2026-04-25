import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      <StatusBar />
      <div className="flex-1 flex flex-col px-7 pt-4">
        <button onClick={() => navigate('/')} className="text-steel text-sm mb-8 text-left">← Back</button>
        <h1 className="font-serif text-3xl text-midnight mb-1">Welcome back</h1>
        <p className="text-steel text-sm mb-8">Sign in to continue with GuideMe</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="section-title block mb-2">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="section-title block mb-2">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>
      </div>

      <div className="px-7 pb-10 flex flex-col gap-3">
        <button onClick={handleLogin} disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <button onClick={() => navigate('/onboard/1')} className="btn-secondary">
          Create an account
        </button>
      </div>
    </div>
  )
}
