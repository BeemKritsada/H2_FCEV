import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { RotateCcw, Zap } from 'lucide-react'
import { useInfrastructureMotion } from '../batch2/useInfrastructureMotion'
import { useMotion } from '../../motion/motion-context'
import '../../../styles/batch-four-scenes.css'

type SceneProps = { count: number; number: number; sourceSlide: number }
type StorageMode = 'store' | 'supply'
type BackupStage = 'normal' | 'interrupted' | 'activating' | 'restored'
type Scenario = 'island' | 'border' | 'dataCenter'

/** One staged entrance per visit: copy blocks first, then the diagram parts in process order. */
function useBatchFourEntrance(root: RefObject<HTMLElement | null>) {
  const { playing, reducedMotion } = useMotion()
  useLayoutEffect(() => {
    if (!root.current || reducedMotion || !playing) return
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power2.out', clearProps: 'opacity,transform' } })
      timeline.from('[data-enter]', { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, 0)
        .from('[data-stage]', { opacity: 0, duration: 0.45, stagger: 0.12 }, 0.3)
      // Flow arrows join only after the equipment they connect is on screen.
      const steps = root.current!.querySelectorAll('[data-flow-step]')
      if (steps.length) timeline.from(steps, { opacity: 0, duration: 0.4, stagger: 0.18 }, '>-0.05')
    }, root)
    return () => context.revert()
    // Entrance only on scene entry; pausing later must not replay it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])
}

function BatchFourEyebrow({ count, number, label }: { count: number; number: number; label: string }) {
  return <div className="reference-eyebrow batch-four-eyebrow">
    <span className="reference-eyebrow__index">{String(number).padStart(2, '0')}</span>
    <span>{label}</span>
    <span className="reference-eyebrow__rule" />
    <span className="reference-eyebrow__total">{String(number).padStart(2, '0')} / {count}</span>
  </div>
}

function BatchFourSource({ sourceSlide }: { sourceSlide: number }) {
  const { t } = useTranslation()
  return <footer className="batch-four-source">
    <span>{t('batchFour.sourceNote', { slide: sourceSlide })}</span>
    <span>{t('batchFour.conceptNote')}</span>
  </footer>
}

function Turbine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} className="energy-turbine">
    <path d="M-5 0 3 0 13 173 -10 173Z" fill="url(#energy-metal)" stroke="#9cb3c6" strokeWidth="2" />
    <g className="energy-turbine__rotor">
      <path d="M0 0-7-17-6-99 0-111 7-97 8-17Z" fill="#f8fcff" stroke="#92aec3" strokeWidth="2" />
      <path d="M0 0-7-17-6-99 0-111 7-97 8-17Z" fill="#f8fcff" stroke="#92aec3" strokeWidth="2" transform="rotate(120)" />
      <path d="M0 0-7-17-6-99 0-111 7-97 8-17Z" fill="#f8fcff" stroke="#92aec3" strokeWidth="2" transform="rotate(240)" />
      <circle r="12" fill="#0753c8" /><circle r="4" fill="#fff" />
    </g>
  </g>
}

function SolarArray() {
  return <g className="energy-solar">
    {[0, 1, 2].map((row) => [0, 1, 2, 3].map((column) => {
      const x = 72 + column * 54 + row * 10
      const y = 328 + row * 26
      return <g key={`${row}-${column}`}>
        <path d={`M${x} ${y}l47 0 9 23-48 0Z`} fill="#155a91" stroke="#88afca" strokeWidth="2" />
        <path d={`M${x + 16} ${y}l8 23M${x + 32} ${y}l8 23M${x + 3} ${y + 12}l48 0`} stroke="#7ab1d3" strokeWidth="1.3" />
        <path d={`M${x + 7} ${y + 23}v11m39-11v11`} stroke="#879eaf" strokeWidth="3" />
      </g>
    }))}
  </g>
}

