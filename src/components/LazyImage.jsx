import { useRef } from 'react'
import { useOnScreen } from '../hooks/useOnScreen'

/**
 * Imagen que solo se monta en el DOM cuando el usuario se acerca a ella.
 * Mientras tanto se renderiza un div placeholder con las mismas clases/estilos
 * para no desplazar el layout.
 */
export function LazyImage({ src, alt, className, style, loading = 'lazy', decoding = 'async', onError }) {
  const ref = useRef()
  const isVisible = useOnScreen(ref, { threshold: 0, rootMargin: '200px' })

  return (
    <>
      {isVisible ? (
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={className}
          loading={loading}
          decoding={decoding}
          style={style}
          onError={onError}
        />
      ) : (
        <div ref={ref} className={className} style={style} />
      )}
    </>
  )
}
