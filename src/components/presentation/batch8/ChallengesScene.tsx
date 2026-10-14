import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ArrowUpRight, CarFront, Fuel, Gauge, type LucideIcon } from 'lucide-react'
import facts from '../../../content/batch-eight-facts.json'
import { AnimatedNumber } from '../AnimatedNumber'
import { useMotion } from '../../motion/motion-context'
import { StateNumberSequence } from '../../motion/SceneNumberSequence'
import { useStateNumbersSeen } from '../../motion/useStateNumbersSeen'
import { challengeIds, challengeImage, type ChallengeId } from './assets'
import '../../../styles/batch-eight-scenes.css'

const icons: Record<ChallengeId, LucideIcon> = { purchase: CarFront, refueling: Fuel, operating: Gauge }
// Stable references: AnimatedNumber serialises them, but module constants keep intent obvious.
const multipleDecimals = [1, 0] as const
// Mirrors SceneNumberSequence: delay, 0.85s per figure, 0.12s gap.
const countDelay = 0.45
const secondFigureStart = countDelay + 0.85 + 0.12

type SceneProps = { number: number; count: number }

function Figure({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`challenge-figure ${className}`} data-detail-item><span className="challenge-figure__label">{label}</span><strong>{children}</strong></div>
}

function ChallengeFigures({ id }: { id: ChallengeId }) {
  const { t } = useTranslation()
  if (id === 'purchase') return <div className="challenge-figures">
    <Figure label={t('batchEight.purchase.priceLabel')}><AnimatedNumber value={facts.purchase.startingPriceRmb} suffix="+" /><small>{t('batchEight.units.rmb')}</small></Figure>
    <Figure label={t('batchEight.purchase.multipleLabel')} className="challenge-figure--secondary"><AnimatedNumber value={facts.purchase.costMultiple} decimals={multipleDecimals} suffix="×" /></Figure>
  </div>
  if (id === 'refueling') return <div className="challenge-figures challenge-figures--pressure">
    <div className="pressure-row" data-detail-item data-pressure="common">
      <strong><AnimatedNumber value={facts.refueling.commonPressureMpa} /><small>{t('batchEight.units.mpa')}</small></strong>
      <div><span className="pressure-status">{t('batchEight.refueling.commonStatus')}</span><p>{t('batchEight.refueling.commonLabel')}</p></div>
    </div>
    <div className="pressure-row" data-detail-item data-pressure="limited">
      <strong><AnimatedNumber value={facts.refueling.limitedPressureMpa} /><small>{t('batchEight.units.mpa')}</small></strong>
      <div><span className="pressure-status pressure-status--limited">{t('batchEight.refueling.limitedStatus')}</span><p>{t('batchEight.refueling.limitedLabel')}</p></div>
    </div>
  </div>
  return <div className="challenge-figures">
    <Figure label={t('batchEight.operating.priceLabel')} className="challenge-figure--warning"><AnimatedNumber value={facts.operating.averageRetailRmbPerKg} decimals={1} /><small>{t('batchEight.units.rmbPerKg')}</small><i className="challenge-figure__accent" aria-hidden="true" data-cost-accent /></Figure>
    <p className="cost-comparison" data-detail-item>{t('batchEight.operating.comparison')}</p>
  </div>
}

/** Mounted per selection; its entrance and numbers play only on the challenge's first view. */
function ChallengeDetail({ id, firstView }: { id: ChallengeId; firstView: boolean }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const { playing, reducedMotion } = useMotion()
  // Fixed at mount, matching the number sequence: pausing later must not rebuild the entrance.
  const [animate] = useState(() => firstView && playing && !reducedMotion)
  const index = challengeIds.indexOf(id) + 1
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      const sequence = gsap.timeline()
      timeline.current = sequence
      sequence.from('[data-detail-item]', { opacity: 0, y: 14, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, 0)
      if (!animate) return
      // The pressure classes activate in the same order the numbers count.
      sequence.fromTo('[data-pressure="common"]', { '--pressure-active': 0 }, { '--pressure-active': 1, duration: 0.5 }, countDelay)
      sequence.fromTo('[data-pressure="limited"]', { '--pressure-active': 0 }, { '--pressure-active': 1, duration: 0.5 }, secondFigureStart)
      sequence.from('[data-cost-accent]', { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power2.out' }, countDelay + 0.85)
    }, root)
    return () => { context.revert(); timeline.current = null }
  }, [animate, reducedMotion])
  useLayoutEffect(() => {
    if (playing) timeline.current?.resume()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1).pause()
    else timeline.current?.pause()
  }, [playing])
  return <div ref={root} className={`challenge-detail challenge-detail--${id}`}>
    <span className="challenge-detail__position" data-detail-item>{t('batchEight.position', { index })}</span>
    <h2 data-detail-item>{t(`batchEight.${id}.title`)}</h2>
    <StateNumberSequence stateId={id} delay={countDelay}><ChallengeFigures id={id} /></StateNumberSequence>
    <p className="challenge-detail__support" data-detail-item>{t(`batchEight.${id}.support`)}</p>
  </div>
}

