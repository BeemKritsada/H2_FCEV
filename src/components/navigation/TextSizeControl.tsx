import { useTranslation } from 'react-i18next'
import { TEXT_SCALE_STEPS } from '../../app/useSceneFit'

/** Presenter text size: A− / current % (click to reset) / A+. Keyboard: −, +, 0. */
export function TextSizeControl({ value, onChange }: { value: number; onChange: (direction: -1 | 0 | 1) => void }) {
  const { t } = useTranslation()
  return <div className="text-size" role="group" aria-label={t('shell.textSize')}>
    <button type="button" onClick={() => onChange(-1)} disabled={value <= TEXT_SCALE_STEPS[0]} aria-label={t('shell.textSmaller')} title={t('shell.textSmaller')}><span aria-hidden="true">A−</span></button>
    <button type="button" className="text-size__value" onClick={() => onChange(0)} aria-label={t('shell.textReset')} title={t('shell.textReset')}>{Math.round(value * 100)}%</button>
    <button type="button" onClick={() => onChange(1)} disabled={value >= TEXT_SCALE_STEPS.at(-1)!} aria-label={t('shell.textLarger')} title={t('shell.textLarger')}><span aria-hidden="true">A+</span></button>
  </div>
}
