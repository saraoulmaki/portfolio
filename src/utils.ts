/** Resolve a file in /public against Vite's base path (GitHub Pages safe). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

let webglCache: boolean | undefined

/** Feature-detect WebGL once. */
export function hasWebGL(): boolean {
  if (webglCache !== undefined) return webglCache
  try {
    const canvas = document.createElement('canvas')
    webglCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    webglCache = false
  }
  return webglCache
}
