import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Anchor, Bike, BrushCleaning, Bus, Car, Factory, FlaskConical, Globe, MapPinned, Package, Pickaxe, Route, Snowflake, TramFront, Truck, type LucideIcon } from 'lucide-react'
import facts from '../../../content/regional-map-facts.json'
import { useMotion } from '../../motion/motion-context'
import { StateNumberSequence } from '../../motion/SceneNumberSequence'
import { AnimatedNumber } from '../AnimatedNumber'
import '../../../styles/regional-map-scene.css'

type LonLat = [number, number]
type Box = [number, number, number, number]
type Region = (typeof facts.regions)[number]
interface Feature { properties: { id: string }; geometry: { coordinates: number[][][][] } }

// Equirectangular projection scaled by cos(35°), the same convention as the other China maps.
const project = ([lon, lat]: LonLat | number[]): [number, number] => [(lon! - 73.2) * 0.8192 * 20, (54 - lat!) * 20]
const toBox = ([west, south, east, north]: number[]): Box => {
  const [x0, y0] = project([west!, north!])
  const [x1, y1] = project([east!, south!])
  return [x0, y0, x1, y1]
}
const nationalBox = toBox([73.2, 17.6, 135.2, 53.9])
const regions = facts.regions
const regionByProvince = new Map<string, { region: string; role: 'core' | 'context' }>(regions.flatMap((region) => [
  ...region.provinces.map((id) => [id, { region: region.id, role: 'core' }] as const),
  ...('contextProvinces' in region ? region.contextProvinces : []).map((id) => [id, { region: region.id, role: 'context' }] as const),
]))
const applicationIcons: Record<string, LucideIcon> = {
  bus: Bus, tram: TramFront, heavyTruck: Truck, twoWheeler: Bike, port: Anchor, cleaning: BrushCleaning, mining: Pickaxe,
  demonstration: FlaskConical, passengerCar: Car, urbanFreight: Package, coldChain: Snowflake, intercity: Route, industrial: Factory, pilots: MapPinned,
}
const imageUrl = (path: string) => `${import.meta.env.BASE_URL}assets/images/${path}`

// Province geometry is split from the main bundle; it is only needed on this scene.
let geometry: Promise<{ id: string; d: string }[]> | null = null
const loadGeometry = () => geometry ??= import('../../../../public/assets/maps/china-provinces-50m.geojson?raw').then(({ default: text }) =>
  (JSON.parse(text) as { features: Feature[] }).features.map((feature) => ({
    id: feature.properties.id,
    d: feature.geometry.coordinates.map((polygon) => polygon.map((ring) => `M${ring.map((point) => project(point).map((value) => value.toFixed(1)).join(',')).join('L')}Z`).join('')).join(''),
  })))

function pointStyle(coordinates: number[]) {
  const [x, y] = project(coordinates)
  return { '--x': x, '--y': y } as CSSProperties
}

function labelClass([dx, dy]: number[]) {
  return `rmap-city__label rmap-city__label--x${dx! + 1} rmap-city__label--y${dy! + 1}`
}

function RegionPhoto({ region, className }: { region: Region; className: string }) {
  const { t } = useTranslation()
  const prefix = `regionalMap.regions.${region.id}`
  return <figure className={`rmap-photo ${className}`} data-reveal>
    <img src={imageUrl(region.image)} alt={t(`${prefix}.imageAlt`)} />
    <figcaption>{region.imageKind === 'photo'
      ? <a href={region.imageSource} target="_blank" rel="noreferrer">{t(`${prefix}.imageCredit`)}</a>
      : t('regionalMap.conceptImage')}</figcaption>
  </figure>
}

