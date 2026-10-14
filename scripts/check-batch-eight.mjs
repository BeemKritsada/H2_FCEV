import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'vite'

const json = async (path) => JSON.parse(await readFile(path, 'utf8'))
const facts = await json('src/content/batch-eight-facts.json')
const locales = { en: await json('src/content/en/batch-eight.json'), th: await json('src/content/th/batch-eight.json') }
const keys = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]).sort()
assert.deepEqual(keys(locales.th), keys(locales.en), 'TH/EN keys must match')

// Every figure must come from the supplied adoption-barriers section in both languages.
for (const locale of ['en', 'th']) {
  const section = (await json(`src/content/${locale}/sections/index.json`)).find(({ id }) => id === facts.sourceSectionId)
  assert.equal(section.sourceSlideNumber, facts.sourceSlide)
  const [purchase, refueling, operating] = section.bulletLists[0].items
  assert.ok(purchase.includes('300,000') && purchase.includes('1.5–4'), `${locale}: purchase source`)
  assert.ok(refueling.includes('35 MPa') && refueling.includes('70 MPa'), `${locale}: refueling source`)
  assert.ok(operating.includes('44.5'), `${locale}: operating source`)
}
assert.equal(facts.purchase.startingPriceRmb, 300000)
assert.deepEqual(facts.purchase.costMultiple, [1.5, 4])
assert.equal(facts.refueling.commonPressureMpa, 35)
assert.equal(facts.refueling.limitedPressureMpa, 70)
assert.equal(facts.operating.averageRetailRmbPerKg, 44.5)

// Approved supporting copy, verbatim; no invented cost-per-100-km figure or station shares.
assert.equal(locales.th.title, 'ปัญหาใหญ่ 3 ประการของรถยนต์ไฮโดรเจน')
assert.equal(locales.en.title, 'Three Major Challenges of Hydrogen Vehicles')
assert.equal(locales.th.purchase.support, 'ราคารถเริ่มต้นประมาณ 300,000 หยวน และสูงกว่ารถน้ำมันหรือรถไฟฟ้าแบตเตอรี่ประมาณ 1.5–4 เท่า')
assert.equal(locales.en.purchase.support, 'Vehicle prices start at approximately 300,000 RMB, around 1.5–4 times comparable ICE or BEV alternatives in the supplied reference.')
assert.equal(locales.th.refueling.support, 'สถานีส่วนใหญ่รองรับระบบ 35 MPa สำหรับรถพาณิชย์ ขณะที่สถานี 70 MPa สำหรับรถส่วนบุคคลยังมีจำนวนน้อย โดยเฉพาะนอกเมืองใหญ่')
assert.equal(locales.en.refueling.support, 'Most stations in the supplied reference use 35 MPa systems for commercial applications, while 70 MPa refueling remains limited, particularly outside major urban areas.')
assert.equal(locales.th.operating.support, 'ราคาไฮโดรเจนปลายทางเฉลี่ย 44.5 หยวนต่อกิโลกรัม ทำให้ต้นทุนการเดินทางต่อ 100 กิโลเมตรสูงกว่ารถไฟฟ้าที่ชาร์จไฟบ้านในเงื่อนไขเปรียบเทียบที่ระบุ')
assert.equal(locales.en.operating.support, 'An average retail hydrogen price of 44.5 RMB/kg contributes to higher cost per 100 km than home-charged battery-electric vehicles under the stated comparison conditions.')
for (const locale of Object.values(locales)) {
  const text = JSON.stringify(locale)
  assert.ok(!/\d+(\.\d+)?\s*%/.test(text), 'No percentages')
  assert.ok(!/RMB\/100|หยวน\/100|per 100 km[^"]*\d+(\.\d+)? RMB/.test(text), 'No cost-per-100-km figures')
}

for (const [id, image] of Object.entries(facts.images)) {
  const file = `public/assets/images/${image.path}`
  assert.ok((await stat(file)).size > 20_000, `${id}: image present`)
  assert.ok(image.path.endsWith('.webp'), `${id}: WebP`)
}

const server = await createServer({ logLevel: 'error', cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { formatStatistic } = await server.ssrLoadModule('/src/components/motion/number-format.ts')
  assert.equal(formatStatistic(300000, { suffix: '+' }), '300,000+')
  assert.equal(formatStatistic([1.5, 4], { decimals: [1, 0], suffix: '×' }), '1.5–4×')
  assert.equal(formatStatistic([1.5, 4], { decimals: [1, 0], suffix: '×' }, 0), '0.0–0×')
  assert.equal(formatStatistic(35), '35')
  assert.equal(formatStatistic(70), '70')
  assert.equal(formatStatistic(44.5, { decimals: 1 }), '44.5')
  assert.equal(formatStatistic([600, 1000]), '600–1,000', 'Existing single-precision ranges unchanged')
  const { presentationScenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  assert.equal(presentationScenes.filter(({ id }) => id === 'scene-challenges').length, 1, 'Scene 24 content replaces scene-challenges; no new slide added')
} finally { await server.close() }

console.log('Batch 8 passed: source-matched figures (300,000+, 1.5–4×, 35/70 MPa, 44.5 RMB/kg), verbatim TH/EN copy, key parity, per-endpoint decimals, optimized images, no added scenes.')
