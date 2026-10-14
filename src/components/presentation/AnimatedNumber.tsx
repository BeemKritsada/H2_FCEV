import { useContext, useLayoutEffect, useRef } from 'react'
import { NumberSequenceContext } from '../motion/number-sequence-context'
import { formatStatistic, type NumberFormat } from '../motion/number-format'
import '../../styles/animated-number.css'

type Props = NumberFormat & { value: number | readonly number[]; active?: boolean }

/** Final accessible value stays stable; GSAP updates only the aria-hidden display. */
export function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', separator = '–', grouping = true }: Props) {
  const node = useRef<HTMLSpanElement>(null)
  const register = useContext(NumberSequenceContext)
  // Serialised so inline arrays do not re-register (and orphan) a running count.
  const valuesKey = JSON.stringify(value)
  const decimalsKey = JSON.stringify(decimals)
  const display = formatStatistic(value, { decimals, prefix, suffix, separator, grouping })
  useLayoutEffect(() => {
    if (!node.current || !register) return
    const values = JSON.parse(valuesKey) as number | number[]
    const places = JSON.parse(decimalsKey) as number | number[]
    return register({ node: node.current, render: (progress) => formatStatistic(values, { decimals: places, prefix, suffix, separator, grouping }, progress) })
  }, [register, valuesKey, decimalsKey, prefix, suffix, separator, grouping])
  return <span className="animated-number" data-statistic={display}>
    <span className="sr-only">{display}</span>
    <span className="animated-number__width" aria-hidden="true">{display}</span>
    <span className="animated-number__tick" aria-hidden="true" ref={node}>{display}</span>
  </span>
}
