import { Component, lazy, Suspense, useRef, type ReactNode } from 'react'
import { ArrowUpRight, Factory, Flame, Layers3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import facts from '../../content/reference-facts.json'
import { useSceneMotion } from '../motion/useSceneMotion'
import { AnimatedNumber } from './AnimatedNumber'
import { ChinaMap } from './ChinaMap'

const LivingChinaMap = lazy(() => import('./LivingChinaMap'))

class MapBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function MapFallback() {
  const { t } = useTranslation()
  return <div className="living-map__fallback"><ChinaMap compact /><span className="map-fallback-label">{t('reference.overview.fallback')}</span></div>
}

function ReferenceEyebrow({ titleKey, index, count }: { titleKey: string; index: number; count: number }) {
  const { t } = useTranslation()
  return <div className="reference-eyebrow" data-enter>
    <span className="reference-eyebrow__index">{String(index).padStart(2, '0')}</span>
    <span>{t(titleKey)}</span>
    <span className="reference-eyebrow__rule" aria-hidden="true" />
    <span className="reference-eyebrow__total">{String(index).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
  </div>
}

function SourceNote({ mix = false }: { mix?: boolean }) {
  const { t } = useTranslation()
  return <div className="reference-source">
    <span>{t(mix ? 'reference.mix.sourceNote' : 'reference.overview.sourceNote', {
      year: facts.overview.verifiedDataYear, edition: facts.overview.originalReferenceYear,
    })}</span>
    <a href={facts.source.url} target="_blank" rel="noreferrer">{t('reference.sourceLink')}<ArrowUpRight size={17} aria-hidden="true" /></a>
  </div>
}

export function ChinaOverviewScene({ count }: { count: number }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useSceneMotion(root)
  return <section ref={root} className="reference-scene overview-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <ReferenceEyebrow titleKey="reference.overview.eyebrow" index={2} count={count} />
    <div className="overview-composition">
      <div className="overview-copy">
        <h1 id="scene-title" data-enter>{t('reference.overview.title')}<span>{t('reference.overview.titleAccent')}</span></h1>
        <div className="overview-metric" data-enter>
          <span className="overview-metric__label">{t('reference.overview.production')}</span>
          <div className="overview-metric__number"><span className="overview-metric__sign">&gt;</span><AnimatedNumber value={facts.overview.annualProductionMillionTonnes} decimals={1} active={playing} /></div>
          <span className="overview-metric__unit">{t('reference.overview.unit')}</span>
        </div>
        <div className="overview-rank" data-enter>
          <strong><span aria-hidden="true">#</span>{facts.overview.globalRank}</strong>
          <div><span>{t('reference.overview.rank')}</span><small>{t('reference.overview.rankContext', { year: facts.overview.verifiedDataYear })}</small></div>
        </div>
      </div>
      <figure className="living-map" data-enter>
        <div className="living-map__meta"><span>{t('visuals.china')}</span><span>H₂</span></div>
        <div className="living-map__canvas" role="img" aria-label={t('reference.overview.mapAlt')}>
          <MapBoundary fallback={<MapFallback />}><Suspense fallback={<MapFallback />}>
            <LivingChinaMap playing={playing} reducedMotion={reducedMotion} fallback={<MapFallback />} />
          </Suspense></MapBoundary>
        </div>
        <figcaption><i className="map-legend-dot" aria-hidden="true" />{t('reference.overview.mapCaption')}</figcaption>
        <span className="living-map__corner living-map__corner--tl" aria-hidden="true" /><span className="living-map__corner living-map__corner--br" aria-hidden="true" />
      </figure>
    </div>
    <SourceNote />
  </section>
}

const mixIcons = { coal: Layers3, byproduct: Factory, gas: Flame }

export function ProductionMixScene({ count }: { count: number }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useSceneMotion(root)
  const sum = facts.productionMix.items.reduce((total, item) => total + item.value, 0)
  return <section ref={root} className="reference-scene mix-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <ReferenceEyebrow titleKey="reference.mix.eyebrow" index={3} count={count} />
    <header className="mix-heading" data-enter>
      <div><h1 id="scene-title">{t('reference.mix.title')}</h1><p>{t('reference.mix.subtitle')}</p></div>
      <span className="reference-period">{t('reference.dataYear', { year: facts.productionMix.verifiedDataYear })}</span>
    </header>
    <div className="mix-chart" role="group" aria-label={t('reference.mix.chartLabel')}>
      <div className="mix-chart__scale" aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></div>
      {facts.productionMix.items.map((item, index) => {
        const Icon = mixIcons[item.id as keyof typeof mixIcons]
        return <div className={`mix-row mix-row--${item.id}`} key={item.id}>
          <div className="mix-row__label" data-enter><Icon size={27} strokeWidth={1.6} aria-hidden="true" /><span>{t(item.labelKey)}<small>{t(item.detailKey)}</small></span></div>
          <div className="mix-row__plot">
            <div className="mix-row__grid" aria-hidden="true" />
            <div className="mix-row__track" role="meter" aria-label={t(item.labelKey)} aria-valuemin={0} aria-valuemax={facts.productionMix.scaleMaximum} aria-valuenow={item.value} aria-valuetext={`${item.value}%`}>
              <div className="mix-row__fill" data-bar style={{ width: `${item.value / facts.productionMix.scaleMaximum * 100}%` }}><span className="energy-shimmer" style={{ animationDelay: `${index * -1.9}s` }} /></div>
            </div>
            <strong className="mix-row__value" style={{ left: `${item.value}%` }} data-enter><AnimatedNumber value={item.value} /><span>%</span></strong>
          </div>
        </div>
      })}
    </div>
    <div className="mix-note" data-enter><span className="mix-note__mark" aria-hidden="true" /><p>{t('reference.mix.totalNote', { total: sum })}</p><span>{t('reference.mix.scaleNote')}</span></div>
    <SourceNote mix />
  </section>
}
