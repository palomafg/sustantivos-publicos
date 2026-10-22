import { useNavigate } from 'react-router-dom'
import { LazyImage } from './LazyImage'

export function WordItem({ word, style, className }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/palabra/${word.id}`)
  }

  return (
    <div
      className={className || 'word-item relative select-none group cursor-pointer'}
      style={style}
      onClick={handleClick}
    >
      <LazyImage
        src={word.fotoUrl}
        alt={word.sustantivo}
        className="w-full h-auto rounded object-contain group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,sans-serif" font-size="36" fill="#999">' + word.sustantivo + '</text></svg>'
        }}
      />
    </div>
  )
}
