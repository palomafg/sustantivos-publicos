import { WordItem } from './WordItem'

export function WordCloud({ words, criterion, onSelect }) {
  // Orden random para la grilla
  const shuffled = [...words].sort(() => Math.random() - 0.5)

  const isGrid = criterion === 'todos'

  return (
    <div
      className="relative w-full select-none bg-gray-50/50 border border-gray-100"
      style={{
        minHeight: '60vh sm:75vh',
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
              className='word-item relative select-none group cursor-pointer'
            />
          ))}
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
      {!isGrid && (
        <div className="absolute bottom-4 sm:bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-xs sm:text-sm text-gray-400">
            Hacé clic en cualquier imagen para ver sus datos
          </p>
        </div>
      )}
    </div>
  )
}
