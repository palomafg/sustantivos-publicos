import { useState, useEffect } from 'react'

/**
 * Imagen con lazy loading nativo del navegador (loading="lazy").
 * Nunca deja el src en undefined para evitar parpadeos blancos
 * al cambiar de palabra (crossfade).
 * El IntersectionObserver se mantiene solo como gancho opcional,
 * pero no controla el atributo src.
 */
export function LazyImage({ src, alt, className, style, loading = 'lazy', decoding = 'async', onError }) {
  const [node, setNode] = useState(null)

  useEffect(() => {
    if (!node) return
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Gancho disponible si se necesita en el futuro;
        // el src se gestiona directamente con loading="lazy".
      },
      { threshold: 0, rootMargin: '100px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return (
    <img
      ref={setNode}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      style={style}
      onError={onError}
    />
  )
}
