export interface NumberFormat {
  /** One precision for every endpoint, or one per endpoint (e.g. 1.5–4×). */
  decimals?: number | readonly number[]
  prefix?: string
  suffix?: string
  separator?: string
  grouping?: boolean
}

/** Numeric endpoints, never translated-string parsing. Latin digits match TH/EN source. */
export function formatStatistic(value: number | readonly number[], { decimals = 0, prefix = '', suffix = '', separator = '–', grouping = true }: NumberFormat = {}, progress = 1) {
  const p = Math.max(0, Math.min(1, progress))
  const values = typeof value === 'number' ? [value] : value
  return prefix + values.map((endpoint, index) => {
    const magnitude = Math.abs(endpoint) * p
    const places = typeof decimals === 'number' ? decimals : decimals[index] ?? 0
    return (endpoint < 0 ? '−' : '') + magnitude.toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places, useGrouping: grouping })
  }).join(separator) + suffix
}