function StorageLandscape({ mode, title, description, labels, children }: {
  mode: StorageMode; title: string; description: string; children: ReactNode
  labels: { windSolar: string; electrolyzer: string; tanks: string; fuelCell: string; grid: string }
}) {
  const id = useId().replaceAll(':', '')
  return <figure className="energy-system" data-enter>
    {children}
    <svg className="energy-system__art" viewBox="0 88 1400 384" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>
      <defs>
        <linearGradient id="energy-sky" x2="0" y2="1"><stop stopColor="#f7fbfe" /><stop offset="1" stopColor="#fff" /></linearGradient>
        <linearGradient id="energy-metal" x2="0" y2="1"><stop stopColor="#d8e5ee" /><stop offset=".48" stopColor="#fff" /><stop offset="1" stopColor="#b3c8d8" /></linearGradient>
        <linearGradient id="energy-panel" x2="1" y2="1"><stop stopColor="#287ab0" /><stop offset="1" stopColor="#123f70" /></linearGradient>
        <marker id={`${id}-green-arrow`} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="m2 2 8 4-8 4Z" fill="#16a56a" /></marker>
        <marker id={`${id}-blue-arrow`} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="m2 2 8 4-8 4Z" fill="#0753c8" /></marker>
      </defs>
      <rect width="1400" height="510" rx="18" fill="url(#energy-sky)" />
      <path d="M0 344 185 279 342 328 545 253 736 321 930 255 1140 324 1400 258V442H0Z" fill="#f3f7fa" />
      <path d="M0 390 205 325 435 381 641 322 833 378 1032 317 1241 371 1400 331V465H0Z" fill="#edf3f6" />
      <path d="M0 431 257 386 476 416 716 377 946 420 1198 376 1400 403V510H0Z" fill="#e7f0f4" />
      <path d="M0 465H1400" stroke="#d8e5ec" strokeWidth="2" />

      <g data-stage data-component="renewables" data-active={mode === 'store'}>
        <Turbine x={151} y={213} /> <Turbine x={302} y={246} scale={.75} />
        <SolarArray />
      </g>

      <g data-flow-step>
        <path className="flow-track" d="M324 360C395 360 421 315 486 315" />
        <path className="flow-path flow-path--renewable" markerEnd={`url(#${id}-green-arrow)`} d="M324 360C395 360 421 315 486 315" />
      </g>
      <g data-flow-step>
        <path className="flow-track" d="M673 315H758" />
        <path className="flow-path flow-path--hydrogen-store" markerEnd={`url(#${id}-blue-arrow)`} d="M673 315H758" />
      </g>
      <g data-flow-step>
        <path className="flow-track" d="M930 315H1004" />
        <path className="flow-path flow-path--hydrogen-supply" markerEnd={`url(#${id}-blue-arrow)`} d="M930 315H1004" />
      </g>
      <g data-flow-step>
        <path className="flow-track" d="M1178 315H1246" />
        <path className="flow-path flow-path--grid" markerEnd={`url(#${id}-green-arrow)`} d="M1178 315H1246" />
      </g>

      <g className="energy-facility" data-stage data-component="electrolyzer" data-active={mode === 'store'}>
        <path d="m481 284 28-21h132l30 21v111H481Z" fill="url(#energy-metal)" stroke="#94aec1" strokeWidth="2" />
        <path d="M481 284h190v14H481Z" fill="#55758e" /><path d="M501 395h152v11H501Z" fill="#153f66" />
        <path d="M512 313h72v58h-72Z" fill="#183c5c" /><path d="M520 321h56v42h-56Z" fill="#dff2f8" />
        <path d="M597 312h55v61h-55Z" fill="#e3edf3" stroke="#afc2cf" strokeWidth="2" />
        <path d="M605 322h39M605 334h39M605 346h39M605 358h39" stroke="#7894a9" strokeWidth="3" />
        <circle cx="615" cy="384" r="5" fill="#16a56a" /><circle cx="635" cy="384" r="5" fill="#f59e0b" />
        <path d="M519 284v-24h13v24M624 284v-30h14v30" fill="#d8e5ee" stroke="#94aec1" strokeWidth="2" />
      </g>
      <g className="energy-facility" data-stage data-component="storage" data-active={mode === 'store' || mode === 'supply'}>
        <path d="M753 398h180v12H753Z" fill="#153f66" />
        {[0, 1, 2].map((index) => {
          const x = 770 + index * 55
          return <g key={index}>
            <rect x={x} y="257" width="43" height="136" rx="20" fill="url(#energy-metal)" stroke="#83a0b4" strokeWidth="2" />
            <ellipse cx={x + 21.5} cy="260" rx="20" ry="7" fill="#f8fbfd" stroke="#83a0b4" strokeWidth="2" />
            <path d={`M${x + 8} 280v93M${x + 34} 280v93`} stroke="#c0d1dd" strokeWidth="2" />
            <path d={`M${x + 21} 248v-13h8v13`} fill="#718da3" />
          </g>
        })}
      </g>
      <g className="energy-facility" data-stage data-component="fuel-cell" data-active={mode === 'supply'}>
        <path d="m1003 286 28-20h123l20 17v110h-171Z" fill="url(#energy-metal)" stroke="#91aabd" strokeWidth="2" />
        <path d="M1003 286h171v14h-171Z" fill="#17446f" /><path d="M1018 393h143v12h-143Z" fill="#153f66" />
        <rect x="1024" y="313" width="97" height="59" rx="3" fill="#e4edf2" stroke="#b1c4d1" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((index) => <path key={index} d={`M${1032 + index * 13} 319v47`} stroke={index % 2 ? '#7893a5' : '#afc3d0'} strokeWidth="5" />)}
        <rect x="1127" y="312" width="31" height="60" fill="#183d5a" /><circle cx="1142" cy="327" r="5" fill="#16a56a" />
      </g>
      <g className="energy-grid" data-stage data-component="grid" data-active={mode === 'supply'}>
        <path d="m1268 238 34 0 31 154h-12l-26-131-26 131h-12Z" fill="#d7e3eb" stroke="#7891a4" strokeWidth="2" />
        <path d="M1243 269h119M1253 293h99M1260 319h86M1266 349h73" stroke="#7891a4" strokeWidth="4" />
        <path d="M1264 258h43M1258 281h61M1254 306h69M1270 331h34" stroke="#a8bac7" strokeWidth="2" />
        <path d="M1257 392h88M1270 392v12M1331 392v12" stroke="#7891a4" strokeWidth="3" />
      </g>
      <text className="energy-art-label" x="229" y="448" textAnchor="middle">{labels.windSolar}</text>
      <text className="energy-art-label" x="570" y="448" textAnchor="middle">{labels.electrolyzer}</text>
      <text className="energy-art-label" x="846" y="448" textAnchor="middle">{labels.tanks}</text>
      <text className="energy-art-label" x="1087" y="448" textAnchor="middle">{labels.fuelCell}</text>
      <text className="energy-art-label" x="1303" y="448" textAnchor="middle">{labels.grid}</text>
    </svg>
  </figure>
}