function RegionPanel({ region }: { region: Region }) {
  const { t } = useTranslation()
  const { reducedMotion, playing } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const prefix = `regionalMap.regions.${region.id}`
  const index = regions.indexOf(region)
  useLayoutEffect(() => {
    if (!root.current || reducedMotion || !playing) return
    const context = gsap.context(() => {
      gsap.from('[data-reveal]', { opacity: 0, y: 10, duration: 0.42, stagger: 0.06, ease: 'power2.out', delay: 0.18 })
    }, root)
    return () => context.revert()
    // Entrance only when the region changes; language and pause toggles keep the panel as is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div className="rmap-panel__content" ref={root} style={{ '--region': region.color } as CSSProperties}>
    <div className="rmap-panel__head" data-reveal>
      <span className="rmap-panel__index">0{index + 1}</span>
      <div><h2>{t(`${prefix}.name`)}</h2><p className="rmap-panel__area">{t(`${prefix}.area`)}</p></div>
    </div>
    <p className="rmap-panel__body" data-reveal>{t(`${prefix}.body`)}</p>
    <div data-reveal>
      <span className="rmap-panel__label">{t('regionalMap.applicationsLabel')}</span>
      <ul className="rmap-apps">{region.applications.map((id) => {
        const Icon = applicationIcons[id]!
        return <li key={id}><Icon aria-hidden="true" strokeWidth={1.7} />{t(`regionalMap.applications.${id}`)}</li>
      })}</ul>
    </div>
    {'statistic' in region && <div className="rmap-stat" data-reveal>
      <StateNumberSequence stateId={`region-${region.id}`} delay={0.45}>
        <strong>{region.statistic.countUp ? <AnimatedNumber value={region.statistic.value} grouping={false} /> : region.statistic.value}</strong>
      </StateNumberSequence>
      <div><span>{t(`${prefix}.statLabel`)}</span><small>{t(`${prefix}.statNote`)}</small></div>
    </div>}
    {region.id === 'yrd' && <p className="rmap-panel__note" data-reveal>{t('regionalMap.externalNote')}</p>}
    {/* Stacked layouts show the photo here; wide layouts show it as an inset on the map. */}
    <RegionPhoto region={region} className="rmap-photo--panel" />
  </div>
}

function OverviewPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const { t } = useTranslation()
  return <div className="rmap-panel__content rmap-panel__content--overview">
    <div className="rmap-panel__head"><span className="rmap-panel__index"><Globe aria-hidden="true" /></span><div><h2>{t('regionalMap.overviewPanel.title')}</h2></div></div>
    <p className="rmap-panel__body">{t('regionalMap.overviewPanel.body')}</p>
    <ol className="rmap-overview-list">{regions.map((region, index) => <li key={region.id} style={{ '--region': region.color } as CSSProperties}>
      <button type="button" onClick={() => onSelect(region.id)}><span>0{index + 1}</span>{t(`regionalMap.regions.${region.id}.name`)}</button>
    </li>)}</ol>
    <p className="rmap-panel__note">{t('regionalMap.overviewPanel.note')}</p>
  </div>
}

export function RegionalMapScene({ number, count }: { number: number; count: number }) {
  const { t } = useTranslation()
  const { playing, reducedMotion } = useMotion()
  const [active, setActive] = useState<string | null>(null)
  const [paths, setPaths] = useState<{ id: string; d: string }[] | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  const world = useRef<SVGGElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const inset = useRef<HTMLDivElement>(null)
  const camera = useRef({ x0: nationalBox[0], y0: nationalBox[1], x1: nationalBox[2], y1: nationalBox[3] })
  const tween = useRef<gsap.core.Tween | null>(null)
  const region = regions.find((item) => item.id === active)

  useEffect(() => {
    let alive = true
    void loadGeometry().then((result) => { if (alive) setPaths(result) })
    return () => { alive = false }
  }, [])

  // Map units → pixels. SVG and HTML labels share one transform so text never scales with zoom.
  const apply = useCallback(() => {
    const element = frame.current
    if (!element || !world.current || !overlay.current) return
    const { width, height } = element.getBoundingClientRect()
    const reserved = inset.current?.offsetWidth ? inset.current.offsetWidth + 20 : 0
    const { x0, y0, x1, y1 } = camera.current
    const scale = Math.min((width - reserved) / (x1 - x0), height / (y1 - y0))
    const tx = (width - reserved - (x1 - x0) * scale) / 2 - x0 * scale
    const ty = (height - (y1 - y0) * scale) / 2 - y0 * scale
    world.current.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})`)
    overlay.current.style.setProperty('--tx', `${tx}px`)
    overlay.current.style.setProperty('--ty', `${ty}px`)
    overlay.current.style.setProperty('--s', String(scale))
  }, [])

  useLayoutEffect(() => {
    if (!frame.current) return
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [apply, paths])

  useLayoutEffect(() => {
    const [x0, y0, x1, y1] = region ? toBox(region.focus) : nationalBox
    tween.current?.kill()
    if (reducedMotion || !playing) {
      Object.assign(camera.current, { x0, y0, x1, y1 })
      apply()
      return
    }
    tween.current = gsap.to(camera.current, { x0, y0, x1, y1, duration: 0.85, ease: 'power2.inOut', onUpdate: apply })
    return () => { tween.current?.kill() }
    // The camera follows the selection only; pausing mid-flight snaps on the next selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, apply])

  // City markers and labels enter in sequence for each newly selected region.
  useLayoutEffect(() => {
    if (!overlay.current || !region || reducedMotion || !playing) return
    const context = gsap.context(() => {
      gsap.from('.rmap-city', { opacity: 0, duration: 0.35, stagger: 0.11, ease: 'power1.out', delay: 0.45 })
      gsap.from('.rmap-city__dot', { scale: 0.4, duration: 0.4, stagger: 0.11, ease: 'back.out(2)', delay: 0.45 })
      gsap.from('[data-detail-label]', { opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.55 })
      if (inset.current) gsap.from(inset.current, { opacity: 0, y: 10, duration: 0.45, ease: 'power2.out', delay: 0.5 })
    }, overlay)
    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // One gentle pulse on the selected region's primary city, held while the presentation is paused.
  const pulse = useRef<gsap.core.Tween | null>(null)
  useLayoutEffect(() => {
    if (!overlay.current || !region || reducedMotion) return
    const ring = overlay.current.querySelector('[data-pulse]')
    if (!ring) return
    pulse.current = gsap.fromTo(ring, { scale: 0.6, opacity: 0.55 }, { scale: 2.4, opacity: 0, duration: 2.2, repeat: -1, ease: 'sine.out', delay: 1 })
    return () => { pulse.current?.kill(); pulse.current = null; gsap.set(ring, { clearProps: 'all' }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion])
  useEffect(() => {
    if (playing) pulse.current?.resume()
    else pulse.current?.pause()
  }, [playing, active])

  const select = (id: string | null) => setActive((current) => (current === id ? current : id))

  return <section className="reference-scene rmap-scene" aria-labelledby="scene-title" data-active-region={active ?? 'overview'}>
    <div className="reference-eyebrow"><span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span><span>{t('regionalMap.eyebrow')}</span><span className="reference-eyebrow__rule" /><span className="reference-eyebrow__total">{number} / {count}</span></div>
    <header className="rmap-heading">
      <h1 id="scene-title">{t('regionalMap.title')}</h1>
      <p>{t('regionalMap.intro')}</p>
    </header>

    <div className="rmap-body">
      <div className="rmap-map" ref={frame}>
        <svg className="rmap-svg" role="img" aria-label={t('regionalMap.mapAlt')}>
          <g ref={world}>
            {paths?.map(({ id, d }) => {
              const membership = regionByProvince.get(id)
              const state = !membership ? 'none' : !active ? 'overview' : membership.region === active ? 'active' : 'dim'
              const color = membership ? regions.find((item) => item.id === membership.region)!.color : undefined
              const external = active === 'yrd' && id === 'shandong'
              return <path key={id} d={d} data-province={id} data-state={state} data-role={membership?.role} data-external={external || undefined}
                style={color ? { '--region': color } as CSSProperties : undefined}
                onClick={membership ? () => select(membership.region) : undefined} />
            })}
          </g>
        </svg>

        <div className="rmap-overlay" ref={overlay}>
          {regions.map((item, index) => item.id !== active && <button key={item.id} type="button" className="rmap-badge" data-dim={active ? true : undefined}
            style={{ ...pointStyle(item.anchor), '--region': item.color, '--ox': `${Math.abs(item.badgeOffset[0]!)}px`, '--oy': `${item.badgeOffset[1]}px` } as CSSProperties}
            onClick={() => select(item.id)} aria-label={t(`regionalMap.regions.${item.id}.name`)}>
            <span className="rmap-badge__dot" />
            <span className={`rmap-badge__tag${item.badgeOffset[0]! < 0 ? ' rmap-badge__tag--left' : ''}`}><b>0{index + 1}</b>{!active && <span>{t(`regionalMap.regions.${item.id}.short`)}</span>}</span>
          </button>)}

          {region && <div key={region.id} className="rmap-details" style={{ '--region': region.color } as CSSProperties}>
            {region.provinceLabels.map((label) => <span key={label.id} className="rmap-province-label" data-detail-label data-external={'external' in label || undefined} style={pointStyle(label.coordinates)}>
              {t(`regionalMap.provinces.${label.id}`)}
            </span>)}
            {'areaLabels' in region && region.areaLabels.map((label) => <span key={label.id} className="rmap-area-label" data-detail-label style={pointStyle(label.coordinates)}>
              {t(`regionalMap.areas.${label.id}`)}
            </span>)}
            {region.cities.map((city) => <div key={city.id} className="rmap-city" data-external={'external' in city || undefined} data-primary={'primary' in city || undefined} style={pointStyle(city.coordinates)}>
              {'primary' in city && <span className="rmap-city__pulse" data-pulse />}
              <span className="rmap-city__dot" />
              <span className={labelClass(city.label)}>{t(`regionalMap.cities.${city.id}`)}</span>
            </div>)}
          </div>}
        </div>

        {region && <div className="rmap-inset" ref={inset} key={region.id}><RegionPhoto region={region} className="rmap-photo--inset" /></div>}

        {active && <button type="button" className="rmap-back" onClick={() => select(null)}><Globe aria-hidden="true" />{t('regionalMap.overviewBack')}</button>}


      </div>

      <ul className="rmap-legend" aria-label={t('regionalMap.legendLabel')}>
        <li><span className="rmap-legend__area" />{t('regionalMap.legend.area')}</li>
        <li><span className="rmap-legend__city" />{t('regionalMap.legend.city')}</li>
        {active === 'yrd' && <li><span className="rmap-legend__external" />{t('regionalMap.legend.external')}</li>}
        {active === 'other' && <li><span className="rmap-legend__dispersed" />{t('regionalMap.legend.dispersed')}</li>}
      </ul>

      <aside className="rmap-panel" aria-live="polite" aria-atomic="true">
        {region ? <RegionPanel key={region.id} region={region} /> : <OverviewPanel onSelect={select} />}
      </aside>

      <nav className="rmap-selectors" aria-label={t('regionalMap.selectorsLabel')}>
        <button type="button" className="rmap-selectors__overview" aria-pressed={!active} onClick={() => select(null)}><Globe aria-hidden="true" />{t('regionalMap.overview')}</button>
        {regions.map((item, index) => <button key={item.id} type="button" aria-pressed={active === item.id} style={{ '--region': item.color } as CSSProperties} onClick={() => select(item.id)}>
          <span className="rmap-selectors__index">0{index + 1}</span><span>{t(`regionalMap.regions.${item.id}.short`)}</span>
        </button>)}
      </nav>
    </div>

    <footer className="rmap-source">{t('regionalMap.source')}</footer>
  </section>
}
