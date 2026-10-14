import { Component, lazy, Suspense, useRef, type ReactNode } from 'react'
import { ArrowRight, Droplets, MapPin, Sun, Wind, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import facts from '../../../content/batch-one-facts.json'
import { useSceneMotion } from '../../motion/useSceneMotion'
import { ConceptFallback } from './ConceptFallback'
import '../../../styles/batch-one-scenes.css'

const HydrogenStage = lazy(() => import('./HydrogenStage'))
type StageKind = 'facility' | 'equipment'

class StageBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function BatchEyebrow({ number, count, label }: { number: number; count: number; label: string }) {
  return <div className="reference-eyebrow" data-enter>
    <span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span>
    <span>{label}</span><span className="reference-eyebrow__rule" aria-hidden="true" />
    <span className="reference-eyebrow__total">{String(number).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
  </div>
}

function ConceptStage({ kind, playing, reducedMotion }: { kind: StageKind; playing: boolean; reducedMotion: boolean }) {
  const { t } = useTranslation()
  const fallback = <ConceptFallback kind={kind} />
  return <div className={`batch-stage batch-stage--${kind}`} role="img" aria-label={t(`batchOne.${kind === 'facility' ? 'green' : 'equipment'}.visualAlt`)}>
    <StageBoundary fallback={fallback}><Suspense fallback={fallback}>
      <HydrogenStage kind={kind} playing={playing} reducedMotion={reducedMotion} fallback={fallback} />
    </Suspense></StageBoundary>
  </div>
}

function BatchSource({ equipment = false }: { equipment?: boolean }) {
  const { t } = useTranslation()
  return <footer className="batch-source">
    <span>{t(equipment ? 'batchOne.equipment.sourceNote' : 'batchOne.green.sourceNote', { slide: facts.sourceSlide })}</span>
    <span className="batch-concept-note">{t('batchOne.conceptNote')}</span>
  </footer>
}

export function GreenHydrogenScene({ count, number }: { count: number; number: number }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useSceneMotion(root)
  return <section ref={root} className="reference-scene batch-one-scene green-expansion-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <BatchEyebrow number={number} count={count} label={t('batchOne.green.eyebrow')} />
    <header className="batch-heading" data-enter>
      <h1 id="scene-title">{t('batchOne.green.title')} <span>{t('batchOne.green.titleAccent')}</span></h1>
      <p>{t('batchOne.green.subtitle')}</p>
    </header>
    <div className="green-composition">
      <div className="green-facility">
        <figure className="green-facility__visual" data-enter>
          <span className="batch-visual-label">{t('batchOne.green.visualLabel')}</span>
          <ConceptStage kind="facility" playing={playing} reducedMotion={reducedMotion} />
          <figcaption className="green-facility__legend">
            <span><i className="batch-dot batch-dot--green" />{t('batchOne.green.electricity')}</span>
            <span><i className="batch-dot batch-dot--blue" />{t('batchOne.green.hydrogen')}</span>
          </figcaption>
        </figure>
        <ol className="green-process" aria-label={t('batchOne.green.processLabel')} data-enter>
          {facts.greenHydrogen.processKeys.map((key, index) => <li key={key}>
            {index === 0 ? <span className="green-process__renewables"><Wind size={22} aria-hidden="true" /><Sun size={20} aria-hidden="true" /></span> : index === 1 ? <Zap size={24} aria-hidden="true" /> : index === 2 ? <Droplets size={24} aria-hidden="true" /> : <span className="green-process__h2" aria-hidden="true">H₂</span>}
            <span>{t(key)}</span>{index < facts.greenHydrogen.processKeys.length - 1 && <ArrowRight className="green-process__arrow" size={20} aria-hidden="true" />}
          </li>)}
        </ol>
      </div>
      <aside className="green-metrics" aria-label={t('batchOne.green.capacityLabel')}>
        <div className="green-metric green-metric--operating" data-enter>
          <span className="green-metric__status"><i className="batch-dot batch-dot--green" />{t('batchOne.green.operating')}</span>
          <strong>{facts.greenHydrogen.operatingCapacity.value.toLocaleString('en-US')}</strong>
          <span className="green-metric__unit">{t(facts.greenHydrogen.operatingCapacity.unitKey)}</span>
        </div>
        <div className="green-metric green-metric--construction" data-enter>
          <span className="green-metric__status"><i className="batch-dot batch-dot--orange" />{t('batchOne.green.construction')}</span>
          <strong>{facts.greenHydrogen.underConstruction.value.toLocaleString('en-US')}</strong>
          <span className="green-metric__unit">{t(facts.greenHydrogen.underConstruction.unitKey)}</span>
          <p className="green-metric__caution">{t('batchOne.green.unitNote')}</p>
        </div>
      </aside>
    </div>
    <div className="green-regions" data-enter>
      <div className="green-regions__context"><MapPin size={22} aria-hidden="true" /><span>{t('batchOne.green.northwest')}<small>{t('batchOne.green.resourceNote')}</small></span></div>
      <ul aria-label={t('batchOne.green.regionsLabel')}>{facts.greenHydrogen.regionKeys.map((key) => <li key={key}>{t(key)}</li>)}</ul>
    </div>
    <BatchSource />
  </section>
}

export function EquipmentTechnologyScene({ count, number }: { count: number; number: number }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useSceneMotion(root)
  return <section ref={root} className="reference-scene batch-one-scene equipment-technology-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <BatchEyebrow number={number} count={count} label={t('batchOne.equipment.eyebrow')} />
    <header className="equipment-heading">
      <div className="batch-heading" data-enter><h1 id="scene-title">{t('batchOne.equipment.title')}<span>{t('batchOne.equipment.titleAccent')}</span></h1></div>
      <div className="equipment-localization" data-enter>
        <strong>{facts.equipment.localizationLowerBound}<span>%+</span></strong>
        <span>{t('batchOne.equipment.localization')}</span>
      </div>
    </header>
    <div className="equipment-showcase">
      <span className="batch-visual-label" data-enter>{t('batchOne.equipment.visualLabel')}</span>
      <ConceptStage kind="equipment" playing={playing} reducedMotion={reducedMotion} />
      <ol className="equipment-captions">
        {facts.equipment.items.map((item, index) => <li key={item.id} data-enter>
          <span className="equipment-captions__index">{String(index + 1).padStart(2, '0')}</span>
          <h2>{t(item.labelKey)}</h2><p>{t(item.detailKey)}</p>
        </li>)}
      </ol>
    </div>
    <p className="equipment-standard" data-enter><span aria-hidden="true" />{t('batchOne.equipment.standardClaim')}</p>
    <BatchSource equipment />
  </section>
}
