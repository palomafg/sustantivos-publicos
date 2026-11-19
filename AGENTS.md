# AGENTS.md — Sustantivos Públicos

## Contexto del proyecto
Plataforma web interactiva y participativa para archivar palabras encontradas en la vía pública (Ciudad Autonoma de Buenos Aires). Archivo colectivo con moderación manual. Diseño mobile-first para difusión por QR en las calles.

## Stack
- Frontend: React + Vite + Tailwind CSS.
- Backend/BD: Supabase (PostgreSQL + Storage + Auth).
- Deploy frontend: Netlify.

## Convenciones
- Código en español para textos de UI; variables/funciones en inglés.
- Commits descriptivos en español.
- No publicar sin aprobación de moderación.

## Optimizaciones móviles aplicadas (sesión de optimización frontend)
El proyecto crasheaba en mobile al cargar `/ubicacion` y la Home por exceso de imágenes en el DOM. Se aplicaron las siguientes correcciones:

1. **Límite de palabras por barrio en `/ubicacion`**: máximo 15 palabras por barrio en la vista de hiper-imagen.
2. **Rotación sutil una a la vez**: cada 5 segundos se reemplaza solo una palabra por barrio (o por slot en Home), no todas a la vez.
3. **Slots fijos**: los componentes mantienen clave estable (`slot-${barrio}-${index}` o `home-slot-${id}`) para que React no desmonte/remonte los `LazyImage` ni cause salto a blanco.
4. **Crossfade suave**: al cambiar una palabra, la actual hace fade-out mientras la entrante hace fade-in (500ms).
5. **Precarga de imagen**: antes del crossfade se descarga la imagen entrante con `new Image()` para evitar parpadeo blanco.
6. **`LazyImage.jsx`**: nunca deja el `src` en `undefined`; siempre expone la URL y usa `loading="lazy"` nativo.
7. **Quitar subrayado de nombres de barrio**: clase `no-underline` en los spans de barrio en `WordCloud.jsx`.

## Archivos clave
- `src/` — componentes React.
- `src/components/WordSlot.jsx` — slot con crossfade para vista de barrio (`/ubicacion`).
- `src/components/HomeSlot.jsx` — slot con crossfade para la Home (`/`).
- `src/components/LazyImage.jsx` — imagen lazy que nunca deja src en undefined.
- `plan.md` — plan de desarrollo.

## Decisiones de sesión — WordDetail como modal sobre la misma página
- **WordDetail solo como modal**: se eliminó la ruta `/palabra/:id` y su uso como página independiente. `WordDetail` siempre se abre como superposición sobre la misma vista (`Archivo` o `BarrioView`), sin recargar ni cambiar la URL. Al cerrar, solo se pone `selectedWordId = null`.
- **Eliminado fallback de navegación**: se quitó `useParams`, `useNavigate` y `mockWords` de `WordDetail.jsx`. También se eliminó el `navigate('/palabra/${word.id}')` que quedaba como fallback en `WordItem.jsx` cuando no se pasa `onSelect`.
- **Página base siempre renderizada**: en `Archivo.jsx` y `BarrioView.jsx` se eliminaron los condicionales `{!selectedWord && ...}` alrededor de `Navbar`, `CriterionSelector`, `WordCloud` y `footer`. Todos siguen visibles detrás del modal (atenuados por el overlay oscuro).
- **Overlay del modal**: `bg-black/30 backdrop-blur-sm` con `z-[99]`, sobre el contenido de página base pero debajo del recuadro blanco (`z-[100]`). Hacer clic fuera del recuadro cierra el modal.
- **CriterionSelector flotante**: se mueve dentro de un `<div fixed>` debajo del `Navbar`, con bordes gris claro arriba/abajo (`border-t border-b border-gray-200`), fondo blanco semi-transparente (`bg-white/95 backdrop-blur`) y centrado verticalmente (`items-center`). El `<main>` lleva `pt-32 sm:pt-40` para que el contenido no quede oculto debajo del selector flotante.
- **Espaciado selector ↔ WordCloud**: `mt-0.5 sm:mt-1`.
- **Orden aleatorio persistente para "Todos"**: en `WordCloud.jsx` el orden aleatorio de la grilla "Todos" se genera una sola vez y se guarda en `localStorage` bajo la clave `sustantivos-orden-todos`. Persiste hasta que el usuario borre la memoria del navegador.
- **Rutas profundas en GitHub Pages**: se agregó `docs/404.html` como copia de `docs/index.html` y un script `postbuild` en `package.json` que lo regenera tras cada `npm run build`. Esto permite acceder directo a rutas como `/todos`, `/ubicacion`, `/ubicacion/:barrio`, `/a-z`, `/aspecto` sin error 404.
- **Link "archivo colectivo" en WordDetail**: lleva a la home (`/`).
- **Nuevas rutas del archivo**:
  - `/todos` → Archivo con criterio "Todos"
  - `/ubicacion` → Archivo con criterio "Ubicación"
  - `/ubicacion/:barrio` → Vista de barrio
  - `/a-z` → Archivo con criterio "A-Z"
  - `/aspecto` → Archivo con criterio "Aspecto"
  - `/visitantes` → Archivo con criterio "Visitantes"
  - `*` → redirect a `/todos`
