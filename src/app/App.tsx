import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { presentation as englishPresentation } from '../content/en/presentation'
import { presentation as thaiPresentation } from '../content/th/presentation'
import i18n from '../i18n'
import { SceneOverview } from '../components/navigation/SceneOverview'
import { TopNavigation } from '../components/navigation/TopNavigation'
import { TextSizeControl } from '../components/navigation/TextSizeControl'
import { PresentationControls } from '../components/presentation/PresentationControls'
import { SceneContainer } from '../components/presentation/SceneContainer'
import { presentationScenes } from '../scenes/scene-config'
import { MotionProvider } from '../components/motion/MotionProvider'
import { useMotion } from '../components/motion/motion-context'
import { SceneNumberSequence } from '../components/motion/SceneNumberSequence'
import { nextSceneImages } from '../components/presentation/batch5/assets'
import { DEFAULT_TEXT_SCALE, TEXT_SCALE_STEPS, readStoredTextScale, storeTextScale, useSceneFit } from './useSceneFit'
import '../styles/presentation-shell.css'

function PresentationFrame({ children }: { children: React.ReactNode }) {
  const { playing } = useMotion()
  return <div className="presentation-app presentation-app--fit" id="presentation" data-motion={playing ? 'running' : 'paused'}>{children}</div>
}

export default function App() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [visitedScenes] = useState(() => new Set<string>())
  const [session, setSession] = useState(0)
  const language = i18n.resolvedLanguage?.startsWith('th') ? 'th' : 'en'
  const presentation = language === 'th' ? thaiPresentation : englishPresentation
  const activeScene = presentationScenes[activeIndex]
  const [textScale, setTextScale] = useState(readStoredTextScale)
  const [headerPeek, setHeaderPeek] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const stageContent = useRef<HTMLDivElement>(null)
  useSceneFit(stage, stageContent, textScale, [activeIndex, language, isFullscreen])

  const changeTextScale = useCallback((direction: -1 | 0 | 1) => {
    setTextScale((current) => {
      const steps = TEXT_SCALE_STEPS as readonly number[]
      const next = direction === 0 ? DEFAULT_TEXT_SCALE : steps[Math.min(steps.length - 1, Math.max(0, steps.indexOf(current) + direction))] ?? DEFAULT_TEXT_SCALE
      storeTextScale(next)
      return next
    })
  }, [])

  useEffect(() => {
    const nextId = presentationScenes[activeIndex + 1]?.id
    if (!nextId) return
    const links = (nextSceneImages[nextId] ?? []).map((href) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'; link.as = 'image'; link.href = href
      document.head.append(link)
      return link
    })
    return () => links.forEach((link) => link.remove())
  }, [activeIndex])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('content.presentationTitle') + ' | H2 FCEV'
  }, [language, t])

  useEffect(() => {
    const updateFullscreen = () => { setIsFullscreen(Boolean(document.fullscreenElement)); setHeaderPeek(false) }
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  // Fullscreen header peek ends once the pointer moves clearly below the header.
  useEffect(() => {
    if (!headerPeek || isOverviewOpen) return
    const onMove = (event: MouseEvent) => {
      const header = document.querySelector('.top-navigation')
      if (header && event.clientY > header.getBoundingClientRect().height + 24) setHeaderPeek(false)
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [headerPeek, isOverviewOpen])

  useEffect(() => {
    if (!isOverviewOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOverviewOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOverviewOpen])

  const selectScene = useCallback((index: number) => {
    if (index < 0 || index >= presentationScenes.length) return
    setActiveIndex(index)
    setIsOverviewOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.querySelector('.presentation-app')?.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOverviewOpen || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"], .language-toggle')) return
      const textStep = ({ '+': 1, '=': 1, '-': -1, _: -1, '0': 0 } as Record<string, -1 | 0 | 1>)[event.key]
      if (textStep !== undefined) { event.preventDefault(); changeTextScale(textStep); return }
      const targetIndex = { ArrowRight: activeIndex + 1, PageDown: activeIndex + 1,
        ArrowLeft: activeIndex - 1, PageUp: activeIndex - 1, Home: 0, End: presentationScenes.length - 1 }[event.key]
      if (targetIndex !== undefined) {
        event.preventDefault()
        selectScene(targetIndex)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, isOverviewOpen, selectScene, changeTextScale])

  const changeLanguage = useCallback((nextLanguage: 'en' | 'th') => {
    void i18n.changeLanguage(nextLanguage)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.querySelector('.presentation-app')?.requestFullscreen()
      }
    } catch {
      // Fullscreen can be unavailable in embedded browser contexts.
    }
  }, [])

  if (!activeScene) return null

  return (
    <MotionProvider suspended={isOverviewOpen}>
    <PresentationFrame>
      {isFullscreen && <div className="fullscreen-hotzone" aria-hidden="true" onMouseEnter={() => setHeaderPeek(true)} />}
      <div className="top-navigation-shell" data-peek={headerPeek || isOverviewOpen}>
      <TopNavigation
        activeScene={activeScene}
        activeIndex={activeIndex}
        language={language}
        isOverviewOpen={isOverviewOpen}
        isFullscreen={isFullscreen}
        onLanguageChange={changeLanguage}
        onOverviewToggle={() => setIsOverviewOpen((open) => !open)}
        onFullscreenToggle={toggleFullscreen}
      />
      </div>

      <SceneOverview
        scenes={presentationScenes}
        activeIndex={activeIndex}
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        onSelect={selectScene}
      />

      <main className="presentation-main">
        <div className="scene-stage" ref={stage}>
          <div className="scene-stage__content" ref={stageContent}>
            <SceneNumberSequence key={`${session}-${activeScene.id}`} sceneId={activeScene.id} visited={visitedScenes}>
            <SceneContainer
              key={activeScene.id}
              scene={activeScene}
              sceneNumber={activeIndex + 1}
              sceneCount={presentationScenes.length}
              presentation={presentation}
            />
            </SceneNumberSequence>
          </div>
        </div>
        <div className="controls-dock">
        <PresentationControls
          activeIndex={activeIndex}
          sceneCount={presentationScenes.length}
          onPrevious={() => selectScene(activeIndex - 1)}
          onNext={() => selectScene(activeIndex + 1)}
          onRestart={() => { visitedScenes.clear(); setSession((value) => value + 1); selectScene(0) }}
        />
        <div className="controls-dock__text-size"><TextSizeControl value={textScale} onChange={changeTextScale} /></div>
        </div>
      </main>
    </PresentationFrame>
    </MotionProvider>
  )
}
