import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }

// Scene positions come from the live config so other batches may insert scenes safely.
const sceneIds = [...(await readFile('src/scenes/scene-config.ts', 'utf8')).matchAll(/id: '(scene-[a-z-]+)'/g)].map((match) => match[1])
const sceneNumber = sceneIds.indexOf('scene-challenges') + 1
assert.ok(sceneNumber > 1, 'scene-challenges must exist in the scene config')
const base = process.env.QA_URL || 'http://127.0.0.1:5180'
const out = 'tmp/batch-eight/qa'
const finals = { purchase: ['300,000+', '1.5–4×'], refueling: ['35', '70'], operating: ['44.5'] }
const titles = {
  en: ['High Vehicle Purchase Cost', 'Limited Hydrogen Refueling Accessibility', 'High Operating Cost'],
  th: ['ค่าใช้จ่ายซื้อรถสูง', 'การเติมไฮโดรเจนไม่สะดวก', 'ค่าใช้จ่ายในการใช้รถสูง'],
}
const ids = Object.keys(finals)

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
await mkdir(out, { recursive: true })
const go = async (number) => {
  await page.locator('.scene-picker').click()
  await page.locator('.scene-overview__item').nth(number - 1).click()
  await page.locator('#scene-title').waitFor()
}
const setLanguage = (language) => page.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
const ticks = () => page.locator('.challenge-detail .animated-number__tick').allTextContents()
const report = []
let passed = false
try {
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)

  // 1. Layout, content and final values: 4 viewports × 2 languages × 3 challenges.
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await setLanguage(language)
      await go(sceneNumber)
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map((img) => img.decode().catch(() => {}))) })
      assert.equal(await page.locator('.challenge-selector').count(), 3, 'Three selectors')
      assert.equal(await page.locator('.challenge-selector').first().getAttribute('aria-pressed'), 'true', 'Challenge 01 selected first')
      for (const [index, id] of ids.entries()) {
        await page.locator('.challenge-selector').nth(index).click()
        await page.waitForTimeout(80)
        const result = await page.evaluate(() => {
          const section = document.querySelector('.challenges-scene')
          const rect = (selector) => section.querySelector(selector)?.getBoundingClientRect()
          const stage = rect('.challenge-stage'), detail = rect('.challenge-detail'), selectors = rect('.challenge-selectors'), source = rect('.challenges-source')
          const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
          const visibleFrames = [...section.querySelectorAll('.challenge-frame')].filter((frame) => Number(getComputedStyle(frame).opacity) > 0.5).map((frame) => frame.dataset.challenge)
          const outside = [...section.querySelectorAll('h1,h2,p,strong,button,.challenge-figure,.pressure-row,.dispenser-marker span')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1 }).map((el) => el.className || el.tagName)
          // Text clipped by its own box (e.g. a long Thai title squeezed into a selector).
          const clipped = [...section.querySelectorAll('h1,h2,p,.challenge-selector__title,.pressure-status')].filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.className || el.tagName)
          const detailChildren = [...section.querySelectorAll('.challenge-detail > *')].map((el) => el.getBoundingClientRect())
          const detailOverflow = detailChildren.some((r) => r.bottom > (innerWidth > 760 ? source.top + 1 : Infinity))
          const overlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
          return {
            horizontal: document.documentElement.scrollWidth > innerWidth + 1, outside, clipped, visibleFrames,
            stats: [...section.querySelectorAll('.challenge-detail [data-statistic]')].map((el) => ({ final: el.dataset.statistic, shown: el.querySelector('.animated-number__tick').textContent })),
            h2: section.querySelector('.challenge-detail h2').textContent,
            pressed: [...section.querySelectorAll('.challenge-selector')].map((b) => b.getAttribute('aria-pressed')),
            missing: [...section.querySelectorAll('img')].filter((img) => !img.complete || !img.naturalWidth).map((img) => img.src),
            pageHeight: document.documentElement.scrollHeight, sourceBottom: source.bottom, controlsTop: controls.top,
            stageDetailOverlap: overlap(stage, detail), selectorsDetailOverlap: overlap(selectors, detail), stageHeight: stage.height, detailOverflow,
          }
        })
        report.push({ width, height, language, id, ...result })
        await page.screenshot({ path: `${out}/${width}-${language}-${index + 1}-${id}.png`, fullPage: true })
        const label = `${width} ${language} ${id}`
        assert.equal(result.horizontal, false, `${label}: horizontal overflow`)
        assert.deepEqual(result.outside, [], `${label}: content outside viewport`)
        assert.deepEqual(result.clipped, [], `${label}: clipped text`)
        assert.deepEqual(result.missing, [], `${label}: missing images`)
        assert.deepEqual(result.visibleFrames, [id], `${label}: exactly the selected image is visible`)
        assert.equal(result.h2, titles[language][index], `${label}: title`)
        assert.deepEqual(result.pressed, ids.map((other) => String(other === id)), `${label}: active selector`)
        assert.deepEqual(result.stats.map((s) => s.final), finals[id], `${label}: figures`)
        result.stats.forEach(({ final, shown }) => assert.equal(shown, final, `${label}: reduced motion shows final values`))
        assert.equal(result.stageDetailOverlap, false, `${label}: image overlaps information`)
        assert.equal(result.selectorsDetailOverlap, false, `${label}: selectors overlap information`)
        if (width > 1100) {
          assert.ok(result.pageHeight <= height + 1, `${label}: slide must fit (${result.pageHeight})`)
          assert.ok(result.sourceBottom <= result.controlsTop + 1, `${label}: source covered by controls`)
          assert.equal(result.detailOverflow, false, `${label}: information runs into the source note`)
          assert.ok(result.stageHeight >= 240, `${label}: image too small (${result.stageHeight})`)
        }
      }
      await page.locator('.challenge-selector').first().click()
    }
  }

  // 2. Language switching keeps the selected challenge; scene navigation in both directions.
  await page.setViewportSize({ width: 1440, height: 900 })
  await setLanguage('en')
  await go(sceneNumber)
  await page.locator('.challenge-selector').nth(1).click()
  await setLanguage('th')
  assert.equal(await page.locator('.challenge-selector').nth(1).getAttribute('aria-pressed'), 'true', 'Selection survives TH switch')
  assert.equal(await page.locator('.challenge-detail h2').textContent(), titles.th[1])
  await setLanguage('en')
  assert.equal(await page.locator('.challenge-selector').nth(1).getAttribute('aria-pressed'), 'true', 'Selection survives EN switch')
  const previousTitle = await page.evaluate(() => document.querySelector('#scene-title').textContent)
  await page.locator('.navigation-button--previous').click()
  assert.notEqual(await page.locator('#scene-title').textContent(), previousTitle, 'Back navigation leaves the scene')
  await page.locator('.navigation-button--next').click()
  assert.equal(await page.locator('#scene-title').textContent(), 'Three Major Challenges of Hydrogen Vehicles', 'Forward navigation returns to the scene')
  await page.locator('.navigation-button--next').click()
  await page.locator('.navigation-button--previous').click()
  assert.equal(await page.locator('.challenge-detail h2').textContent(), titles.en[0], 'Re-entering starts on Challenge 01')

  // 3. Real motion: sequential counts, per-challenge first view only, no replay on language switch.
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await go(sceneNumber)
  const sample = async (duration, action) => {
    await page.evaluate(() => {
      window.samples = []
      window.sampler = setInterval(() => window.samples.push({
        values: [...document.querySelectorAll('.challenge-detail .animated-number__tick')].map((el) => el.textContent),
        active: document.querySelectorAll('.challenge-detail [data-counting="true"]').length,
        id: document.querySelector('.challenges-scene').dataset.active,
      }), 30)
    })
    if (action) await action()
    await page.waitForTimeout(duration)
    return page.evaluate(() => { clearInterval(window.sampler); return window.samples })
  }
  const assertSequential = (all, final, label) => {
    const samples = all.filter((s) => s.id === label)
    assert.ok(samples.some((s) => s.active === 1), `${label}: must animate`)
    assert.ok(samples.every((s) => s.active <= 1), `${label}: figures must not count simultaneously`)
    assert.deepEqual(samples.at(-1).values, final, `${label}: final values`)
    for (let index = 1; index < final.length; index++) {
      const firstMove = samples.find((s) => s.values[index] !== samples[0].values[index])
      assert.ok(firstMove, `${label}: figure ${index + 1} must animate`)
      assert.equal(firstMove.values[index - 1], final[index - 1], `${label}: previous figure must finish first`)
    }
  }
  // Language switch mid-count must not restart the purchase sequence.
  const purchase = await sample(2600, async () => { await page.waitForTimeout(700); await setLanguage('th'); await page.waitForTimeout(80); await setLanguage('en') })
  assertSequential(purchase, finals.purchase, 'purchase')
  const purchaseRestarts = purchase.slice(1).filter((s, i) => s.values[0] === '0+' && purchase[i].values[0] !== '0+').length
  assert.equal(purchaseRestarts, 0, 'Language switching must not replay the count')
  assertSequential(await sample(2800, () => page.locator('.challenge-selector').nth(1).click()), finals.refueling, 'refueling')
  assertSequential(await sample(2000, () => page.locator('.challenge-selector').nth(2).click()), finals.operating, 'operating')
  for (const [index, id] of ids.entries()) {
    await page.locator('.challenge-selector').nth(index).click()
    await page.waitForTimeout(40)
    assert.deepEqual(await ticks(), finals[id], `${id}: revisiting shows final values immediately`)
  }
  await page.locator('.navigation-button--previous').click()
  await page.locator('.navigation-button--next').click()
  await page.waitForTimeout(40)
  assert.deepEqual(await ticks(), finals.purchase, 'Returning to the scene shows final values')
  await page.locator('.challenge-selector').nth(2).click()
  await page.waitForTimeout(40)
  assert.deepEqual(await ticks(), finals.operating, 'Returning to the scene keeps per-challenge memory')

  // 4. Rapid clicks settle on the last choice with one visible image.
  for (let round = 0; round < 4; round++) for (const index of [1, 2, 0, 2, 1]) await page.locator('.challenge-selector').nth(index).click({ delay: 0 })
  await page.waitForTimeout(1100)
  const settled = await page.evaluate(() => ({
    visible: [...document.querySelectorAll('.challenge-frame')].filter((frame) => Number(getComputedStyle(frame).opacity) > 0.5).map((frame) => frame.dataset.challenge),
    faint: [...document.querySelectorAll('.challenge-frame')].filter((frame) => { const o = Number(getComputedStyle(frame).opacity); return o > 0.02 && o < 0.98 }).length,
    pressed: [...document.querySelectorAll('.challenge-selector')].map((b) => b.getAttribute('aria-pressed')),
    h2: document.querySelector('.challenge-detail h2').textContent,
    details: document.querySelectorAll('.challenge-detail').length,
  }))
  assert.deepEqual(settled, { visible: ['refueling'], faint: 0, pressed: ['false', 'true', 'false'], h2: titles.en[1], details: 1 }, 'Rapid clicks settle cleanly')
  await page.screenshot({ path: `${out}/motion-settled.png` })

  // 5. Restart clears the per-challenge memory.
  await go(sceneIds.length)
  await page.locator('.navigation-button--next').click()
  await go(sceneNumber)
  assert.equal((await ticks())[0], '0+', 'Explicit restart re-enables first-view counting')
  await page.waitForTimeout(2600)

  assert.deepEqual(errors, [], 'No browser errors')
  passed = true
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify({ passed, sceneNumber, errors, report }, null, 2))
  await browser.close()
}
console.log(`Batch 8 browser checks passed: scene ${sceneNumber}, ${report.length} layout cases.`)
