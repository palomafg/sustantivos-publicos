import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LazyImage } from './LazyImage'

const BACKGROUND_COUNT = 20
const ROTATION_MS = 5000
const HINT_DELAY_MS = 2000

export function Home({ words }) {
  const navigate = useNavigate()
  const [visibleWords, setVisibleWords] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const hintRef = useRef(null)

  useEffect(() => {
    const pickRandom = () => {
      const shuffled = [...words].sort(() => Math.random() - 0.5)
      setVisibleWords(shuffled.slice(0, BACKGROUND_COUNT))
    }
    pickRandom()
    const interval = setInterval(pickRandom, ROTATION_MS)
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

  const items = visibleWords.map((word, index) => {
    const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      maxHeight: 'none',
      opacity: 0.05,
      animation: 'opacity-pulse ease-in-out infinite',
      animationDuration: `${1 + (seed % 10)}s`,
      animationDelay: `${(seed % 10) * 0.4}s`,
    }
    return {
      ...word,
      style,
      className: 'word-item absolute select-none group cursor-pointer opacity-pulse',
    }
  })

  return (
    <div
      className="relative w-full h-screen select-none bg-white overflow-hidden"
      onClick={handleEnter}
    >
      {items.map((word) => (
        <div
          key={word.id}
          className={word.className}
          style={word.style}
        >
          <LazyImage
            src={word.fotoUrl}
            alt={word.sustantivo}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
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
