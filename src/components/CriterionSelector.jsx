import { useNavigate } from 'react-router-dom'

const criterioARuta = {
  todos: '/todos',
  barrio: '/ubicacion',
  alfabeto: '/a-z',
  visual: '/aspecto',
}

export function CriterionSelector({ current, onChange }) {
  const navigate = useNavigate()

  const criteria = [
    { value: 'todos', label: 'Todos' },
    { value: 'barrio', label: 'Ubicacion' },
    { value: 'alfabeto', label: 'A-Z' },
    { value: 'visual', label: 'Aspecto' },
  ]

  const handleChange = (value) => {
    navigate(criterioARuta[value])
    if (onChange) onChange(value)
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {criteria.map((c) => (
        <button
          key={c.value}
          onClick={() => handleChange(c.value)}
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
