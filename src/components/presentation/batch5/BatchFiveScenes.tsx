import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Droplets, Fuel, Gauge, Leaf, PackageCheck, Snowflake } from 'lucide-react'
import facts from '../../../content/batch-five-facts.json'
import { AnimatedNumber } from '../AnimatedNumber'
import { projectRegion, regionOutline } from '../batch2/regionProjection'
import { useLogisticsMotion } from './useLogisticsMotion'
import { logisticsImage, performanceTruck, railImage, railSources } from './assets'
import '../../../styles/batch-five-scenes.css'

type SceneProps = { number: number; count: number }
function Shell({ number, count, topic, children, rail = false }: SceneProps & { topic: string; children: ReactNode; rail?: boolean }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useLogisticsMotion(root)
  return <section ref={root} className={`reference-scene batch-five-scene scene-${topic}`} aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t(`batchFive.${rail ? 'rail' : 'logistics'}Eyebrow`)}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="logistics-heading"><h1 id="scene-title">{t(`batchFive.${topic}.title`)}</h1><p>{t(`batchFive.${topic}.subtitle`)}</p></header>
    {children}
  </section>
}
function Source({ slide, note, children }: { slide: number; note?: string; children?: ReactNode }) {
  const { t } = useTranslation()
  return <footer className="logistics-source"><span>{t('batchFive.source', { slide })}{note && <span className="logistics-source__note">{note}</span>}</span><div>{children}</div></footer>
}
function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>
}
function Metric({ value, unit, label, decimals = 0, suffix = '', className = '', children }: { value: number | readonly number[]; unit?: string; label: string; decimals?: number; suffix?: string; className?: string; children?: ReactNode }) {
  return <div className={`logistics-metric ${className}`}><span className="logistics-metric__label">{label}</span><strong><AnimatedNumber value={value} decimals={decimals} suffix={suffix} />{unit && <small>{unit}</small>}</strong>{children}</div>
}

export function LogisticsApplicationsScene(props: SceneProps) {
  const { t } = useTranslation()
  return <Shell {...props} topic="applications">
    <div className="application-grid">{['port', 'mine', 'steel', 'highway'].map((id, index) => <figure className="application-frame" data-cinema key={id}>
      <img src={logisticsImage(id)} alt={t(`batchFive.applications.${id}Detail`)} width="1440" height="810" decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} />
      <figcaption><span className="application-index" aria-hidden="true">0{index + 1}</span><div><h2>{t(`batchFive.applications.${id}`)}</h2><p>{t(`batchFive.applications.${id}Detail`)}</p></div></figcaption>
    </figure>)}</div>
    <Source slide={facts.logisticsSourceSlide} note={t('batchFive.concept')} />
  </Shell>
}

const highlightIcons = { refueling: Fuel, range: Gauge, cold: Snowflake, payload: PackageCheck }
export function TruckPerformanceScene(props: SceneProps) {
  const { t } = useTranslation()
  const [highlight, setHighlight] = useState('refueling')
  return <Shell {...props} topic="performance">
    <div className="truck-performance" data-highlight={highlight}>
      <div className="truck-performance__metrics">
        <Metric className={highlight === 'refueling' ? 'is-highlighted' : ''} value={facts.truck.refuelingMinutes} unit={t('batchFive.units.minutes')} label={t('batchFive.performance.refueling')} />
        <Metric className={highlight === 'range' ? 'is-highlighted' : ''} value={facts.truck.rangeKm} unit={t('batchFive.units.kilometers')} label={t('batchFive.performance.range')} />
        <Metric className={highlight === 'cold' ? 'is-highlighted' : ''} value={facts.truck.coldCelsius} suffix="°C" label={t('batchFive.performance.cold')} />
      </div>
      <div className="truck-performance__visual">
        <figure className="performance-truck" data-cinema><div className="performance-truck__halo" aria-hidden="true" /><img src={performanceTruck} alt={t('batchFive.performance.truckAlt')} width="1440" height="706" decoding="async" /><figcaption>{t('batchFive.truckConcept')}</figcaption></figure>
        <div className="performance-highlights" role="group" aria-label={t('batchFive.performance.highlight')}>
          {Object.entries(highlightIcons).map(([id, Icon]) => <button type="button" key={id} aria-pressed={highlight === id} onClick={() => setHighlight(id)}><Icon size={20} aria-hidden="true" />{t(`batchFive.performance.${id}`)}</button>)}
        </div>
        <div className={`payload-message ${highlight === 'payload' ? 'is-highlighted' : ''}`} data-payload><PackageCheck size={28} aria-hidden="true" /><div><h2>{t('batchFive.performance.payload')}</h2><p>{t('batchFive.performance.payloadNote')}</p></div></div>
      </div>
    </div>
    <Source slide={facts.logisticsSourceSlide} note={`${t('batchFive.performance.coldNote')} · ${t('batchFive.performance.scope')}`} />
  </Shell>
}

