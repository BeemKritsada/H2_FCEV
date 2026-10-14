import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { createServer } from 'vite'
import { numberMigrationFiles } from './authorized-number-migration.mjs'

const json = (path) => JSON.parse(readFileSync(path, 'utf8'))
import { readPrePolish } from './authorized-caption-polish.mjs'
const baseline = json('docs/batch-two-protected-baseline.json')
const facts = json('src/content/batch-two-facts.json')
for (const { path, hash } of baseline.files) if (!numberMigrationFiles.has(path)) assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), hash, `${path}: protected source changed`)
for (const locale of ['en', 'th']) assert.deepEqual(JSON.parse(readPrePolish(`src/content/${locale}/common.json`)), baseline.locales[locale], 'Existing translations must remain unchanged apart from the authorized caption polish')
function leaves(object, prefix = '') {
  return Object.fromEntries(Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? Object.entries(leaves(value, prefix + key + '.')) : [[prefix + key, value]]))
}
const en = leaves(json('src/content/en/batch-two.json')), th = leaves(json('src/content/th/batch-two.json'))
assert.deepEqual(Object.keys(en).sort(), Object.keys(th).sort(), 'TH/EN key parity')
for (const key of Object.keys(en)) {
  assert.ok(th[key].length && en[key].length, `Empty translation: ${key}`)
  assert.deepEqual(en[key].match(/\{\{.*?\}\}/g), th[key].match(/\{\{.*?\}\}/g), `Interpolation mismatch: ${key}`)
  assert.deepEqual(en[key].match(/\d+/g), th[key].match(/\d+/g), `Numeric mismatch: ${key}`)
}
assert.equal(facts.completed, 557)
assert.equal(facts.plannedOrConstruction, 177)
assert.equal(facts.projectedLowerBoundExclusive, 650)
assert.equal(facts.projectionYear, 2026)
assert.equal(facts.publicPercentApproximate, 60)
assert.equal(facts.remainderPercentDerived, 100 - facts.publicPercentApproximate)
assert.deepEqual(facts.retailStorageTransportSharePercent, [30, 40])
assert.equal(facts.regions.length, 4)
for (const locale of ['en', 'th']) {
  const source = json(`src/content/${locale}/sections/index.json`).find((section) => section.id === facts.sourceSectionId)
  const text = JSON.stringify(source)
  for (const value of ['557', '177', '650', '2026', '60%', '30', '40%']) assert.ok(text.includes(value), `${locale}: source must support ${value}`)
}

