import { createContext } from 'react'

export interface StatisticEntry { node: HTMLSpanElement; render: (progress: number) => string }
export const NumberSequenceContext = createContext<((entry: StatisticEntry) => () => void) | null>(null)
/** The App-owned session set, so interactive states inside a scene share its first-view memory. */
export const NumberSessionContext = createContext<{ sceneId: string; visited: Set<string> } | null>(null)
