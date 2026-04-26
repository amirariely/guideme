import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { chat as chatApi } from '../api/index.js'
import StatusBar from '../components/StatusBar'
import ScreenHeader from '../components/ScreenHeader'
import BottomNav from '../components/BottomNav'

const QUICK_QUESTIONS = [
  'How much should my baby sleep?',
  'Why does baby cry after feeding?',
  'Is it normal to poop 6x a day?',
  'How do I build a sleep routine?',
]

const INITIAL_MESSAGES = [
  {
    id: 0,
    role: 'assistant',
    content: "Hi! I'm GuideMe's parenting advisor. Ask me anything about your baby, sleep, feeding, development, or family life — I'm here 24/7 with science-backed answers. 🌿",
  },
]

export default function Chat() {
  const { state } = useApp()
  const { baby, sleepZoneActive } = state
  const isDark = sleepZoneActive

  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const bg       = isDark ? 'bg-[#0D1117]'               : 'bg-cream'
  const textPri  = isDark ? 'text-white'                  : 'text-midnight'
  const textSec  = isDark ? 'text-white/50'               : 'text-steel'
  const inputBg  = isDark ? 'bg-white/10 border-white/10' : 'bg-white border-mist/40'
  const bubbleAI = isDark ? 'bg-white/10 text-white'      : 'bg-white text-midnight border border-mist/30'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim()
    if (!userMsg || loading) return

    setInput('')
    setError(null)

    const userEntry = { id: Date.now(), role: 'user', content: userMsg }
    const updatedMessages = [...messages, userEntry]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Send conversation history (skip the initial greeting)
      const historyToSend = updatedMessages
        .filter(m => m.id !== 0)
        .map(m => ({ role: m.role, content: m.content }))

      // Call backend — which calls Claude API server-side
      const reply = await chatApi.send(historyToSend)
      setMessages(prev => [...prev, {
        id:      reply.id || Date.now() + 1,
        role:    'assistant',
        content: reply.content,
      }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={`flex flex-col min-h-screen ${bg} transition-colors duration-500`}>
      <StatusBar light={isDark} />
      <ScreenHeader title="Ask GuideMe" subtitle="Science-backed answers, 24/7" />

      <div className="flex gap-2 px-5 overflow-x-auto phone-scroll pb-4 flex-shrink-0">
        {QUICK_QUESTIONS.map(q => (
          <button key={q} onClick={() => sendMessage(q)} disabled={loading}
            className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-medium active:scale-95 transition-transform disabled:opacity-40 ${
              isDark ? 'bg-white/5 border-white/10 text-white/70' : 'bg-white border-mist/40 text-steel'
            }`}>{q}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-5 flex flex-col gap-3 pb-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🌿</div>
            )}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-sage-dark text-white rounded-br-sm' : `${bubbleAI} rounded-bl-sm`
            }`}>{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-sm mr-2 flex-shrink-0">🌿</div>
            <div className={`rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 ${bubbleAI}`}>
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-sage" style={{ animation: 'wave-bar 1s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mx-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
            <p className="text-red-500 text-xs">⚠️ {error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-5 pb-3 pt-2 flex-shrink-0">
        <div className={`flex items-center gap-2 border rounded-2xl px-4 py-2 ${inputBg}`}>
          <input ref={inputRef}
            className={`flex-1 bg-transparent font-sans text-sm outline-none placeholder:text-mist ${textPri}`}
            placeholder={`Ask about ${baby.name || 'your baby'}…`}
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="w-8 h-8 bg-sage-dark rounded-xl flex items-center justify-center text-white text-sm disabled:opacity-40 active:scale-90 transition-transform">↑</button>
        </div>
        <p className={`text-center text-[10px] mt-2 ${textSec}`}>Not medical advice · Consult your pediatrician for urgent concerns</p>
      </div>

      <BottomNav />
    </div>
  )
}
