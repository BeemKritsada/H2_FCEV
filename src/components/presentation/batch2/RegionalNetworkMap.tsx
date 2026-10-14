import { useTranslation } from 'react-i18next'
import facts from '../../../content/batch-two-facts.json'
import { projectRegion, regionOutline as outline } from './regionProjection'

export function RegionalNetworkMap() {
  const { t } = useTranslation()
  return <figure className="regional-network">
    <div className="regional-network__surface">
      <svg className="regional-network__map" viewBox="0 0 600 360" role="img" aria-label={t('batchTwo.network.mapAlt')}>
        <path d={outline} fill="#edf5fc" stroke="#c7ddeb" strokeWidth="1" fillRule="evenodd" />
        <path data-map-outline d={outline} fill="none" stroke="#468ec6" strokeWidth="1.1" pathLength="1" strokeDasharray="1" />
        {facts.regions.map((region, index) => {
          const [x, y] = projectRegion(region.anchor)
          return <g key={region.id} transform={`translate(${x} ${y})`}>
            <g data-cluster className="regional-cluster">
              <ellipse rx="24" ry="16" fill="#00a8e8" opacity=".1" />
              <circle className="infra-node-pulse" r="12" fill="none" stroke="#00a8e8" strokeWidth="1" style={{ animationDelay: `${index * -0.8}s` }} />
              <circle r="5" fill="#0753c8" stroke="white" strokeWidth="2" />
              <path className="infra-signal" d="M-21 5 Q0 -20 21 5" pathLength="100" fill="none" stroke="#00a8e8" strokeWidth="1.3" strokeDasharray="5 95" style={{ animationDelay: `${index * -0.65}s` }} />
            </g>
            <g className="regional-network__badge" transform="translate(12 -24)"><circle r="10" fill="white" stroke="#afcfe7" /><text textAnchor="middle" dominantBaseline="central">{index + 1}</text></g>
          </g>
        })}
      </svg>
    </div>
    <ol className="regional-network__labels" aria-label={t('batchTwo.network.regionsLabel')}>
      {facts.regions.map((region, index) => <li key={region.id}><span>{index + 1}</span>{t(`batchTwo.network.regions.${region.id}`)}</li>)}
    </ol>
    <figcaption>{t('batchTwo.network.mapNote')} <span className="regional-network__credit"><a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> · <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a></span></figcaption>
  </figure>
}
