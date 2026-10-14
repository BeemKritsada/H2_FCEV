import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { useMotion } from '../../motion/motion-context'

export function useLogisticsMotion(root: RefObject<HTMLElement | null>) {
  const { playing, reducedMotion } = useMotion()
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.05 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [root])
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      const sequence = gsap.timeline({ paused: true })
      timeline.current = sequence
      const frames = root.current!.querySelectorAll('[data-cinema]')
      if (frames.length) sequence.from(frames, { opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 0.8, stagger: 0.18, ease: 'power3.inOut' }, 0)
      const map = root.current!.querySelector('[data-logistics-map]')
      if (map) sequence.from(map, { opacity: 0, scale: 0.96, duration: 0.8, transformOrigin: 'center', ease: 'power2.out' }, 0)
      const nodes = root.current!.querySelectorAll('[data-region-node]')
      if (nodes.length) sequence.from(nodes, { opacity: 0, duration: 0.45, stagger: 0.18 }, 0.35)
      const labels = root.current!.querySelectorAll('[data-region-label]')
      if (labels.length) sequence.from(labels, { opacity: 0, x: -8, duration: 0.45, stagger: 0.18 }, 0.35)
      const payload = root.current!.querySelector('[data-payload]')
      if (payload) sequence.from(payload, { opacity: 0, duration: 0.6 }, 3.2)
    }, root)
    return () => { context.revert(); timeline.current = null }
  }, [root, reducedMotion])
  useLayoutEffect(() => {
    if (playing && visible) timeline.current?.play()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1).pause()
    else timeline.current?.pause()
  }, [playing, visible, reducedMotion])
  return { playing: playing && visible, reducedMotion }
}
