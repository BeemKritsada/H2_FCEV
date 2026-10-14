import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/** Replaceable media slot: a future verified GLB renderer can supply children. */
export function HeroTruck({ children }: { children?: ReactNode }) {
  const { t } = useTranslation()
  return (
    <figure className="hero-truck" data-visual-layer="vehicle">
      <div className="hero-truck__media">
        {children ?? (
          <img
            alt={t('visuals.truckAlt')}
            decoding="async"
            fetchPriority="high"
            height="1024"
            src={`${import.meta.env.BASE_URL}assets/images/hydrogen-truck.jpg`}
            width="1536"
          />
        )}
      </div>
      <figcaption>{t('visuals.conceptVehicle')}</figcaption>
    </figure>
  )
}
