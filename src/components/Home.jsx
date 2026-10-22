import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LazyImage } from './LazyImage'

const BACKGROUND_COUNT = 20
const ROTATION_MS = 5000

export function Home({ words }) {
  const navigate = useNavigate()
  const [visibleWords, setVisibleWords] = useState([])

  useEffect(() => {
    const pickRandom = () => {
      const shuffled = [...words].sort(() => Math.random() - 0.5)
      setVisibleWords(shuffled.slice(0, BACKGROUND_COUNT))
    }
    pickRandom()
    const interval = setInterval(pickRandom, ROTATION_MS)
    return () => clearInterval(interval)
  }, [words])

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
    <div className="relative w-full h-screen select-none bg-white overflow-hidden">
      {items.map((word) => (
        <div
          key={word.id}
          className={word.className}
          style={word.style}
          onClick={() => {
            navigate('/archivo')
          }}
        >
          <LazyImage
            src={word.fotoUrl}
            alt={word.sustantivo}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}
    </div>
  )
}
