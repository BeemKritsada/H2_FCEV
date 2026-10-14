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