export function PowerStorageScene({ count, number, sourceSlide }: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useInfrastructureMotion(root)
  useBatchFourEntrance(root)
  const [mode, setMode] = useState<StorageMode>('store')
  return <section ref={root} className="reference-scene batch-four-scene power-storage-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'} data-mode={mode}>
    <BatchFourEyebrow count={count} number={number} label={t('batchFour.storage.eyebrow')} />
    <header className="batch-four-heading" data-enter>
      <h1 id="scene-title">{t('batchFour.storage.title')}</h1>
      <p>{t('batchFour.storage.subtitle')}</p>
    </header>
    <StorageLandscape
      mode={mode}
      title={t('batchFour.storage.visualTitle')}
      description={t('batchFour.storage.visualAlt')}
      labels={{
        windSolar: t('batchFour.storage.windSolar'),
        electrolyzer: t('batchFour.storage.electrolyzer'),
        tanks: t('batchFour.storage.tanks'),
        fuelCell: t('batchFour.storage.fuelCell'),
        grid: t('batchFour.storage.grid'),
      }}
    >
      <div className="storage-controls" role="group" aria-label={t('batchFour.storage.modeLabel')}>
        <button type="button" aria-pressed={mode === 'store'} onClick={() => setMode('store')}>{t('batchFour.storage.modeStore')}</button>
        <button type="button" aria-pressed={mode === 'supply'} onClick={() => setMode('supply')}>{t('batchFour.storage.modeSupply')}</button>
      </div>
    </StorageLandscape>
    <div className="storage-summary" aria-live="polite" data-enter>
      <span className="storage-summary__status"><i aria-hidden="true" />{mode === 'store' ? t('batchFour.storage.modeStore') : t('batchFour.storage.modeSupply')}</span>
      <div className="storage-summary__content">
        <p>{mode === 'store' ? t('batchFour.storage.storeFlow') : t('batchFour.storage.supplyFlow')}</p>
        <span>{t('batchFour.storage.impact')}</span>
      </div>
      <span className="storage-summary__note">{t('batchFour.storage.note')}</span>
    </div>
    <BatchFourSource sourceSlide={sourceSlide} />
  </section>
}

