import { useParams, useNavigate } from 'react-router-dom'
import { mockWords } from '../data/mockWords'

export function WordDetail({ word: wordProp, onClose, words: wordsProp }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const word = wordProp || mockWords.find(w => w.id === id) || { id }
  const words = wordsProp || mockWords

  const handleClose = () => {
    if (onClose) onClose()
    navigate('/archivo')
  }

  if (!word.sustantivo) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col p-4 sm:p-6">
        <button onClick={handleClose} className="mb-4 text-gray-500 hover:text-gray-900">
          ×
        </button>
        <p>Palabra no encontrada</p>
      </div>
    )
  }

  return (
    <>
      {/* Fondo: grilla de todas las palabras con opacidad 15% */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-0 p-0 w-full h-full overflow-hidden opacity-15">
          {[...words].sort(() => Math.random() - 0.5).map((w) => (
            <img
              key={w.id}
              src={w.fotoUrl}
              alt={w.sustantivo}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>

      {/* Recuadro del detalle */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg sm:max-w-xl md:max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X cerrar a la derecha */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <button onClick={handleClose} className="text-black font-bold text-2xl sm:text-3xl leading-none">
            ×
          </button>
        </div>

        {/* Imagen */}
        <img
          src={word.fotoUrl}
          alt={word.sustantivo}
          className="w-full h-auto rounded-lg shadow-lg mb-6 sm:mb-8 object-cover"
          style={{ maxHeight: '45vh' }}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,sans-serif" font-size="32" fill="#999">Imagen no disponible</text></svg>'
          }}
        />

        {/* Título */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-none mb-4 sm:mb-6 text-black italic">
          {word.sustantivo}
        </h2>

        {/* Datos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm mb-6 sm:mb-8">
          <div className="border-l-2 border-gray-300 pl-3 sm:pl-4">
            <span className="block text-[10px] sm:text-xs uppercase text-gray-400 font-semibold tracking-wider">Barrio</span>
            {word.barrio}
          </div>
          <div className="border-l-2 border-gray-300 pl-3 sm:pl-4">
            <span className="block text-[10px] sm:text-xs uppercase text-gray-400 font-semibold tracking-wider">Categoria visual</span>
            {word.categoriaVisual || '—'}
          </div>
          <div className="border-l-2 border-gray-300 pl-3 sm:pl-4">
            <span className="block text-[10px] sm:text-xs uppercase text-gray-400 font-semibold tracking-wider">Registrado por</span>
            {word.nombreQuienSube}
          </div>
        </div>

        {/* Footer con link al archivo colectivo */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm">
            Esta palabra forma parte del <span className="text-black underline underline-offset-2 hover:no-underline cursor-pointer" onClick={() => navigate('/')}>archivo colectivo</span>.
          </p>
        </div>
      </div>
    </>
  )
}
