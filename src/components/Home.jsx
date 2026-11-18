import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeSlot } from './HomeSlot'

const ROTATION_MS = 5000
const HINT_DELAY_MS = 2000

const SLOT_COUNT = 20

export function Home({ words }) {
  const navigate = useNavigate()
  const [showHint, setShowHint] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const hintRef = useRef(null)

  // Slots fijos: cada uno mantiene una palabra de fondo.
  // Cada 5s se reemplaza solo UNA palabra de un slot al azar (no las 20 de golpe).
  const [slotWords, setSlotWords] = useState([])

  useEffect(() => {
    const initial = []
    for (let i = 0; i < SLOT_COUNT; i++) {
      const w = words[Math.floor(Math.random() * words.length)]
      initial.push({ slotId: i, word: w })
    }
    setSlotWords(initial)

    const interval = setInterval(() => {
      setSlotWords((prev) => {
        const next = [...prev]
        const slotIdx = Math.floor(Math.random() * SLOT_COUNT)
        const available = words.filter((w) => w.id !== next[slotIdx].word.id)
        if (available.length === 0) return next
        const newWord = available[Math.floor(Math.random() * available.length)]
        next[slotIdx] = { slotId: slotIdx, word: newWord }
        return next
      })
    }, ROTATION_MS)

    return () => clearInterval(interval)
  }, [words])

  // Muestra el hint editorial tras 2 segundos de inactividad
  useEffect(() => {
    if (interacted) return
    const timer = setTimeout(() => setShowHint(true), HINT_DELAY_MS)
    return () => clearTimeout(timer)
  }, [interacted])

  // Animación de entrada: opacidad de 0 a 1 en 1.5s
  useEffect(() => {
    if (!showHint || !hintRef.current) return
    hintRef.current.style.opacity = '0'
    hintRef.current.style.transition = 'opacity 1.5s ease-in-out'
    hintRef.current.getBoundingClientRect() // forzar reflow
    hintRef.current.style.opacity = '1'
  }, [showHint])

  const handleEnter = () => {
    setInteracted(true)
    setShowHint(false)
    navigate('/todos')
  }

  return (
    <div
      className="relative w-full h-screen select-none bg-white overflow-hidden"
      onClick={handleEnter}
    >
      {slotWords.map(({ slotId, word }) => (
        <HomeSlot
          key={`home-slot-${slotId}`}
          slotId={slotId}
          word={word}
        />
      ))}

      {showHint && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            ref={hintRef}
            role="button"
            tabIndex={0}
            onClick={handleEnter}
            onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
            className="bg-black/60 backdrop-blur px-6 sm:px-8 py-2 sm:py-3 rounded"
          >
            <span
              className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] text-white leading-none"
            >
              Ver el archivo completo
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
