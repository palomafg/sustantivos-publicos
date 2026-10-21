export function Home({ words }) {
  const items = words.map((word, index) => {
    const seed = word.id.charCodeAt(0) + word.id.charCodeAt(word.id.length - 1)

    // Contenedor que ocupa el 100% del ancho y alto del navegador
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
      animationDuration: `${1 + (seed % 10)}s`, // entre 1s y 10s
      animationDelay: `${(seed % 10) * 0.4}s`, // retraso distinto por imagen
    }

    return {
      ...word,
      style: style,
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
            window.location.href = '/sustantivos-publicos/archivo'
          }}
        >
          <img
            src={word.fotoUrl}
            alt={word.sustantivo}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,sans-serif" font-size="36" fill="#999">' + word.sustantivo + '</text></svg>'
            }}
          />
        </div>
      ))}
    </div>
  )
}
