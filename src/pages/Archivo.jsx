import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { CriterionSelector } from '../components/CriterionSelector'
import { WordCloud } from '../components/WordCloud'
import { WordDetail } from '../components/WordDetail'
import { mockWords } from '../data/mockWords'

export default function Archivo() {
  const [selectedWordId, setSelectedWordId] = useState(null)
  const [criterion, setCriterion] = useState('todos')

  const approvedWords = mockWords.filter(w => w.aprobado)
  const selectedWord = approvedWords.find(w => w.id === selectedWordId) || null

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <main className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-6 w-full max-w-none">
        <CriterionSelector
          current={criterion}
          onChange={setCriterion}
        />

        <div className="mt-4 sm:mt-8 relative w-full" style={{ minHeight: '60vh sm:75vh', position: 'relative', overflowX: 'hidden' }}>
          {selectedWord ? (
            <WordDetail
              word={selectedWord}
              words={approvedWords}
              onClose={() => setSelectedWordId(null)}
            />
          ) : (
            <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-none">
              <WordCloud
                words={approvedWords}
                criterion={criterion}
                onSelect={setSelectedWordId}
              />
            </div>
          )}
        </div>

        <footer className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 text-gray-500 text-xs sm:text-sm">
          <p>Archivo colectivo de la Ciudad Autónoma de Buenos Aires</p>
          <p className="mt-1 text-[10px] sm:text-xs">Paloma González — 2026</p>
        </footer>
      </main>
    </div>
  )
}
