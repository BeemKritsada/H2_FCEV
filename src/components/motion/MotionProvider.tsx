import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionContext } from './motion-context'

const motionQuery = '(prefers-reduced-motion: reduce)'
const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const subscribeVisibility = (callback: () => void) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}

export function MotionProvider({ children, suspended = false }: { children: ReactNode; suspended?: boolean }) {
  const [paused, setPaused] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false)
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === 'visible', () => true)
  const togglePaused = useCallback(() => setPaused((previous) => !previous), [])
  const value = useMemo(() => ({
    paused, reducedMotion, playing: !paused && !reducedMotion && visible && !suspended, togglePaused,
  }), [paused, reducedMotion, visible, suspended, togglePaused])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
