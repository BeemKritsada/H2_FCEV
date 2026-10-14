import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Leaf, MapPin } from 'lucide-react'
import { AnimatedNumber } from '../AnimatedNumber'
import { projectRegion, regionOutline } from '../batch2/regionProjection'
import { railImage } from '../batch5/assets'
import { useLogisticsMotion } from '../batch5/useLogisticsMotion'
import '../../../styles/batch-seven-scenes.css'

type Props = { number: number; count: number }
type Category = 'passenger' | 'tourism' | 'freight' | 'pilot'
type Location = { id: string; coordinate: [number, number]; category: Category; documented?: boolean; region?: boolean }

const locations: readonly Location[] = [
  { id: 'foshan', coordinate: [113.12, 23.03], category: 'passenger', documented: true },
  { id: 'changchun', coordinate: [125.32, 43.90], category: 'tourism', documented: true },
  { id: 'jilin', coordinate: [126.55, 43.84], category: 'tourism', documented: true },
  { id: 'chengdu', coordinate: [104.07, 30.67], category: 'passenger', documented: true },
  { id: 'yibin', coordinate: [104.62, 28.77], category: 'pilot' },
  { id: 'baotou', coordinate: [109.84, 40.66], category: 'pilot' },
  { id: 'qinzhou', coordinate: [108.65, 21.98], category: 'pilot' },
  { id: 'qingdao', coordinate: [120.38, 36.07], category: 'pilot' },
  { id: 'tangshan', coordinate: [118.18, 39.63], category: 'pilot' },
  // Province / region markers are representative centroids, not project sites.
  { id: 'liaoning', coordinate: [123.43, 41.80], category: 'freight', region: true },
  { id: 'innerMongolia', coordinate: [111.65, 40.82], category: 'freight', region: true },
  { id: 'hebei', coordinate: [114.52, 38.04], category: 'freight', region: true },
]

const sourceLinks = {
  freight: 'https://www.ceic.com/gjnyjtwwEn/xwzx/202404/a9485e0a063c4ae0ac7825b1a0db73f6.shtml',
  duration: 'https://www.crrcgc.cc/zjen/2024-09/03/article_2024090316061425776.html',
  small: 'https://www.crrcgc.cc/zcdt/2025-09/28/article_2025092811504928556.html',
  medium: 'https://www.crrcgc.cc/crrcgc/2021-06/16/article_5E6286A002724FED9915DE6BA50BB487.html',
  mediumPhoto: 'https://www.sohu.com/a/473494511_121119000',
}

function Shell({ number, count, topic, children }: Props & { topic: string; children: ReactNode }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useLogisticsMotion(root)
  return <section ref={root} className={`reference-scene batch-seven-scene scene-${topic}`} data-motion={playing ? 'running' : 'paused'} aria-labelledby="scene-title">
    <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('batchSeven.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="batch-seven-heading"><h1 id="scene-title">{t(`batchSeven.${topic}.title`)}</h1><p>{t(`batchSeven.${topic}.subtitle`)}</p></header>
    {children}
  </section>
}

function Source({ children, note }: { children: ReactNode; note: string }) {
  const { t } = useTranslation()
  return <footer className="batch-seven-source"><span>{t('batchSeven.source')} · {note}</span><div>{children}</div></footer>
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14} aria-hidden="true" /></a>
}

function Metric({ value, suffix = '', label, unit }: { value: number; suffix?: string; label: string; unit: string }) {
  return <div className="batch-seven-metric"><span>{label}</span><strong><AnimatedNumber value={value} suffix={suffix} /><small>{unit}</small></strong></div>
}

export function FreightLocomotiveScene(props: Props) {
  const { t } = useTranslation()
  return <Shell {...props} topic="freight">
    <figure className="freight-hero" data-cinema>
      <img src={railImage('freight-2400')} alt={t('batchSeven.freight.photoAlt')} width="1108" height="739" decoding="async" fetchPriority="high" />
      <figcaption><span><MapPin size={19} aria-hidden="true" />{t('batchSeven.freight.location')}</span><span>{t('batchSeven.freight.photoCaption')}</span></figcaption>
    </figure>
    <div className="freight-metrics">
      <Metric value={2400} label={t('batchSeven.freight.power')} unit="kW" />
      <Metric value={10000} label={t('batchSeven.freight.haul')} unit={t('batchSeven.freight.tonnes')} />
      <Metric value={12} suffix="+" label={t('batchSeven.freight.duration')} unit={t('batchSeven.freight.hours')} />
    </div>
    <Source note={t('batchSeven.freight.scope')}><SourceLink href={sourceLinks.freight}>CHN Energy</SourceLink><SourceLink href={sourceLinks.duration}>CRRC</SourceLink></Source>
  </Shell>
}

