import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import speaker from '../../../content/speaker.json'
import { useMotion } from '../../motion/motion-context'
import '../../../styles/speaker-closing.css'

const photo = `${import.meta.env.BASE_URL}assets/images/${speaker.photo}`

/** Final presenter page. The speaker block is identical in both languages by request. */
export function SpeakerClosingScene({ number, count }: { number: number; count: number }) {
  const root = useRef<HTMLElement>(null)
  const { playing, reducedMotion } = useMotion()

  useLayoutEffect(() => {
    if (!root.current || reducedMotion || !playing) return
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power2.out', clearProps: 'opacity,transform' } })
        .from('[data-closing="backdrop"]', { opacity: 0, duration: 0.8 }, 0)
        .from('[data-closing="portrait"]', { opacity: 0, x: 48, duration: 1.1, ease: 'power3.out' }, 0.2)
        .from('[data-closing="identity"]', { opacity: 0, x: -32, duration: 0.8, stagger: 0.12 }, 0.55)
        .from('[data-closing="position"]', { opacity: 0, y: 8, duration: 0.5, stagger: 0.1 }, 1.0)
        .from('[data-closing="thanks"]', { opacity: 0, y: 12, duration: 0.8 }, '>+0.15')
    }, root)
    return () => context.revert()
    // Plays once on arrival; pausing afterwards keeps the finished layout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  return <section ref={root} className="speaker-closing" aria-labelledby="scene-title">
    <div className="speaker-closing__backdrop" data-closing="backdrop" aria-hidden="true" />
    <div className="speaker-closing__eyebrow" data-closing="identity">
      <span className="speaker-closing__index">{String(number).padStart(2, '0')}</span>
      <span lang="en">{speaker.presentedBy}</span>
      <span className="speaker-closing__rule" />
      <span className="speaker-closing__total">{number} / {count}</span>
    </div>

    <div className="speaker-closing__copy">
      <h1 id="scene-title" lang="th" data-closing="identity">{speaker.nameTh}</h1>
      <p className="speaker-closing__name-en" lang="en" data-closing="identity">{speaker.nameEn}</p>
      <ul className="speaker-closing__positions" lang="th">
        {speaker.positions.map((position) => <li key={position} data-closing="position">{position}</li>)}
      </ul>
      <p className="speaker-closing__thanks" data-closing="thanks">
        <span lang="en">{speaker.thanksEn}</span>
        <span lang="th">{speaker.thanksTh}</span>
      </p>
    </div>

    <figure className="speaker-closing__portrait" data-closing="portrait">
      <div className="speaker-closing__frame">
        <span className="speaker-closing__accent" aria-hidden="true" />
        <img src={photo} alt={`${speaker.nameTh} (${speaker.nameEn})`} width="1030" height="954" decoding="async" />
      </div>
    </figure>
  </section>
}
