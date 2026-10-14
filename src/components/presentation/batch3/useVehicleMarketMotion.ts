import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { useInfrastructureMotion } from '../batch2/useInfrastructureMotion'

/** Reuse the existing pause, visibility and exit lifecycle without changing Batch 2. */
export function useVehicleMarketMotion(root: RefObject<HTMLElement | null>) {
  const motion = useInfrastructureMotion(root)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  useLayoutEffect(() => {
    const node = root.current
    if (!node || motion.reducedMotion) return
    const context = gsap.context(() => {
      const sequence = gsap.timeline({ paused: true })
      timeline.current = sequence
      const vehicles = node.querySelectorAll('[data-market-vehicle]')
      if (vehicles.length) sequence.from(vehicles, { x: 24, opacity: 0.15, scale: 0.97, duration: 0.95, stagger: 0.22, ease: 'power3.out' }, 0)
      const sales = node.querySelector('[data-monthly-sales]')
      if (sales) sequence.from(sales, { opacity: 0.5, y: 7, duration: 0.6, ease: 'power2.out' }, 1.05)
      const path = node.querySelector('[data-market-track]')
      if (path) sequence.from(path, { strokeDashoffset: 1, duration: 1.45, ease: 'power2.inOut' }, 0)
      const phases = node.querySelectorAll('[data-market-phase]')
      if (phases.length) sequence.from(phases, { opacity: 0.45, x: -12, duration: 0.8, stagger: 0.55, ease: 'power2.out' }, 0.1)
      const outcome = node.querySelector('[data-market-outcome]')
      if (outcome) sequence.from(outcome, { opacity: 0.55, duration: 0.65 }, 1.15)
      const shares = node.querySelectorAll('[data-market-share]')
      if (shares.length) sequence.from(shares, { opacity: 0.55, duration: 0.75, stagger: 0.25 }, 0.25)
    }, node)
    return () => {
      context.revert(); timeline.current = null
    }
  }, [root, motion.reducedMotion])
  // Finish the reveal when paused so the presenter never holds an intermediate count.
  useLayoutEffect(() => {
    if (motion.playing) timeline.current?.play()
    else timeline.current?.progress(1).pause()
  }, [motion.playing, motion.reducedMotion])
  return motion
}
