import { useCallback, useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useMotion } from './motion-context'
import { NumberSequenceContext, NumberSessionContext, type StatisticEntry } from './number-sequence-context'

/** One timeline per activation. The session set belongs to App, not the keyed scene. */
export function SceneNumberSequence({ sceneId, visited, delay = 0.3, children }: { sceneId: string; visited: Set<string>; delay?: number | undefined; children: ReactNode }) {
  const entries = useRef(new Set<StatisticEntry>())
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const { playing, reducedMotion } = useMotion()
  const playingRef = useRef(playing)
  const register = useCallback((entry: StatisticEntry) => {
    entries.current.add(entry)
    // Statistics introduced by an interactive mode change stay at their final values.
    return () => { entries.current.delete(entry) }
  }, [])
  useLayoutEffect(() => { playingRef.current = playing }, [playing])
  useLayoutEffect(() => {
    let cancelled = false
    let sequence: gsap.core.Timeline | null = null
    let registered: StatisticEntry[] = []
    // Discard StrictMode's rehearsal before marking this scene visited.
    queueMicrotask(() => {
      if (cancelled) return
      registered = [...entries.current].filter(({ node }) => node.isConnected).sort((a, b) => a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1)
      if (visited.has(sceneId) || reducedMotion || !playingRef.current) {
        visited.add(sceneId)
        registered.forEach((entry) => { entry.node.textContent = entry.render(1) })
        return
      }
      visited.add(sceneId)
      sequence = gsap.timeline({ delay })
      timeline.current = sequence
      registered.forEach((entry, index) => {
        const state = { progress: 0 }
        entry.node.textContent = entry.render(0)
        sequence!.to(state, {
          progress: 1, duration: 0.85, ease: 'power2.out',
          onStart: () => { entry.node.dataset.counting = 'true' },
          onUpdate: () => { if (entries.current.has(entry)) entry.node.textContent = entry.render(state.progress) },
          onComplete: () => { if (entries.current.has(entry)) entry.node.textContent = entry.render(1); delete entry.node.dataset.counting },
        }, index === 0 ? 0 : '+=0.12')
      })
    })
    return () => {
      cancelled = true
      sequence?.kill()
      timeline.current = null
      registered.forEach((entry) => { entry.node.textContent = entry.render(1); delete entry.node.dataset.counting })
    }
  }, [sceneId, visited, reducedMotion, delay])
  useLayoutEffect(() => {
    if (playing) timeline.current?.resume()
    else timeline.current?.pause()
  }, [playing])
  const session = useMemo(() => ({ sceneId, visited }), [sceneId, visited])
  return <NumberSessionContext.Provider value={session}><NumberSequenceContext.Provider value={register}>{children}</NumberSequenceContext.Provider></NumberSessionContext.Provider>
}

/**
 * A separately remembered sequence for one interactive state of a scene (e.g. a selected tab).
 * It counts on the state's first view in this session and shows final values afterwards.
 */
export function StateNumberSequence({ stateId, delay, children }: { stateId: string; delay?: number | undefined; children: ReactNode }) {
  const session = useContext(NumberSessionContext)
  if (!session) return children
  return <SceneNumberSequence sceneId={`${session.sceneId}#${stateId}`} visited={session.visited} delay={delay}>{children}</SceneNumberSequence>
}

