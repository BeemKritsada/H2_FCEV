import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { useMotion } from './motion-context'

/** One entrance per mounted scene. Locale changes do not recreate the timeline. */
export function useSceneMotion(root: RefObject<HTMLElement | null>) {
  const { playing, reducedMotion } = useMotion()
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.05 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [root])

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      timeline.current = gsap.timeline({ paused: true })
        .from('[data-enter]', { opacity: 0, y: 18, duration: 0.75, stagger: 0.1, ease: 'power3.out' })
      const bars = root.current?.querySelectorAll('[data-bar]')
      if (bars?.length) timeline.current.from(bars, { scaleX: 0, transformOrigin: 'left center', duration: 1.35, stagger: 0.14, ease: 'power3.inOut' }, 0.2)
    }, root)
    return () => { context.revert(); timeline.current = null }
  }, [root, reducedMotion])

  useEffect(() => {
    // Pause before the first frame without hiding the content behind an overlay.
    if (playing && inView) timeline.current?.play()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1)
    else timeline.current?.pause()
  }, [playing, inView, reducedMotion])

  return { playing: playing && inView, reducedMotion }
}
