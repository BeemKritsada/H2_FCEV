import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ArrowDown, ArrowRight, ArrowLeft, ArrowUp, Boxes, ChartNoAxesCombined, Check, CircleDollarSign, Droplets, Factory, Fuel, Gauge, Leaf, Network, Settings, Ship, Snowflake, Sun, Thermometer, Truck, Users, Wind, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { useMotion } from '../../motion/motion-context'
import { logisticsImage, performanceTruck } from '../batch5/assets'
import '../../../styles/batch-five-scenes.css'
import '../../../styles/batch-nine-scenes.css'

type Kind = 'advantages' | 'barriers'
const stationImage = `${import.meta.env.BASE_URL}assets/images/challenges/refueling-station.webp`
const carImage = `${import.meta.env.BASE_URL}assets/images/challenges/fcev-sedan.webp`
const topicIcons: Record<Kind, LucideIcon[]> = {
  advantages: [Leaf, Fuel, Snowflake, Wind, Factory],
  barriers: [CircleDollarSign, Network, Leaf, Wrench, ChartNoAxesCombined],
}

function Label({ name }: { name: string }) {
  const { t } = useTranslation()
  return <>{t(`batchNine.diagram.${name}`)}</>
}

function SymbolLabel({ icon: Icon, name, className = '' }: { icon: LucideIcon; name: string; className?: string }) {
  return <div className={`industry-symbol ${className}`} data-step><Icon aria-hidden="true" strokeWidth={1.5} /><span><Label name={name} /></span></div>
}