export function MiningLocomotivesScene(props: Props) {
  const { t } = useTranslation()
  return <Shell {...props} topic="mining">
    <div className="mining-comparison">
      {([['small', 'mining-700', 700, sourceLinks.small], ['medium', 'industrial-1400', 1400, sourceLinks.medium]] as const).map(([id, image, power]) => <article className="mining-locomotive" key={id}>
        <figure data-cinema><img src={railImage(image)} alt={t(`batchSeven.mining.${id}Alt`)} width={id === 'small' ? 1200 : 1080} height={id === 'small' ? 1016 : 720} decoding="async" /></figure>
        <div className="mining-locomotive__detail"><span>{t(`batchSeven.mining.${id}`)}</span><strong><AnimatedNumber value={power} /><small>kW</small></strong></div>
      </article>)}
    </div>
    <div className="mining-takeaway" data-payload><Leaf size={28} aria-hidden="true" /><div><h2>{t('batchSeven.mining.benefit')}</h2><p>{t('batchSeven.mining.benefitNote')}</p></div></div>
    <p className="mining-regions">{t('batchSeven.mining.regions')}</p>
    <Source note={t('batchSeven.mining.scope')}><SourceLink href={sourceLinks.small}>CRRC 700 kW</SourceLink><SourceLink href={sourceLinks.medium}>CRRC 1,400 kW</SourceLink><SourceLink href={sourceLinks.mediumPhoto}>{t('batchSeven.photo')} 1,400 kW</SourceLink></Source>
  </Shell>
}

export function RailDeploymentScene(props: Props) {
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState('foshan')
  const selected = locations.find(({ id }) => id === selectedId) ?? locations[0]!
  return <Shell {...props} topic="deployment">
    <div className="deployment-composition">
      <figure className="deployment-map">
        <svg viewBox="0 0 600 360" role="img" aria-label={t('batchSeven.deployment.mapAlt')} data-logistics-map>
          <path d={regionOutline} fill="#f0f7fc" stroke="#8cb9dc" strokeWidth="1.2" fillRule="evenodd" />
          {locations.map(({ id, coordinate, category, region }, index) => {
            const [x, y] = projectRegion(coordinate)
            return <g key={id} className={`deployment-node deployment-node--${category}`} data-region-node data-selected={selectedId === id} transform={`translate(${x} ${y})`}>
              <circle className="deployment-node__pulse" r={region ? 17 : 14} style={{ animationDelay: `${index * -.28}s` }} />
              <circle className="deployment-node__core" r={region ? 7 : 6} />
              {selectedId === id && <text className="deployment-node__label" x={x > 395 ? -13 : 13} y="-13" textAnchor={x > 395 ? 'end' : 'start'}>{t(`batchSeven.deployment.locations.${id}`)}</text>}
            </g>
          })}
        </svg>
        <div className="deployment-map__legend" aria-label={t('batchSeven.deployment.select')}>
          {(['passenger', 'tourism', 'freight', 'pilot'] as const).map(category => <span className={`deployment-map__legend-item deployment-map__legend-item--${category}`} key={category}><i aria-hidden="true" />{t(`batchSeven.deployment.categories.${category}`)}</span>)}
        </div>
        <figcaption>{t('batchSeven.deployment.mapNote')}</figcaption>
      </figure>
      <aside className="deployment-index">
        <div className="deployment-selected"><span>{t('batchSeven.deployment.select')}</span><h2>{t(`batchSeven.deployment.locations.${selected.id}`)}</h2><p className={`deployment-category deployment-category--${selected.category}`}>{t(`batchSeven.deployment.categories.${selected.category}`)}</p><p>{t(`batchSeven.deployment.${selected.region ? 'statusRegion' : selected.documented ? 'statusKnown' : 'statusSource'}`)}</p></div>
        <div className="deployment-list"><h3>{t('batchSeven.deployment.cities')}</h3><div role="group" aria-label={t('batchSeven.deployment.cities')}>{locations.filter(({ region }) => !region).map(({ id, category }) => <button type="button" className={`deployment-place deployment-place--${category}`} aria-pressed={selectedId === id} onClick={() => setSelectedId(id)} key={id}><i aria-hidden="true" />{t(`batchSeven.deployment.locations.${id}`)}</button>)}</div></div>
        <div className="deployment-list deployment-list--regions"><h3>{t('batchSeven.deployment.regions')}</h3><div role="group" aria-label={t('batchSeven.deployment.regions')}>{locations.filter(({ region }) => region).map(({ id, category }) => <button type="button" className={`deployment-place deployment-place--${category}`} aria-pressed={selectedId === id} onClick={() => setSelectedId(id)} key={id}><i aria-hidden="true" />{t(`batchSeven.deployment.locations.${id}`)}</button>)}</div></div>
      </aside>
    </div>
    <Source note={t('batchSeven.deployment.mapNote')}><SourceLink href="https://www.naturalearthdata.com/">Natural Earth</SourceLink></Source>
  </Shell>
}
