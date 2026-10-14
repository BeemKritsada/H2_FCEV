import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { createServer } from 'vite'
import { numberMigrationFiles } from './authorized-number-migration.mjs'

const json = (file) => JSON.parse(readFileSync(file, 'utf8'))
import { readPrePolish } from './authorized-caption-polish.mjs'
const baseline = json('docs/batch-three-protected-baseline.json')
const facts = json('src/content/batch-three-facts.json')
for (const { path, hash } of baseline.files) {
  if (!numberMigrationFiles.has(path)) assert.equal(createHash('sha256').update(readPrePolish(path)).digest('hex'), hash, `${path}: earlier scene changed`)
}
for (const locale of ['en', 'th']) assert.deepEqual(JSON.parse(readPrePolish(`src/content/${locale}/common.json`)), baseline.locales[locale])
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
const vehicleAssets = [
  'รถบรรทุกไฮโดรเจนสีขาวฟ้าล้ำสมัย.png',
  'รถบัสไฮโดรเจนล้ำสมัยสีขาวมุก.png',
  'รถซีดานไฮโดรเจนหรูสีขาวประกายเงิน.png',
]
for (const filename of vehicleAssets) {
  const asset = readFileSync(`public/assets/images/vehicles/${filename}`)
  assert.equal(asset.toString('ascii', 1, 4), 'PNG', `${filename}: PNG signature`)
  assert.equal(asset.readUInt32BE(16), 1672, `${filename}: width`)
  assert.equal(asset.readUInt32BE(20), 941, `${filename}: height`)
  assert.equal(asset[25], 6, `${filename}: PNG alpha channel`)
}
for (const locale of ['en', 'th']) {
  const source = json(`src/content/${locale}/sections/index.json`).find(({ id }) => id === facts.sourceSectionId)
  assert.equal(source.sourceSlideNumber, facts.sourceSlide)
  for (const value of ['40,000', '3,600', '2025', '2026', '95%', '5%', '65%']) assert.ok(JSON.stringify(source).includes(value), `${locale}: source mismatch ${value}`)
}
assert.ok(existsSync('public/assets/images/hydrogen-truck.jpg'))

const server = await createServer({ cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes: scenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  const { MotionContext } = await server.ssrLoadModule('/src/components/motion/motion-context.ts')
  const { getVehicleCarouselPosition } = await server.ssrLoadModule('/src/components/presentation/batch3/vehicle-carousel-layout.ts')
  await server.ssrLoadModule('/src/components/presentation/batch2/LogisticsStage.tsx')
  assert.deepEqual(['truck', 'bus', 'car'].map((id) => getVehicleCarouselPosition(id, 'truck')), ['center', 'right', 'left'])
  assert.deepEqual(['truck', 'bus', 'car'].map((id) => getVehicleCarouselPosition(id, 'bus')), ['left', 'center', 'right'])
  assert.deepEqual(['truck', 'bus', 'car'].map((id) => getVehicleCarouselPosition(id, 'car')), ['right', 'left', 'center'])
  const originalModule = ts.transpileModule(baseline.sceneConfig, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const { presentationScenes: originalScenes } = await import(`data:text/javascript;base64,${Buffer.from(originalModule).toString('base64')}`)
  const batchThreeAdded = ['scene-market-transition', 'scene-market-structure']
  const batchFourAdded = ['scene-distributed-power', 'scene-hydrogen-cofiring']
  const batchFiveAdded = ['scene-truck-performance', 'scene-heavy-logistics-regions', 'scene-suburban-train', 'scene-foshan-tram', 'scene-tourism-trams', 'scene-freight-locomotive', 'scene-mining-locomotives', 'scene-rail-deployment', 'scene-cold-chain-comparison', 'scene-industry-advantages', 'scene-industry-barriers', 'scene-regional-map']
  const movedPowerStorage = 'scene-power-storage'
  const originalPowerStorage = originalScenes.find(({ id }) => id === movedPowerStorage)
  assert.deepEqual(scenes.find(({ id }) => id === movedPowerStorage), originalPowerStorage, 'Existing power-storage scene configuration changed')
  // User retired these five legacy scenes after their replacement scenes were approved.
  const retiredIds = ['scene-refrigerated-logistics', 'scene-industry', 'scene-rail-specialized', 'scene-regions', 'scene-advantages']
  const preservedOriginalScenes = originalScenes.filter(({ id }) => ![movedPowerStorage, ...retiredIds].includes(id))
  const currentOriginalScenes = scenes.filter(({ id }) => ![...batchThreeAdded, ...batchFourAdded, ...batchFiveAdded, movedPowerStorage].includes(id))
  assert.deepEqual(currentOriginalScenes, preservedOriginalScenes, 'Protected scenes changed or their relative order changed')
  assert.deepEqual(scenes.slice(7, 12).map(({ id }) => id), ['scene-hydrogen-transport', 'scene-vehicle-deployment', ...batchThreeAdded, movedPowerStorage])
  assert.deepEqual(scenes.slice(12, 14).map(({ id }) => id), batchFourAdded)
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
          for (const value of ['95%+', '<5%', '65%+']) assert.ok(text.includes(value))
          translated('structure.carousel.truck.title'); translated('structure.carousel.truck.description')
          for (const id of ['bus', 'car']) for (const key of ['title', 'description', 'alt']) assert.ok(i18n.t(`batchThree.structure.carousel.${id}.${key}`).length, `${locale}: missing ${id}.${key}`)
          translated('structure.carousel.overviewLabel'); translated('structure.carousel.overviewHeavyDuty')
          const cards = html.match(/data-carousel-id="(?:truck|bus|car)"/g) ?? []
          assert.equal(cards.length, 3, `${locale}: all three vehicle images should render`)
          assert.match(html, /data-active-vehicle="truck"/, 'Truck should be selected by default')
          assert.match(html, /data-carousel-id="truck"[^>]*aria-pressed="true"/, 'Truck should be the active carousel button initially')
          for (const filename of vehicleAssets) assert.ok(html.includes(filename) || html.includes(encodeURI(filename)), `${locale}: missing image reference ${filename}`)
          assert.ok(!html.includes('<canvas'), 'Scene 11 image carousel must not use Three.js canvases')
          const busInfo = i18n.t('batchThree.structure.carousel.bus.description')
          assert.ok(busInfo.includes('95'))
          assert.ok(/not a bus-specific share|ไม่ใช่สัดส่วนของรถโดยสาร/.test(busInfo), 'The 95% figure must be attributed to the commercial category, not buses alone')
          assert.ok(!text.includes('85%'), 'Do not merge the incompatible source-slide share into this scene')
        }
      }
    }
  }
  console.log(`Batch 3 passed: ${baseline.files.length - numberMigrationFiles.size} protected files unchanged; six explicitly authorized Batch 5 migration files are checked separately. Original scene configurations, TH/EN, qualifiers, denominators and SSR dispatch retained.`)
} finally { await server.close() }
