import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Krits/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')) }
const executablePath = process.env.CHROMIUM_PATH || 'C:/Users/Krits/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) })
const base = process.env.QA_URL || 'http://127.0.0.1:5183'
const out = 'tmp/presentation-shell/qa'
const errors = [], report = []
const listen = (target) => {
  target.on('pageerror', (error) => errors.push(error.message))
  target.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
}
const lang = (target, language) => target.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
const go = async (target, index) => {
  await target.locator('.scene-picker').click()
  await target.locator('.scene-overview__item').nth(index).click()
  await target.locator('#scene-title').waitFor()
}
const state = (target) => target.evaluate(() => {
  const stage = document.querySelector('.scene-stage').getBoundingClientRect()
  const content = document.querySelector('.scene-stage__content')
  const scene = content.firstElementChild.getBoundingClientRect()
  const controls = document.querySelector('.presentation-controls').getBoundingClientRect()
  const header = document.querySelector('.top-navigation').getBoundingClientRect()
  return {
    pageScroll: document.documentElement.scrollHeight > innerHeight + 1 || document.querySelector('.presentation-app').scrollHeight > innerHeight + 1,
    horizontal: document.documentElement.scrollWidth > innerWidth + 1,
    sceneBottom: scene.bottom, stageBottom: stage.bottom, stageTop: stage.top, controlsTop: controls.top, headerBottom: header.bottom,
    fit: Number(content.dataset.fitScale), zoom: Number(content.style.zoom),
  }
})
await mkdir(out, { recursive: true })

const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
listen(page)
try {
  await page.goto(base)
  await page.evaluate(() => localStorage.removeItem('h2fcev.textScale'))
  await page.reload()
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '110%', 'default text size is 110%')
  await page.locator('.scene-picker').click()
  const count = await page.locator('.scene-overview__item').count()
  await page.keyboard.press('Escape')
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      for (let index = 0; index < count; index++) {
        await go(page, index)
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(120)
        const s = await state(page)
        report.push({ id: `${width}x${height}-${language}-${index + 1}`, fit: s.fit })
        assert.equal(s.pageScroll, false, `${width}x${height} ${language} scene ${index + 1}: page scrolls`)
        assert.equal(s.horizontal, false, `${width}x${height} ${language} scene ${index + 1}: horizontal overflow`)
        assert.ok(s.sceneBottom <= s.controlsTop + 1, `${width}x${height} ${language} scene ${index + 1}: content under controls by ${Math.round(s.sceneBottom - s.controlsTop)}px`)
        assert.ok(s.fit >= 0.62 && s.fit <= 1.1 + 1e-9, `${width}x${height} ${language} scene ${index + 1}: fit ${s.fit}`)
      }
    }
  }

  // Text size: buttons and keys step through sizes, persist, and still fit.
  await page.setViewportSize({ width: 1920, height: 1080 })
  await go(page, 1)
  await page.locator('.text-size button').last().click()
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '120%')
  await page.evaluate(() => document.activeElement?.blur())
  await page.keyboard.press('+')
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '130%')
  const large = await state(page)
  assert.ok(large.sceneBottom <= large.controlsTop + 1, 'large text still fits')
  await page.screenshot({ path: `${out}/text-130.png` })
  await page.reload()
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '130%', 'text size persists')
  await page.keyboard.press('0')
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '110%')
  await page.keyboard.press('-'); await page.keyboard.press('-')
  assert.equal((await page.locator('.text-size__value').textContent()).trim(), '90%')
  await page.keyboard.press('0')

  // Fullscreen: header hidden, stage gains its height, header peeks from the top edge.
  const before = await state(page)
  await page.locator('.fullscreen-button').click()
  await page.waitForFunction(() => Boolean(document.fullscreenElement))
  await page.waitForTimeout(400)
  const full = await state(page)
  report.push({ id: 'fullscreen', before: before.stageTop, after: full.stageTop, header: full.headerBottom })
  assert.ok(full.headerBottom <= 1, 'header hidden in fullscreen')
  assert.ok(full.stageTop <= 1, 'stage starts at the top in fullscreen')
  assert.equal(full.pageScroll, false, 'no scroll in fullscreen')
  await page.screenshot({ path: `${out}/fullscreen.png` })
  await page.mouse.move(960, 4)
  await page.waitForTimeout(400)
  assert.ok((await state(page)).headerBottom >= 60, 'header peeks at the top edge')
  await page.screenshot({ path: `${out}/fullscreen-peek.png` })
  await page.mouse.move(960, 600, { steps: 6 })
  await page.waitForTimeout(400)
  const hidden = await page.evaluate(() => { const h = document.querySelector('.top-navigation'); return { bottom: h.getBoundingClientRect().bottom, peek: h.dataset.peek, overview: document.querySelector('.scene-picker').getAttribute('aria-expanded'), fv: h.matches(':has(:focus-visible)'), hover: h.matches(':hover') } })
  assert.ok(hidden.bottom <= 1, 'header hides again ' + JSON.stringify(hidden))
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(300)
  assert.equal((await state(page)).pageScroll, false, 'next scene in fullscreen fits')
  await page.evaluate(() => document.exitFullscreen())

  // Mobile keeps natural vertical scrolling and only applies the text size.
  await page.setViewportSize({ width: 390, height: 844 })
  await go(page, 10)
  const mobile = await state(page)
  assert.equal(mobile.horizontal, false, 'mobile horizontal overflow')
  assert.equal(mobile.fit, 1, 'phones stay at their tested 100% layout')

  assert.deepEqual(errors, [], 'console errors')
  const fits = report.filter((r) => r.fit).map((r) => r.fit)
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log(`Presentation shell QA passed: ${count} scenes × 2 languages × 3 desktop sizes fit without scrolling (fit scale ${Math.min(...fits).toFixed(2)}–${Math.max(...fits).toFixed(2)}), text size controls/keys/persistence, fullscreen header hide/peek, mobile, no console errors.`)
} catch (error) {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.error(errors)
  throw error
} finally {
  await browser.close()
}
