import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const json = (file) => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
const baseline = json('docs/batch-one-protected-baseline.json')
const facts = json('src/content/batch-one-facts.json')
for (const { Path: path, Hash: hash } of baseline.files) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase(), hash, `${path}: approved/protected source was changed`)
}
function preserve(original, current, prefix) {
  for (const [key, value] of Object.entries(original)) {
    const path = `${prefix}.${key}`
    if (value && typeof value === 'object') preserve(value, current[key], path)
    else assert.equal(current[key], value, `${path}: existing translation changed`)
  }
}
for (const language of ['en', 'th']) {
  const common = json(`src/content/${language}/common.json`)
  preserve(baseline.locales[language], common, language)
  const source = json(`src/content/${language}/sections/index.json`).find((section) => section.id === facts.sourceSectionId)
  const sourceParagraphs = source.bulletLists[1].items.join(' ')
  for (const value of [250000, 900000]) assert.ok(sourceParagraphs.includes(value.toLocaleString('en-US')), `${language}: source number missing`)
  assert.ok(sourceParagraphs.includes('90%'), `${language}: localization threshold must match source`)
  assert.equal(facts.greenHydrogen.operatingCapacity.value, 250000)
  assert.equal(facts.greenHydrogen.underConstruction.value, 900000)
  assert.equal(facts.equipment.localizationLowerBound, 90)
  assert.equal(facts.equipment.comparison, 'greater-than')
  assert.equal(facts.greenHydrogen.underConstruction.unitKey, 'batchOne.green.tonnesUnit')
  assert.doesNotMatch(common.batchOne.green.tonnesUnit, /year|ปี/i, 'Do not silently assign an annual unit')
  assert.ok(common.batchOne.green.unitNote.length > 0)
  for (const key of [...facts.greenHydrogen.regionKeys, ...facts.greenHydrogen.processKeys, ...facts.equipment.items.flatMap((item) => [item.labelKey, item.detailKey])]) {
    assert.equal(typeof key.split('.').reduce((value, part) => value?.[part], common), 'string', `${language}: ${key} must be translated`)
  }
}
console.log(`Batch 1 checks passed: ${baseline.files.length} protected files byte-identical; all existing locale strings preserved; 250,000 / 900,000 / 90%+ and the unconfirmed annual unit retained.`)