export function ChallengesScene({ number, count }: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const { playing, reducedMotion } = useMotion()
  const seen = useStateNumbersSeen()
  const [active, setActive] = useState<ChallengeId>('purchase')
  // Captured at selection time, before the state's number sequence marks it as seen.
  const [firstView, setFirstView] = useState(() => !seen('purchase'))
  const previous = useRef(active)
  const entrance = useRef<gsap.core.Timeline | null>(null)

  const select = (id: ChallengeId) => {
    if (id === active) return
    setFirstView(!seen(id))
    setActive(id)
  }

  // Frame opacity is owned by GSAP from the first paint so a crossfade starts from the real value.
  useLayoutEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>('.challenge-frame').forEach((frame) => gsap.set(frame, { opacity: frame.dataset.challenge === previous.current ? 1 : 0 }))
  }, [])

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      entrance.current = gsap.timeline()
        .from('[data-enter]', { opacity: 0, y: 18, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, 0)
        .from('.challenge-frame.is-active', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power3.inOut' }, 0.1)
    }, root)
    return () => { context.revert(); entrance.current = null }
  }, [reducedMotion])

  useLayoutEffect(() => {
    // A paused presentation shows the finished composition rather than an invisible first frame.
    if (playing) entrance.current?.resume()
    else if (entrance.current?.progress() === 0) entrance.current.progress(1).pause()
    else entrance.current?.pause()
  }, [playing])

  // Crossfade on selection. Killing in-flight tweens keeps rapid clicks on the latest choice.
  useLayoutEffect(() => {
    if (previous.current === active || !stage.current) return
    previous.current = active
    const frames = [...stage.current.querySelectorAll<HTMLElement>('.challenge-frame')]
    gsap.killTweensOf(frames)
    frames.forEach((frame) => {
      const incoming = frame.dataset.challenge === active
      if (reducedMotion) { gsap.set(frame, { opacity: incoming ? 1 : 0, scale: 1, clipPath: 'none' }); return }
      if (incoming) gsap.fromTo(frame, { opacity: Number(gsap.getProperty(frame, 'opacity')), scale: 1.035 }, { opacity: 1, scale: 1, clipPath: 'none', duration: 0.8, ease: 'power3.out' })
      else gsap.to(frame, { opacity: 0, scale: 0.985, duration: 0.55, ease: 'power2.inOut' })
    })
  }, [active, reducedMotion])

  const image = facts.images[active]
  const credit = 'source' in image ? image : null
  return <section ref={root} className="reference-scene challenges-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'} data-active={active}>
    <div className="reference-eyebrow" data-enter><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('batchEight.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="challenges-heading" data-enter><h1 id="scene-title">{t('batchEight.title')}</h1><p>{t('batchEight.subtitle')}</p></header>

    <div className="challenges-layout">
      <div className="challenge-stage" ref={stage} data-enter>
        {challengeIds.map((id) => <figure key={id} className={`challenge-frame challenge-frame--${id}${id === active ? ' is-active' : ''}`} data-challenge={id} aria-hidden={id !== active}>
          <img src={challengeImage(id)} alt={t(`batchEight.${id}.alt`)} width={facts.images[id].size[0]} height={facts.images[id].size[1]} decoding="async" fetchPriority={id === 'purchase' ? 'high' : 'auto'} />
          {id === 'refueling' && <span className="dispenser-marker" aria-hidden="true"><i /><span>{t('batchEight.refueling.dispenser')}</span></span>}
          <span className="challenge-frame__index" aria-hidden="true">{String(challengeIds.indexOf(id) + 1).padStart(2, '0')}</span>
          <figcaption>{t(`batchEight.${id}.credit`)}</figcaption>
        </figure>)}
      </div>

      <div className="challenge-detail-region" aria-live="polite">
        <ChallengeDetail key={active} id={active} firstView={firstView} />
      </div>

      <div className="challenge-selectors" role="group" aria-label={t('batchEight.selector')} data-enter>
        {challengeIds.map((id, index) => {
          const Icon = icons[id]
          return <button type="button" key={id} className="challenge-selector" aria-pressed={id === active} onClick={() => select(id)}>
            <span className="challenge-selector__thumb" aria-hidden="true"><img src={challengeImage(id)} alt="" width="160" height="100" decoding="async" /></span>
            <span className="challenge-selector__text"><span className="challenge-selector__index"><Icon size={18} aria-hidden="true" />{String(index + 1).padStart(2, '0')}</span><span className="challenge-selector__title">{t(`batchEight.${id}.short`)}</span></span>
          </button>
        })}
      </div>
    </div>

    <footer className="logistics-source challenges-source" data-enter>
      <span>{t('batchEight.source', { slide: facts.sourceSlide })}<span className="challenges-source__note">{t(`batchEight.${active}.scope`)}</span></span>
      <div>{credit && <a href={credit.source} target="_blank" rel="noreferrer">{credit.credit} · {credit.license}<ArrowUpRight size={15} aria-hidden="true" /></a>}</div>
    </footer>
  </section>
}