const server = await createServer({ cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes: scenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  const { MotionContext } = await server.ssrLoadModule('/src/components/motion/motion-context.ts')
  await server.ssrLoadModule('/src/components/presentation/batch1/HydrogenStage.tsx')
  await server.ssrLoadModule('/src/components/presentation/batch2/LogisticsStage.tsx')
  const { projectRegion, regionOutline } = await server.ssrLoadModule('/src/components/presentation/batch2/regionProjection.ts')
  assert.ok(regionOutline.startsWith('M') && !regionOutline.includes('NaN'))
  const projected = Object.fromEntries(facts.regions.map(({ id, anchor }) => [id, projectRegion(anchor)]))
  for (const point of Object.values(projected)) assert.ok(point[0] > 0 && point[0] < 600 && point[1] > 0 && point[1] < 360)
  assert.ok(projected.capital[1] < projected.delta[1] && projected.delta[1] < projected.bay[1], 'Geographic north/south ordering')
  assert.ok(projected.west[0] < projected.bay[0] && projected.bay[0] < projected.delta[0], 'Geographic west/east ordering')
  const oldModule = ts.transpileModule(baseline.sceneConfig, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const { presentationScenes: oldScenes } = await import(`data:text/javascript;base64,${Buffer.from(oldModule).toString('base64')}`)
  const addedIds = ['scene-infrastructure-expansion', 'scene-hydrogen-transport']
  const laterBatchIds = ['scene-market-transition', 'scene-market-structure', 'scene-distributed-power', 'scene-hydrogen-cofiring', 'scene-truck-performance', 'scene-heavy-logistics-regions', 'scene-suburban-train', 'scene-foshan-tram', 'scene-tourism-trams', 'scene-freight-locomotive', 'scene-mining-locomotives', 'scene-rail-deployment', 'scene-cold-chain-comparison', 'scene-industry-advantages', 'scene-industry-barriers', 'scene-regional-map']
  const movedId = 'scene-power-storage'
  // User retired these five legacy scenes after their replacement scenes were approved.
  const retiredIds = ['scene-refrigerated-logistics', 'scene-industry', 'scene-rail-specialized', 'scene-regions', 'scene-advantages']
  assert.deepEqual(scenes.find(({ id }) => id === movedId), oldScenes.find(({ id }) => id === movedId), 'The moved power scene retains its source configuration')
  assert.deepEqual(scenes.filter(({ id }) => ![...addedIds, ...laterBatchIds, movedId].includes(id)), oldScenes.filter(({ id }) => ![movedId, ...retiredIds].includes(id)), 'All remaining pre-existing scene configs and relative ordering must be preserved')
  assert.deepEqual(scenes.slice(4, 9).map(({ id }) => id), ['scene-equipment-technology', 'scene-infrastructure', ...addedIds, 'scene-vehicle-deployment'])
  for (const locale of ['en', 'th']) {
    await i18n.changeLanguage(locale)
    const { presentation } = await server.ssrLoadModule(`/src/content/${locale}/presentation.ts`)
    for (const reducedMotion of [false, true]) for (const index of [4, 5, 6, 7, 8, 7, 6, 5, 4]) {
      const scene = scenes[index]
      const html = renderToStaticMarkup(createElement(MotionContext.Provider, { value: { playing: !reducedMotion, paused: reducedMotion, reducedMotion, togglePaused() {} } }, createElement(SceneContainer, { scene, sceneNumber: index + 1, sceneCount: scenes.length, presentation })))
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1)
      assert.ok(!html.includes('batchTwo.'), `${locale}: unresolved translation key`)
      if (index < 5 || index > 7) continue
      assert.doesNotMatch(html, />734</, 'Do not replace the forecast with a sum of statuses')
      assert.ok(html.includes(`data-motion="${reducedMotion ? 'paused' : 'running'}"`))
      const escaped = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')
      const translated = (key, options) => assert.ok(html.includes(escaped(i18n.t(`batchTwo.${key}`, options))), `${locale}: missing essential text ${key}`)
      if (index === 5) {
        assert.match(html, />557</); assert.match(html, /~60%/); assert.match(html, /~40%/)
        for (const { id } of facts.regions) translated(`network.regions.${id}`)
        for (const key of ['scale', 'remainder', 'mapNote']) translated(`network.${key}`)
        assert.equal((html.match(/data-cluster=/g) ?? []).length, 4)
      }
      if (index === 6) {
        for (const value of ['557', '177', '650+']) assert.ok(html.includes(`data-statistic="${value}"`))
        translated('expansion.completed'); translated('expansion.planned')
        translated('expansion.projected', { year: 2026 }); translated('expansion.note')
      }
      if (index === 7) {
        assert.match(html, /30–40%/, 'The complete cost range must remain available to assistive technology')
        for (const key of ['cost', 'pilot', 'interregional', 'pressure', 'concept', 'production', 'storage', 'transportation', 'refueling']) translated(`transport.${key}`)
      }
    }
  }
  console.log(`Batch 2 passed: ${baseline.files.filter(({ path }) => !numberMigrationFiles.has(path)).length} protected files unchanged; authorized number components covered separately; previous source configs, TH/EN keys, figures, geographic projection, 05→09 and reverse SSR dispatch, and reduced-motion markup preserved.`)
} finally { await server.close() }
