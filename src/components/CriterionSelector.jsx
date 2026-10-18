import { Link, useLocation } from 'react-router-dom'

export function CriterionSelector({ current, onChange }) {
  const criteria = [
    { value: 'todos', label: 'Todos' },
    { value: 'barrio', label: 'Barrio' },
    { value: 'alfabeto', label: 'Alfabeto' },
    { value: 'visual', label: 'Visual' },
    { value: 'visitantes', label: 'Visitantes' },
  ]

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
      {criteria.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-full border transition-colors ${
            current === c.value
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
