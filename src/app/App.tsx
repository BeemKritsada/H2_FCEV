import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { presentation as englishPresentation } from '../content/en/presentation'
import { presentation as thaiPresentation } from '../content/th/presentation'
import i18n from '../i18n'
import { SceneOverview } from '../components/navigation/SceneOverview'
import { TopNavigation } from '../components/navigation/TopNavigation'
import { PresentationControls } from '../components/presentation/PresentationControls'
import { SceneContainer } from '../components/presentation/SceneContainer'
import { presentationScenes } from '../scenes/scene-config'
import { MotionProvider } from '../components/motion/MotionProvider'
import { useMotion } from '../components/motion/motion-context'

function PresentationFrame({ children }: { children: React.ReactNode }) {
  const { playing } = useMotion()
  return <div className="presentation-app" id="presentation" data-motion={playing ? 'running' : 'paused'}>{children}</div>
}

export default function App() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const language = i18n.resolvedLanguage?.startsWith('th') ? 'th' : 'en'
  const presentation = language === 'th' ? thaiPresentation : englishPresentation
  const activeScene = presentationScenes[activeIndex]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('content.presentationTitle') + ' | H2 FCEV'
  }, [language, t])

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

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
      const targetIndex = { ArrowRight: activeIndex + 1, PageDown: activeIndex + 1,
        ArrowLeft: activeIndex - 1, PageUp: activeIndex - 1, Home: 0, End: presentationScenes.length - 1 }[event.key]
      if (targetIndex !== undefined) {
        event.preventDefault()
        selectScene(targetIndex)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, isOverviewOpen, selectScene])

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

      <SceneOverview
        scenes={presentationScenes}
        activeIndex={activeIndex}
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        onSelect={selectScene}
      />

      <main className="presentation-main">
        <SceneContainer
          key={activeScene.id}
          scene={activeScene}
          sceneNumber={activeIndex + 1}
          sceneCount={presentationScenes.length}
          presentation={presentation}
        />
        <PresentationControls
          activeIndex={activeIndex}
          sceneCount={presentationScenes.length}
          onPrevious={() => selectScene(activeIndex - 1)}
          onNext={() => selectScene(activeIndex + 1)}
        />
      </main>
    </PresentationFrame>
    </MotionProvider>
  )
}
