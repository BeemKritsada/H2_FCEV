import { ArrowRight, BatteryCharging, Factory, Fuel, Gauge, Leaf, Snowflake, Truck, Warehouse, Wind, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
import type { PresentationLocale } from '../../content/schema'
import type { PresentationScene } from '../../scenes/scene-config'
import { ChinaMap } from './ChinaMap'
import { HeroTruck } from './HeroTruck'

function ProcessPath({ steps, connected = true }: { steps: { label: string; Icon: LucideIcon }[]; connected?: boolean }) {
  return (
    <ol className="process-path">
      {steps.map(({ label, Icon }, index) => (
        <li key={label}>
          <span className="process-path__number">{String(index + 1).padStart(2, '0')}</span>
          <Icon aria-hidden="true" size={31} strokeWidth={1.5} />
          <span>{label}</span>
          {connected && index < steps.length - 1 && <ArrowRight aria-hidden="true" className="process-path__arrow" size={20} />}
        </li>
      ))}
    </ol>
  )
}

function StationDrawing() {
  return (
    <svg aria-hidden="true" className="station-drawing" viewBox="0 0 620 390">
      <defs>
        <linearGradient id="station-roof" x2=".8" y2="1"><stop stopColor="#5298fb" /><stop offset="1" stopColor="#1643a3" /></linearGradient>
        <linearGradient id="station-metal"><stop stopColor="#d1e1f0" /><stop offset=".5" stopColor="#fff" /><stop offset="1" stopColor="#acc6e0" /></linearGradient>
      </defs>
      <path d="M15 312 340 218 607 283 270 380Z" fill="#e9f1f8" />
      <path d="M38 334 346 242M124 357 433 265M215 377 526 290" stroke="#fff" strokeWidth="3" />
      <path d="M432 124v149l16 5V129M172 92v191l15 4V98" fill="url(#station-metal)" />
      <path d="M107 83 298 31 530 89 335 150Z" fill="url(#station-roof)" />
      <path d="M107 83v18l228 67 195-61V89l-195 61Z" fill="#164da7" />
      <path d="m125 104 210 61 178-55" fill="none" stroke="#4ae0f0" strokeWidth="3" />
      <path d="M227 168 262 158 297 168v129l-36 14-34-13Z" fill="url(#station-metal)" />
      <path d="M261 173v132l32-11V170Z" fill="#bed6eb" />
      <path d="m234 184 22 5v34l-22-5Z" fill="#163f6e" />
      <path d="m233 248 24 6v40l-24-6Z" fill="#1761de" />
      <path d="M294 195c42 0 45 63 21 65-19 2-8-39-25-33" fill="none" stroke="#315278" strokeWidth="6" />
      <path d="m343 199 53-15 33 11v84l-55 18-31-11Z" fill="url(#station-metal)" />
      <path d="m353 211 21 6 44-14M353 227l21 6 44-14M353 243l21 6 44-14" fill="none" stroke="#a0c3e2" strokeWidth="2" />
      <text x="189" y="99" fill="white" fontSize="24" fontFamily="Inter, sans-serif" fontWeight="700" transform="rotate(16 189 99)">H₂</text>
    </svg>
  )
}

function RailDrawing({ freight = false }: { freight?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 130" className="rail-drawing">
      <path d="M18 109h568M18 117h568" stroke="#a7bfd7" strokeWidth="2" />
      {freight ? <>
        <path d="M65 43h184V21h76l24 22h76v40H65Z" fill="#e2edf6" stroke="#819fba" />
        <path d="M251 28h64l21 21h-85Z" fill="#24486a" />
        <path d="M62 75h366v15H62Z" fill="#2265d9" />
        <path d="M448 37h115v51H448Z" fill="#ccdfec" stroke="#819fba" />
        <path d="M80 54h145M80 62h145" stroke="#91b1cb" strokeWidth="3" />
        <path d="M469 42v40M488 42v40M507 42v40M526 42v40M545 42v40" stroke="#a5c4d9" strokeWidth="3" />
        {[95, 121, 366, 392, 476, 542].map((x) => <circle key={x} cx={x} cy="96" r="10" fill="#304964" />)}
      </> : <>
        <path d="M43 88c-18 0-16-18-3-34l28-27h485v61Z" fill="#e4eef7" stroke="#8faac2" />
        <path d="M54 43 40 61h67V43Z" fill="#1b436e" />
        <path d="M126 44h53v20h-53Zm72 0h53v20h-53Zm125 0h53v20h-53Zm72 0h53v20h-53Zm72 0h53v20h-53Z" fill="#315c88" />
        <path d="M33 75h520v13H43Z" fill="#2164de" /><path d="M277 30v58M290 30v58" stroke="#7d9eba" strokeWidth="3" />
        {[103, 236, 341, 513].map((x) => <circle key={x} cx={x} cy="96" r="10" fill="#304964" />)}
      </>}
    </svg>
  )
}

export function SceneVisual({ scene, presentation }: { scene: PresentationScene; presentation: PresentationLocale }) {
  const { t } = useTranslation()
  const step = (key: string, Icon: LucideIcon) => ({ label: t(`visuals.${key}`), Icon })
  let visual

  if (scene.visual === 'truck' || scene.visual === 'fleet') {
    visual = <HeroTruck />
  } else if (scene.visual === 'map') {
    visual = <><ChinaMap /><div className="visual-baseline"><span>H₂</span><span>{t('visuals.energyAndLogistics')}</span></div></>
  } else if (scene.id === 'scene-production-mix') {
    const items = presentation.sections.find((section) => section.id === 'hydrogen-production-structure')?.bulletLists?.[0]?.items ?? []
    visual = <div className="production-chart">
      <div className="production-chart__scale"><span>0</span><span>100%</span></div>
      {items.map((item) => {
        const value = Number(item.match(/(\d+(?:\.\d+)?)%/)?.[1] ?? 0)
        return <div className="production-chart__row" key={item}>
          <p>{item}</p>
          <div className="production-chart__track"><span style={{ width: `${value}%` }} /></div>
        </div>
      })}
      <p className="visual-note">{t('visuals.shareNote')}</p>
    </div>
  } else if (scene.visual === 'station') {
    visual = <><StationDrawing /><div className="visual-baseline"><Fuel aria-hidden="true" /><span>{t('visuals.station')}</span></div><p className="visual-note">{t('visuals.schematic')}</p></>
  } else if (scene.visual === 'rail') {
    visual = <div className="rail-study"><div><p>{t('visuals.passengerRail')}</p><RailDrawing /></div><div><p>{t('visuals.freightRail')}</p><RailDrawing freight /></div><p className="visual-note">{t('visuals.schematic')}</p></div>
  } else if (scene.visual === 'cold-chain') {
    visual = <div className="cold-chain-study">
      <div className="cold-chain-study__vehicle"><Snowflake aria-hidden="true" size={36} strokeWidth={1.3} /><Truck aria-hidden="true" size={155} strokeWidth={.8} /></div>
      <div className="comparison-paths">
        <div><strong>FCEV</strong><ProcessPath steps={[step('hydrogen', Fuel), step('fuelCell', Zap)]} /></div>
        <div><strong>BEV</strong><ProcessPath steps={[step('battery', BatteryCharging)]} /></div>
      </div>
      <div className="cold-chain-study__loads"><span><Truck aria-hidden="true" size={19} />{t('visuals.propulsion')}</span><span><Snowflake aria-hidden="true" size={19} />{t('visuals.refrigeration')}</span></div>
      <p className="visual-note">{t('visuals.schematic')}</p>
    </div>
  } else {
    const steps = scene.visual === 'renewable'
      ? [step('renewables', Wind), step('electrolysis', Zap), step('hydrogen', Fuel)]
      : scene.visual === 'power'
        ? [step('renewables', Wind), step('electrolysis', Zap), step('storage', Warehouse), step('fuelCell', BatteryCharging), step('grid', Zap)]
        : scene.visual === 'industry'
          ? [step('hydrogen', Fuel), step('steel', Factory), step('chemicals', Factory)]
          : scene.visual === 'barriers'
            ? [step('vehicleCost', Truck), step('stationAccess', Fuel), step('hydrogenCost', Gauge)]
            : [step('refueling', Fuel), step('coldOperation', Snowflake), step('heavyFreight', Truck), step('water', Leaf)]
    visual = <div className={`process-study${scene.visual === 'barriers' ? ' process-study--barriers' : ''}`}>
      <div className="process-study__heading" aria-hidden="true">{scene.visual === 'barriers' ? <Gauge size={52} strokeWidth={1} /> : <span>H<sub>2</sub></span>}</div>
      <ProcessPath steps={steps} connected={scene.visual === 'renewable' || scene.visual === 'power'} />
      <p className="visual-note">{t('visuals.schematic')}</p>
    </div>
  }

  return <div className={`scene-visual scene-visual--${scene.visual}`} data-visual-layer="scene-media">{visual}</div>
}