function IslandIllustration() {
  return <>
    <defs><linearGradient id="island-sea" x2="0" y2="1"><stop stopColor="#cbeaf4" /><stop offset="1" stopColor="#edf8fb" /></linearGradient></defs>
    <rect width="540" height="310" fill="#f2f9fc" />
    <circle cx="452" cy="47" r="23" fill="#fff2cf" />
    <path d="M0 153c55-20 109 17 167-1s102-2 146 13 108-15 227-2v147H0Z" fill="url(#island-sea)" />
    <path d="M0 205c62-15 117 11 181-2 92-19 155 15 218-1 43-11 89-3 141 9v99H0Z" fill="#d6eff5" />
    <path d="M0 224c61-43 119-35 171-11 35 16 69 11 111-8 61-29 107-17 147 8 38 23 73 21 111-2v99H0Z" fill="#b9dcce" />
    <path d="M0 256c70-29 136-5 192 9 68 17 124-21 188-17s104 17 160-4v66H0Z" fill="#91c2a9" />
    <g className="backup-environment__building" fill="#eaf1e9" stroke="#90a9b4" strokeWidth="2"><path d="m235 143 57-25 59 21v56l-58 25-58-23Z" /><path d="m292 118 60 21 0 56-60 25Z" fill="#d7e3e8" /><path className="backup-window" d="M250 149h21v25h-21Z" fill="#8cbcd1" /><path className="backup-window" d="M283 146h45v29h-45Z" fill="#bfe2ed" /></g>
    <path d="M248 219 233 236m77-1-8 21" stroke="#6a8c84" strokeWidth="7" />
    <g className="backup-unit" transform="translate(170 239)"><rect width="59" height="35" rx="3" fill="#f8fcfd" stroke="#6e8ea2" strokeWidth="2" /><path d="M8 8h43M8 16h43M8 24h43" stroke="#2e7dae" strokeWidth="2" /><circle cx="49" cy="5" r="3" fill="#16a56a" /><text x="29" y="51" textAnchor="middle">H₂ FC</text></g>
    <path className="scenario-flow scenario-flow--grid" d="M455 37V99H367v30" />
    <path className="scenario-flow scenario-flow--hydrogen" d="M153 256h17" />
    <path className="scenario-flow scenario-flow--backup" d="M229 254h40v-61h32" />
    <g transform="translate(140 240)"><rect width="13" height="31" rx="6" fill="#e1edf2" stroke="#6e8ea2" strokeWidth="2" /><path d="M6 26v-9" stroke="#0753c8" strokeWidth="3" /></g>
    <g className="scenario-lamp" transform="translate(339 151)"><circle r="12" fill="#f59e0b" /><path d="M0-23v-9m23 32h9m-55 0h-9m48-16 7-7m-46 46-7 7" stroke="#db930e" strokeWidth="3" /></g>
  </>
}

