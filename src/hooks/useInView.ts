import { useEffect, useState, type RefObject } from 'react'

/** True while the element is (roughly) on screen. Used to pause the 3D render loop. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '100px') {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
