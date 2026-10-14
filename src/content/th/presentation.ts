import sectionData from './sections/index.json'
import type { PresentationLocale, PresentationSection } from '../schema'
import { glossary } from './glossary'

const sections = sectionData as unknown as PresentationSection[]

export const presentation: PresentationLocale = {
  language: 'th',
  title: {
    text: 'H2 FCEV for Logistics in China',
    translatedText: 'H2 FCEV สำหรับโลจิสติกส์ในจีน',
    sourceSectionNumber: 1,
    sourceSlideNumber: 1,
  },
  sections,
  glossary,
}
