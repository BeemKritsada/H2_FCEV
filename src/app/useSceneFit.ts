import { useLayoutEffect, type RefObject } from 'react'

export const TEXT_SCALE_STEPS = [0.9, 1, 1.1, 1.2, 1.3, 1.4] as const
export const DEFAULT_TEXT_SCALE = 1.1
const MIN_FIT_SCALE = 0.62
const STORAGE_KEY = 'h2fcev.textScale'

export function readStoredTextScale() {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY))
    return (TEXT_SCALE_STEPS as readonly number[]).includes(value) ? value : DEFAULT_TEXT_SCALE
  } catch { return DEFAULT_TEXT_SCALE }
}
export function storeTextScale(value: number) {
  try { localStorage.setItem(STORAGE_KEY, String(value)) } catch { /* private mode: keep in memory only */ }
}

/** Fixed-height scenes were validated down to this stage height; text only grows when there is spare room. */
const FIXED_SCENE_MIN_HEIGHT = 740

/** Applies the presenter's text size, then (desktop only) shrinks just enough to fit the stage. */
function fitStage(host: HTMLElement, node: HTMLElement, textScale: number) {
  const desktop = window.matchMedia('(min-width: 1101px)').matches
  const apply = (zoom: number) => {
    node.style.zoom = String(zoom)
    if (desktop) node.style.setProperty('--scene-fit-height', `${host.clientHeight / zoom}px`)
    else node.style.removeProperty('--scene-fit-height')
  }
  // Phones keep their tested layouts at 100%; pinch-zoom covers text size there.
  let zoom = window.matchMedia('(max-width: 760px)').matches ? 1 : textScale
  apply(zoom)
  if (desktop) {
    const scene = node.firstElementChild
    const fixedHeight = scene && getComputedStyle(scene).getPropertyValue('--scene-fixed').trim() === '1'
    if (fixedHeight) {
      // These scenes compress their visuals to the given height; keep them at least as tall as tested.
      zoom = Math.min(textScale, Math.max(1, host.clientHeight / FIXED_SCENE_MIN_HEIGHT))
      apply(zoom)
    }
    // Content-height scenes grow with the text: shrink until they fit. Scroll panels count as overflow.
    const scrollers = [...node.querySelectorAll<HTMLElement>('*')].filter((element) => /auto|scroll/.test(getComputedStyle(element).overflowY))
    for (let attempt = 0; attempt < 12 && zoom > MIN_FIT_SCALE; attempt++) {
      const available = host.clientHeight
      const used = node.getBoundingClientRect().height
      const innerOverflow = scrollers.some((element) => element.scrollHeight > element.clientHeight + 4)
      if (used <= available + 1 && !innerOverflow) break
      zoom = Math.max(MIN_FIT_SCALE, zoom * Math.min(0.97, used > available ? available / used : 0.97))
      apply(zoom)
    }
  }
  node.dataset.fitScale = zoom.toFixed(3)
}

/**
 * Scales the active scene by the presenter's text size and, on desktop, shrinks it just enough
 * to fit the stage, so no slide ever needs scrolling. CSS zoom also multiplies viewport units,
 * so fixed-height scenes read `--scene-fit-height` (stage height in the zoomed coordinate space).
 */
export function useSceneFit(stage: RefObject<HTMLDivElement | null>, content: RefObject<HTMLDivElement | null>, textScale: number, deps: readonly unknown[]) {
  useLayoutEffect(() => {
    const host = stage.current, node = content.current
    if (!host || !node) return
    let frame = 0
    const run = () => fitStage(host, node, textScale)
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(run) }
    run()
    // Late content (fonts, images, async map geometry) and window changes trigger a re-fit.
    const resize = new ResizeObserver(schedule)
    resize.observe(host)
    if (node.firstElementChild) resize.observe(node.firstElementChild)
    // Count-up ticks rewrite numbers every frame; their width is reserved, so they never need a re-fit.
    const mutations = new MutationObserver((records) => {
      if (records.some((record) => !(record.target as Element).closest?.('.animated-number'))) schedule()
    })
    mutations.observe(node, { childList: true, subtree: true })
    void document.fonts?.ready.then(schedule)
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect(); mutations.disconnect()
      window.removeEventListener('resize', schedule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, content, textScale, ...deps])
}
