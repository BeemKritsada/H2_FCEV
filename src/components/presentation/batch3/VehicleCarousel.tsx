import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import facts from '../../../content/batch-three-facts.json'
import { getVehicleCarouselPosition, type VehicleId } from './vehicle-carousel-layout'
import { AnimatedNumber } from '../AnimatedNumber'

const assetRoot = `${import.meta.env.BASE_URL}assets/images/vehicles`
const truckImage = 'รถบรรทุกไฮโดรเจนสีขาวฟ้าล้ำสมัย.png'
const vehicles: { id: VehicleId; image: string }[] = [
  { id: 'truck', image: truckImage },
  { id: 'bus', image: 'รถบัสไฮโดรเจนล้ำสมัยสีขาวมุก.png' },
  { id: 'car', image: 'รถซีดานไฮโดรเจนหรูสีขาวประกายเงิน.png' },
]

function placeVehicleCards(stage: HTMLDivElement, activeVehicleId: VehicleId, animate: boolean, reducedMotion: boolean) {
  const width = stage.getBoundingClientRect().width
  if (width <= 0) return
  for (const card of stage.querySelectorAll<HTMLElement>('[data-carousel-id]')) {
    const id = card.dataset.carouselId as VehicleId | undefined
    if (!id) continue
    const position = getVehicleCarouselPosition(id, activeVehicleId)
    const x = position === 'left' ? -width * 0.36 : position === 'right' ? width * 0.36 : 0
    const scale = position === 'center' ? 1 : 0.72
    gsap.killTweensOf(card)
    gsap.set(card, { xPercent: -50, yPercent: -50, zIndex: position === 'center' ? 2 : 1 })
    if (animate && !reducedMotion) {
      gsap.to(card, { xPercent: -50, yPercent: -50, x, scale, opacity: position === 'center' ? 1 : 0.78, duration: 0.78, ease: 'power3.inOut', overwrite: 'auto' })
    } else {
      gsap.set(card, { xPercent: -50, yPercent: -50, x, scale, opacity: position === 'center' ? 1 : 0.78 })
    }
  }
}

export default function VehicleCarousel({ reducedMotion }: { reducedMotion: boolean }) {
  const { t } = useTranslation()
  const [activeVehicleId, setActiveVehicleId] = useState<VehicleId>('truck')
  const stage = useRef<HTMLDivElement>(null)
  const hasPositioned = useRef(false)

  useLayoutEffect(() => {
    const node = stage.current
    if (!node) return
    placeVehicleCards(node, activeVehicleId, hasPositioned.current, reducedMotion)
    hasPositioned.current = true
    return () => node.querySelectorAll<HTMLElement>('[data-carousel-id]').forEach((card) => gsap.killTweensOf(card))
  }, [activeVehicleId, reducedMotion])

  useLayoutEffect(() => {
    const node = stage.current
    if (!node) return
    const onResize = () => placeVehicleCards(node, node.dataset.activeVehicle as VehicleId, false, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      node.querySelectorAll<HTMLElement>('[data-carousel-id]').forEach((card) => gsap.killTweensOf(card))
    }
  }, [])

  const figure = activeVehicleId === 'truck'
    ? facts.heavyDuty.threshold
    : activeVehicleId === 'bus'
      ? facts.commercial.threshold
      : facts.passenger.threshold
  const figureContextKey = activeVehicleId === 'truck'
    ? 'truck.figureContext'
    : activeVehicleId === 'bus'
      ? 'bus.figureContext'
      : 'car.figureContext'

  return <div className="vehicle-showcase">
    <link rel="preload" as="image" href={`${assetRoot}/${truckImage}`} fetchPriority="high" />
    <div className="vehicle-carousel" role="group" aria-roledescription={t('batchThree.structure.carousel.role')} aria-label={t('batchThree.structure.carousel.label')}>
      <div ref={stage} className="vehicle-carousel__stage" data-active-vehicle={activeVehicleId}>
        {vehicles.map(({ id, image }) => {
          const title = t(`batchThree.structure.carousel.${id}.title`)
          return <button
            key={id}
            type="button"
            className="vehicle-carousel__item"
            data-carousel-id={id}
            data-position={getVehicleCarouselPosition(id, activeVehicleId)}
            aria-label={t('batchThree.structure.carousel.selectVehicle', { vehicle: title })}
            aria-pressed={id === activeVehicleId}
            onClick={() => setActiveVehicleId(id)}
          >
            <img
              src={`${assetRoot}/${image}`}
              alt={t(`batchThree.structure.carousel.${id}.alt`)}
              width="1672"
              height="941"
              loading="eager"
              decoding="async"
              fetchPriority={id === 'truck' ? 'high' : 'auto'}
              draggable={false}
            />
          </button>
        })}
      </div>
    </div>

    <section className="vehicle-detail" aria-live="polite" aria-atomic="true">
      <div className="vehicle-detail__copy">
        <h2>{t(`batchThree.structure.carousel.${activeVehicleId}.title`)}</h2>
        <p>{t(`batchThree.structure.carousel.${activeVehicleId}.description`)}</p>
      </div>
      <div className="vehicle-detail__figure">
        <span>{t(`batchThree.structure.carousel.${figureContextKey}`)}</span>
        <strong><AnimatedNumber value={figure} prefix={activeVehicleId === 'car' ? '<' : ''} suffix={activeVehicleId === 'car' ? '%' : '%+'} /></strong>
      </div>
    </section>

    <aside className="market-structure-overview" aria-label={t('batchThree.structure.carousel.overviewLabel')}>
      <h3>{t('batchThree.structure.carousel.overviewLabel')}</h3>
      <div className="market-structure-overview__item"><strong><AnimatedNumber value={facts.commercial.threshold} suffix="%+" /></strong><span>{t('batchThree.structure.carousel.overviewCommercial')}</span></div>
      <div className="market-structure-overview__item"><strong><AnimatedNumber value={facts.passenger.threshold} prefix="<" suffix="%" /></strong><span>{t('batchThree.structure.carousel.overviewPassenger')}</span></div>
      <div className="market-structure-overview__item"><strong>{facts.heavyDuty.threshold}%+</strong><span>{t('batchThree.structure.carousel.overviewHeavyDuty')}</span></div>
    </aside>
  </div>
}
