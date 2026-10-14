import { useTranslation } from 'react-i18next'

export function ChinaMap({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  return (
    <figure className={`china-map${compact ? ' china-map--compact' : ''}`} data-visual-layer="geography">
      <img
        alt={t('visuals.mapAlt')}
        height="360"
        src={`${import.meta.env.BASE_URL}assets/maps/china-outline.svg`}
        width="600"
      />
      <figcaption>
        <span>{t('visuals.china')}</span>
        {!compact && <small>{t('visuals.mapNote')}</small>}
      </figcaption>
    </figure>
  )
}
