import { useTranslation } from 'react-i18next'
import { HeroTruck } from '../HeroTruck'

/** Camera-like drift is applied to the whole photograph, never individual wheels. */
export function MarketTruck() {
  return <div className="market-truck" data-market-vehicle>
    <div className="market-truck__ambient"><HeroTruck /></div>
    <div className="market-truck__light" aria-hidden="true" />
    <svg className="market-truck__energy" viewBox="0 0 800 56" preserveAspectRatio="none" aria-hidden="true">
      <path d="M20 38 H780" fill="none" stroke="#d9eaf6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path className="market-energy-flow" d="M20 38 H780" fill="none" stroke="#00a8e8" strokeWidth="2" pathLength="100" strokeDasharray="8 92" vectorEffect="non-scaling-stroke" />
    </svg>
  </div>
}

/** Brand-free layered category references, not exact official vehicle designs. */
export function CategoryVehicle({ kind }: { kind: 'bus' | 'car' }) {
  const { t } = useTranslation()
  return <svg className={`category-vehicle category-vehicle--${kind}`} viewBox={kind === 'bus' ? '0 0 440 190' : '0 0 380 170'} role="img" aria-label={t(`batchThree.structure.${kind}Alt`)}>
    {kind === 'bus' ? <>
      <ellipse cx="220" cy="161" rx="195" ry="10" fill="#dfeaf3" />
      <path d="M27 67 L69 37 H361 Q387 37 399 59 L418 83 V141 L375 162 H44 Q27 158 27 140 Z" fill="#edf4f8" stroke="#9ab6cd" strokeWidth="1.5" />
      <path d="M27 67 H353 Q368 67 375 81 V160 H44 Q27 158 27 140 Z" fill="#dceaf3" />
      <path d="M375 81 L413 72 L418 84 V141 L375 162 Z" fill="#bed6e6" />
      <path d="M33 75 H350 Q361 75 365 84 V111 H33 Z" fill="#174b74" />
      <path d="M382 86 L411 78 V110 L382 121 Z" fill="#133b61" />
      {[91, 146, 201, 256, 310].map((x) => <path key={x} d={`M${x} 74 V112`} stroke="#b9d4e5" strokeWidth="4" />)}
      <path d="M29 120 H373 V137 H29 Z" fill="#0753c8" /><path d="M375 126 L417 114 V130 L375 143 Z" fill="#07398f" />
      <path d="M321 75 V149 M352 76 V150" fill="none" stroke="#527b9b" strokeWidth="2" />
      <path d="M49 55 H329" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><path d="M379 142 L411 131" stroke="#f2fbff" strokeWidth="4" />
      {[88, 301].map((x) => <g key={x}><circle cx={x} cy="148" r="21" fill="#273d50" /><circle cx={x} cy="148" r="12" fill="#c2d6e3" /><circle cx={x} cy="148" r="5" fill="#6d8ba3" /></g>)}
    </> : <>
      <ellipse cx="193" cy="139" rx="167" ry="10" fill="#e4edf4" />
      <path d="M32 104 L65 85 L106 48 Q116 42 137 42 H226 Q246 45 274 79 L326 91 Q348 94 351 113 L348 132 L31 131 Q23 116 32 104 Z" fill="#edf3f8" stroke="#a4bdcf" strokeWidth="1.5" />
      <path d="M84 86 L116 52 H163 V85 Z M174 52 H219 Q236 55 258 85 H174 Z" fill="#39617f" />
      <path d="M30 113 H350 V128 H30 Z" fill="#98b9d1" /><path d="M51 98 L109 96 M278 96 L326 104" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <path d="M169 91 V120 M267 91 V118 M185 97 H204" fill="none" stroke="#91aec4" strokeWidth="1.5" />
      {[88, 292].map((x) => <g key={x}><circle cx={x} cy="126" r="23" fill="#344a5d" /><circle cx={x} cy="126" r="14" fill="#dae5ed" /><circle cx={x} cy="126" r="6" fill="#7994a9" /></g>)}
    </>}
  </svg>
}
