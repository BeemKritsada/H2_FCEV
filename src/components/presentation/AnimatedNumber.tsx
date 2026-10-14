import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useMotion } from '../motion/motion-context'

/** DOM-only ticking: no per-frame React updates and no screen-reader announcements. */
export function AnimatedNumber({ value, decimals = 0, active = true }: { value: number; decimals?: number; active?: boolean }) {
  const node = useRef<HTMLSpanElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const { playing, reducedMotion } = useMotion()
  const display = value.toFixed(decimals)

  useLayoutEffect(() => {
    if (reducedMotion || !node.current) return
    const state = { value: 0 }
    const element = node.current
    tween.current = gsap.to(state, {
      value, duration: 1.7, delay: 0.2, ease: 'power2.out', paused: true,
      onUpdate: () => { element.textContent = state.value.toFixed(decimals) },
    })
    return () => { tween.current?.kill(); element.textContent = value.toFixed(decimals) }
  }, [value, decimals, reducedMotion])

  useEffect(() => {
    if (playing && active) tween.current?.play()
    else if (tween.current?.progress() === 0) tween.current.progress(1)
    else tween.current?.pause()
  }, [playing, active, reducedMotion])

  return <><span className="sr-only">{display}</span><span aria-hidden="true" ref={node}>{display}</span></>
}
