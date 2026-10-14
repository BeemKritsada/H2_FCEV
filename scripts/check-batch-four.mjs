import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '.tmp/vite-ssr-checks', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { default: i18n, i18nReady } = await server.ssrLoadModule('/src/i18n/index.ts')
  await i18nReady
  const { SceneContainer } = await server.ssrLoadModule('/src/components/presentation/SceneContainer.tsx')
  const { presentationScenes: scenes } = await server.ssrLoadModule('/src/scenes/scene-config.ts')
  const { MotionContext } = await server.ssrLoadModule('/src/components/motion/motion-context.ts')
  const batchFourIds = ['scene-power-storage', 'scene-distributed-power', 'scene-hydrogen-cofiring']
  assert.equal(scenes.length, 29)
  assert.deepEqual(scenes.slice(11, 15).map(({ id }) => id), [...batchFourIds, 'scene-heavy-duty-logistics'])

  for (const locale of ['en', 'th']) {
    await i18n.changeLanguage(locale)
    const { presentation } = await server.ssrLoadModule(`/src/content/${locale}/presentation.ts`)
    for (const mode of ['playing', 'paused', 'reduced']) {
      for (const index of [11, 12, 13]) {
        const scene = scenes[index]
        const html = renderToStaticMarkup(createElement(
          MotionContext.Provider,
          { value: { playing: mode === 'playing', paused: mode === 'paused', reducedMotion: mode === 'reduced', togglePaused() {} } },
          createElement(SceneContainer, { scene, sceneNumber: index + 1, sceneCount: scenes.length, presentation }),
        ))
        const text = html.replace(/<[^>]+>/g, '').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&amp;', '&')
        assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${locale} scene ${index + 1}: one title`)
        assert.ok(!html.includes('batchFour.'), `${locale} scene ${index + 1}: unresolved translation key`)
        assert.ok(html.includes(`data-motion="${mode === 'playing' ? 'running' : 'paused'}"`), `${locale} scene ${index + 1}: motion state`)
        assert.ok(text.includes(i18n.t('batchFour.sourceNote', { slide: 8 })), `${locale} scene ${index + 1}: source reference`)

        if (index === 11) {
          assert.ok(text.includes(i18n.t('batchFour.storage.title', { lng: locale })))
          assert.match(html, /data-mode="store"/)
          assert.equal((html.match(/class="flow-path flow-path--/g) ?? []).length, 4, `${locale}: four connected flow routes`)
          assert.ok(text.includes(i18n.t('batchFour.storage.storeFlow', { lng: locale })))
          assert.equal((html.match(/aria-pressed=/g) ?? []).length, 2, `${locale}: two presenter modes`)
        }
        if (index === 12) {
          assert.ok(text.includes(i18n.t('batchFour.distributed.title', { lng: locale })))
          assert.equal((html.match(/class="backup-scenario"/g) ?? []).length, 3, `${locale}: three selectable environments`)
          for (const key of ['island', 'border', 'dataCenter']) assert.ok(text.includes(i18n.t(`batchFour.distributed.${key}`, { lng: locale })))
          for (const key of ['normal', 'interrupted', 'activating', 'restored']) assert.ok(text.includes(i18n.t(`batchFour.distributed.stage.${key}`, { lng: locale })))
          assert.ok(text.includes(i18n.t('batchFour.distributed.chpTitle', { lng: locale })))
          assert.ok(text.includes(i18n.t('batchFour.distributed.chpFlow', { lng: locale })))
        }
        if (index === 13) {
          assert.ok(text.includes(i18n.t('batchFour.cofiring.title', { lng: locale })))
          for (const key of ['coalFeed', 'hydrogenFeed', 'boiler', 'steam', 'electricity', 'objective', 'caveat']) assert.ok(text.includes(i18n.t(`batchFour.cofiring.${key}`, { lng: locale })))
          assert.doesNotMatch(text, /\d+(?:\.\d+)?\s*%/, 'Do not add an unsupported blend or reduction percentage')
          assert.equal((html.match(/class="cofire-flow /g) ?? []).length, 4, `${locale}: one coal, hydrogen, steam and power path each`)
        }
      }
    }
  }
  console.log('Batch 4 passed: Scenes 12–14 retain their order in the 29-scene presentation; TH/EN, playing/paused/reduced-motion rendering, source references and co-firing claims checked.')
  console.log('SSR does not exercise pointer interaction, browser layout, console output, or timed animation playback.')
} finally {
  await server.close()
}
