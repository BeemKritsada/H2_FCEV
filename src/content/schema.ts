export type NarrativeGroup =
  | 'industry-overview'
  | 'hydrogen-supply'
  | 'vehicle-deployment'
  | 'applications'
  | 'commercial-logistics'
  | 'rail-transport'
  | 'advantages-limitations'
  | 'regional-deployment'

export interface ContentBulletList {
  label?: string
  items: string[]
}

export interface NumericFact {
  id: string
  label: string
  value: number | string
  unit?: string
  context?: string
}

export interface PresentationSection {
  id: string
  sourceSectionNumber: number
  sourceSlideNumber: number
  narrativeGroup: NarrativeGroup
  heading: string
  subheading?: string
  paragraphs?: string[]
  bulletLists?: ContentBulletList[]
  emphasis?: string[]
  facts?: NumericFact[]
  editorialNoteIds?: string[]
}

export interface PresentationTitle {
  text: 'H2 FCEV for Logistics in China'
  translatedText?: string
  sourceSectionNumber: 1
  sourceSlideNumber: 1
}

export interface GlossaryEntry {
  id: string
  term: string
  translation: string
  note?: string
}

export interface PresentationLocale {
  language: 'th' | 'en'
  title: PresentationTitle
  sections: PresentationSection[]
  glossary: GlossaryEntry[]
}
