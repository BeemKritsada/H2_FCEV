import { ArrowUpRight, Leaf, MoveUpRight, Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PresentationLocale } from '../../content/schema'
import { ChinaMap } from './ChinaMap'
import { HeroTruck } from './HeroTruck'

export function OpeningScene({ presentation, closing = false }: {
  presentation: PresentationLocale
  closing?: boolean
}) {
  const { t } = useTranslation()
  const title = presentation.title.translatedText ?? presentation.title.text
  const themes = [
    { key: 'cleaner', Icon: Leaf },
    { key: 'efficiency', Icon: MoveUpRight },
    { key: 'sustainable', Icon: Sprout },
  ] as const

  return (
    <section aria-labelledby="scene-title" className={`opening-scene${closing ? ' opening-scene--closing' : ''}`}>
      <div className="opening-copy" data-visual-layer="title">
        <p className="opening-eyebrow">CLEAN ENERGY <span>|</span> SMART LOGISTICS <span>|</span> A GREENER CHINA</p>
        <div aria-hidden="true" className="spectrum-line"><i /><i /><i /><i /></div>
        <h1 aria-label={title} aria-live="polite" className="opening-title" id="scene-title">
          <span lang="en">H2 FCEV</span>
          <span>{title.replace(/^H2 FCEV\s*/, '')}</span>
        </h1>
        <p className="opening-caption">{t('opening.caption')}</p>
        {!closing && <p className="opening-reference-year">{t('batchFive.referenceYear')}</p>}
        <div className="opening-chapter">
          <span className="opening-chapter__line" aria-hidden="true" />
          <span>{t(closing ? 'sceneLabels.closing' : 'opening.chapter')}</span>
          <ArrowUpRight aria-hidden="true" size={17} />
        </div>
      </div>

      <div className="opening-art">
        <ChinaMap compact />
        <div aria-hidden="true" className="hydrogen-molecule hydrogen-molecule--one"><span>H</span><i /><span>H</span></div>
        <div aria-hidden="true" className="hydrogen-molecule hydrogen-molecule--two"><span>H</span><i /><span>H</span></div>
        <HeroTruck />
      </div>

      <div className="opening-themes" aria-label={t('opening.themes')}>
        {themes.map(({ key, Icon }) => (
          <div className={`opening-theme opening-theme--${key}`} key={key}>
            <Icon aria-hidden="true" size={25} strokeWidth={1.6} />
            <span>{t(`opening.${key}`)}</span>
          </div>
        ))}
      </div>

      <svg aria-hidden="true" className="energy-ribbon" preserveAspectRatio="none" viewBox="0 0 1600 200" data-visual-layer="ribbon">
        <defs>
          <linearGradient id="ribbon-blue" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#087bdc" /><stop offset=".6" stopColor="#1353db" /><stop offset="1" stopColor="#092d93" />
          </linearGradient>
          <linearGradient id="ribbon-cyan"><stop stopColor="#ddf5ff" /><stop offset="1" stopColor="#53c6ef" /></linearGradient>
        </defs>
        <path d="M0 155 C460 230 950 215 1600 4 L1600 200 L0 200Z" fill="url(#ribbon-cyan)" opacity=".42" />
        <path d="M0 172 C600 240 1110 177 1600 52 L1600 200 L0 200Z" fill="url(#ribbon-blue)" />
        <path d="M0 195 C570 227 1210 215 1600 119 L1600 200 L0 200Z" fill="#2178ef" opacity=".8" />
        <path d="M0 171 C600 239 1110 176 1600 51" fill="none" stroke="#6bd8f5" strokeWidth="2" />
      </svg>
    </section>
  )
}