function BorderIllustration() {
  return <>
    <rect width="540" height="310" fill="#f3f8fb" />
    <path d="m0 165 88-78 76 52 93-95 92 100 69-47 122 67v146H0Z" fill="#d9e7ed" />
    <path d="m0 192 90-48 85 44 89-44 91 46 83-40 102 49v111H0Z" fill="#bdd5d8" />
    <path d="M0 230c76-31 137-15 202 7 69 23 121-18 185-5 63 12 95 25 153-1v79H0Z" fill="#a6c5b4" />
    <path d="M0 274 164 222l210 55-162 33H0Z" fill="#dce4e3" />
    <path d="m227 276 143-43 170 42-146 35Z" fill="#eff3f3" />
    <g className="backup-environment__building" fill="#eef3f5" stroke="#819aab" strokeWidth="2"><path d="m225 151 111-43 109 39v86l-110 40-110-42Z" /><path d="m336 108 109 39v86l-109 40Z" fill="#dce7ec" /><path className="backup-window" d="M247 163h34v46h-34Zm48-15h26v40h-26Z" fill="#6e9cb5" /><path className="backup-window" d="M365 165h55v35h-55Z" fill="#bfd9e2" /></g>
    <path d="M204 241V179h17m-17 24h-18m132 77v-28h31" fill="none" stroke="#7893a4" strokeWidth="5" />
    <path d="M207 241h160m-146-8v17m44-17v17m44-17v17m44-17v17" stroke="#7893a4" strokeWidth="3" />
    <g className="backup-unit" transform="translate(382 247)"><rect width="58" height="34" rx="3" fill="#f8fcfd" stroke="#6e8ea2" strokeWidth="2" /><path d="M8 8h42M8 16h42M8 24h42" stroke="#2e7dae" strokeWidth="2" /><circle cx="48" cy="5" r="3" fill="#16a56a" /><text x="29" y="50" textAnchor="middle">H₂ FC</text></g>
    <path className="scenario-flow scenario-flow--grid" d="M420 56V112H383v30" />
    <path className="scenario-flow scenario-flow--hydrogen" d="M368 264h14" />
    <path className="scenario-flow scenario-flow--backup" d="M382 247h-31v-42h-33" />
    <g className="scenario-lamp" transform="translate(332 174)"><circle r="11" fill="#f59e0b" /><path d="M0-21v-8m21 29h8m-50 0h-8m43-15 6-6" stroke="#db930e" strokeWidth="3" /></g>
  </>
}

function DataCenterIllustration() {
  return <>
    <rect width="540" height="310" fill="#f1f8fc" />
    <circle cx="440" cy="49" r="20" fill="#fff1cf" />
    <path d="M0 220 120 183l89 23 123-52 92 34 116-30v152H0Z" fill="#e4eef2" />
    <path d="M0 266 151 217l105 33 148-52 136 44v68H0Z" fill="#d7e6e9" />
    <path d="M68 278h422" stroke="#9db3bd" strokeWidth="3" />
    <g className="backup-environment__building"><path d="m115 121 119-44 122 43v118l-121 42-120-45Z" fill="#edf4f7" stroke="#809cac" strokeWidth="2" /><path d="m235 77 121 43v118l-121 42Z" fill="#d6e3e9" stroke="#809cac" strokeWidth="2" />
      {[0, 1, 2, 3].map((row) => [0, 1, 2].map((column) => <path key={`${row}-${column}`} className="backup-window" d={`M${130 + column * 31} ${141 + row * 22}h22v13h-22Z`} fill="#477d9a" />))}
      {[0, 1, 2].map((row) => [0, 1, 2].map((column) => <path key={`b-${row}-${column}`} className="backup-window" d={`M${253 + column * 29} ${130 + row * 28}h18v14h-18Z`} fill="#5788a1" />))}
      <path d="M144 108v-17h24v17m28-10V80h19v18m92 15V95h22v22" stroke="#758f9e" strokeWidth="4" fill="#eef4f6" />
    </g>
    <g className="backup-unit" transform="translate(391 230)"><rect width="69" height="41" rx="3" fill="#f8fcfd" stroke="#6e8ea2" strokeWidth="2" /><path d="M9 9h50M9 19h50M9 29h50" stroke="#2e7dae" strokeWidth="3" /><circle cx="57" cy="5" r="3" fill="#16a56a" /><text x="34" y="58" textAnchor="middle">H₂ FC</text></g>
    <path className="scenario-flow scenario-flow--grid" d="M451 47V89H344v25" />
    <path className="scenario-flow scenario-flow--hydrogen" d="M376 250h15" />
    <path className="scenario-flow scenario-flow--backup" d="M391 249h-39V199h-20" />
    <g className="scenario-lamp" transform="translate(323 177)"><circle r="11" fill="#f59e0b" /><path d="M0-21v-8m21 29h8m-50 0h-8m43-15 6-6" stroke="#db930e" strokeWidth="3" /></g>
  </>
}

