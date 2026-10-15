import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import facts from '../../../content/batch-three-facts.json'
import { getVehicleCarouselPosition, type VehicleId } from './vehicle-carousel-layout'
import { AnimatedNumber } from '../AnimatedNumber'

const assetRoot = `${import.meta.env.BASE_URL}assets/images/vehicles`
// Approved PNG masters stay the reference/fallback; browsers load the WebP copies (same 1672×941 size and
// alpha, ~85% smaller) so cards never paint half-loaded.
const truckImage = 'รถบรรทุกไฮโดรเจนสีขาวฟ้าล้ำสมัย.png'
const webp = (image: string) => image.replace(/.png$/, '.webp')
const vehicles: { id: VehicleId; image: string }[] = [
  { id: 'truck', image: truckImage },
  { id: 'bus', image: 'รถบัสไฮโดรเจนล้ำสมัยสีขาวมุก.png' },
  { id: 'car', image: 'รถซีดานไฮโดรเจนหรูสีขาวประกายเงิน.png' },
]

function placeVehicleCards(stage: HTMLDivElement, activeVehicleId: VehicleId, animate: boolean, reducedMotion: boolean) {
  // Layout width in the scene's own coordinates, so offsets stay right when the stage is zoomed.
  const width = stage.clientWidth
  if (width <= 0) return
  for (const card of stage.querySelectorAll<HTMLElement>('[data-carousel-id]')) {
    const id = card.dataset.carouselId as VehicleId | undefined
    if (!id) continue
    const position = getVehicleCarouselPosition(id, activeVehicleId)
    const x = position === 'left' ? -width * 0.36 : position === 'right' ? width * 0.36 : 0
    const scale = position === 'center' ? 1 : 0.72
    gsap.killTweensOf(card)
    // y is pinned to 0: otherwise GSAP can read the CSS translate(-50%, -50%) as a pixel offset on first
    // parse and add it to yPercent, lifting the vehicles half out of the stage depending on timing.
    gsap.set(card, { xPercent: -50, yPercent: -50, y: 0, zIndex: position === 'center' ? 2 : 1 })
    if (animate && !reducedMotion) {
      gsap.to(card, { xPercent: -50, yPercent: -50, y: 0, x, scale, opacity: position === 'center' ? 1 : 0.78, duration: 0.78, ease: 'power3.inOut', overwrite: 'auto' })
    } else {
      gsap.set(card, { xPercent: -50, yPercent: -50, y: 0, x, scale, opacity: position === 'center' ? 1 : 0.78 })
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
    // Re-place on any stage size change (fonts, scrollbar, fit scaling), not only window resizes.
    let lastWidth = node.clientWidth
    const observer = new ResizeObserver(() => {
      const width = node.clientWidth
      if (Math.abs(width - lastWidth) < 0.5) return
      lastWidth = width
      placeVehicleCards(node, node.dataset.activeVehicle as VehicleId, false, true)
    })
    observer.observe(node)
    // Cards stay hidden until their image is fully decoded, then fade in.
    const images = [...node.querySelectorAll<HTMLImageElement>('img')]
    const reveal = (img: HTMLImageElement) => { void img.decode().catch(() => {}).then(() => { img.dataset.loaded = 'true' }) }
    const onLoad = (event: Event) => reveal(event.currentTarget as HTMLImageElement)
    images.forEach((img) => { if (img.complete && img.naturalWidth) reveal(img); else img.addEventListener('load', onLoad) })
    return () => {
      observer.disconnect()
      images.forEach((img) => img.removeEventListener('load', onLoad))
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
    <link rel="preload" as="image" type="image/webp" href={`${assetRoot}/${webp(truckImage)}`} fetchPriority="high" />
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
            <picture>
            <source srcSet={`${assetRoot}/${webp(image)}`} type="image/webp" />
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
            </picture>
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
