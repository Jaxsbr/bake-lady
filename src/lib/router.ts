import { useState, useEffect } from 'preact/hooks'

export type Route =
  | { type: 'home' }
  | { type: 'detail'; id: string }
  | { type: 'new' }
  | { type: 'edit'; id: string }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '')
  if (!path) return { type: 'home' }

  const editMatch = path.match(/^recipe\/([^/]+)\/edit$/)
  if (editMatch) return { type: 'edit', id: editMatch[1] }

  if (path === 'recipe/new') return { type: 'new' }

  const detailMatch = path.match(/^recipe\/([^/]+)$/)
  if (detailMatch) return { type: 'detail', id: detailMatch[1] }

  return { type: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return route
}

export function navigate(path: string): void {
  window.location.hash = path
}
