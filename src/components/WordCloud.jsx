import { useNavigate } from 'react-router-dom'
import { WordItem } from './WordItem'
import { LazyImage } from './LazyImage'

export function WordCloud({ words, criterion, onSelect }) {
  const navigate = useNavigate()

  // Orden random para la grilla de "Todos"
  const shuffled = [...words].sort(() => Math.random() - 0.5)

  const isGrid = criterion === 'todos'
  const isBarrio = criterion === 'barrio'

  // Agrupar por barrio para el criterio "Ubicacion"
  const palabrasPorBarrio = {}
  words.forEach((w) => {
    if (!palabrasPorBarrio[w.barrio]) {
      palabrasPorBarrio[w.barrio] = []
    }
    palabrasPorBarrio[w.barrio].push(w)
  })

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
          {shuffled.map((word) => (
            <WordItem
              key={word.id}
              word={word}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              className='word-item relative select-none group cursor-pointer opacity-pulse'
            />
          ))}
        </div>
      ) : isBarrio ? (
        <div className="p-0 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 w-full">
            {Object.entries(palabrasPorBarrio).map(([barrio, barrioWords]) => (
              <div key={barrio} className="relative w-full min-h-[200px]">
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white">
                  {barrioWords.map((word, index) => {
                    const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)
                    const pulseDuration = 3 + (seed % 6)
                    const pulseDelay = index * 0.4

                    return (
                      <div
                        key={word.id}
                        className="absolute select-none group cursor-pointer opacity-pulse"
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
                        onClick={() => {
                          navigate(`/palabra/${word.id}`)
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
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {shuffled.map((word, index) => {
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
