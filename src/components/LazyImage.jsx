import { useState, useEffect } from 'react'

/**
 * Imagen que solo descarga su recurso cuando entra al viewport.
 * El elemento <img> siempre está en el DOM (preserva layout),
 * pero el src solo se asigna cuando es visible.
 */
export function LazyImage({ src, alt, className, style, loading = 'lazy', decoding = 'async', onError }) {
  const [isVisible, setIsVisible] = useState(false)
  const [node, setNode] = useState(null)

  useEffect(() => {
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return (
    <img
      ref={setNode}
      src={isVisible ? src : undefined}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      style={style}
      onError={onError}
    />
  )
}
