import { useEffect, useRef, useState } from 'react'

// Reads real microphone amplitude via Web Audio API
// Each bar reflects actual frequency band energy from the mic
export default function MicWaveform() {
  const [bars, setBars] = useState(Array(14).fill(4))
  const animRef     = useRef(null)
  const analyserRef = useRef(null)
  const streamRef   = useRef(null)

  useEffect(() => {
    let audioCtx, analyser, source, dataArray

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        audioCtx  = new (window.AudioContext || window.webkitAudioContext)()
        analyser  = audioCtx.createAnalyser()
        analyser.fftSize = 64  // 32 frequency bins — plenty for 14 bars
        analyserRef.current = analyser
        source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
        dataArray = new Uint8Array(analyser.frequencyBinCount)

        const draw = () => {
          analyser.getByteFrequencyData(dataArray)
          // Map 32 bins → 14 bars, normalize to 4–100% height
          const step = Math.floor(dataArray.length / 14)
          const newBars = Array.from({ length: 14 }, (_, i) => {
            const val = dataArray[i * step] || 0
            return Math.max(4, Math.round((val / 255) * 100))
          })
          setBars(newBars)
          animRef.current = requestAnimationFrame(draw)
        }
        draw()
      } catch (e) {
        // Mic not available — fall back to gentle idle animation
        let t = 0
        const idle = () => {
          t += 0.06
          const idleBars = Array.from({ length: 14 }, (_, i) =>
            Math.max(4, Math.round(10 + 8 * Math.sin(t + i * 0.5)))
          )
          setBars(idleBars)
          animRef.current = requestAnimationFrame(idle)
        }
        idle()
      }
    }

    start()

    return () => {
      cancelAnimationFrame(animRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (audioCtx) audioCtx.close()
    }
  }, [])

  return (
    <div className="flex items-end gap-[3px] h-8 mt-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-sage/60 rounded-full transition-all duration-75"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}
