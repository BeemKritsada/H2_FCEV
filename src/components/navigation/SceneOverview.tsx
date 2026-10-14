import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { PresentationScene } from '../../scenes/scene-config'

interface SceneOverviewProps {
  scenes: readonly PresentationScene[]
  activeIndex: number
  isOpen: boolean
  onClose: () => void
  onSelect: (index: number) => void
}

export function SceneOverview({
  scenes,
  activeIndex,
  isOpen,
  onClose,
  onSelect,
}: SceneOverviewProps) {
  const { t } = useTranslation()
  const overviewRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = overviewRef.current
    panel?.querySelector<HTMLButtonElement>('[aria-current="step"]')?.focus()
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panel) return
      const buttons = Array.from(panel.querySelectorAll<HTMLButtonElement>('button'))
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      previousFocus?.focus({ preventScroll: true })
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="scene-overview-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('navigation.sceneOverview')}>
      <nav
        aria-label={t('navigation.sceneOverview')}
        className="scene-overview"
        id="scene-overview"
        ref={overviewRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="scene-overview__header">
          <div>
            <span className="eyebrow">{t('navigation.scenePreview')}</span>
            <h2>{t('navigation.sceneOverview')}</h2>
          </div>
          <button
            aria-label={t('navigation.closeOverview')}
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <ol className="scene-overview__list">
          {scenes.map((scene, index) => (
            <li key={scene.id}>
              <button
                aria-current={index === activeIndex ? 'step' : undefined}
                className={index === activeIndex ? 'scene-overview__item is-active' : 'scene-overview__item'}
                onClick={() => onSelect(index)}
                type="button"
              >
                <span className="scene-overview__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="scene-overview__title">{t(scene.labelKey)}</span>
                <span aria-hidden="true" className="scene-overview__indicator" />
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
