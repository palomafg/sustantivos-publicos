import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WordItem } from './WordItem'
import { WordSlot } from './WordSlot'

const STORAGE_KEY = 'sustantivos-orden-todos'

export function WordCloud({ words, criterion, onSelect }) {
  const navigate = useNavigate()

  // Orden aleatorio persistente para la grilla de "Todos"
  const [savedOrder, setSavedOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

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
  const isLetra = criterion === 'alfabeto'
  const isVisual = criterion === 'visual'

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

  const wordById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words])

  // Agrupar por letra inicial para el criterio "A-Z"
  const palabrasPorLetra = useMemo(() => {
    const grouped = {}
    words.forEach((w) => {
      const letra = w.sustantivo.charAt(0).toUpperCase()
      if (!grouped[letra]) {
        grouped[letra] = []
      }
      grouped[letra].push(w)
    })
    return grouped
  }, [words])

  // Agrupar por categoria visual para el criterio "Aspecto"
  const palabrasPorCategoria = useMemo(() => {
    const grouped = {}
    words.forEach((w) => {
      const cat = w.categoriaVisual || 'Sin categoría'
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push(w)
    })
    return grouped
  }, [words])

  // Slots fijos por barrio: 15 palabras por barrio.
  // Cada 5s se reemplaza solo UNA palabra por barrio (rotación sutil, como en Home).
  const [slotWords, setSlotWords] = useState({})

  useEffect(() => {
    if (!isBarrio) return

    // Inicializar: 15 palabras al azar por barrio
    const initial = {}
    Object.entries(palabrasPorBarrio).forEach(([barrio, barrioWords]) => {
      const shuffled = [...barrioWords].sort(() => Math.random() - 0.5)
      initial[barrio] = shuffled.slice(0, 15).map((w) => w.id)
    })
    setSlotWords(initial)

    const interval = setInterval(() => {
      setSlotWords((prev) => {
        const next = { ...prev }
        Object.entries(palabrasPorBarrio).forEach(([barrio, barrioWords]) => {
          const currentIds = prev[barrio] || []
          const available = barrioWords.filter((w) => !currentIds.includes(w.id))
          if (available.length === 0) return

          const newIds = [...currentIds]
          const pos = Math.floor(Math.random() * newIds.length)
          const newWord = available[Math.floor(Math.random() * available.length)]
          newIds[pos] = newWord.id
          next[barrio] = newIds
        })
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isBarrio, palabrasPorBarrio])

  // Slots fijos por letra: 15 palabras por letra.
  // Cada 5s se reemplaza solo UNA palabra por letra (rotación sutil, como en Home).
  const [slotWordsLetra, setSlotWordsLetra] = useState({})

  useEffect(() => {
    if (!isLetra) return

    // Inicializar: 15 palabras al azar por letra
    const initial = {}
    Object.entries(palabrasPorLetra).forEach(([letra, letraWords]) => {
      const shuffled = [...letraWords].sort(() => Math.random() - 0.5)
      initial[letra] = shuffled.slice(0, 15).map((w) => w.id)
    })
    setSlotWordsLetra(initial)

    const interval = setInterval(() => {
      setSlotWordsLetra((prev) => {
        const next = { ...prev }
        Object.entries(palabrasPorLetra).forEach(([letra, letraWords]) => {
          const currentIds = prev[letra] || []
          const available = letraWords.filter((w) => !currentIds.includes(w.id))
          if (available.length === 0) return

          const newIds = [...currentIds]
          const pos = Math.floor(Math.random() * newIds.length)
          const newWord = available[Math.floor(Math.random() * available.length)]
          newIds[pos] = newWord.id
          next[letra] = newIds
        })
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isLetra, palabrasPorLetra])

  // Slots fijos por categoria visual: 15 palabras por categoria.
  // Cada 5s se reemplaza solo UNA palabra por categoria (rotación sutil, como en Home).
  const [slotWordsVisual, setSlotWordsVisual] = useState({})

  useEffect(() => {
    if (!isVisual) return

    // Inicializar: 15 palabras al azar por categoria
    const initial = {}
    Object.entries(palabrasPorCategoria).forEach(([categoria, categoriaWords]) => {
      const shuffled = [...categoriaWords].sort(() => Math.random() - 0.5)
      initial[categoria] = shuffled.slice(0, 15).map((w) => w.id)
    })
    setSlotWordsVisual(initial)

    const interval = setInterval(() => {
      setSlotWordsVisual((prev) => {
        const next = { ...prev }
        Object.entries(palabrasPorCategoria).forEach(([categoria, categoriaWords]) => {
          const currentIds = prev[categoria] || []
          const available = categoriaWords.filter((w) => !currentIds.includes(w.id))
          if (available.length === 0) return

          const newIds = [...currentIds]
          const pos = Math.floor(Math.random() * newIds.length)
          const newWord = available[Math.floor(Math.random() * available.length)]
          newIds[pos] = newWord.id
          next[categoria] = newIds
        })
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isVisual, palabrasPorCategoria])

  return (
    <div
      className="relative w-full select-none bg-gray-50/50"
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
            {Object.entries(palabrasPorBarrio).map(([barrio, barrioWords]) => {
              const visibleIds = slotWords[barrio] || barrioWords.slice(0, 15).map((w) => w.id)
              const visibleWords = visibleIds.map((id) => wordById.get(id)).filter(Boolean)

              return (
                <div
                  key={`barrio-${barrio}`}
                  className="relative w-full overflow-visible cursor-pointer my-2 sm:my-3"
                  onClick={() => {
                    sessionStorage.setItem('returnScrollY', window.scrollY.toString())
                    navigate(`/ubicacion/${barrio.toLowerCase()}`)
                  }}
                >
                  <div className="relative w-full h-[120px] sm:h-[160px] flex items-center justify-center overflow-hidden bg-white">
                    {visibleWords.map((word, index) => {
                      const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
                      return (
                        <WordSlot
                          key={`slot-${barrio}-${index}`}
                          word={word}
                          index={index}
                          seed={seed}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-1 sm:mt-1 flex justify-center">
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] text-gray-700 leading-none no-underline">
                      {barrio}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : isLetra ? (
        <div className="p-0 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 w-full">
            {Object.entries(palabrasPorLetra).map(([letra, letraWords]) => {
              const visibleIds = slotWordsLetra[letra] || letraWords.slice(0, 15).map((w) => w.id)
              const visibleWords = visibleIds.map((id) => wordById.get(id)).filter(Boolean)

              return (
                <div
                  key={`letra-${letra}`}
                  className="relative w-full overflow-visible cursor-pointer my-2 sm:my-3"
                  onClick={() => {
                    sessionStorage.setItem('returnScrollY', window.scrollY.toString())
                    navigate(`/a-z/${letra.toLowerCase()}`)
                  }}
                >
                  <div className="relative w-full h-[120px] sm:h-[160px] flex items-center justify-center overflow-hidden bg-white">
                    {visibleWords.map((word, index) => {
                      const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
                      return (
                        <WordSlot
                          key={`slot-${letra}-${index}`}
                          word={word}
                          index={index}
                          seed={seed}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-1 sm:mt-1 flex justify-center">
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] text-gray-700 leading-none no-underline">
                      {letra}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : isVisual ? (
        <div className="p-0 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 w-full">
            {Object.entries(palabrasPorCategoria).map(([categoria, categoriaWords]) => {
              const visibleIds = slotWordsVisual[categoria] || categoriaWords.slice(0, 15).map((w) => w.id)
              const visibleWords = visibleIds.map((id) => wordById.get(id)).filter(Boolean)

              return (
                <div
                  key={`categoria-${categoria}`}
                  className="relative w-full overflow-visible cursor-pointer my-2 sm:my-3"
                  onClick={() => {
                    sessionStorage.setItem('returnScrollY', window.scrollY.toString())
                    navigate(`/aspecto/${categoria.toLowerCase()}`)
                  }}
                >
                  <div className="relative w-full h-[120px] sm:h-[160px] flex items-center justify-center overflow-hidden bg-white">
                    {visibleWords.map((word, index) => {
                      const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
                      return (
                        <WordSlot
                          key={`slot-${categoria}-${index}`}
                          word={word}
                          index={index}
                          seed={seed}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-1 sm:mt-1 flex justify-center">
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] text-gray-700 leading-none no-underline">
                      {categoria}
                    </span>
                  </div>
                </div>
              )
            })}
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
      {!isGrid && !isBarrio && !isLetra && !isVisual && (
        <div className="absolute bottom-4 sm:bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-xs sm:text-sm text-gray-400">
            Hacé clic en cualquier imagen para ver sus datos
          </p>
        </div>
      )}
    </div>
  )
}
