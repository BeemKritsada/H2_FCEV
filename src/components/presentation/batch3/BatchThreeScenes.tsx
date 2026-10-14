import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Building2, Compass, MoveRight } from 'lucide-react'
import facts from '../../../content/batch-three-facts.json'
import { useVehicleMarketMotion } from './useVehicleMarketMotion'
import { MarketTruck } from './VehicleArtwork'
import VehicleCarousel from './VehicleCarousel'
import '../../../styles/batch-three-scenes.css'

type SceneProps = { count: number; number: number }
function Eyebrow({ count, number }: SceneProps) {
  const { t } = useTranslation()
  return <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('batchThree.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{String(number).padStart(2, '0')} / {count}</span></div>
}
function Source({ vehicles = false }: { vehicles?: boolean }) {
  const { t } = useTranslation()
  return <footer className="market-source"><span>{t('batchThree.source', { slide: facts.sourceSlide })}</span>{vehicles && <span>{t('batchThree.assetNote')}</span>}</footer>
}
export function VehicleFleetScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useVehicleMarketMotion(root)
  return <section ref={root} className="reference-scene batch-three-scene vehicle-fleet-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} />
    <header className="fleet-heading"><h1 id="scene-title">{t('batchThree.fleet.title')}</h1><p className="market-context">{t('batchThree.fleet.context', { year: facts.referenceYear })}</p></header>
    <div className="fleet-composition">
      <div className="fleet-copy">
        <p className="fleet-period">{t('batchThree.fleet.period', { year: facts.fleet.year })}</p>
        <div className="fleet-total"><span className="market-qualifier">{t('batchThree.fleet.approximate')}</span><strong><span className="sr-only">{facts.fleet.value.toLocaleString('en-US')}</span><span aria-hidden="true" data-fleet-count={facts.fleet.value}>{facts.fleet.value.toLocaleString('en-US')}</span></strong><p>{t('batchThree.fleet.accumulated')}</p></div>
        <div className="fleet-sales" data-monthly-sales><span className="market-qualifier">{t('batchThree.fleet.nearly')}</span><div className="fleet-sales__value"><strong>{facts.monthlySales.value.toLocaleString('en-US')}</strong><span>{t('batchThree.fleet.monthlyUnit')}</span></div><p>{t('batchThree.fleet.sales', { year: facts.monthlySales.year })}</p></div>
      </div>
      <div className="fleet-vehicle">
        <span className="market-art-label">{t('batchThree.fleet.vehicleLabel')}</span><MarketTruck />
        <p className="fleet-rank"><span aria-hidden="true" /><span>{t('batchThree.fleet.rank')}</span></p>
      </div>
    </div>
    <Source vehicles />
  </section>
}

export function MarketTransitionScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useVehicleMarketMotion(root)
  return <section ref={root} className="reference-scene batch-three-scene market-transition-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} /><h1 id="scene-title">{t('batchThree.transition.title')}</h1>
    <div className="market-journey">
      <div className="market-phases">
        <article className="market-phase market-phase--momentum" data-market-phase>
          <div className="market-phase__period"><span>{t('batchThree.transition.late')}</span><strong>{facts.transition.momentumYear}</strong></div>
          <div className="market-phase__heading"><Building2 aria-hidden="true" size={30} strokeWidth={1.5} /><h2>{t('batchThree.transition.momentum')}</h2></div>
          <p>{t('batchThree.transition.momentumDetail', { year: facts.transition.momentumYear })}</p>
        </article>
        <article className="market-phase market-phase--adjustment" data-market-phase>
          <div className="market-phase__period"><span>{t('batchThree.transition.early')}</span><strong>{facts.transition.adjustmentYear}</strong></div>
          <div className="market-phase__heading"><Compass aria-hidden="true" size={30} strokeWidth={1.5} /><h2>{t('batchThree.transition.adjustment')}</h2></div>
          <p>{t('batchThree.transition.adjustmentDetail', { year: facts.transition.adjustmentYear })}</p>
        </article>
      </div>
      <figure className="market-phase-track" role="img" aria-label={t('batchThree.transition.diagramAlt')}>
        <svg className="market-phase-track__line" viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 22 H1000" fill="none" stroke="#dce7f1" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path data-market-track d="M0 22 H1000" fill="none" stroke="#5b98c7" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength="1" strokeDasharray="1" />
          <path className="market-energy-flow" d="M0 22 H1000" fill="none" stroke="#00a8e8" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength="100" strokeDasharray="4 96" />
        </svg>
        {[0, 1].map((index) => <svg className="market-phase-track__node" key={index} viewBox="0 0 44 44" aria-hidden="true"><circle className="market-phase-pulse" cx="22" cy="22" r="12" fill="none" stroke="#00a8e8" style={{ animationDelay: `${index * -2}s` }} /><circle cx="22" cy="22" r="6" fill={index ? '#fff' : '#0753c8'} stroke="#0753c8" strokeWidth="2" /></svg>)}
        <span className="market-phase-track__direction" aria-hidden="true"><ArrowRight size={24} strokeWidth={1.5} /></span>
      </figure>
    </div>
    <div className="market-outcome" data-market-outcome><MoveRight size={38} strokeWidth={1.4} aria-hidden="true" /><div><h2>{t('batchThree.transition.outcome')}</h2><p>{t('batchThree.transition.outcomeDetail')}</p></div></div>
    <p className="market-qualitative">{t('batchThree.transition.qualitative')}</p>
    <Source />
  </section>
}

export function MarketStructureScene(props: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useVehicleMarketMotion(root)
  return <section ref={root} className="reference-scene batch-three-scene market-structure-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <Eyebrow {...props} />
    <header className="structure-heading"><h1 id="scene-title">{t('batchThree.structure.title')}</h1><p>{t('batchThree.structure.scope')}</p></header>
    <VehicleCarousel reducedMotion={reducedMotion} />
    <Source vehicles />
  </section>
}
