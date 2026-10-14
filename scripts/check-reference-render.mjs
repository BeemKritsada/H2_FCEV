import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

// Server-side markup smoke test, deliberately not a substitute for browser/GPU QA.
const server = await createServer({ cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  // Resolve the lazy module before shutdown; WebGL gracefully returns its fallback in Node.
  await server.ssrLoadModule('/src/components/presentation/LivingChinaMap.tsx')
  await server.ssrLoadModule('/src/components/presentation/batch1/HydrogenStage.tsx')
  assert.deepEqual(presentationScenes.slice(2, 6).map((scene) => scene.id), [
    'scene-production-mix', 'scene-green-hydrogen', 'scene-equipment-technology', 'scene-infrastructure',
  ], 'Navigation order must be 03 production → 04 green → 05 equipment → 06 infrastructure')
  for (const locale of ['en', 'th']) {
    await i18n.changeLanguage(locale)
    const { presentation } = await server.ssrLoadModule(`/src/content/${locale}/presentation.ts`)
    for (const [index, scene] of presentationScenes.entries()) {
      const html = renderToStaticMarkup(createElement(SceneContainer, {
        scene, sceneNumber: index + 1, sceneCount: presentationScenes.length, presentation,
      }))
      assert.match(html, /<h1[\s>]/, `${locale} ${scene.id}: heading missing`)
      assert.ok(!html.includes('reference.overview.') && !html.includes('reference.mix.'), 'Raw translation key in markup')
      if (scene.id === 'scene-china-scale') {
        assert.match(html, /36\.5/, `${locale}: production metric missing`)
        assert.match(html, /2024/, `${locale}: historical year missing`)
        // The figure is labelled with its verified data year (2024), not the 2026 presentation year.
        assert.match(html, /NEA/, `${locale}: NEA source label missing`)
        assert.doesNotMatch(html, /unverified|ยังต้องตรวจสอบ/, `${locale}: development note visible`)
      }
      if (scene.id === 'scene-production-mix') {
        const values = [...html.matchAll(/aria-valuenow="(\d+)"/g)].map((match) => Number(match[1]))
        assert.deepEqual(values, [56, 21, 21], `${locale}: accessible bar values differ`)
        assert.equal([...html.matchAll(/aria-valuemax="100"/g)].length, 3, 'All bars must share the same scale')
        assert.match(html, /98%/, 'Source subtotal note missing')
      }
      if (scene.id === 'scene-green-hydrogen') {
        assert.match(html, /250,000/, 'Operational capacity missing')
        assert.match(html, /900,000/, 'Construction figure missing')
        assert.ok(!html.includes(i18n.t('batchOne.green.unitNote')), 'Batch 5 removes this warning from the UI only')
        for (const region of ['xinjiang', 'innerMongolia', 'gansu']) assert.ok(html.includes(i18n.t(`batchOne.green.${region}`)))
        assert.ok(html.includes(i18n.t('batchOne.conceptNote')), 'Temporary concept identification must be visible')
      }
      if (scene.id === 'scene-equipment-technology') {
        assert.match(html, /data-statistic="90"/, 'Localization magnitude must remain 90')
        assert.match(html, /<span>%\+<\/span>/, 'Localization threshold suffix must remain %+')
        for (const item of ['electrolyzer', 'tank', 'fuelCell']) assert.ok(html.includes(i18n.t(`batchOne.equipment.${item}`)))
        assert.ok(html.includes(i18n.t('batchOne.equipment.standardClaim')), 'Global-standard comparison must be attributed to supplied material')
      }
    }
    // Render the same navigation sequence backwards to check scene dispatch in each locale.
    for (const index of [5, 4, 3, 2]) {
      const scene = presentationScenes[index]
      const html = renderToStaticMarkup(createElement(SceneContainer, { scene, sceneNumber: index + 1, sceneCount: presentationScenes.length, presentation }))
      assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${locale} ${scene.id}: one heading per backward scene`)
      assert.ok(!html.includes('batchOne.'), 'Batch translation key must resolve when returning to a scene')
    }
  }
  console.log(`Render smoke test passed: all ${presentationScenes.length} scenes in TH and EN; 03→04→05→06 and reverse dispatch; headings, chart values, qualifiers and temporary-asset labels. Browser layout, keyboard events, motion and GPU behavior are not tested here.`)
} finally {
  await server.close()
}
