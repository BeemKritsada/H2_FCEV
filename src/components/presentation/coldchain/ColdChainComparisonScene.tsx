import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { BatteryCharging, Boxes, Clock3, Gauge, type LucideIcon } from 'lucide-react'
import facts from '../../../content/cold-chain-facts.json'
import { useMotion } from '../../motion/motion-context'
import { StateNumberSequence } from '../../motion/SceneNumberSequence'
import { AnimatedNumber } from '../AnimatedNumber'
import { coldChainImage } from '../batch5/assets'
import '../../../styles/batch-five-scenes.css'
import '../../../styles/cold-chain-comparison.css'

const topics = ['energy', 'payload', 'time', 'range'] as const
type Topic = (typeof topics)[number]
type Side = 'bev' | 'fcev'
const icons: Record<Topic, LucideIcon> = {
  energy: BatteryCharging,
  payload: Boxes,
  time: Clock3,
  range: Gauge,
}

function TopicFigure({ topic, side }: { topic: Topic; side: Side }) {
  const { t } = useTranslation()
  const prefix = `coldChainScene.topics.${topic}`
  const value = topic === 'time'
    ? (side === 'fcev' ? facts.hydrogenRefuelMinutes : facts.bevChargeHours)
    : topic === 'range' && side === 'fcev' ? facts.hydrogenRangeKm : null
  const unit = topic === 'time'
    ? t(`coldChainScene.units.${side === 'fcev' ? 'minutes' : 'hours'}`)
    : t('coldChainScene.units.kilometers')
  return <div className={`cold-chain-result cold-chain-result--${side}`} data-topic-item>
    <span className="cold-chain-result__side">{side.toUpperCase()}</span>
    <span className="cold-chain-result__label">{t(`${prefix}.${side}Label`)}</span>
    {value ? <strong><AnimatedNumber value={value} /><small>{unit}</small></strong> : <span className="cold-chain-result__qualitative">{t(`${prefix}.${side}Callout`)}</span>}
    {value && <p>{t(`${prefix}.${side}Callout`)}</p>}
  </div>
}

function TopicDetail({ topic }: { topic: Topic }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const { playing, reducedMotion } = useMotion()
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      timeline.current = gsap.timeline().from('[data-topic-item]', {
        opacity: 0, y: 12, duration: 0.48, stagger: 0.08, ease: 'power3.out',
      })
    }, root)
    return () => { context.revert(); timeline.current = null }
  }, [reducedMotion])
  useLayoutEffect(() => {
    if (playing) timeline.current?.resume()
    else if (timeline.current?.progress() === 0) timeline.current.progress(1).pause()
    else timeline.current?.pause()
  }, [playing])
  return <div ref={root} className={`cold-chain-topic-detail cold-chain-topic-detail--${topic}`}>
    <StateNumberSequence stateId={topic} delay={0.55}>
      <div className="cold-chain-topic-detail__results">
        <TopicFigure topic={topic} side="fcev" />
        <TopicFigure topic={topic} side="bev" />
      </div>
    </StateNumberSequence>
    <p className="cold-chain-topic-detail__explanation" data-topic-item>{t(`coldChainScene.topics.${topic}.explanation`)}</p>
  </div>
}

export function ColdChainComparisonScene({ number, count }: { number: number; count: number }) {
  const { t } = useTranslation()
  const { playing, reducedMotion } = useMotion()
  const root = useRef<HTMLElement>(null)
  const entrance = useRef<gsap.core.Timeline | null>(null)
  const [activeTopic, setActiveTopic] = useState<Topic>('time')
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      entrance.current = gsap.timeline()
        .from('[data-cold-enter]', { opacity: 0, y: 15, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, 0)
        .from('.cold-chain-vehicle img', { opacity: 0, x: -14, duration: 0.8, stagger: 0.18, ease: 'power2.out' }, 0.15)
    }, root)
    return () => { context.revert(); entrance.current = null }
  }, [reducedMotion])
  useLayoutEffect(() => {
    if (playing) entrance.current?.resume()
    else if (entrance.current?.progress() === 0) entrance.current.progress(1).pause()
    else entrance.current?.pause()
  }, [playing])
  return <section ref={root} className="reference-scene cold-chain-scene" data-motion={playing ? 'running' : 'paused'} aria-labelledby="scene-title">
    <div className="reference-eyebrow" data-cold-enter><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('coldChainScene.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="cold-chain-heading" data-cold-enter><h1 id="scene-title">{t('coldChainScene.title')}</h1><p>{t('coldChainScene.subtitle')}</p></header>
    <div className="cold-chain-vehicles">
      {(['bev', 'fcev'] as const).map(side => <figure className={`cold-chain-vehicle cold-chain-vehicle--${side}`} key={side}>
        <figcaption>{t(`coldChainScene.${side}`)}</figcaption>
        <div className="cold-chain-vehicle__stage"><img src={coldChainImage(side)} alt={t(`coldChainScene.${side}Alt`)} width="1672" height="941" decoding="async" fetchPriority="high" /></div>
      </figure>)}
    </div>
    <div className="performance-highlights cold-chain-selectors" role="group" aria-label={t('coldChainScene.selector')} data-cold-enter>
      {topics.map(topic => {
        const Icon = icons[topic]
        return <button key={topic} type="button" aria-pressed={activeTopic === topic} onClick={() => setActiveTopic(topic)}><Icon size={20} aria-hidden="true" />{t(`coldChainScene.topics.${topic}.short`)}</button>
      })}
    </div>
    <div className="cold-chain-detail-region" aria-live="polite"><TopicDetail key={activeTopic} topic={activeTopic} /></div>
    <footer className="cold-chain-source" data-cold-enter><span>{t('coldChainScene.source', { slide: facts.sourceSlide })} · {t('coldChainScene.scope')}</span><span>{t('coldChainScene.assetNote')}</span></footer>
  </section>
}
