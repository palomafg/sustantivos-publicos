# Plan de Desarrollo — Sustantivos Públicos

## 1. Descripción de la solución
Plataforma web interactiva y participativa que convierte un archivo personal de palabras encontradas en la vía pública en un archivo colectivo. Permite a cualquier persona fotografiar y subir palabras halladas en el espacio público, moderadas antes de publicarse, y explorar el archivo mediante visualizaciones de "hiper-imágenes" agrupadas por distintos criterios.

## 2. Decisiones técnicas

### Stack
- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: Serverless (Supabase) para formularios y moderación.
- **Base de datos**: PostgreSQL (Supabase) con tablas `words`, `submissions`, `categories`.
- **Almacenamiento de imágenes**: Supabase Storage=, con redimensionado a 1200px y formato WebP.
- **Despliegue**: Netlify para el frontend, backend en Supabase.

### Estructura de datos (propuesta)
- `words`: id, text, location, category, photo_url, author_name, approved_at, created_at.
- `submissions`: id, text, location, photo_url, author_name, suggested_category, status (pending/approved/rejected), created_at.
- `categories`: id, name, type (location/alphabetical/visual/community).

### Arquitectura de vistas
1. **Vista pública del archivo** (home): palabras flotantes sin orden, selector de criterio, formación de grupos e hiper-imágenes.
2. **Formulario público de carga**: nombre, ubicación, foto, categoría opcional.
3. **Panel de moderación** (privado): listar pendientes, aprobar/descartar.
4. **Vista de detalle de palabra** (modal): se abre como superposición sobre `Archivo` o `BarrioView`, sin recargar ni cambiar la URL. Muestra imagen, título, barrio, categoría visual y quién la subió. Cierre con × o clic fuera del recuadro.

### Rutas del archivo
- `/` → Home
- `/todos` → Archivo con criterio "Todos"
- `/ubicacion` → Archivo con criterio "Ubicación"
- `/ubicacion/:barrio` → Vista de palabras de un barrio
- `/a-z` → Archivo con criterio "A-Z"
- `/aspecto` → Archivo con criterio "Aspecto"
- `/visitantes` → Archivo con criterio "Visitantes"
- `/cargar` → Formulario público de carga
- `/moderar` → Panel de moderación
- `*` → Redirect a `/todos`

### Criterios del selector y su ruta correspondiente
| Criterio | Valor en selector | Ruta |
|----------|-------------------|------|
| Todos | `todos` | `/todos` |
| Ubicación | `barrio` | `/ubicacion` |
| A-Z | `alfabeto` | `/a-z` |
| Aspecto | `visual` | `/aspecto` |
| Visitantes | `visitantes` | `/visitantes` |

### Detalle de palabra como modal (no ruta independiente)
- `WordDetail` se invoca como componente embebido en `Archivo.jsx` y `BarrioView.jsx` mediante props `word`, `words` y `onClose`.
- Al cerrar, `onClose` establece `selectedWordId = null` y la página subyacente permanece intacta.
- El `WordCloud` siempre se renderiza; el `WordDetail` se superpone con `position: fixed` y `z-index` superior cuando hay una palabra seleccionada.

### Decisiones de diseño
- Mobile-first (QR en la calle).
- Hiper-imágenes generadas en el navegador (Canvas/CSS) para evitar carga de servidor; actualizar con cada palabra aprobada.
- Animaciones con Framer Motion o CSS transforms; limitar número de elementos simultáneos en móvil (lazy render).
- Ubicación como lista de barrios (extensible) + dirección opcional.
- Estilo Suizo / Editorial.

### Decisiones de despliegue y persistencia
- **Orden aleatorio persistente para "Todos"**: en `WordCloud.jsx` el orden aleatorio de la grilla "Todos" se genera una sola vez y se guarda en `localStorage` bajo la clave `sustantivos-orden-todos`. Persiste hasta que el usuario borre la memoria del navegador.
- **Rutas profundas en GitHub Pages**: se agregó `docs/404.html` como copia de `docs/index.html` y un script `postbuild` en `package.json` que lo regenera tras cada `npm run build`. Esto permite acceder directo a rutas como `/todos`, `/ubicacion`, `/ubicacion/:barrio`, `/a-z`, `/aspecto` sin error 404.
- **Despliegue**: Netlify para el frontend, backend en Supabase.

