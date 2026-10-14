import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const json = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''))
const facts = json('src/content/reference-facts.json')
const locales = ['en', 'th'].map((language) => ({
  language,
  common: json(`src/content/${language}/common.json`),
  sections: json(`src/content/${language}/sections/index.json`),
}))
const leaves = (value, prefix = '') => Object.entries(value).flatMap(([key, item]) => {
  const path = prefix ? `${prefix}.${key}` : key
  return typeof item === 'object' ? leaves(item, path) : [[path, item]]
})
const en = new Map(leaves(locales[0].common))
const th = new Map(leaves(locales[1].common))
assert.deepEqual([...en.keys()].sort(), [...th.keys()].sort(), 'All control and content translation keys must match')
for (const [key, value] of en) {
  assert.ok(value.trim().length && th.get(key).trim().length, `${key} must be translated`)
  const placeholders = (text) => (text.match(/\{\{[^}]+\}\}/g) ?? []).sort()
  assert.deepEqual(placeholders(value), placeholders(th.get(key)), `${key}: interpolation mismatch`)
  const numbers = (text) => (text.match(/\d+(?:\.\d+)?/g) ?? []).sort()
  assert.deepEqual(numbers(value), numbers(th.get(key)), `${key}: numeric mismatch between languages`)
}
for (const { language, sections, common } of locales) {
  const original = sections.find((section) => section.id === facts.productionMix.sourceSectionId)
  const values = original.bulletLists[0].items.map((item) => Number(item.match(/(\d+)%/)[1]))
  assert.deepEqual(facts.productionMix.items.map((item) => item.value), values, `${language}: chart must preserve source values`)
  const overview = sections.find((section) => section.id === facts.overview.sourceSectionId)
  assert.ok(overview.paragraphs.some((p) => p.includes(String(facts.overview.annualProductionMillionTonnes))), `${language}: production must match source`)
  for (const item of facts.productionMix.items) {
    for (const key of [item.labelKey, item.detailKey]) assert.equal(typeof key.split('.').reduce((object, k) => object?.[k], common), 'string')
  }
}
assert.equal(facts.productionMix.scaleMaximum, 100, 'Use a common 0–100 scale')
assert.equal(facts.productionMix.items[1].value, facts.productionMix.items[2].value, 'Both 21% bars must be equal')
assert.equal(facts.productionMix.items.reduce((sum, item) => sum + item.value, 0), 98, 'Do not invent a fourth category')
assert.equal(facts.overview.originalReferenceYear, 2026, 'Keep the original reporting reference')
assert.equal(facts.overview.verifiedDataYear, 2024, 'Do not present a historical value as verified 2026 data')
console.log('Reference checks passed: complete TH/EN keys, matching interpolation and numbers, source-linked figures, equal 21% shares, common scale, and separate reference/data years.')
