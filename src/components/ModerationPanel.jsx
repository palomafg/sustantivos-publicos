import { useNavigate } from 'react-router-dom'

export function ModerationPanel() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => navigate('/archivo')}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Volver al archivo
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-3 sm:p-6 max-w-xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Panel de moderación</h2>
        <p className="text-gray-600 text-sm mb-6">Aquí revisarás los envíos pendientes.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
          <p className="text-gray-500 text-sm">Esta sección se conectará al backend en la próxima etapa.</p>
        </div>
      </main>
    </div>
  )
}
