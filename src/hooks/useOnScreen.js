import { useState, useEffect, useRef } from 'react'

/**
 * Devuelve true cuando el elemento referenciado entra en el viewport.
 * rootMargin permite precargar un poco antes de que se vea.
 */
export function useOnScreen(ref, options = {}) {
  const { threshold = 0, rootMargin = '200px' } = options
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold, rootMargin }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin])

  return isVisible
}
