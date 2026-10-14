import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }
const executablePath = process.env.CHROMIUM_PATH || 'C:/Users/Krits/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) })
const base = process.env.QA_URL || 'http://127.0.0.1:5183'
const out = 'tmp/batch-nine/qa'
const sceneIds = [...(await readFile('src/scenes/scene-config.ts', 'utf8')).matchAll(/id: '(scene-[a-z-]+)'/g)].map(match => match[1])
const advantageNumber = sceneIds.indexOf('scene-industry-advantages') + 1
const barrierNumber = sceneIds.indexOf('scene-industry-barriers') + 1
assert.ok(advantageNumber > 1 && barrierNumber === advantageNumber + 1, 'Industry scenes must remain consecutive')
const locales = Object.fromEntries(await Promise.all(['en', 'th'].map(async lang => [lang, JSON.parse(await readFile(`src/content/${lang}/batch-nine.json`, 'utf8'))])))
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const errors = [], failures = [], report = []
const listen = target => {
  target.on('pageerror', error => errors.push(error.message))
  target.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
}
listen(page)
await mkdir(out, { recursive: true })
const go = async (target, number) => {
  await target.locator('.scene-picker').click()
  await target.locator('.scene-overview__item').nth(number - 1).click()
  await target.locator('#scene-title').waitFor()
}
const select = (target, index) => target.locator('.industry-topics button').nth(index)
const lang = (target, language) => target.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      for (const [number, kind] of [[advantageNumber, 'advantages'], [barrierNumber, 'barriers']]) {
        await go(page, number)
        assert.equal(await page.locator('.industry-topics button').count(), 5)
        assert.equal(await select(page, 0).getAttribute('aria-pressed'), 'true', 'Default first topic')
        for (let index = 0; index < 5; index++) {
          await select(page, index).click()
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('main img')].map(img => img.decode())) })
          assert.equal(await page.locator('.industry-copy h2').textContent(), locales[language][kind].topics[index].label)
          assert.equal(await page.locator('.industry-copy p').textContent(), locales[language][kind].topics[index].body)
          assert.equal(await page.locator('.industry-topics [aria-pressed="true"]').count(), 1)
          assert.equal(await select(page, index).getAttribute('aria-pressed'), 'true')
          const result = await page.evaluate(() => {
            const section = document.querySelector('.industry-scene')
            const box = selector => section.querySelector(selector).getBoundingClientRect()
            const visual = box('.industry-visual'), copy = box('.industry-copy'), source = box('.industry-source'), selectors = box('.industry-topics')
            const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
            const outside = [...section.querySelectorAll('h1,h2,p,button,strong,small,.industry-symbol')].filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1 }).map(el => el.className || el.tagName)
            const clipped = [...section.querySelectorAll('h1,h2,p,button,strong,.industry-symbol')].filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.className || el.tagName)
            const visualTextOutside = [...section.querySelectorAll('.industry-visual strong,.industry-visual small,.industry-symbol,.industry-visual figcaption')].filter(el => { const r = el.getBoundingClientRect(); return r.top < visual.top - 1 || r.bottom > visual.bottom + 1 }).map(el => el.className || el.tagName)
            const rectOverlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
            return {
              horizontal: document.documentElement.scrollWidth > innerWidth + 1, outside, clipped, visualTextOutside,
              missing: [...section.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
              pageHeight: document.documentElement.scrollHeight, visualHeight: visual.height,
              sourceBottom: source.bottom, controlsTop: controls.top, copyBottom: copy.bottom, sourceTop: source.top,
              selectorBottom: selectors.bottom, selectorTop: selectors.top,
              copyVisualOverlap: rectOverlap(visual, copy), selectorsCopyOverlap: rectOverlap(selectors, copy),
              untranslated: section.textContent.includes('batchNine.'), statistics: section.querySelectorAll('[data-statistic]').length,
            }
          })
          report.push({ width, height, language, number, index, ...result })
          const label = `${width} ${language} ${number}/${index + 1}`
          try {
            assert.equal(result.horizontal, false, `${label}: horizontal overflow`)
            assert.deepEqual(result.outside, [], `${label}: outside viewport`)
            assert.deepEqual(result.clipped, [], `${label}: clipped text`)
            assert.deepEqual(result.visualTextOutside, [], `${label}: visual text clipped`)
            assert.deepEqual(result.missing, [], `${label}: missing assets`)
            assert.equal(result.untranslated, false)
            assert.equal(result.statistics, 0, 'No invented quantitative statistics')
            assert.equal(result.copyVisualOverlap || result.selectorsCopyOverlap, false, `${label}: overlapping blocks`)
            if (width > 1100) {
              assert.ok(result.visualHeight >= 170, `${label}: main visual too compressed (${result.visualHeight})`)
              assert.ok(result.pageHeight <= height + 1, `${label}: slide overflow`)
              assert.ok(result.sourceBottom <= result.controlsTop + 1, `${label}: source under navigation`)
              assert.ok(result.copyBottom <= result.sourceTop + 1, `${label}: copy overlaps source`)
              assert.ok(result.selectorBottom <= result.controlsTop + 1 && result.selectorTop > 0, `${label}: selectors outside slide`)
            }
          } catch (error) { failures.push(error.message) }
          await page.screenshot({ path: `${out}/${width}-${language}-${number}-${index + 1}.png`, fullPage: true })
        }
      }
    }
  }
  const motion = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  listen(motion)
  await motion.goto(base)
  await go(motion, advantageNumber - 1)
  await motion.locator('.navigation-button--next').click()
  assert.equal(await motion.locator('.reference-eyebrow__index').textContent(), String(advantageNumber))
  await select(motion, 3).focus()
  await motion.keyboard.press('Space')
  assert.equal(await select(motion, 3).getAttribute('aria-pressed'), 'true', 'Keyboard selects topic')
  await motion.waitForTimeout(1800)
  await lang(motion, 'th')
  assert.equal(await select(motion, 3).getAttribute('aria-pressed'), 'true', 'Language retains selected topic')
  assert.equal(await motion.locator('[data-visual]').evaluate(el => getComputedStyle(el).opacity), '1', 'Language does not replay entrance')
  await motion.locator('.motion-button').click()
  const flow = await motion.locator('[data-flow]').first().evaluate(el => getComputedStyle(el).strokeDashoffset)
  await motion.waitForTimeout(250)
  assert.equal(await motion.locator('[data-flow]').first().evaluate(el => getComputedStyle(el).strokeDashoffset), flow, 'Global pause stops ambient movement')
  await select(motion, 1).click()
  assert.equal(await motion.locator('[data-visual]').evaluate(el => getComputedStyle(el).opacity), '1', 'Selecting while paused shows completed content')
  await motion.locator('.motion-button').click()
  await motion.evaluate(() => { window.__oldFlow = document.querySelector('[data-flow]') })
  for (const index of [2, 4, 1, 0, 3]) await select(motion, index).click({ force: true })
  assert.equal(await select(motion, 3).getAttribute('aria-pressed'), 'true', 'Rapid input settles on last topic')
  const oldStyle = await motion.evaluate(() => window.__oldFlow.getAttribute('style'))
  await motion.waitForTimeout(1600)
  assert.equal(await motion.evaluate(() => window.__oldFlow.isConnected), false)
  assert.equal(await motion.evaluate(() => window.__oldFlow.getAttribute('style')), oldStyle, 'Detached SVG is no longer animated')
  await motion.locator('.navigation-button--next').click()
  assert.equal(await motion.locator('.reference-eyebrow__index').textContent(), String(barrierNumber))
  for (const index of [4, 2, 0, 1, 3, 4]) await select(motion, index).click({ force: true })
  await motion.waitForTimeout(1800)
  assert.match(await motion.locator('.industry-copy small').textContent(), /2026/)
  await lang(motion, 'en')
  assert.equal(await select(motion, 4).getAttribute('aria-pressed'), 'true')
  assert.match(await motion.locator('.industry-copy small').textContent(), /not full-year results or a forecast/)
  await motion.locator('.navigation-button--next').click()
  assert.equal(await motion.locator('.presentation-progress__track').getAttribute('aria-valuenow'), String(barrierNumber + 1))
  for (const number of [barrierNumber, advantageNumber, advantageNumber - 1]) {
    await motion.locator('.navigation-button--previous').click()
    assert.equal(await motion.locator('.reference-eyebrow__index').textContent(), String(number))
  }
  await motion.locator('.scene-picker').click()
  assert.equal(await motion.locator('.scene-overview__item').count(), sceneIds.length)
  await motion.close()
  assert.deepEqual(errors, [], 'No browser console or page errors')
  assert.deepEqual(failures, [], 'Responsive layout failures')
  console.log(`Batch 9 browser QA passed: 80 TH/EN topic/viewport cases, five selectors per scene, keyboard, reduced motion, global pause, language stability, rapid transitions, cleanup, navigation ${advantageNumber - 1}–${barrierNumber + 1} and ${sceneIds.length} scene overview, no console errors.`)
} finally {
  await writeFile(`${out}/report.json`, JSON.stringify({ report, failures, errors }, null, 2))
  await browser.close()
}
