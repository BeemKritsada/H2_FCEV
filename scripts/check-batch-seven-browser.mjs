import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }
const chromiumPath = process.env.CHROMIUM_PATH || 'C:/Users/Krits/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
const browser = await chromium.launch({ headless: true, ...(existsSync(chromiumPath) ? { executablePath: chromiumPath } : {}) })
const base = process.env.QA_URL || 'http://127.0.0.1:5177'
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
await mkdir('tmp/batch-seven/qa', { recursive: true })
const go = async number => {
  await page.locator('.scene-picker').click()
  await page.locator('.scene-overview__item').nth(number - 1).click()
  await page.locator('#scene-title').waitFor()
}
const report = []
try {
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await page.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
      for (const scene of [21, 22, 23]) {
        await go(scene)
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map(img => img.decode().catch(() => {}))) })
        const result = await page.evaluate(() => {
          const section = document.querySelector('.batch-seven-scene')
          const source = section.querySelector('.batch-seven-source').getBoundingClientRect()
          const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
          const content = section.querySelector('.freight-metrics,.mining-regions,.deployment-composition').getBoundingClientRect()
          return {
            title: section.querySelector('h1').textContent,
            stats: [...section.querySelectorAll('[data-statistic]')].map(el => [el.dataset.statistic, el.querySelector('.animated-number__tick').textContent]),
            missing: [...section.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
            horizontal: document.documentElement.scrollWidth > innerWidth + 1,
            outside: [...section.querySelectorAll('h1,h2,h3,p,strong,button,.batch-seven-metric')].filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1 }).map(el => el.className || el.tagName),
            pageHeight: document.documentElement.scrollHeight,
            sourceTop: source.top,
            sourceBottom: source.bottom,
            contentBottom: content.bottom,
            controlsTop: controls.top,
          }
        })
        report.push({ width, height, language, scene, ...result })
        await page.screenshot({ path: `tmp/batch-seven/qa/${width}-${language}-${scene}.png`, fullPage: true })
        assert.deepEqual(result.missing, [], `${width} ${language} ${scene}: missing images`)
        assert.equal(result.horizontal, false, `${width} ${language} ${scene}: horizontal overflow`)
        assert.deepEqual(result.outside, [], `${width} ${language} ${scene}: text outside viewport`)
        if (width > 1100) {
          assert.ok(result.pageHeight <= height + 1, `${width} ${language} ${scene}: vertical overflow`)
          assert.ok(result.sourceBottom <= result.controlsTop + 1, `${width} ${language} ${scene}: source hidden by controls`)
          assert.ok(result.contentBottom <= result.sourceTop + 1, `${width} ${language} ${scene}: content overlaps source`)
        }
        result.stats.forEach(([final, shown]) => assert.equal(shown, final, 'Reduced motion should show final values'))
        assert.equal(result.stats.length, scene === 21 ? 3 : scene === 22 ? 2 : 0)
        if (scene === 21) assert.deepEqual(result.stats.map(([final]) => final), ['2,400', '10,000', '12+'])
        if (scene === 22) assert.deepEqual(result.stats.map(([final]) => final), ['700', '1,400'])
        if (scene === 23) assert.equal(await page.locator('.deployment-node').count(), 12)
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.locator('.language-toggle__option').filter({ hasText: 'EN' }).click()
  await go(23)
  await page.getByRole('button', { name: 'Yibin' }).click()
  assert.equal(await page.locator('.deployment-selected h2').textContent(), 'Yibin')
  assert.match(await page.locator('.deployment-selected').textContent(), /requires confirmation/)
  await page.locator('.language-toggle__option').filter({ hasText: 'TH' }).click()
  assert.equal(await page.locator('.deployment-selected h2').textContent(), 'อี๋ปิน')
  await go(20)
  for (const expected of [21, 22, 23, 24]) {
    await page.locator('.navigation-button--next').click()
    assert.match(await page.locator('.reference-eyebrow__index,.scene-copy__position').first().textContent(), new RegExp(String(expected).padStart(2, '0')))
  }
  for (const expected of [23, 22, 21, 20]) {
    await page.locator('.navigation-button--previous').click()
    assert.match(await page.locator('.reference-eyebrow__index').first().textContent(), new RegExp(String(expected).padStart(2, '0')))
  }
  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  motionPage.on('pageerror', error => errors.push(error.message))
  motionPage.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await motionPage.goto(base)
  await motionPage.evaluate(() => {
    window.__batchSevenCountStarts = []
    new MutationObserver(records => {
      for (const record of records) {
        const target = record.target
        if (target.dataset.counting !== 'true') continue
        const scene = target.closest('.batch-seven-scene')
        if (!scene) continue
        const number = Number(scene.querySelector('.reference-eyebrow__index')?.textContent)
        const index = [...scene.querySelectorAll('.animated-number__tick')].indexOf(target)
        window.__batchSevenCountStarts.push({ number, index, time: performance.now() })
      }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-counting'] })
  })
  const motionGo = async number => {
    await motionPage.locator('.scene-picker').click()
    await motionPage.locator('.scene-overview__item').nth(number - 1).click()
  }
  await motionGo(21)
  await motionPage.waitForTimeout(3300)
  let starts = await motionPage.evaluate(() => window.__batchSevenCountStarts)
  assert.deepEqual(starts.filter(item => item.number === 21).map(item => item.index), [0, 1, 2], 'Scene 21 numbers start in reading order')
  await motionPage.locator('.language-toggle__option').filter({ hasText: 'TH' }).click()
  assert.deepEqual(await motionPage.evaluate(() => window.__batchSevenCountStarts), starts, 'Language change does not restart counts')
  await motionGo(22)
  await motionPage.waitForTimeout(2400)
  starts = await motionPage.evaluate(() => window.__batchSevenCountStarts)
  assert.deepEqual(starts.filter(item => item.number === 22).map(item => item.index), [0, 1], 'Scene 22 numbers start in reading order')
  await motionGo(21)
  await motionPage.waitForTimeout(450)
  assert.deepEqual(await motionPage.evaluate(() => window.__batchSevenCountStarts), starts, 'Revisiting does not restart counts')
  await motionPage.close()
  assert.deepEqual(errors, [], 'No browser console or page errors')
  console.log('Batch 7 browser QA passed: 24 responsive TH/EN cases, map focus, navigation 20–24, ordered first-entry counts, language/revisit stability, reduced motion and console.')
} finally {
  await writeFile('tmp/batch-seven/qa/report.json', JSON.stringify({ report, errors }, null, 2))
  await browser.close()
}
