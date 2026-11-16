import { useEffect, useState } from 'react'

/**
 * Minimal hash router — works on GitHub Pages without server rewrites.
 *
 *   #/projects/<slug>   → project detail page
 *   anything else       → home (plain anchors like #projects scroll to sections)
 */
export type Route = { name: 'home'; anchor?: string } | { name: 'project'; slug: string }

export function parseHash(hash: string): Route {
  const match = hash.match(/^#\/projects\/([\w-]+)\/?$/)
  if (match) return { name: 'project', slug: match[1] }
  const anchor = hash.startsWith('#') && !hash.startsWith('#/') ? hash.slice(1) : undefined
  return { name: 'home', anchor: anchor || undefined }
}

export const projectHref = (slug: string) => `#/projects/${slug}`

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
