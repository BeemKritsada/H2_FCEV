import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PresentationControlsProps {
  activeIndex: number
  sceneCount: number
  onPrevious: () => void
  onNext: () => void
  onRestart: () => void
}

export function PresentationControls({
  activeIndex,
  sceneCount,
  onPrevious,
  onNext,
  onRestart,
}: PresentationControlsProps) {
  const { t } = useTranslation()
  const current = activeIndex + 1
  const progress = (current / sceneCount) * 100

  return (
    <footer className="presentation-controls">
      <button
        aria-label={t('controls.previous')}
        className="navigation-button navigation-button--previous"
        disabled={activeIndex === 0}
        onClick={onPrevious}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        <span>{t('controls.previous')}</span>
      </button>

      <div className="presentation-progress">
        <div
          aria-label={t('controls.progress')}
          aria-valuemax={sceneCount}
          aria-valuemin={1}
          aria-valuenow={current}
          aria-valuetext={t('controls.scenePosition', { current, total: sceneCount })}
          className="presentation-progress__track"
          role="progressbar"
        >
          <span className="presentation-progress__fill" style={{ width: progress + '%' }} />
        </div>
        <span className="presentation-progress__count">
          <strong>{String(current).padStart(2, '0')}</strong>
          <span aria-hidden="true">/</span>
          <span>{String(sceneCount).padStart(2, '0')}</span>
        </span>
      </div>

      <button
        aria-label={t(activeIndex === sceneCount - 1 ? 'batchFive.restart' : 'controls.next')}
        className="navigation-button navigation-button--next"
        onClick={activeIndex === sceneCount - 1 ? onRestart : onNext}
        type="button"
      >
        <span>{t(activeIndex === sceneCount - 1 ? 'batchFive.restart' : 'controls.next')}</span>
        <ArrowRight aria-hidden="true" size={17} />
      </button>
    </footer>
  )
}
