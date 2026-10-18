import { useState } from 'react'
import { useNavigate } from 'react'

export function UploadForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    sustantivo: '',
    barrio: '',
    nuevoBarrio: '',
    categoriaVisual: '',
    nombre: '',
    email: '',
  })
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [barrios, setBarrios] = useState(['Palermo', 'Centro', 'Villa Crespo', 'Villa Pueyrredón'])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      alert('Tu aporte quedó registrado y está pendiente de aprobación.')
      navigate('/')
    }, 1000)
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setPreview(URL.createObjectURL(f))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Volver al archivo
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-md sm:max-w-xl mx-auto py-6 sm:py-10 px-3 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 sm:p-12">
          <div className="mb-4 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Cargar palabra</h2>
            <p className="text-gray-600 text-sm">
              Fotografíá una palabra de la calle y completa el formulario.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Sustantivo
              </label>
              <input
                type="text"
                value={form.sustantivo}
                onChange={(e) => setForm({ ...form, sustantivo: e.target.value })}
                placeholder="Ej: casa"
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Barrio
              </label>
              <select
                value={form.barrio}
                onChange={(e) => setForm({ ...form, barrio: e.target.value, nuevoBarrio: '' })}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
              >
                <option value="">Seleccionar barrio</option>
                {barrios.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="otro">Otro barrio</option>
              </select>
              {form.barrio === 'otro' && (
                <input
                  type="text"
                  value={form.nuevoBarrio}
                  onChange={(e) => setForm({ ...form, nuevoBarrio: e.target.value })}
                  placeholder="Nombre del nuevo barrio"
                  className="mt-2 sm:mt-3 w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Categoría visual (opcional)
              </label>
              <input
                type="text"
                value={form.categoriaVisual}
                onChange={(e) => setForm({ ...form, categoriaVisual: e.target.value })}
                placeholder="Ej: luminoso, stencil, manuscrito..."
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Foto de la palabra
              </label>
              <div className="flex flex-col gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('foto-input').click()}
                  className="flex items-center justify-center gap-1 sm:gap-2 border border-dashed border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-4 text-sm text-gray-600 hover:border-black hover:text-black transition-colors"
                >
                  Seleccionar foto
                </button>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Tu nombre (público)
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Paloma González"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium py-3 sm:py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {submitting ? 'Enviando…' : 'Enviar aporte'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
