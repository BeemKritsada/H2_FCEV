import { ChevronDown, LayoutGrid, Maximize2, Minimize2, Pause, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from './LanguageToggle'
import type { PresentationScene } from '../../scenes/scene-config'
import { useMotion } from '../motion/motion-context'

interface TopNavigationProps {
  activeScene: PresentationScene
  activeIndex: number
  language: 'en' | 'th'
  isOverviewOpen: boolean
  isFullscreen: boolean
  onLanguageChange: (language: 'en' | 'th') => void
  onOverviewToggle: () => void
  onFullscreenToggle: () => void
}

export function TopNavigation({
  activeScene,
  activeIndex,
  language,
  isOverviewOpen,
  isFullscreen,
  onLanguageChange,
  onOverviewToggle,
  onFullscreenToggle,
}: TopNavigationProps) {
  const { t } = useTranslation()
  const FullscreenIcon = isFullscreen ? Minimize2 : Maximize2
  const { paused, reducedMotion, togglePaused } = useMotion()
  const MotionIcon = paused || reducedMotion ? Play : Pause
  const motionLabel = t(reducedMotion ? 'navigation.reducedMotion' : paused ? 'navigation.resumeMotion' : 'navigation.pauseMotion')

  return (
    <header className="top-navigation">
      <a aria-label={t('content.presentationTitle')} className="brand-lockup" href="#presentation">
        <span aria-hidden="true" className="brand-lockup__mark">H₂</span>
        <span className="brand-lockup__text">
          <strong>{t('brand.name')}</strong>
          <small>{t('brand.descriptor')}</small>
        </span>
      </a>

      <button
        aria-controls="scene-overview"
        aria-expanded={isOverviewOpen}
        className="scene-picker"
        onClick={onOverviewToggle}
        type="button"
      >
        <LayoutGrid aria-hidden="true" size={16} strokeWidth={1.7} />
        <span className="scene-picker__label">{t(activeScene.labelKey)}</span>
        <span className="scene-picker__count">{String(activeIndex + 1).padStart(2, '0')}</span>
        <ChevronDown aria-hidden="true" className={isOverviewOpen ? 'is-rotated' : ''} size={15} />
      </button>

      <div className="top-navigation__actions">
        <button type="button" className="icon-button motion-button" onClick={togglePaused} disabled={reducedMotion} aria-label={motionLabel} title={motionLabel} aria-pressed={paused || reducedMotion}>
          <MotionIcon size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <LanguageToggle language={language} onChange={onLanguageChange} />
        <span aria-hidden="true" className="top-navigation__divider" />
        <button
          aria-label={isFullscreen ? t('navigation.exitFullscreen') : t('navigation.enterFullscreen')}
          className="icon-button fullscreen-button"
          onClick={onFullscreenToggle}
          title={isFullscreen ? t('navigation.exitFullscreen') : t('navigation.enterFullscreen')}
          type="button"
        >
          <FullscreenIcon aria-hidden="true" size={17} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}
