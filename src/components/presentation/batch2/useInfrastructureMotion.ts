import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { useMotion } from '../../motion/motion-context'

let removeExitSnapshot: (() => void) | undefined

/** A short, inert exit snapshot keeps App's existing keyed navigation unchanged. */
function fadeExit(node: HTMLElement) {
  removeExitSnapshot?.()
  if (!node.isConnected || document.visibilityState === 'hidden') return
  const rect = node.getBoundingClientRect()
  if (rect.bottom <= 0 || rect.top >= window.innerHeight || !node.animate) return
  const copy = node.cloneNode(true) as HTMLElement
  copy.inert = true
  copy.setAttribute('aria-hidden', 'true')
  copy.setAttribute('data-motion', 'paused')
  copy.removeAttribute('aria-labelledby')
  copy.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
  const canvases = copy.querySelectorAll('canvas')
  node.querySelectorAll('canvas').forEach((canvas, index) => {
    const target = canvases[index]
    if (!target) return
    target.width = canvas.width; target.height = canvas.height
    try { target.getContext('2d')?.drawImage(canvas, 0, 0) } catch { /* DOM labels still supply the full content. */ }
  })
  Object.assign(copy.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: '0', zIndex: '3', pointerEvents: 'none', overflow: 'hidden' })
  const parent = node.parentElement
  // StrictMode replays effects without removing the node. Only navigation gets an exit.
  queueMicrotask(() => {
    if (node.isConnected || !parent?.isConnected) return
    // Retain inherited language and fullscreen visibility; never attach outside the app.
    parent.append(copy)
    const animation = copy.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' })
    const remove = () => { animation.cancel(); copy.remove(); clearTimeout(timeout); if (removeExitSnapshot === remove) removeExitSnapshot = undefined }
    const timeout = window.setTimeout(remove, 300)
    animation.onfinish = remove
    removeExitSnapshot = remove
  })
}

export function useInfrastructureMotion(root: RefObject<HTMLElement | null>) {
  const { playing, reducedMotion } = useMotion()
  const [inView, setInView] = useState(true)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const exitEnabled = useRef(false)
  useEffect(() => { exitEnabled.current = playing && !reducedMotion }, [playing, reducedMotion])
  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.05 })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [root])
  useLayoutEffect(() => {
    const node = root.current
    if (!node) return
    const context = gsap.context(() => {
      if (reducedMotion) return
      const sequence = gsap.timeline({ paused: true })
      timeline.current = sequence
      sequence.from(node, { opacity: 0.65, duration: 0.35 })
      const outline = node.querySelector('[data-map-outline]')
      if (outline) sequence.from(outline, { strokeDashoffset: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
      const clusters = node.querySelectorAll('[data-cluster]')
      if (clusters.length) sequence.from(clusters, { scale: 0.15, opacity: 0, duration: 0.55, stagger: 0.18, transformOrigin: 'center', ease: 'back.out(1.3)' }, 0.25)
      const ring = node.querySelector('[data-public-ring]')
      if (ring) sequence.from(ring, { strokeDashoffset: 100, duration: 1.3, ease: 'power2.out' }, 0.25)
      const milestones = node.querySelectorAll('[data-milestone]')
      if (milestones.length) sequence.from(milestones, { scale: 0.5, opacity: 0, duration: 0.55, stagger: 0.5, transformOrigin: 'center' }, 0)
      const branch = node.querySelector('[data-development-branch]')
      if (branch) sequence.from(branch, { strokeDashoffset: 1, duration: 0.7 }, 0.4)
      const forecast = node.querySelector('[data-forecast]')
      if (forecast) sequence.from(forecast, { opacity: 0.55, duration: 0.6 }, 1.05)
      const cost = node.querySelector('[data-cost]')
      if (cost) sequence.from(cost, { opacity: 0.6, duration: 0.7 }, 1.25)
    }, node)
    return () => { context.revert(); timeline.current = null }
  }, [root, reducedMotion])
  useEffect(() => {
    if (playing && inView) timeline.current?.play()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1).pause()
    else timeline.current?.pause()
  }, [playing, inView, reducedMotion])
  useLayoutEffect(() => {
    const node = root.current
    return () => { if (node && exitEnabled.current) fadeExit(node) }
  }, [root])
  return { playing: playing && inView, reducedMotion }
}
