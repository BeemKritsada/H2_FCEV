import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }
const chromiumPath = process.env.CHROMIUM_PATH || 'C:/Users/Krits/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
const browser = await chromium.launch({ headless: true, ...(existsSync(chromiumPath) ? { executablePath: chromiumPath } : {}) })
const base = process.env.QA_URL || 'http://127.0.0.1:5182'
const sceneIds = [...(await readFile('src/scenes/scene-config.ts', 'utf8')).matchAll(/id: '(scene-[a-z-]+)'/g)].map(match => match[1])
const sceneNumber = sceneIds.indexOf('scene-cold-chain-comparison') + 1
assert.ok(sceneNumber > 1, 'Cold-chain scene must exist')
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = []
const listen = target => {
  target.on('pageerror', error => errors.push(error.message))
  target.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
}
listen(page)
await mkdir('tmp/cold-chain/qa', { recursive: true })
const go = async (target, number) => {
  await target.locator('.scene-picker').click()
  await target.locator('.scene-overview__item').nth(number - 1).click()
  await target.locator('#scene-title').waitFor()
}
const topic = (target, index) => target.locator('.cold-chain-selectors button').nth(index)
const stats = target => target.locator('.cold-chain-detail-region [data-statistic]').evaluateAll(nodes => nodes.map(node => ({ final: node.dataset.statistic, shown: node.querySelector('.animated-number__tick').textContent })))
const report = []
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await page.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
      await go(page, sceneNumber - 1)
      await go(page, sceneNumber)
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('.cold-chain-vehicle img')].map(img => img.decode())) })
      assert.equal(await page.locator('.cold-chain-vehicle img').count(), 2)
      assert.equal(await page.locator('.cold-chain-selectors button').count(), 4)
      assert.equal(await topic(page, 2).getAttribute('aria-pressed'), 'true', 'Time is the default topic')
      assert.deepEqual((await stats(page)).map(item => item.final), ['10–15', '1–2'])
      for (const item of await stats(page)) assert.equal(item.shown, item.final, 'Reduced motion shows final values')
      for (const index of [0, 1, 2, 3]) {
        await topic(page, index).click()
        assert.equal(await topic(page, index).getAttribute('aria-pressed'), 'true')
        const values = (await stats(page)).map(item => item.final)
        assert.deepEqual(values, index === 2 ? ['10–15', '1–2'] : index === 3 ? ['500–800'] : [])
        const result = await page.evaluate(() => {
          const section = document.querySelector('.cold-chain-scene')
          const [bev, fcev] = [...section.querySelectorAll('.cold-chain-vehicle img')].map(img => ({ complete: img.complete && img.naturalWidth > 0, rect: img.getBoundingClientRect() }))
          const source = section.querySelector('.cold-chain-source').getBoundingClientRect()
          const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
          return {
            title: section.querySelector('h1').textContent,
            topic: section.querySelector('.cold-chain-selectors [aria-pressed="true"]').textContent,
            images: [bev.complete, fcev.complete],
            widthRatio: bev.rect.width / fcev.rect.width,
            horizontal: document.documentElement.scrollWidth > innerWidth + 1,
            outside: [...section.querySelectorAll('h1,h2,p,button,strong,.cold-chain-result')].filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1 }).map(el => el.className || el.tagName),
            pageHeight: document.documentElement.scrollHeight,
            sourceBottom: source.bottom,
            controlsTop: controls.top,
            detailBottom: section.querySelector('.cold-chain-detail-region').getBoundingClientRect().bottom,
            sourceTop: source.top,
          }
        })
        report.push({ width, height, language, index, ...result })
        assert.deepEqual(result.images, [true, true], 'Both truck images remain loaded')
        assert.ok(result.widthRatio > .99 && result.widthRatio < 1.01, 'Truck frames use the same scale')
        assert.equal(result.horizontal, false, `${width} ${language} ${index}: horizontal overflow`)
        assert.deepEqual(result.outside, [], `${width} ${language} ${index}: text outside viewport`)
        if (width > 1100) {
          assert.ok(result.pageHeight <= height + 1, `${width} ${language} ${index}: slide overflow`)
          assert.ok(result.sourceBottom <= result.controlsTop + 1, `${width} ${language} ${index}: source hidden by controls`)
          assert.ok(result.detailBottom <= result.sourceTop + 1, `${width} ${language} ${index}: detail overlaps source`)
        }
      }
      await topic(page, 2).click()
      await page.screenshot({ path: `tmp/cold-chain/qa/${width}-${language}-time.png`, fullPage: true })
      await topic(page, 3).click()
      await page.screenshot({ path: `tmp/cold-chain/qa/${width}-${language}-range.png`, fullPage: true })
    }
  }
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  listen(motionPage)
  await motionPage.goto(base)
  await motionPage.evaluate(() => {
    window.__coldChainStarts = []
    new MutationObserver(records => {
      for (const record of records) {
        const node = record.target
        if (node.dataset.counting !== 'true') continue
        const scene = node.closest('.cold-chain-scene')
        if (!scene) continue
        const active = scene.querySelector('.cold-chain-selectors [aria-pressed="true"]')?.textContent
        window.__coldChainStarts.push({ active, value: node.closest('[data-statistic]')?.dataset.statistic, time: performance.now() })
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-counting'] })
  })
  await go(motionPage, sceneNumber)
  await motionPage.waitForTimeout(3200)
  let starts = await motionPage.evaluate(() => window.__coldChainStarts)
  assert.deepEqual(starts.map(item => item.value), ['10–15', '1–2'], 'FCEV then BEV count on first view')
  await topic(motionPage, 3).click()
  await motionPage.waitForTimeout(1700)
  starts = await motionPage.evaluate(() => window.__coldChainStarts)
  assert.deepEqual(starts.map(item => item.value), ['10–15', '1–2', '500–800'], 'Range counts once')
  await motionPage.locator('.language-toggle__option').filter({ hasText: 'TH' }).click()
  assert.equal(await topic(motionPage, 3).getAttribute('aria-pressed'), 'true', 'Language switch retains topic')
  assert.deepEqual(await motionPage.evaluate(() => window.__coldChainStarts), starts, 'Language switch does not recount')
  await topic(motionPage, 2).click()
  await motionPage.waitForTimeout(500)
  assert.deepEqual(await motionPage.evaluate(() => window.__coldChainStarts), starts, 'Viewed topic does not recount')
  await topic(motionPage, 0).click()
  await topic(motionPage, 1).click()
  await topic(motionPage, 3).click()
  assert.equal(await topic(motionPage, 3).getAttribute('aria-pressed'), 'true', 'Rapid clicks settle on the latest topic')
  await motionPage.locator('.navigation-button--previous').click()
  await motionPage.locator('.navigation-button--next').click()
  assert.equal(await motionPage.locator('.reference-eyebrow__index').textContent(), String(sceneNumber))
  await motionPage.waitForTimeout(500)
  assert.deepEqual(await motionPage.evaluate(() => window.__coldChainStarts), starts, 'Scene revisit does not recount')
  await motionPage.locator('.navigation-button--next').click()
  assert.equal(await motionPage.locator('.reference-eyebrow__index').textContent(), String(sceneNumber + 1))
  await motionPage.close()
  assert.deepEqual(errors, [], 'No console or page errors')
  console.log(`Cold-chain browser QA passed: 32 TH/EN responsive topic cases, both images, navigation ${sceneNumber - 1}–${sceneNumber + 1}, ordered first-view counts, language/revisit stability and console.`)
} finally {
  await writeFile('tmp/cold-chain/qa/report.json', JSON.stringify({ report, errors }, null, 2))
  await browser.close()
}
