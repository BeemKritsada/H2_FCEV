import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }
const base = process.env.QA_URL || 'http://127.0.0.1:5175'
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
await mkdir('tmp/batch-five/qa', { recursive: true })
const go = async (number) => {
  await page.locator('.scene-picker').click()
  await page.locator('.scene-overview__item').nth(number - 1).click()
  await page.locator('#scene-title').waitFor()
}
const report = []
let passed = false
try {
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await page.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
      for (let scene = 15; scene <= 20; scene++) {
        await go(scene)
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map((img) => img.decode().catch(() => {}))) })
        const result = await page.evaluate(() => {
          const section = document.querySelector('.batch-five-scene')
          const stats = [...section.querySelectorAll('[data-statistic]')].map((el) => ({ final: el.dataset.statistic, shown: el.querySelector('.animated-number__tick').textContent }))
          const overflowing = [...section.querySelectorAll('h1,h2,p,strong,button,.logistics-metric,.tourism-name')].filter((el) => el.getBoundingClientRect().right > innerWidth + 1 || el.getBoundingClientRect().left < -1).map((el) => el.className || el.tagName)
          const source = section.querySelector('.logistics-source').getBoundingClientRect()
          const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
          const hiddenBelowSource = [...section.querySelectorAll('.logistics-metric,.payload-message,.train-milestones,.tourism-dates,.tourism-environment')].filter((el) => el.getBoundingClientRect().bottom > source.top + 1).map((el) => el.className)
          return { horizontal: document.documentElement.scrollWidth > innerWidth + 1, overflowing, stats, missing: [...section.querySelectorAll('img')].filter((img) => !img.complete || !img.naturalWidth).map((img) => img.src), title: section.querySelector('h1').textContent, pageHeight: document.documentElement.scrollHeight, sourceBottom: source.bottom, controlsTop: controls.top, hiddenBelowSource }
        })
        report.push({ width, height, language, scene, ...result })
        await page.screenshot({ path: `tmp/batch-five/qa/${width}-${language}-${scene}.png`, fullPage: true })
        assert.equal(result.horizontal, false, `${width} ${language} ${scene}: horizontal overflow`)
        assert.deepEqual(result.overflowing, [], `${width} ${language} ${scene}: content outside viewport`)
        assert.deepEqual(result.missing, [], `${scene}: missing images`)
        if (width > 1100) {
          assert.ok(result.pageHeight <= height + 1, `${width} ${language} ${scene}: full slide must fit`)
          assert.ok(result.sourceBottom <= result.controlsTop + 1, `${width} ${language} ${scene}: source must not be covered`)
          assert.deepEqual(result.hiddenBelowSource, [], `${width} ${language} ${scene}: content overlaps source note`)
        }
        result.stats.forEach(({ final, shown }) => assert.equal(shown, final, 'Reduced motion must show final values'))
      }
    }
  }
  // The migrated scenes retain their original layouts; inspect both desktop and phone.
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await page.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
      for (const scene of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11]) {
        await go(scene)
        await page.waitForTimeout(200)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${width} ${language} ${scene}: migrated scene horizontal overflow`)
        const actual = await page.locator('.animated-number__tick').allTextContents()
        const expected = await page.locator('[data-statistic]').evaluateAll((nodes) => nodes.map((node) => node.dataset.statistic))
        assert.deepEqual(actual, expected)
        if (scene === 1) assert.match(await page.locator('.opening-reference-year').textContent(), /2026/)
        if (scene === 4) assert.equal(await page.locator('.green-metric__caution').count(), 0)
        if (scene === 11) {
          assert.equal(await page.evaluate(() => {
            const bounds = document.querySelector('.vehicle-carousel__stage').getBoundingClientRect()
            return [...document.querySelectorAll('.vehicle-carousel__item img')].every((img) => {
              const rect = img.getBoundingClientRect()
              return rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1
            })
          }), true, 'Carousel images must fit vertically inside the stage')
          assert.equal(await page.locator('.vehicle-detail__figure .animated-number').evaluate((node) => getComputedStyle(node).color), 'rgb(7, 83, 200)', 'Count-up wrapper inherits the approved figure color')
        }
        await page.screenshot({ path: `tmp/batch-five/qa/regression-${width}-${language}-${scene}.png`, fullPage: true })
      }
    }
  }
  // Local presenter choices survive language switching; navigation still moves one scene.
  await go(20)
  await page.locator('.tourism-focus').nth(1).click()
  await page.locator('.language-toggle__option').filter({ hasText: 'EN' }).click()
  assert.equal(await page.locator('.tourism-focus').nth(1).getAttribute('aria-pressed'), 'true')
  await page.locator('.navigation-button--previous').click()
  assert.match(await page.locator('#scene-title').textContent(), /Foshan/)
  await page.locator('.navigation-button--next').click()
  assert.match(await page.locator('#scene-title').textContent(), /Tourism/)
  // Fresh presentation session for real GSAP timing and replay checks.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.reload()
  await go(16)
  await page.evaluate(() => {
    window.numberSamples = []
    window.numberSampler = setInterval(() => {
      window.numberSamples.push({ time: performance.now(), values: [...document.querySelectorAll('.truck-performance__metrics [data-statistic]')].map((el) => el.querySelector('.animated-number__tick').textContent), active: document.querySelectorAll('[data-counting="true"]').length })
    }, 40)
  })
  await page.waitForTimeout(500)
  await page.locator('.language-toggle__option').filter({ hasText: 'TH' }).click()
  await page.waitForTimeout(2900)
  const samples = await page.evaluate(() => { clearInterval(window.numberSampler); return window.numberSamples })
  assert.ok(samples.some((s) => s.active === 1), 'Must animate')
  assert.ok(samples.every((s) => s.active <= 1), 'Statistics must not animate simultaneously')
  const finalValues = ['3–5', '600–1,000', '−30°C']
  assert.deepEqual(samples.at(-1).values, finalValues)
  for (let index = 1; index < 3; index++) {
    const firstMove = samples.find((s) => s.values[index] !== (index === 1 ? '0–0' : '−0°C'))
    assert.ok(firstMove, 'Each statistic must animate')
    assert.equal(firstMove.values[index - 1], finalValues[index - 1], 'Previous count must finish before next')
  }
  await page.locator('.performance-highlights button').nth(2).click()
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), finalValues)
  await page.locator('.navigation-button--next').click()
  await page.locator('.navigation-button--previous').click()
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), finalValues, 'Returning to a visited scene must show final values immediately')
  await page.locator('.language-toggle__option').filter({ hasText: 'EN' }).click()
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), finalValues)
  // A changed carousel statistic must not be overwritten by the old running tween.
  await go(11)
  await page.waitForTimeout(100)
  await page.locator('[data-carousel-id="bus"]').click()
  await page.locator('.language-toggle__option').filter({ hasText: 'TH' }).click()
  await page.waitForTimeout(3100)
  assert.equal(await page.locator('.vehicle-carousel__stage').getAttribute('data-active-vehicle'), 'bus')
  assert.equal(await page.locator('.vehicle-detail__figure .animated-number__tick').textContent(), '95%+')
  await page.locator('[data-carousel-id="car"]').click()
  assert.equal(await page.locator('.vehicle-detail__figure .animated-number__tick').textContent(), '<5%')
  await page.locator('.scene-picker').click()
  await page.locator('.scene-overview__item').last().click()
  await page.locator('.navigation-button--next').click()
  await go(16)
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), ['0–0', '0–0', '−0°C'], 'Explicit restart clears visited tracking')
  await page.waitForTimeout(400)
  await page.locator('.motion-button').click()
  const paused = await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents()
  await page.waitForTimeout(300)
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), paused, 'Pause freezes counting')
  await page.locator('.motion-button').click()
  await page.waitForTimeout(3100)
  assert.deepEqual(await page.locator('.truck-performance__metrics .animated-number__tick').allTextContents(), finalValues)
  assert.deepEqual(errors, [], 'Browser console/page errors')
  passed = true
  console.log('Browser QA passed: 48 TH/EN new-scene layout cases plus 40 earlier-scene regressions; images, controls, sequential counts, language switch, revisit, explicit restart, pause/resume and console.')
} finally {
  await writeFile('tmp/batch-five/qa/report.json', JSON.stringify({ passed, report, errors }, null, 2))
  await browser.close()
}