### Optimizaciones móviles aplicadas (rendimiento en celular)
Se detectó que el navegador crasheaba en mobile al cargar `/ubicacion` y la Home por exceso de imágenes en el DOM y animaciones simultáneas. Se aplicaron:

1. **Límite de 15 palabras por barrio** en `/ubicacion` (hiper-imagen).
2. **Rotación una a la vez**: cada 5s se reemplaza solo una palabra por barrio/slot, no todas a la vez.
3. **Slots fijos**: claves estables (`slot-${barrio}-${index}`, `home-slot-${id}`) para evitar remounts y salto a blanco.
4. **Crossfade 500ms**: fade-out de la actual + fade-in de la entrante al rotar.
5. **Precarga de imagen**: `new Image()` antes de mostrar para evitar parpadeo blanco.
6. **`LazyImage` estable**: nunca deja `src` en `undefined`.
7. **Sin subrayado en nombres de barrio**: clase `no-underline` en `WordCloud.jsx`.

## 3. Estrategia de implementación
1. Consolidar el frontend existente (React/Vite) y definir rutas.
2. Integrar backend y base de datos.
3. Implementar formulario público y moderación.
4. Implementar visualización con flotación, agrupamiento e hiper-imágenes.
5. Optimizar rendimiento móvil.
6. Difusión con QR y pruebas en campo.

## 4. Organización de tareas

### Fase 1 — Fundamentos (1-2 semanas)
- [ ] Definir esquema de BD y crear proyecto Supabase.
- [ ] Configurar autenticación para panel de moderación (admin).
- [ ] Estructurar rutas en React: `/`, `/cargar`, `/admin`.
- [ ] Migrar datos iniciales (200 palabras) a la BD.

### Fase 2 — Formulario y moderación (1 semana)
- [ ] Formulario público con carga de foto (mobile).
- [ ] Endpoint de envío (status pending).
- [ ] Panel admin: listado, aprobar/rechazar.
- [ ] Notificación al aprobar (opcional).

### Fase 3 — Visualización del archivo (2 semanas)
- [ ] Pantalla inicial con palabras flotantes superpuestas y opacidad variable.
- [ ] Selector de criterio (Ubicación, Alfabético, Visual, Propuestas).
- [ ] Animación de flotación hacia grupos con nombre.
- [ ] Hiper-imagen por grupo (superposición con opacidades).
- [ ] Vista de grupo: desplegar palabras y detalle individual.

### Fase 4 — Optimización y difusión (1 semana)
- [ ] Lazy loading y límite de elementos en móvil.
- [ ] Generación de QR para difusión.
- [ ] Pruebas de usabilidad en celular.
- [ ] Deploy a Netlify + backend en Supabase.

### Fase 5 — Investigación abierta
- [ ] Decidir si se aceptan frases/pintadas además de sustantivos.
- [ ] Definir cómo se carga y muestra la ubicación.
- [ ] Decidir si hiper-imágenes se generan en cliente o servidor.
- [ ] Establecer tamaño/formato de fotos.
- [ ] Incentivo de navegación (formulario obligatorio tras tiempo).

## 5. Riesgos y mitigaciones
- **Rendimiento en móvil con cientos de imágenes**: usar virtualización, limitar simultáneos, WebP. **Mitigación aplicada**: limitar a 15 palabras por barrio, rotar una a la vez cada 5s, slots fijos, crossfade con precarga, `LazyImage` sin src undefined.
- **Moderación manual**: puede escalar; considerar filtros automáticos básicos.
- **Almacenamiento de fotos**: definir cuotas y compresión.

## 6. Próximos pasos inmediatos
1. Crear proyecto Supabase y esquema inicial.
2. Implementar rutas y formulario.
3. Cargar las 200 palabras iniciales.