function ScenarioCard({ scenario, selected, stage, title, detail, onSelect }: {
  scenario: Scenario; selected: boolean; stage: BackupStage; title: string; detail: string; onSelect: () => void
}) {
  const id = useId().replaceAll(':', '')
  const sceneState = selected ? stage : 'normal'
  return <button
    type="button"
    className="backup-scenario"
    data-stage
    data-scenario={scenario}
    data-selected={selected}
    data-power-state={sceneState}
    aria-pressed={selected}
    aria-label={`${title}. ${detail}`}
    onClick={onSelect}
  >
    <svg className="backup-scenario__art" viewBox="0 0 540 310" role="img" aria-labelledby={`${id}-title`} aria-hidden="true">
      <title id={`${id}-title`}>{title}</title>
      {scenario === 'island' ? <IslandIllustration /> : scenario === 'border' ? <BorderIllustration /> : <DataCenterIllustration />}
    </svg>
    <span className="backup-scenario__copy"><strong>{title}</strong><span>{detail}</span></span>
    <span className="backup-scenario__selection" aria-hidden="true"><i /></span>
  </button>
}

export function DistributedPowerScene({ count, number, sourceSlide }: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useInfrastructureMotion(root)
  useBatchFourEntrance(root)
  const [scenario, setScenario] = useState<Scenario>('island')
  const [stage, setStage] = useState<BackupStage>('normal')
  const timers = useRef<number[]>([])
  const stages: BackupStage[] = ['normal', 'interrupted', 'activating', 'restored']

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }
  useEffect(() => () => clearTimers(), [])
  const toggleSequence = () => {
    clearTimers()
    if (stage !== 'normal') {
      setStage('normal')
      return
    }
    setStage('interrupted')
    timers.current = [
      window.setTimeout(() => setStage('activating'), 850),
      window.setTimeout(() => setStage('restored'), 1750),
    ]
  }

  return <section ref={root} className="reference-scene batch-four-scene distributed-power-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'} data-power-stage={stage}>
    <BatchFourEyebrow count={count} number={number} label={t('batchFour.distributed.eyebrow')} />
    <header className="batch-four-heading" data-enter>
      <h1 id="scene-title">{t('batchFour.distributed.title')}</h1>
      <p>{t('batchFour.distributed.subtitle')}</p>
    </header>
    <div className="backup-showcase" data-enter>
      <div className="backup-scenarios" role="group" aria-label={t('batchFour.distributed.scenarioLabel')}>
        <ScenarioCard scenario="island" selected={scenario === 'island'} stage={stage} title={t('batchFour.distributed.island')} detail={t('batchFour.distributed.islandDetail')} onSelect={() => setScenario('island')} />
        <ScenarioCard scenario="border" selected={scenario === 'border'} stage={stage} title={t('batchFour.distributed.border')} detail={t('batchFour.distributed.borderDetail')} onSelect={() => setScenario('border')} />
        <ScenarioCard scenario="dataCenter" selected={scenario === 'dataCenter'} stage={stage} title={t('batchFour.distributed.dataCenter')} detail={t('batchFour.distributed.dataCenterDetail')} onSelect={() => setScenario('dataCenter')} />
      </div>
      <div className="backup-operations">
        <div className="backup-flow-legend" aria-live="polite">
          <span className="backup-flow-legend__grid"><i />{t('batchFour.distributed.gridSupply')}</span>
          <span className="backup-flow-legend__hydrogen"><i />{t('batchFour.distributed.hydrogenBackup')}</span>
        </div>
        <button className="backup-sequence-button" type="button" onClick={toggleSequence}>
          {stage === 'normal' ? <><Zap size={17} aria-hidden="true" />{t('batchFour.distributed.runSequence')}</> : <><RotateCcw size={16} aria-hidden="true" />{t('batchFour.distributed.resetSequence')}</>}
        </button>
      </div>
      <ol className="backup-sequence" aria-label={t('batchFour.distributed.sequenceLabel')} aria-live="polite">
        {stages.map((step, index) => <li key={step} data-current={stage === step} data-complete={stages.indexOf(stage) > index} aria-current={stage === step ? 'step' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span>{t(`batchFour.distributed.stage.${step}`)}
        </li>)}
      </ol>
    </div>
    <aside className="chp-note" data-enter>
      <span className="chp-note__flow">{t('batchFour.distributed.chpFlow')}</span>
      <div><h2>{t('batchFour.distributed.chpTitle')}</h2><p>{t('batchFour.distributed.chpNote')}</p></div>
      <span className="chp-note__pilot">{t('batchFour.distributed.pilotLabel')}</span>
    </aside>
    <BatchFourSource sourceSlide={sourceSlide} />
  </section>
}

