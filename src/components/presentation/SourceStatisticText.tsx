import { Fragment } from 'react'
import { AnimatedNumber } from './AnimatedNumber'

// Explicit source-data tokens for statistics in the remaining original prose scenes.
// Years, enumerated list indexes, MPa labels and footnotes are deliberately excluded.
const sourceStatistics: Record<string, { token: string; value: number | number[]; decimals?: number }[]> = {
  'refrigerated-transport': [
    { token: '10–15', value: [10, 15] }, { token: '1–2', value: [1, 2] }, { token: '500–800', value: [500, 800] },
  ],
  'adoption-barriers': [{ token: '300,000', value: 300000 }, { token: '44.5', value: 44.5, decimals: 1 }],
  'remaining-challenges': [{ token: '44.5', value: 44.5, decimals: 1 }, { token: '25–30', value: [25, 30] }],
}
export function SourceStatisticText({ text, sectionId }: { text: string; sectionId: string }) {
  const definitions = Object.entries(sourceStatistics).find(([id]) => sectionId.startsWith(id))?.[1]
  if (!definitions) return text
  const tokens = definitions.map(({ token }) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return text.split(new RegExp(`(${tokens.join('|')})`, 'g')).map((part, index) => {
    const definition = definitions.find(({ token }) => token === part)
    return <Fragment key={index}>{definition ? <AnimatedNumber value={definition.value} decimals={definition.decimals ?? 0} /> : part}</Fragment>
  })
}
