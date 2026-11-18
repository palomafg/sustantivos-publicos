import { LazyImage } from './LazyImage'
import { useNavigate } from 'react-router-dom'

export function WordDetail({ word, onClose }) {
  const navigate = useNavigate()
  const handleClose = () => {
    // Siempre se usa como modal: solo cierra el detalle sin recargar la página
    onClose?.()
  }

  if (!word?.sustantivo) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col p-4 sm:p-6">
        <button onClick={handleClose} className="mb-4 text-gray-500 hover:text-gray-900">
          ×
        </button>
        <p>Palabra no encontrada</p>
      </div>
    )
  }

  return (
    <>
      {/* Overlay: efecto de modal, la página se ve detrás pero oscurecida */}
      <div
        className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Recuadro del detalle */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-lg sm:max-w-xl md:max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X cerrar a la derecha */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <button onClick={handleClose} className="text-black font-bold text-2xl sm:text-3xl leading-none">
            ×
          </button>
        </div>

        {/* Imagen */}
        <LazyImage
          src={word.fotoUrl}
          alt={word.sustantivo}
          className="w-full h-auto rounded-lg shadow-lg mb-6 sm:mb-8 object-cover"
          style={{ maxHeight: '45vh' }}
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