export function HeavyLogisticsRegionsScene(props: SceneProps) {
  const { t } = useTranslation()
  return <Shell {...props} topic="regions">
    <div className="heavy-regions-composition">
      <figure className="heavy-regions-map">
        <svg viewBox="0 0 600 360" role="img" aria-label={t('batchFive.regions.mapAlt')} data-logistics-map>
          <path d={regionOutline} fill="#eef5fb" stroke="#aacce3" strokeWidth="1" fillRule="evenodd" />
          {facts.regions.map(({ id, anchor }, index) => {
            const [x, y] = projectRegion(anchor)
            return <g key={id} transform={`translate(${x} ${y})`} data-region-node>
              <circle r="17" className="logistics-map-pulse" style={{ animationDelay: `${index * -0.7}s` }} fill="#00a8e8" opacity=".12" />
              <circle r="9" fill="#0753c8" stroke="white" strokeWidth="2" /><text y=".5" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="600">{index + 1}</text>
            </g>
          })}
        </svg>
        <ol className="heavy-regions-legend" aria-label={t('batchFive.regions.legend')}>{facts.regions.map(({ id }, index) => <li key={id} data-region-label><span>{index + 1}</span>{t(`batchFive.regions.${id}`)}</li>)}</ol>
      </figure>
      <aside className="convoy-highlight"><span className="convoy-mark" aria-hidden="true">H₂</span><Metric value={facts.convoyTonnes} unit={t('batchFive.units.tonnes')} label={t('batchFive.regions.convoy')} /><p>{t('batchFive.regions.scope')}</p><div className="convoy-context"><PackageCheck size={30} aria-hidden="true" /><h2>{t('batchFive.regions.suitable')}</h2></div></aside>
    </div>
    <Source slide={facts.logisticsSourceSlide} note={t('batchFive.regions.note')}><SourceLink href="https://www.naturalearthdata.com/">Natural Earth</SourceLink></Source>
  </Shell>
}

export function SuburbanTrainScene(props: SceneProps) {
  const { t } = useTranslation()
  return <Shell {...props} topic="suburban" rail>
    <div className="rail-composition">
      <div className="rail-story"><figure className="rail-photo" data-cinema><img src={railImage('suburban')} alt={t('batchFive.suburban.alt')} width="1393" height="783" decoding="async" /></figure>
        <div className="train-milestones"><div><strong>{facts.suburban.introductionYear}</strong><p>{t('batchFive.suburban.original')}</p></div><div><strong>{facts.suburban.laterTestYear}</strong><p>{t('batchFive.suburban.later')}</p></div></div>
      </div>
      <div className="rail-metrics">
        <Metric value={facts.suburban.cars} unit={t('batchFive.units.cars')} label={t('batchFive.suburban.formation')} />
        <Metric value={facts.suburban.speedKmh} unit={t('batchFive.units.speed')} label={t('batchFive.suburban.speed')} />
        <Metric value={facts.suburban.laterRangeLowerBoundKm} suffix="+" unit={t('batchFive.units.kilometers')} label={t('batchFive.suburban.range')} />
        <Metric value={facts.suburban.suppliedRefuelingMinutes} unit={t('batchFive.units.minutes')} label={t('batchFive.suburban.refueling')} />
      </div>
    </div>
    <Source slide={facts.railSourceSlide} note={t('batchFive.suburban.note')}><SourceLink href={railSources.suburban}>HUBER+SUHNER</SourceLink><SourceLink href={railSources.laterTest}>2024 · {t('batchFive.photoSource')}</SourceLink></Source>
  </Shell>
}

