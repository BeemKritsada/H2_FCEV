import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function readJson(path) {
  const text = readFileSync(resolve(path), 'utf8').replace(/^\uFEFF/, '')
  return JSON.parse(text)
}

const ledger = readJson('docs/source-number-ledger.json')
const editorialReview = readFileSync(resolve('docs/editorial-review.md'), 'utf8')
const knownNoteIds = new Set(
  Array.from(editorialReview.matchAll(/^\|\s*([a-z0-9-]+)\s*\|/gm), (match) => match[1]),
)
const localeNames = ['th', 'en']
const errors = []

function collectStrings(section) {
  return [
    section.heading,
    section.subheading,
    ...(section.paragraphs || []),
    ...(section.bulletLists || []).flatMap((list) => [list.label, ...list.items]),
    ...(section.emphasis || []),
    ...(section.facts || []).flatMap((fact) => [
      fact.label,
      String(fact.value),
      fact.unit,
      fact.context,
    ]),
  ].filter((value) => typeof value === 'string')
}

function tokens(values) {
  return values.flatMap((value) => value.match(/[0-9]+(?:[,.][0-9]+)*/g) || [])
    .map((value) => value.replaceAll(',', ''))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function compareTokens(slide, expected, actual, locale) {
  const left = tokens(expected)
  const right = tokens(actual)
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    errors.push(
      locale + ' slide ' + slide + ': numeric tokens differ; expected [' +
      left.join(', ') + '], actual [' + right.join(', ') + ']',
    )
  }
}

const expectedSlides = ledger.map((entry) => entry.slide)
if (expectedSlides.length !== 19 || expectedSlides.some((slide, index) => slide !== index + 1)) {
  errors.push('Source ledger must cover slides 1 through 19 in order.')
}

let referenceIds
let referenceSlides
let referenceGlossaryIds

for (const locale of localeNames) {
  const sections = readJson('src/content/' + locale + '/sections/index.json')
  const glossary = readJson('src/content/' + locale + '/glossary.json')
  const titleModule = readFileSync(resolve('src/content/' + locale + '/presentation.ts'), 'utf8')

  if (sections.length !== 18) {
    errors.push(locale + ': expected 18 sections for source slides 2–19, found ' + sections.length + '.')
  }

  const ids = sections.map((section) => section.id)
  const sourceSlides = sections.map((section) => section.sourceSlideNumber)
  if (new Set(ids).size !== ids.length) {
    errors.push(locale + ': section IDs must be unique.')
  }
  if (JSON.stringify(sourceSlides.slice().sort((a, b) => a - b)) !== JSON.stringify(expectedSlides.slice(1))) {
    errors.push(locale + ': sections must cover each source slide 2–19 exactly once.')
  }
  if (new Set(glossary.map((entry) => entry.id)).size !== glossary.length) {
    errors.push(locale + ': glossary IDs must be unique.')
  }

  if (locale === 'th') {
    referenceIds = ids
    referenceSlides = sourceSlides
    referenceGlossaryIds = glossary.map((entry) => entry.id)
  } else {
    if (JSON.stringify(ids) !== JSON.stringify(referenceIds)) {
      errors.push('Thai and English section IDs/order do not match.')
    }
    if (JSON.stringify(sourceSlides) !== JSON.stringify(referenceSlides)) {
      errors.push('Thai and English source-slide mapping does not match.')
    }
    if (JSON.stringify(glossary.map((entry) => entry.id)) !== JSON.stringify(referenceGlossaryIds)) {
      errors.push('Thai and English glossary IDs/order do not match.')
    }
  }

  const titleRow = ledger.find((entry) => entry.slide === 1)
  compareTokens(1, titleRow.values, ['H2 FCEV for Logistics in China'], locale)

  for (const section of sections) {
    const source = ledger.find((entry) => entry.slide === section.sourceSlideNumber)
    if (!source) {
      errors.push(locale + ': no source ledger entry for slide ' + section.sourceSlideNumber + '.')
      continue
    }
    compareTokens(section.sourceSlideNumber, source.values, collectStrings(section), locale)
    for (const noteId of section.editorialNoteIds || []) {
      if (!knownNoteIds.has(noteId)) {
        errors.push(locale + ' slide ' + section.sourceSlideNumber + ': editorial note ' + noteId + ' is not documented.')
      }
    }
  }

  if (!titleModule.includes("language: '" + locale + "'")) {
    errors.push(locale + ': presentation module has incorrect or missing language metadata.')
  }
}

if (errors.length) {
  console.error(errors.map((error) => 'ERROR ' + error).join('\n'))
  process.exitCode = 1
} else {
  console.log('Content check passed: 19 source slides, 18 aligned sections per locale, matching glossary IDs, exact numeric-token multisets, and documented editorial-note links.')
}
