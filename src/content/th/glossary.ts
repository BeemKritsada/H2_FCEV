import glossaryData from './glossary.json'
import type { GlossaryEntry } from '../schema'

export const glossary = glossaryData as unknown as GlossaryEntry[]