export function FoshanTramScene(props: SceneProps) {
  const { t } = useTranslation()
  return <Shell {...props} topic="foshan" rail>
    <div className="foshan-composition">
      <div className="foshan-visual"><figure className="rail-photo" data-cinema><img src={railImage('foshan')} alt={t('batchFive.foshan.alt')} width="1080" height="720" decoding="async" /></figure><p className="foshan-history">{t('batchFive.foshan.historical')}</p></div>
      <aside className="foshan-metrics"><div className="historical-year"><span>{t('batchFive.foshan.service')}</span><strong>{facts.foshan.serviceYear}</strong></div><Metric value={facts.foshan.routeKm} decimals={1} unit={t('batchFive.units.kilometers')} label={t('batchFive.foshan.route')} /><div className="tram-distance" role="img" aria-label={t('batchFive.foshan.line')}><i /><span /><i /></div><Metric value={facts.foshan.reportedRangeKm} unit={t('batchFive.units.kilometers')} label={t('batchFive.foshan.range')} /></aside>
    </div>
    <Source slide={facts.railSourceSlide} note={t('batchFive.foshan.note')}><SourceLink href={railSources.foshan}>CRRC</SourceLink><SourceLink href={railSources.foshanPhoto}>{t('batchFive.photoSource')}</SourceLink></Source>
  </Shell>
}

export function TourismTramsScene(props: SceneProps) {
  const { t } = useTranslation()
  const [focus, setFocus] = useState('changchun')
  return <Shell {...props} topic="tourism" rail>
    <div className="tourism-showcase" role="group" aria-label={t('batchFive.tourism.focus')}>
      {(['changchun', 'jilin'] as const).map((id) => <article key={id} className="tourism-vehicle" data-selected={focus === id}>
        <button className="tourism-focus" type="button" aria-pressed={focus === id} onClick={() => setFocus(id)}>
          <span className="tourism-city">{t(`batchFive.tourism.${id}`)}<ArrowUpRight size={22} aria-hidden="true" /></span>
          <span className="tourism-photo" data-cinema><img src={railImage(id)} alt={t(`batchFive.tourism.${id}Alt`)} width={id === 'changchun' ? 930 : 1417} height={id === 'changchun' ? 649 : 1063} decoding="async" /></span>
          <span className="tourism-name"><span lang="zh">{t(`batchFive.tourism.${id === 'changchun' ? 'qingchun' : 'qingsong'}Chinese`)}</span><strong>{t(`batchFive.tourism.${id === 'changchun' ? 'qingchun' : 'qingsong'}`)}</strong></span>
        </button>
        <div className="tourism-dates"><p>{t(`batchFive.tourism.${id}Intro`)}</p><p>{t(`batchFive.tourism.${id}Service`)}</p></div>
      </article>)}
    </div>
    <div className="tourism-environment"><p><Droplets size={26} aria-hidden="true" />{t('batchFive.tourism.water')}</p><p><Leaf size={26} aria-hidden="true" />{t('batchFive.tourism.local')}</p></div>
    <Source slide={facts.railSourceSlide} note={t('batchFive.tourism.scope')}><SourceLink href={railSources.changchunPhoto}>China News Service</SourceLink><SourceLink href={railSources.jilin}>Ifeng · 吉林日报</SourceLink></Source>
  </Shell>
}
