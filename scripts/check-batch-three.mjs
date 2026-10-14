import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { createServer } from 'vite'

const json = (file) => JSON.parse(readFileSync(file, 'utf8'))
const baseline = json('docs/batch-three-protected-baseline.json')
const facts = json('src/content/batch-three-facts.json')
for (const { path, hash } of baseline.files) assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), hash, `${path}: earlier scene changed`)
for (const locale of ['en', 'th']) assert.deepEqual(json(`src/content/${locale}/common.json`), baseline.locales[locale])
const flatten = (object, prefix = '') => Object.fromEntries(Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? Object.entries(flatten(value, `${prefix}${key}.`)) : [[`${prefix}${key}`, value]]))
const en = flatten(json('src/content/en/batch-three.json')), th = flatten(json('src/content/th/batch-three.json'))
assert.deepEqual(Object.keys(en).sort(), Object.keys(th).sort())
for (const key of Object.keys(en)) {
  assert.ok(en[key].length && th[key].length)
  assert.deepEqual(en[key].match(/\{\{.*?\}\}/g), th[key].match(/\{\{.*?\}\}/g), `Interpolation mismatch: ${key}`)
  assert.deepEqual(en[key].match(/\d+/g), th[key].match(/\d+/g), `Numeric mismatch: ${key}`)
}
assert.deepEqual(facts.fleet, { value: 40000, qualifier: 'approximately', year: 2025, period: 'year-end', measure: 'accumulated-vehicles' })
assert.deepEqual(facts.monthlySales, { value: 3600, qualifier: 'nearly', year: 2025, period: 'year-end', measure: 'vehicles-per-month' })
assert.equal(facts.referenceYear, 2026)
assert.equal(facts.transition.kind, 'qualitative')
assert.equal(facts.transition.timeSeriesAvailable, false)
assert.deepEqual(facts.commercial, { threshold: 95, comparison: 'greater-than', denominator: 'all-hydrogen-vehicles' })
assert.deepEqual(facts.passenger, { threshold: 5, comparison: 'less-than', denominator: 'all-hydrogen-vehicles' })
assert.deepEqual(facts.heavyDuty, { threshold: 65, comparison: 'greater-than', denominator: 'commercial-hydrogen-vehicles' })
for (const locale of ['en', 'th']) {
  const source = json(`src/content/${locale}/sections/index.json`).find(({ id }) => id === facts.sourceSectionId)
  assert.equal(source.sourceSlideNumber, facts.sourceSlide)
  for (const value of ['40,000', '3,600', '2025', '2026', '95%', '5%', '65%']) assert.ok(JSON.stringify(source).includes(value), `${locale}: source mismatch ${value}`)
}
assert.ok(existsSync('public/assets/images/hydrogen-truck.jpg'))

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes: scenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  const { MotionContext } = await server.ssrLoadModule('/src/components/motion/motion-context.ts')
  await server.ssrLoadModule('/src/components/presentation/batch2/LogisticsStage.tsx')
  const originalModule = ts.transpileModule(baseline.sceneConfig, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const { presentationScenes: originalScenes } = await import(`data:text/javascript;base64,${Buffer.from(originalModule).toString('base64')}`)
  const added = ['scene-market-transition', 'scene-market-structure']
  assert.deepEqual(scenes.filter(({ id }) => !added.includes(id)), originalScenes, 'Earlier IDs, configurations and relative ordering changed')
  assert.deepEqual(scenes.slice(7, 12).map(({ id }) => id), ['scene-hydrogen-transport', 'scene-vehicle-deployment', ...added, 'scene-heavy-duty-logistics'])
  for (const locale of ['en', 'th']) {
    await i18n.changeLanguage(locale)
    const { presentation } = await server.ssrLoadModule(`/src/content/${locale}/presentation.ts`)
    for (const mode of ['playing', 'paused', 'reduced']) {
      for (const index of [7, 8, 9, 10, 11, 10, 9, 8, 7]) {
        const scene = scenes[index]
        const html = renderToStaticMarkup(createElement(MotionContext.Provider, { value: { playing: mode === 'playing', paused: mode === 'paused', reducedMotion: mode === 'reduced', togglePaused() {} } }, createElement(SceneContainer, { scene, sceneNumber: index + 1, sceneCount: scenes.length, presentation })))
        const text = html.replace(/<[^>]+>/g, '').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&amp;', '&')
        assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1)
        assert.ok(!html.includes('batchThree.'), `${locale}: missing translation`)
        if (index < 8 || index > 10) continue
        assert.ok(html.includes(`data-motion="${mode === 'playing' ? 'running' : 'paused'}"`))
        const translated = (key, options) => assert.ok(text.includes(i18n.t(`batchThree.${key}`, options)), `${locale}: missing ${key}`)
        if (index === 8) {
          for (const value of ['40,000', '3,600', '2025', '2026']) assert.ok(text.includes(value))
          for (const key of ['approximate', 'nearly', 'accumulated', 'monthlyUnit', 'rank']) translated(`fleet.${key}`)
          translated('fleet.sales', { year: 2025 }); translated('fleet.context', { year: 2026 }); translated('assetNote')
        }
        if (index === 9) {
          assert.ok(text.includes('2025') && text.includes('2026'))
          for (const key of ['momentum', 'adjustment', 'outcome', 'qualitative']) translated(`transition.${key}`)
          translated('transition.momentumDetail', { year: 2025 }); translated('transition.adjustmentDetail', { year: 2026 })
          assert.doesNotMatch(text, /\d+(?:\.\d+)?\s*%/, 'Do not invent a measured decline percentage')
          assert.ok(!html.includes('hydrogen-truck.jpg'), 'Transition should have its own visual')
        }
        if (index === 10) {
          for (const value of ['>95%', '<5%', '>65%']) assert.ok(text.includes(value))
          translated('structure.commercialShare', { value: 95 }); translated('structure.passengerShare', { value: 5 })
          translated('structure.withinCommercial', { value: 65 }); translated('structure.denominatorNote'); translated('assetNote')
          const commercial = html.match(/<section class="commercial-category"[\s\S]*?<\/section>/)?.[0]
          assert.ok(commercial?.includes('heavy-duty-subshare'), 'Truck sub-share must remain nested inside the commercial category')
          assert.ok(!text.includes('85%'), 'Do not merge the incompatible source-slide share into this scene')
        }
      }
    }
  }
  console.log(`Batch 3 passed: ${baseline.files.length} protected files unchanged, previous scene configs retained, matching TH/EN, source qualifiers and share denominators, and 08→12/reverse SSR dispatch in playing/paused/reduced modes. Browser layout, keyboard, console and animation frames are not covered by SSR.`)
} finally { await server.close() }
