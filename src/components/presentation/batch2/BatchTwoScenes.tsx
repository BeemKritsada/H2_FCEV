import { Component, lazy, Suspense, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Check, GitBranch, TrendingUp } from 'lucide-react'
import facts from '../../../content/batch-two-facts.json'
import { RegionalNetworkMap } from './RegionalNetworkMap'
import { useInfrastructureMotion } from './useInfrastructureMotion'
import { LogisticsFallback } from './LogisticsFallback'
import '../../../styles/batch-two-scenes.css'

const LogisticsStage = lazy(() => import('./LogisticsStage'))
class LogisticsBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
type SceneProps = { count: number; number: number }
function Eyebrow({ count, number }: SceneProps) {
  const { t } = useTranslation()
  return <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('batchTwo.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{String(number).padStart(2, '0')} / {count}</span></div>
}

export function RefuelingNetworkScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useInfrastructureMotion(root)
  return <section ref={root} className="reference-scene batch-two-scene refueling-network-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} /><h1 id="scene-title">{t('batchTwo.network.title')}</h1>
    <div className="network-composition">
      <div className="network-summary">
        <strong className="infra-hero">{facts.completed}</strong><p className="network-completed">{t('batchTwo.network.completed')}</p>
        <p className="network-scale">{t('batchTwo.network.scale')}</p>
        <div className="public-access">
          <svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="44" fill="none" stroke="#dae8f4" strokeWidth="8" /><circle data-public-ring cx="55" cy="55" r="44" fill="none" stroke="#0753c8" strokeWidth="8" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - facts.publicPercentApproximate} transform="rotate(-90 55 55)" /></svg>
          <div><strong>~{facts.publicPercentApproximate}%</strong><span>{t('batchTwo.network.public')}</span></div>
        </div>
        <p className="public-remainder"><strong>~{facts.remainderPercentDerived}%</strong> {t('batchTwo.network.industrial')}<small>{t('batchTwo.network.remainder')}</small></p>
      </div>
      <RegionalNetworkMap />
    </div>
    <footer className="infra-source">{t('batchTwo.source')}</footer>
  </section>
}

export function InfrastructureExpansionScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useInfrastructureMotion(root)
  const milestones = [
    { value: facts.completed, key: 'completed', Icon: Check },
    { value: facts.plannedOrConstruction, key: 'planned', Icon: GitBranch },
    { value: `${facts.projectedLowerBoundExclusive}+`, key: 'projected', Icon: TrendingUp },
  ]
  return <section ref={root} className="reference-scene batch-two-scene infrastructure-expansion-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} /><h1 id="scene-title">{t('batchTwo.expansion.title')}</h1>
    <p className="infra-subtitle">{t('batchTwo.expansion.subtitle')}</p>
    <div className="expansion-composition">
      <div className="expansion-milestones">
        {milestones.map(({ value, key, Icon }, index) => <div key={key} className={`expansion-milestone expansion-milestone--${key}`} data-forecast={index === 2 ? '' : undefined}>
          <span className="expansion-milestone__icon" data-milestone><Icon size={26} aria-hidden="true" /></span>
          <strong>{value}</strong>
          <h2>{t(`batchTwo.expansion.${key}`, { year: facts.projectionYear })}</h2>
          <p>{t(`batchTwo.expansion.${key}Note`, { value: facts.projectedLowerBoundExclusive })}</p>
        </div>)}
      </div>
      <div className="expansion-paths" role="img" aria-label={t('batchTwo.expansion.diagramAlt')}>
        <svg className="expansion-connector" viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 22 H1000" fill="none" stroke="#c2d9ed" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path data-development-branch d="M250 22 H750" fill="none" stroke="#6c9dd0" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength="1" strokeDasharray="1" />
          <path className="infra-signal" d="M0 22 H1000" fill="none" stroke="#00a8e8" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength="100" strokeDasharray="3 97" />
        </svg>
        {milestones.map(({ key }, index) => <svg className="expansion-node" key={key} viewBox="0 0 44 44" aria-hidden="true">
          <circle className="infra-node-pulse" cx="22" cy="22" r="12" fill="none" stroke="#00a8e8" style={{ animationDelay: `${index * -1}s` }} />
          <circle cx="22" cy="22" r="7" fill={index === 1 ? '#fff' : '#0753c8'} stroke="#0753c8" strokeWidth="2" />
        </svg>)}
      </div>
    </div>
    <p className="expansion-note">{t('batchTwo.expansion.note')}</p>
    <footer className="infra-source">{t('batchTwo.source')}</footer>
  </section>
}

export function HydrogenTransportScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useInfrastructureMotion(root)
  const fallback = <LogisticsFallback />
  return <section ref={root} className="reference-scene batch-two-scene hydrogen-transport-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} /><h1 id="scene-title">{t('batchTwo.transport.title')}</h1>
    <div className="logistics-composition">
      <div className="logistics-system">
        <figure className="logistics-figure">
          <div className="logistics-stage" role="img" aria-label={t('batchTwo.transport.visualAlt')}>
            <LogisticsBoundary fallback={fallback}><Suspense fallback={fallback}><LogisticsStage playing={playing} reducedMotion={reducedMotion} fallback={fallback} /></Suspense></LogisticsBoundary>
          </div>
          <figcaption>{t('batchTwo.transport.concept')}</figcaption>
        </figure>
        <ol className="logistics-process">{['production', 'storage', 'transportation', 'refueling'].map((key, index) => <li key={key}><span>{t(`batchTwo.transport.${key}`)}</span>{index < 3 && <ArrowRight size={18} aria-hidden="true" />}</li>)}</ol>
        <div className="pipeline-status"><p><i className="pipeline-status__operating" />{t('batchTwo.transport.pilot')}</p><p><i className="pipeline-status__limited" />{t('batchTwo.transport.interregional')}</p></div>
        <p className="pressure-note">{t('batchTwo.transport.pressure')}</p>
      </div>
      <aside className="logistics-cost" data-cost>
        <strong className="cost-statistic">
          <span className="sr-only">{facts.retailStorageTransportSharePercent.join('–')}%</span>
          <span className="cost-statistic__value" aria-hidden="true">
            <span>{facts.retailStorageTransportSharePercent[0]}</span>
            <span className="cost-statistic__separator">–</span>
            <span>{facts.retailStorageTransportSharePercent[1]}</span>
            <span className="cost-statistic__unit">%</span>
          </span>
        </strong>
        <h2>{t('batchTwo.transport.cost')}</h2>
        <div className="cost-band" aria-hidden="true"><span /><i /></div>
        <p>{t('batchTwo.transport.impact')}</p>
      </aside>
    </div>
    <footer className="infra-source">{t('batchTwo.transport.source')}</footer>
  </section>
}
