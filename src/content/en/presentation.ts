import sectionData from './sections/index.json'
import type { PresentationLocale, PresentationSection } from '../schema'
import { glossary } from './glossary'

const sections = sectionData as unknown as PresentationSection[]

export const presentation: PresentationLocale = {
  language: 'en',
  title: {
    text: 'H2 FCEV for Logistics in China',
    sourceSectionNumber: 1,
    sourceSlideNumber: 1,
  },
  sections,
  glossary,
}
