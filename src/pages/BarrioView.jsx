import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { WordItem } from '../components/WordItem'
import { WordDetail } from '../components/WordDetail'
import { mockWords } from '../data/mockWords'

export default function BarrioView() {
  const { barrio } = useParams()
  const navigate = useNavigate()
  const [selectedWordId, setSelectedWordId] = useState(null)

  const barrioWords = mockWords.filter(
    (w) => w.aprobado && w.barrio.toLowerCase() === barrio.toLowerCase()
  )
  const selectedWord = barrioWords.find((w) => w.id === selectedWordId) || null

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <main className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-6 w-full max-w-none">
        {/* Botón volver arriba izquierda */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/ubicacion')}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>

        {/* Título centrado */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter leading-none text-black uppercase tracking-[0.05em]">
            {barrio}
          </h2>
        </div>

        <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1 p-1 w-full">
            {barrioWords.map((word) => (
              <WordItem
                key={word.id}
                word={word}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                className='word-item relative select-none group cursor-pointer opacity-pulse'
                onSelect={setSelectedWordId}
              />
            ))}
          </div>
        </div>

        {selectedWord && (
          <WordDetail
            word={selectedWord}
            words={barrioWords}
            onClose={() => setSelectedWordId(null)}
          />
        )}

        <footer className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 text-gray-500 text-xs sm:text-sm">
          <p>Archivo colectivo de la Ciudad Autónoma de Buenos Aires</p>
          <p className="mt-1 text-[10px] sm:text-xs">Paloma González — 2026</p>
        </footer>
      </main>
    </div>
  )
}
