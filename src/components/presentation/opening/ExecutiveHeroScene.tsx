import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Factory, Leaf, Route, type LucideIcon } from 'lucide-react'
import { useMotion } from '../../motion/motion-context'
import '../../../styles/executive-hero.css'

const base = import.meta.env.BASE_URL
// Thai loanwords the browser's dictionary can split mid-word; kept whole without changing the text.
const unbreakable = /(โลจิสติกส์|ไฮโดรเจน|เซลล์เชื้อเพลิง)/
function KeepWords({ text }: { text: string }) {
  return <>{text.split(unbreakable).map((part, index) => index % 2 ? <span key={index} className="executive-hero__nowrap">{part}</span> : part)}</>
}

const themes: [key: 'clean' | 'efficient' | 'transition', Icon: LucideIcon][] = [['clean', Leaf], ['efficient', Route], ['transition', Factory]]

/** Scene 01: clean executive hero. One photograph, strong type, a quiet map, a short entrance. */
export function ExecutiveHeroScene() {
  const { t } = useTranslation()
  const { playing, reducedMotion } = useMotion()
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current || reducedMotion || !playing) return
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'opacity,transform' } })
        .from('[data-hero="backdrop"]', { opacity: 0, duration: 0.6, ease: 'power1.out' }, 0)
        .from('[data-hero="label"]', { opacity: 0, y: 10, duration: 0.5 }, 0.15)
        .from('[data-hero="title"]', { opacity: 0, y: 24, duration: 0.7 }, 0.3)
        .from('[data-hero="subtitle"]', { opacity: 0, y: 16, duration: 0.6 }, 0.5)
        .from('[data-hero="truck"]', { opacity: 0, x: 56, duration: 1.1, ease: 'power2.out' }, 0.65)
        .from('[data-hero="map"]', { opacity: 0, duration: 1.2, ease: 'power1.out' }, 0.65)
        .from('[data-hero="support"]', { opacity: 0, y: 10, duration: 0.5, stagger: 0.1 }, 0.9)
        .from('[data-hero="theme"]', { opacity: 0, y: 8, duration: 0.45, stagger: 0.12 }, 1.1)
    }, root)
    return () => context.revert()
    // Entrance runs once per visit; later pause/resume leaves the finished composition in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  return <section ref={root} className="executive-hero" aria-labelledby="scene-title">
    <div className="executive-hero__backdrop" data-hero="backdrop" aria-hidden="true" />

    <div className="executive-hero__copy">
      <p className="executive-hero__label" lang="en" data-hero="label">{t('openingHero.label')}</p>
      <h1 id="scene-title" className="executive-hero__title">
        <span className="executive-hero__name" lang="en" data-hero="title">{t('openingHero.title')}</span>
        <span className="executive-hero__subtitle" data-hero="subtitle"><KeepWords text={t('openingHero.subtitle')} /></span>
      </h1>
      <p className="executive-hero__support" data-hero="support"><KeepWords text={t('openingHero.support')} /></p>
      <p className="executive-hero__year opening-reference-year" data-hero="support">{t('batchFive.referenceYear')}</p>
      <ul className="executive-hero__themes" aria-label={t('openingHero.themesLabel')}>
        {themes.map(([key, Icon]) => <li key={key} className={`executive-hero__theme executive-hero__theme--${key}`} data-hero="theme">
          <Icon aria-hidden="true" strokeWidth={1.7} />
          <span><KeepWords text={t(`openingHero.themes.${key}`)} /></span>
        </li>)}
      </ul>
    </div>

    <div className="executive-hero__visual">
      <img className="executive-hero__map" data-hero="map" src={`${base}assets/maps/china-outline.svg`} alt="" aria-hidden="true" width="600" height="360" />
      <img className="executive-hero__truck" data-hero="truck" src={`${base}assets/images/hydrogen-truck.jpg`} alt={t('visuals.truckAlt')} width="1536" height="1024" decoding="async" fetchPriority="high" />
    </div>
  </section>
}
