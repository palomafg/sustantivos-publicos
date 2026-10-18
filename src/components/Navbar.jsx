import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { to: '/archivo', label: 'Archivo' },
    { to: '/cargar', label: 'Subir' },
    { to: '/moderar', label: 'Moderar' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 z-50 w-full pt-[10px]">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Título y subtítulo a la izquierda, uno encima del otro */}
          <div className="flex flex-col items-start">
            <Link to="/" className="font-extrabold text-lg sm:text-xl lg:text-xl tracking-tighter leading-none">
              Sustantivos Públicos
            </Link>
            <span className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5">
              Un archivo abierto sobre la información escrita en la vía pública
            </span>
          </div>

          {/* Enlaces de navegación (solo desktop) */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs sm:text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-black'
                    : 'text-gray-500 hover:text-gray-900'
                } py-1 px-2 rounded hover:bg-gray-50`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botón menú móvil */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Abrir menú"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col gap-2 z-40">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium py-2 px-4 rounded ${
                location.pathname === link.to
                  ? 'text-black bg-gray-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
