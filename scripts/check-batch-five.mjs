import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const json = (path) => JSON.parse(readFileSync(path, 'utf8'))
const flatten = (object, prefix = '') => Object.fromEntries(Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? Object.entries(flatten(value, `${prefix}${key}.`)) : [[`${prefix}${key}`, value]]))
const en = flatten(json('src/content/en/batch-five.json')), th = flatten(json('src/content/th/batch-five.json'))
assert.deepEqual(Object.keys(en).sort(), Object.keys(th).sort())
for (const key of Object.keys(en)) {
  assert.ok(en[key] && th[key], `${key}: nonempty translation`)
  assert.deepEqual(en[key].match(/\{\{.*?\}\}/g), th[key].match(/\{\{.*?\}\}/g), key)
  assert.deepEqual(en[key].match(/\d+/g), th[key].match(/\d+/g), `${key}: preserve numbers in both languages`)
}
const facts = json('src/content/batch-five-facts.json')
assert.deepEqual(facts.truck, { refuelingMinutes: [3, 5], rangeKm: [600, 1000], coldCelsius: -30 })
assert.equal(facts.convoyTonnes, 10000)
assert.deepEqual(facts.suburban, { introductionYear: 2022, laterTestYear: 2024, cars: 4, speedKmh: 160, laterRangeLowerBoundKm: 1000, suppliedRefuelingMinutes: 15 })
assert.deepEqual(facts.foshan, { serviceYear: 2019, routeKm: 6.5, reportedRangeKm: 100 })
for (const [folder, ids] of Object.entries({ logistics: ['port', 'mine', 'steel', 'highway', 'performance-truck'], rail: ['suburban', 'foshan', 'changchun', 'jilin'] })) {
  for (const id of ids) {
    const path = `public/assets/images/${folder}/${id}.webp`
    assert.ok(existsSync(path))
    const buffer = readFileSync(path)
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP')
    assert.ok(buffer.byteLength < 500000, `${path}: optimized presentation asset`)
  }
}
const server = await createServer({ cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { formatStatistic } = await server.ssrLoadModule('/src/components/motion/number-format.ts')
  const cases = [
    [36.5, { decimals: 1 }, '36.5'], [250000, {}, '250,000'], [95, { suffix: '%+' }, '95%+'],
    [5, { prefix: '<', suffix: '%' }, '<5%'], [[3, 5], {}, '3–5'], [[600, 1000], {}, '600–1,000'],
    [-30, { suffix: '°C' }, '−30°C'], [6.5, { decimals: 1 }, '6.5'], [44.5, { decimals: 1, suffix: ' RMB/kg' }, '44.5 RMB/kg'],
    [2400, { suffix: ' kW' }, '2,400 kW'], [12, { suffix: '+' }, '12+'],
  ]
  for (const [value, options, expected] of cases) assert.equal(formatStatistic(value, options), expected)
  assert.equal(formatStatistic([600, 1000], {}, .5), '300–500')
  assert.equal(formatStatistic(-30, { suffix: '°C' }, 0), '−0°C')
  assert.equal(formatStatistic(5, { prefix: '<', suffix: '%' }, .5), '<3%')
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes: scenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  const expected = ['scene-heavy-duty-logistics', 'scene-truck-performance', 'scene-heavy-logistics-regions', 'scene-suburban-train', 'scene-foshan-tram', 'scene-tourism-trams']
  assert.deepEqual(scenes.slice(14, 20).map(({ id }) => id), expected)
  assert.equal(new Set(scenes.map(({ id }) => id)).size, 29)
  const expectedStats = { 2: 1, 3: 3, 4: 2, 5: 1, 6: 2, 7: 3, 8: 1, 9: 2, 11: 3, 15: 0, 16: 3, 17: 1, 18: 4, 19: 2, 20: 0, 21: 3, 22: 2, 23: 0, 24: 2, 25: 0, 26: 0, 27: 2, 28: 0 } // Cold-chain opens on time; Challenges on topic 01; regional map on the national overview.
  for (const locale of ['en', 'th']) {
    await i18n.changeLanguage(locale)
    const { presentation } = await server.ssrLoadModule(`/src/content/${locale}/presentation.ts`)
    for (let index = 0; index < scenes.length; index++) {
      const html = renderToStaticMarkup(createElement(SceneContainer, { scene: scenes[index], sceneNumber: index + 1, sceneCount: scenes.length, presentation }))
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1)
      assert.ok(!html.includes('batchFive.'), `${locale} ${index + 1}: untranslated key`)
      if (index + 1 in expectedStats) assert.equal((html.match(/data-statistic=/g) ?? []).length, expectedStats[index + 1], `${locale} ${index + 1}: migrated statistics`)
      if (index === 0) assert.ok(html.includes(i18n.t('batchFive.referenceYear')))
      if (index === 3) {
        assert.ok(!html.includes(i18n.t('batchOne.green.unitNote')))
        assert.ok(html.includes('900,000'))
      }
      if (index === 17) {
        assert.ok(html.includes('2022') && html.includes('2024'))
        assert.ok(!html.includes('data-statistic="2024"'))
      }
      if (index === 18) assert.ok(!html.includes('data-statistic="2019"'))
      if (index === 19) assert.ok(html.includes('氢春号') && html.includes('氢凇号'))
    }
  }
  console.log('Batch 5/6 passed: numeric formatting, exact source values, 29 scenes, global migration audit, historical years, TH/EN parity, nine persistent optimized images, opening year and hidden unit warning.')
} finally { await server.close() }