// Decorative equipment elevations. Text lives in HTML so both languages wrap naturally.
function Equipment({ kind }: { kind: 'renewables' | 'electrolyzer' | 'storage' | 'factory' | 'stack' }) {
  const id = useId().replaceAll(':', '')
  return <svg className="industry-equipment" viewBox="0 0 220 170" aria-hidden="true">
    <defs><linearGradient id={`${id}-metal`} x2="1" y2=".2"><stop stopColor="#c9dbe8" /><stop offset=".45" stopColor="#fff" /><stop offset="1" stopColor="#adc7db" /></linearGradient></defs>
    <ellipse cx="110" cy="153" rx="95" ry="10" fill="#dce9f1" />
    <g stroke="#7196b4" strokeWidth="1.5" fill={`url(#${id}-metal)`}>
      {kind === 'renewables' && <>
        <path d="M57 58h7l5 86H51Z" /><g transform="translate(61 58)"><path d="M0 0-5-15 0-48 5-15Z" /><path d="M0 0-5-15 0-48 5-15Z" transform="rotate(120)" /><path d="M0 0-5-15 0-48 5-15Z" transform="rotate(240)" /><circle r="7" fill="#0753c8" /></g>
        <path d="m90 102 84-12 30 47-86 12Z" fill="#145c98" /><path d="m118 98 30 47m-2-51 29 47m-73-26 84-12m-76 26 84-12" stroke="#8bc9eb" /><path d="M125 148v8m68-19v14" strokeWidth="4" />
      </>}
      {kind === 'electrolyzer' && <><path d="m30 55 22-18h129l15 18v91H30Z" /><path d="M30 55h166v13H30Z" fill="#07398f" /><rect x="44" y="83" width="63" height="47" rx="3" fill="#164064" /><path d="M52 111h46" stroke="#00a8e8" strokeWidth="3" />{[0, 1, 2, 3, 4].map(i => <path key={i} d={`M124 ${82 + i * 10}h55`} strokeWidth="3" />)}<path d="M48 37V22h13v15m91 0V22h13v15" /><circle cx="54" cy="137" r="3" fill="#16a56a" /></>}
      {kind === 'storage' && <>{[35, 88, 141].map(x => <g key={x}><rect x={x} y="31" width="44" height="111" rx="21" /><ellipse cx={x + 22} cy="36" rx="20" ry="7" /><path d={`M${x + 22} 29V17h9M${x + 9} 57v62`} /><rect data-tank-fill x={x + 10} y="72" width="24" height="59" rx="10" fill="#00a8e8" fillOpacity=".25" stroke="none" /></g>)}<path d="M26 143h173v10H26Z" fill="#07398f" /></>}
      {kind === 'factory' && <><path d="M28 77 73 54v27l44-27v27l47-24v90H28Z" /><path d="M155 57V23h18l8 124h-17" /><path d="M38 111h115M38 128h115" stroke="#0753c8" strokeWidth="8" /><path d="M27 147h161" strokeWidth="5" /></>}
      {kind === 'stack' && <><path d="m24 62 42-32h126v89l-43 31H24Z" fill="#b8ccd9" />{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${29 + i * 14} 63l42-31v89l-42 28Z`} fill={i % 2 ? '#eaf1f6' : '#8eaabd'} />)}<path d="M24 63h126v86H24Z" fill="#d6e5ee" fillOpacity=".5" /><path d="M38 83h93v7H38m0 25h93v7H38" stroke="#0753c8" strokeWidth="3" /><circle cx="44" cy="136" r="5" fill="#00a8e8" /></>}
    </g>
  </svg>
}

function FlowArrow({ down = false }: { down?: boolean }) {
  return <span className={`industry-flow-arrow${down ? ' industry-flow-arrow--down' : ''}`} aria-hidden="true"><svg viewBox={down ? '0 0 24 40' : '0 0 100 24'}><path d={down ? 'M12 0V32' : 'M0 12H90'} stroke="#b9d2e4" /><path data-flow d={down ? 'M12 0V32' : 'M0 12H90'} stroke="currentColor" strokeDasharray="8 7" /><path d={down ? 'm5 27 7 10 7-10' : 'm84 5 10 7-10 7'} stroke="currentColor" fill="none" /></svg></span>
}

function VisualNote({ type = 'concept' }: { type?: string }) {
  const { t } = useTranslation()
  return <span className="industry-visual-note">{t(`batchNine.${type}`)}</span>
}

function StationPhoto() {
  const { t } = useTranslation()
  return <figure className="industry-station-photo"><img src={stationImage} alt={t('batchNine.stationAlt')} /><figcaption>{t('batchNine.station')}<a href="https://commons.wikimedia.org/wiki/File:Hydrogen_station_in_Jyv%C3%A4skyl%C3%A4.jpg" target="_blank" rel="noreferrer">{t('batchNine.credit')}</a></figcaption></figure>
}

function CleanOperation() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-clean" data-visual>
    <div className="industry-clean__vehicle"><img src={performanceTruck} alt={t('batchNine.truckAlt')} /><VisualNote type="vehicleConcept" /></div>
    <div className="industry-reaction">
      <div className="industry-reaction__inputs" data-step><span><b>H₂</b><Label name="hydrogen" /></span><i>+</i><span><b>O₂</b><Label name="oxygen" /></span></div>
      <FlowArrow down />
      <div className="industry-reaction__stack" data-step><Equipment kind="stack" /><strong><Label name="fuelCell" /></strong></div>
      <FlowArrow down />
      <div className="industry-reaction__outputs"><SymbolLabel icon={Zap} name="electricity" /><span>+</span><SymbolLabel icon={Droplets} name="water" /></div>
      <small><Label name="heat" /></small>
    </div>
  </div>
}

function Refueling() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-refueling" data-visual>
    <StationPhoto />
    <div className="industry-refueling__process"><SymbolLabel icon={Fuel} name="dispenser" /><FlowArrow /><div className="industry-refueling__truck" data-step><img src={performanceTruck} alt={t('batchNine.truckAlt')} /><span><Label name="refuel" /></span></div><FlowArrow /><SymbolLabel icon={Truck} name="return" /><p><Label name="downtime" /></p></div>
  </div>
}

function HeavyDuty() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-heavy" data-visual><img className="industry-landscape" src={logisticsImage('mine')} alt={t('batchNine.mineAlt')} /><div className="industry-heavy__context"><SymbolLabel icon={Snowflake} name="cold" /><SymbolLabel icon={Thermometer} name="thermal" /><SymbolLabel icon={Boxes} name="load" /><span><Label name="logistics" /></span></div><VisualNote type="industrialConcept" /></div>
}

function Storage() {
  return <div className="industry-visual industry-storage" data-visual><div className="industry-storage__time" data-step><span><Sun /><Label name="surplus" /></span><span><Label name="seasonal" /></span><span><Label name="later" /><ArrowRight /></span></div><div className="industry-storage__system">{(['renewables', 'electrolyzer', 'storage', 'factory'] as const).map((kind, index) => <div className="industry-storage__stage" key={kind}><div data-step><Equipment kind={kind} /><strong><Label name={index === 3 ? 'demand' : kind} /></strong></div>{index < 3 && <FlowArrow />}</div>)}</div><VisualNote /></div>
}

function IndustrySectors() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-sectors" data-visual><div className="industry-sectors__photos"><img src={logisticsImage('steel')} alt={t('batchNine.steelAlt')} /><img src={logisticsImage('port')} alt={t('batchNine.portAlt')} /></div><div className="industry-sectors__network"><div className="industry-h2" data-step>H₂<small><Label name="demandLinks" /></small></div><div className="industry-sectors__branches">{([['steel', Factory], ['chemicals', Settings], ['freight', Truck], ['shipping', Ship]] as [string, LucideIcon][]).map(([name, icon]) => <div key={name}><FlowArrow down /><SymbolLabel icon={icon} name={name} /></div>)}</div></div><VisualNote type="industrialConcept" /></div>
}

function TotalCost() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-cost" data-visual><div className="industry-cost__scene"><img className="industry-cost__station" src={stationImage} alt={t('batchNine.stationAlt')} /><img className="industry-cost__truck" src={performanceTruck} alt={t('batchNine.truckAlt')} /><span className="industry-cost__context">{t('batchNine.vehicleConcept')} · {t('batchNine.station')}<a href="https://commons.wikimedia.org/wiki/File:Hydrogen_station_in_Jyv%C3%A4skyl%C3%A4.jpg" target="_blank" rel="noreferrer">{t('batchNine.credit')}</a></span></div><div className="industry-cost__layers"><SymbolLabel icon={Truck} name="acquisition" /><span aria-hidden="true">+</span><SymbolLabel icon={Fuel} name="fuel" /><span aria-hidden="true">+</span><SymbolLabel icon={Gauge} name="operations" /><strong><Label name="systemCost" /></strong></div></div>
}

function Infrastructure() {
  return <div className="industry-visual industry-infrastructure" data-visual><StationPhoto /><div className="industry-loop"><div className="industry-loop__node industry-loop__node--one" data-step><Truck /><Label name="fewVehicles" /></div><ArrowRight className="industry-loop__arrow industry-loop__arrow--top" aria-hidden="true" /><div className="industry-loop__node industry-loop__node--two" data-step><CircleDollarSign /><Label name="limitedInvestment" /></div><ArrowDown className="industry-loop__arrow industry-loop__arrow--right" aria-hidden="true" /><div className="industry-loop__node industry-loop__node--three" data-step><Fuel /><Label name="limitedAccess" /></div><ArrowLeft className="industry-loop__arrow industry-loop__arrow--bottom" aria-hidden="true" /><div className="industry-loop__node industry-loop__node--four" data-step><Truck /><Label name="slowAdoption" /></div><ArrowUp className="industry-loop__arrow industry-loop__arrow--left" aria-hidden="true" /><div className="industry-loop__center"><Network /><Label name="coordination" /></div></div></div>
}

function ProductionPathways() {
  return <div className="industry-visual industry-pathways" data-visual><div className="industry-pathways__label"><Label name="upstream" /></div><div className="industry-pathway industry-pathway--fossil" data-step><SymbolLabel icon={Factory} name="fossil" /><FlowArrow /><div className="industry-pathway__plant"><Equipment kind="factory" /><span><Label name="fossilProduction" /><small className="industry-pathway__emissions"><Label name="productionEmissions" /></small></span></div><FlowArrow /><div className="industry-pathway__result"><b>H₂</b><small><Label name="hydrogen" /></small></div></div><div className="industry-pathway industry-pathway--green" data-step><SymbolLabel icon={Wind} name="green" /><FlowArrow /><div className="industry-pathway__plant"><Equipment kind="electrolyzer" /><span><Label name="electrolysis" /></span></div><FlowArrow /><div className="industry-pathway__result"><b>H₂</b><small><Label name="greenHydrogen" /></small></div></div><div className="industry-pathways__use"><Label name="sameUse" /></div><VisualNote /></div>
}

function ServiceNetwork() {
  const { t } = useTranslation()
  return <div className="industry-visual industry-service" data-visual><div className="industry-service__bay"><div className="industry-service__building" aria-hidden="true"><span /><span /><span /></div><img src={carImage} alt={t('batchNine.vehicleConcept')} /><div className="industry-service__powertrain" data-step><Equipment kind="stack" /><span><Label name="powertrain" /></span></div><span className="industry-service__caption"><Label name="serviceSystem" /></span></div><div className="industry-service__network"><SymbolLabel icon={Network} name="service" /><SymbolLabel icon={Users} name="technicians" /><SymbolLabel icon={Wrench} name="parts" /></div><VisualNote /></div>
}

function Commercialization() {
  return <div className="industry-visual industry-commercial" data-visual><div className="industry-commercial__caption"><span><Label name="early2026" /></span><strong><Label name="pathway" /></strong></div><div className="industry-roadmap">{([['policy', CircleDollarSign], ['scale', Factory], ['costReduction', Settings], ['commercial', ChartNoAxesCombined]] as [string, LucideIcon][]).map(([name, Icon], index) => <div className="industry-roadmap__stage" key={name} data-step><span className="industry-roadmap__marker"><Icon strokeWidth={1.5} /></span><strong><Label name={name} /></strong>{index < 3 && <FlowArrow />}</div>)}</div><p><Label name="notForecast" /></p><VisualNote /></div>
}

const visuals: Record<Kind, (() => React.JSX.Element)[]> = {
  advantages: [CleanOperation, Refueling, HeavyDuty, Storage, IndustrySectors],
  barriers: [TotalCost, Infrastructure, ProductionPathways, ServiceNetwork, Commercialization],
}

function TopicSelectors({ kind, active, onSelect }: { kind: Kind; active: number; onSelect: (index: number) => void }) {
  const { t } = useTranslation()
  const compact = kind === 'advantages'
  return <nav className={`industry-topics${compact ? ' performance-highlights' : ''}`} aria-label={t('batchNine.select')}>
    {!compact && <span className="industry-topics__hint">{t('batchNine.select')}</span>}
    {topicIcons[kind].map((Icon, index) => <button key={index} type="button" aria-pressed={active === index} aria-controls="industry-active-topic" onClick={() => onSelect(index)}>
      {!compact && <span className="industry-topic__number">0{index + 1}</span>}
      <Icon size={20} aria-hidden="true" strokeWidth={compact ? 2 : 1.6} />
      <span>{t(`batchNine.${kind}.topics.${index}.short`)}</span>
      {!compact && <Check className="industry-topic__check" aria-hidden="true" />}
    </button>)}
  </nav>
}

function ActiveTopic({ kind, active, onSelect }: { kind: Kind; active: number; onSelect: (index: number) => void }) {
  const { t } = useTranslation()
  const { playing, reducedMotion } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const entrance = useRef<gsap.core.Timeline | null>(null)
  const ambient = useRef<gsap.core.Timeline | null>(null)
  const prefix = `batchNine.${kind}.topics.${active}`
  const Visual = visuals[kind][active]!
  const TopicIcon = topicIcons[kind][active]!
  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return
    const context = gsap.context(() => {
      entrance.current = gsap.timeline()
        .from('[data-visual]', { opacity: 0, y: 8, duration: .65, ease: 'power2.out' }, 0)
        .from('.industry-copy > *', { opacity: 0, y: 10, duration: .55, stagger: .08, ease: 'power2.out' }, .12)
        .from('[data-step]', { opacity: .15, y: 7, duration: .5, stagger: .13, ease: 'power2.out' }, .25)
      ambient.current = gsap.timeline({ repeat: -1 })
      const flows = root.current!.querySelectorAll('[data-flow]')
      if (flows.length) ambient.current.to(flows, { strokeDashoffset: -60, duration: 3, ease: 'none' }, 0)
      const tankFill = root.current!.querySelectorAll('[data-tank-fill]')
      if (tankFill.length) ambient.current.fromTo(tankFill, { scaleY: .25, svgOrigin: '110 131' }, { scaleY: 1, duration: 4, stagger: .15, ease: 'sine.inOut', repeat: 1, yoyo: true }, 0)
    }, root)
    return () => { context.revert(); entrance.current = null; ambient.current = null }
  }, [active, reducedMotion])
  useLayoutEffect(() => {
    if (playing) { entrance.current?.resume(); ambient.current?.resume() }
    else { if (entrance.current?.progress() === 0) entrance.current.progress(1); entrance.current?.pause(); ambient.current?.pause() }
  }, [active, playing])
  return <div className="industry-panel" ref={root} data-topic={active}>
    <Visual />
    {kind === 'advantages' && <TopicSelectors kind={kind} active={active} onSelect={onSelect} />}
    <div className="industry-copy" aria-live="polite" aria-atomic="true"><div className={kind === 'advantages' ? 'industry-copy__title' : undefined}>{kind === 'advantages' ? <TopicIcon size={28} aria-hidden="true" /> : <span className="industry-copy__index">0{active + 1}</span>}<h2>{t(`${prefix}.label`)}</h2></div><div className="industry-copy__explanation"><strong>{t(`${prefix}.takeaway`)}</strong><p>{t(`${prefix}.body`)}</p><small>{t(`${prefix}.note`)}</small></div></div>
  </div>
}

export function IndustryScene({ kind, number, count }: { kind: Kind; number: number; count: number }) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  return <section className={`reference-scene industry-scene industry-scene--${kind}`} aria-labelledby="scene-title">
    <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('batchNine.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="industry-heading"><h1 id="scene-title">{t(`batchNine.${kind}.title`)}</h1></header>
    <div className="industry-body">
      {kind === 'barriers' && <TopicSelectors kind={kind} active={active} onSelect={setActive} />}
      <div id="industry-active-topic" className="industry-active-topic"><ActiveTopic key={kind === 'barriers' ? active : kind} kind={kind} active={active} onSelect={setActive} /></div>
    </div>
    <footer className="industry-source">{t('batchNine.source')}</footer>
  </section>
}