function CoalPlantDiagram({ labels, title, description }: { labels: string[]; title: string; description: string }) {
  const id = useId().replaceAll(':', '')
  return <figure className="cofiring-diagram" data-enter>
    <svg viewBox="0 70 1400 352" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>
      <defs>
        <linearGradient id={`${id}-boiler`} x2="0" y2="1"><stop stopColor="#f9fcfd" /><stop offset="1" stopColor="#dce8ee" /></linearGradient>
        <linearGradient id={`${id}-heat`} x2="0" y2="1"><stop stopColor="#f9d790" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <marker id={`${id}-coal-arrow`} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 2 8 4-8 4Z" fill="#66788a" /></marker>
        <marker id={`${id}-hydrogen-arrow`} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 2 8 4-8 4Z" fill="#0753c8" /></marker>
        <marker id={`${id}-power-arrow`} viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto"><path d="m2 2 8 4-8 4Z" fill="#16a56a" /></marker>
      </defs>
      <rect width="1400" height="480" fill="#f7fafc" />
      <path d="M0 392H1400v88H0Z" fill="#edf3f6" />
      <path d="M0 392H1400" stroke="#c8d8e2" strokeWidth="2" />

      <g className="coal-feed" data-stage>
        <path d="M64 142h143l-20 114h-103Z" fill="#dce4ea" stroke="#8698a7" strokeWidth="3" />
        <path d="M79 159h112l-13 40H91Z" fill="#697786" />
        {[0, 1, 2, 3, 4, 5].map((index) => <ellipse key={index} cx={96 + (index % 3) * 27} cy={174 + Math.floor(index / 3) * 13} rx="10" ry="6" fill={index % 2 ? '#4f5d69' : '#87919a'} />)}
        <path className="cofire-track" d="M136 256V272H444" />
        <path className="cofire-flow cofire-flow--coal" markerEnd={`url(#${id}-coal-arrow)`} d="M136 256V272H444" />
        <text className="cofire-art-label" x="137" y="122" textAnchor="middle">{labels[0]}</text>
      </g>

      <g className="hydrogen-feed" data-stage>
        <rect x="245" y="333" width="62" height="54" rx="10" fill="#e4edf3" stroke="#7e9bb1" strokeWidth="3" />
        <ellipse cx="276" cy="334" rx="30" ry="8" fill="#f7fbfd" stroke="#7e9bb1" strokeWidth="3" />
        <path className="cofire-track" d="M307 352H444" />
        <path className="cofire-flow cofire-flow--hydrogen" markerEnd={`url(#${id}-hydrogen-arrow)`} d="M307 352H444" />
        <text className="cofire-art-label cofire-art-label--blue" x="230" y="367" textAnchor="end">{labels[1]}</text>
      </g>

      <g className="boiler-section" data-stage>
        <path d="m454 175 29-23h274l32 27v214H454Z" fill={`url(#${id}-boiler)`} stroke="#718ca0" strokeWidth="4" />
        <path d="M480 197h282v168H480Z" fill="#edf3f6" stroke="#b0c1cc" strokeWidth="2" />
        <path d="M500 213h75v131h-75Z" fill="#e6eef2" stroke="#98adbb" strokeWidth="2" />
        <path d="M587 213h62v131h-62Z" fill="#f2f6f8" stroke="#98adbb" strokeWidth="2" />
        <path d="M664 213h76v131h-76Z" fill="#e6eef2" stroke="#98adbb" strokeWidth="2" />
        <path d="M495 239h56m-56 21h56m-56 21h56m-56 21h56m32-63h54m-54 21h54m-54 21h54m-54 21h54" stroke="#9cb4c3" strokeWidth="4" />
        <path d="M520 325v-55l20-20 18 25 18-15 19 20 18-26 19 18 20-22 25 28v47Z" fill={`url(#${id}-heat)`} />
        <path d="M510 344v18m44-18v18m44-18v18m44-18v18m44-18v18m44-18v18" stroke="#8098a9" strokeWidth="5" />
        <path className="chimney" d="m468 152 5-44h17l5 44" fill="#d7e2e9" stroke="#829aab" strokeWidth="3" />
        <path className="chimney" d="m735 152 5-72h18l6 72" fill="#d7e2e9" stroke="#829aab" strokeWidth="3" />
        <text className="cofire-art-label" x="616" y="139" textAnchor="middle">{labels[2]}</text>
        <text className="cofire-art-note" x="612" y="385" textAnchor="middle">{labels[3]}</text>
      </g>

      <g data-stage>
        <path d="M791 251H922" fill="none" stroke="#cdeaf3" strokeWidth="15" strokeLinecap="round" />
        <path className="cofire-flow cofire-flow--steam" d="M791 251H922" />
        <text className="cofire-art-label cofire-art-label--blue" x="856" y="229" textAnchor="middle">{labels[4]}</text>
      </g>

      <g className="steam-turbine" data-stage>
        <path d="M924 204h145l41 33v82h-186Z" fill="#d9e5ec" stroke="#728da1" strokeWidth="3" />
        <path d="M941 225h119v52H941Z" fill="#eff5f7" stroke="#9db1bf" strokeWidth="2" />
        <g transform="translate(997 251)">
          <g className="steam-turbine__rotor">
            <circle r="25" fill="#d2e0e8" stroke="#718b9d" strokeWidth="3" />
            <path d="M0-19v38M-19 0h38M-13-13l26 26M13-13l-26 26" stroke="#55758e" strokeWidth="3" />
            <circle r="6" fill="#0753c8" />
          </g>
        </g>
        <path d="M1065 248h31" stroke="#667d8f" strokeWidth="10" />
        <rect x="1095" y="215" width="78" height="84" rx="7" fill="#e3edf2" stroke="#718da1" strokeWidth="3" />
        <path d="M1110 232h47v12h-47Zm0 26h47v12h-47Z" fill="#59788f" />
      </g>
      <g data-stage>
        <path className="cofire-track" d="M1175 256H1262" />
        <path className="cofire-flow cofire-flow--power" markerEnd={`url(#${id}-power-arrow)`} d="M1175 256H1262" />
        <text className="cofire-art-label cofire-art-label--green" x="1186" y="236">{labels[5]}</text>
      </g>
      <g className="cofire-grid" data-stage transform="translate(44 0)">
        <path d="m1273 174 28 0 26 169h-12l-20-140-22 140h-12Z" fill="#d6e2e9" stroke="#72899a" strokeWidth="3" />
        <path d="M1252 207h81m-74 25h68m-61 28h54m-49 30h44" stroke="#738b9d" strokeWidth="4" />
        <path d="M1238 182h108" stroke="#9db0be" strokeWidth="2" />
      </g>
    </svg>
  </figure>
}

