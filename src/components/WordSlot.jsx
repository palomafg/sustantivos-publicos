import { useState, useEffect, useRef } from 'react'

/**
 * Slot de barrio con crossfade suave.
 * - Precarga la imagen entrante antes de mostrarla (evita el parpadeo blanco).
 * - Usa  directo porque estas imágenes siempre están en el viewport.
 */
export function WordSlot({ word, index, seed }) {
  const [current, setCurrent] = useState(word)
  const [next, setNext] = useState(null)
  const [cross, setCross] = useState(false)
  const preloadRef = useRef(null)

  useEffect(() => {
    if (word.id === current?.id) return

    if (preloadRef.current) {
      preloadRef.current.abort?.()
    }

    const controller = new AbortController()
    preloadRef.current = controller

    const img = new Image()
    img.src = word.fotoUrl
    img.onload = () => {
      if (controller.signal.aborted) return
      setNext(word)
      setCross(true)
      const t = setTimeout(() => {
        setCurrent(word)
        setNext(null)
        setCross(false)
      }, 400)
      return () => clearTimeout(t)
    }
    const fallback = setTimeout(() => {
      if (controller.signal.aborted) return
      setNext(word)
      setCross(true)
      const t = setTimeout(() => {
        setCurrent(word)
        setNext(null)
        setCross(false)
      }, 400)
      return () => clearTimeout(t)
    }, 2000)

    return () => {
      controller.abort()
      clearTimeout(fallback)
    }
  }, [word, current?.id])

  const pulseDuration = 3 + (seed % 6)
  const pulseDelay = index * 0.4

  return (
    <div
      className="absolute select-none group"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        opacity: 0.05,
        animation: 'opacity-pulse ease-in-out infinite',
        animationDuration: `${pulseDuration}s`,
        animationDelay: `${pulseDelay}s`,
      }}
    >
      {/* Imagen actual (sale durante el crossfade) */}
      {current && (
        <div
          className="w-full h-full object-contain"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: cross ? 0 : 1,
            transition: 'opacity 400ms ease',
          }}
        >
          <img
            src={current.fotoUrl}
            alt={current.sustantivo}
            className="w-full h-full object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      {/* Imagen siguiente (entra durante el crossfade, ya precargada) */}
      {next && cross && (
        <div
          className="w-full h-full object-contain"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 1,
            transition: 'opacity 400ms ease',
          }}
        >
          <img
            src={next.fotoUrl}
            alt={next.sustantivo}
            className="w-full h-full object-contain"
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </div>
  )
}
