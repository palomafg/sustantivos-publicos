import { useState, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { CriterionSelector } from '../components/CriterionSelector'
import { WordDetail } from '../components/WordDetail'
import { WordCloud } from '../components/WordCloud'
import { mockWords } from '../data/mockWords'

export default function Archivo({ initialCriterion = 'todos' }) {
  const [selectedWordId, setSelectedWordId] = useState(null)
  const [criterion, setCriterion] = useState(initialCriterion)

  const approvedWords = mockWords.filter(w => w.aprobado)
  const selectedWord = approvedWords.find(w => w.id === selectedWordId) || null

  // Restaurar scroll guardado al volver desde una vista interna
  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('returnScrollY')
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10))
      sessionStorage.removeItem('returnScrollY')
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <main className="relative pt-32 sm:pt-40 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-6 w-full max-w-none">
        {/* Selector de criterio flotante debajo del Navbar */}
        <div className="fixed top-[66px] sm:top-[74px] left-0 right-0 z-[60] bg-white/95 backdrop-blur border-t border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 justify-center items-center">
          <CriterionSelector
            current={criterion}
            onChange={setCriterion}
          />
        </div>

        <div className="mt-0.5 sm:mt-1 relative w-full" style={{ minHeight: '60vh sm:75vh', position: 'relative', overflowX: 'hidden' }}>
          <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-none">
            <WordCloud
              words={approvedWords}
              criterion={criterion}
              onSelect={setSelectedWordId}
            />
          </div>
          {selectedWord && (
            <WordDetail
              word={selectedWord}
              words={approvedWords}
              onClose={() => setSelectedWordId(null)}
            />
          )}
        </div>

        <footer className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 text-gray-500 text-xs sm:text-sm">
          <p>Archivo colectivo de palabras encontradas en la Ciudad Autónoma de Buenos Aires</p>
          <p className="mt-1 text-[10px] sm:text-xs">Paloma González — 2026</p>
        </footer>
      </main>
    </div>
  )
}