export function HydrogenCofiringScene({ count, number, sourceSlide }: SceneProps) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const { playing } = useInfrastructureMotion(root)
  useBatchFourEntrance(root)
  const labels = [
    t('batchFour.cofiring.coalFeed'), t('batchFour.cofiring.hydrogenFeed'),
    t('batchFour.cofiring.boiler'), t('batchFour.cofiring.heat'),
    t('batchFour.cofiring.steam'), t('batchFour.cofiring.electricity'),
  ]
  return <section ref={root} className="reference-scene batch-four-scene cofiring-scene" aria-labelledby="scene-title" data-motion={playing ? 'running' : 'paused'}>
    <BatchFourEyebrow count={count} number={number} label={t('batchFour.cofiring.eyebrow')} />
    <header className="batch-four-heading" data-enter>
      <h1 id="scene-title">{t('batchFour.cofiring.title')}</h1>
      <p>{t('batchFour.cofiring.subtitle')}</p>
    </header>
    <CoalPlantDiagram labels={labels} title={t('batchFour.cofiring.diagramTitle')} description={t('batchFour.cofiring.diagramAlt')} />
    <div className="cofiring-takeaway" data-enter>
      <span className="cofiring-takeaway__mark"><i /></span>
      <div><strong>{t('batchFour.cofiring.objective')}</strong><p>{t('batchFour.cofiring.caveat')}</p></div>
      <span className="cofiring-takeaway__flow">{t('batchFour.cofiring.processShort')}</span>
    </div>
    <BatchFourSource sourceSlide={sourceSlide} />
  </section>
}
