import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WordItem } from './WordItem'
import { LazyImage } from './LazyImage'

const STORAGE_KEY = 'sustantivos-orden-todos'

export function WordCloud({ words, criterion, onSelect }) {
  const navigate = useNavigate()

  // Orden aleatorio persistente para la grilla de "Todos"
  // Se genera una sola vez (primera visita) y se guarda en localStorage del navegador
  const [savedOrder, setSavedOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Construir array de palabras ordenado según el orden persistente
  const orderedWords = useMemo(() => {
    const order = savedOrder || [...words].sort(() => Math.random() - 0.5).map((w) => w.id)
    if (!savedOrder) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
      } catch {
        // Ignorar errores de localStorage
      }
      setSavedOrder(order)
    }
    const wordById = new Map(words.map((w) => [w.id, w]))
    return order.map((id) => wordById.get(id)).filter(Boolean)
  }, [words, savedOrder])

  const isGrid = criterion === 'todos'
  const isBarrio = criterion === 'barrio'

  // Agrupar por barrio para el criterio "Ubicacion"
  const palabrasPorBarrio = useMemo(() => {
    const grouped = {}
    words.forEach((w) => {
      if (!grouped[w.barrio]) {
        grouped[w.barrio] = []
      }
      grouped[w.barrio].push(w)
    })
    return grouped
  }, [words])

  return (
    <div
      className="relative w-full select-none bg-gray-50/50 border border-gray-100"
      style={{
        minHeight: '75vh',
        position: 'relative',
        overflowX: 'hidden',
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {isGrid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1 p-1 w-full">
          {orderedWords.map((word) => (
            <WordItem
              key={word.id}
              word={word}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              className='word-item relative select-none group cursor-pointer opacity-pulse'
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : isBarrio ? (
        <div className="p-0 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 w-full">
            {Object.entries(palabrasPorBarrio).map(([barrio, barrioWords]) => (
              <div
                key={barrio}
                className="relative w-full overflow-visible cursor-pointer my-2 sm:my-3"
                onClick={() => navigate(`/ubicacion/${barrio.toLowerCase()}`)}
              >
                <div className="relative w-full h-[120px] sm:h-[160px] flex items-center justify-center overflow-hidden bg-white">
                  {barrioWords.map((word, index) => {
                    const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
                    const pulseDuration = 3 + (seed % 6)
                    const pulseDelay = index * 0.4

                    return (
                      <div
                        key={word.id}
                        className="absolute select-none group opacity-pulse"
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
                        <LazyImage
                          src={word.fotoUrl}
                          alt={word.sustantivo}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="mt-1 sm:mt-1 flex justify-center">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] text-gray-700 leading-none">
                    {barrio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {orderedWords.map((word, index) => {
            const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
            const expTop = 60 + (seed * 37) % 70
            const expLeft = 20 + (seed * 53) % 70
            const expRotate = -15 + (seed * 29) % 30
            const expWidth = 25 + (seed % 7) * 8

            const style = {
              top: `${expTop}%`,
              left: `${expLeft}%`,
              transform: `rotate(${expRotate}deg)`,
              opacity: 0.95,
              width: `${expWidth}%`,
              transition: 'none',
              willChange: 'auto',
            }

            return (
              <WordItem
                key={word.id}
                word={word}
                style={style}
                className='word-item absolute select-none group cursor-pointer'
              />
            )
          })}
        </>
      )}
      {!isGrid && !isBarrio && (
        <div className="absolute bottom-4 sm:bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-xs sm:text-sm text-gray-400">
            Hacé clic en cualquier imagen para ver sus datos
          </p>
        </div>
      )}
    </div>
  )
}
