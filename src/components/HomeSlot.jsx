import { useState, useEffect, useRef } from 'react'

/**
 * Slot de fondo de la Home con animación idéntica al WordCloud de /ubicacion.
 * - Contenedor con opacity: 0.05 y opacity-pulse (igual que /ubicacion).
 * - Imagenes superpuestas con object-cover a pantalla completa.
 * - Precarga la imagen entrante antes del crossfade.
 * - Crossfade solapado: la siguiente sube de 0 a 1 mientras la actual baja de 1 a 0.
 */
export function HomeSlot({ slotId, word }) {
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
      }, 500)
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
      }, 500)
      return () => clearTimeout(t)
    }, 2500)

    return () => {
      controller.abort()
      clearTimeout(fallback)
    }
  }, [word, current?.id])

  const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
  const pulseDuration = 3 + (seed % 6)
  const pulseDelay = slotId * 0.4

  // Estilo idéntico al contenedor de WordSlot en /ubicacion
  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    opacity: 0.05,
    animation: 'opacity-pulse ease-in-out infinite',
    animationDuration: `${pulseDuration}s`,
    animationDelay: `${pulseDelay}s`,
  }

  return (
    <div
      className="word-item absolute select-none group cursor-pointer"
      style={containerStyle}
    >
      {/* Imagen actual (sale durante el crossfade) */}
      {current && (
        <div
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: cross ? 0 : 1,
            transition: 'opacity 500ms ease',
          }}
        >
          <img
            src={current.fotoUrl}
            alt={current.sustantivo}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      {/* Imagen siguiente (entra durante el crossfade, ya precargada) */}
      {next && cross && (
        <div
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 1,
            transition: 'opacity 500ms ease',
          }}
        >
          <img
            src={next.fotoUrl}
            alt={next.sustantivo}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </div>
  )
}
