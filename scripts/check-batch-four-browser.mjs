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
const out = 'tmp/batch-four/qa'
const config = await readFile('src/scenes/scene-config.ts', 'utf8')
const sceneIds = [...config.matchAll(/id: '(scene-[a-z0-9-]+)'/g)].map(([, id]) => id)
const scenes = [['storage', 'scene-power-storage'], ['distributed', 'scene-distributed-power'], ['cofiring', 'scene-hydrogen-cofiring']].map(([name, id]) => [name, sceneIds.indexOf(id) + 1])
const errors = [], report = []
const listen = (target) => {
  target.on('pageerror', (error) => errors.push(error.message))
  target.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
}
const go = async (target, number) => {
  await target.locator('.scene-picker').click()
  await target.locator('.scene-overview__item').nth(number - 1).click()
  await target.locator('#scene-title').waitFor()
}
const lang = (target, language) => target.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
await mkdir(out, { recursive: true })

const measure = (target) => target.evaluate(() => {
  const section = document.querySelector('.batch-four-scene')
  const controls = document.querySelector('.presentation-controls')?.getBoundingClientRect()
  const svgs = [...section.querySelectorAll('svg.energy-system__art, .cofiring-diagram svg')]
  const overlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
  const texts = svgs.flatMap((svg) => [...svg.querySelectorAll('text')].map((el) => ({ text: el.textContent, r: el.getBoundingClientRect(), svg: svg.getBoundingClientRect() })))
  // Drawn shapes a label must stay clear of (chimneys, tank, tower, hopper).
  const shapes = svgs.flatMap((svg) => [...svg.querySelectorAll('.cofire-grid, .hydrogen-feed rect, .hydrogen-feed ellipse, .chimney, .coal-feed > path:first-child, .energy-grid')].map((el) => el.getBoundingClientRect()))
  const textCollisions = []
  texts.forEach((a, i) => texts.slice(i + 1).forEach((b) => { if (overlap(a.r, b.r)) textCollisions.push(`${a.text} × ${b.text}`) }))
  texts.forEach((a) => shapes.forEach((r) => { if (overlap(a.r, r)) textCollisions.push(`${a.text} × shape`) }))
  return {
    horizontal: document.documentElement.scrollWidth > innerWidth + 1,
    sectionBottom: section.getBoundingClientRect().bottom, controlsTop: controls?.top ?? innerHeight,
    titleTop: section.querySelector('h1').getBoundingClientRect().top,
    textOutside: texts.filter(({ r, svg }) => r.left < svg.left - 1 || r.right > svg.right + 1).map(({ text }) => text),
    textCollisions,
    svgHeight: Math.round(svgs[0]?.getBoundingClientRect().height ?? 0),
    clipped: [...section.querySelectorAll('h1,h2,p,button,strong,li')].filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent.slice(0, 40)),
  }
})

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
listen(page)
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1792, 891], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      for (const [name, number] of scenes) {
        await go(page, number)
        await page.evaluate(() => document.fonts.ready)
        const result = await measure(page)
        const id = `${width}x${height}-${language}-${name}`
        await page.screenshot({ path: `${out}/${id}.png`, fullPage: width < 800 })
        report.push({ id, ...result })
        assert.equal(result.horizontal, false, `${id}: horizontal overflow`)
        assert.deepEqual(result.clipped, [], `${id}: clipped text`)
        assert.deepEqual(result.textCollisions, [], `${id}: diagram label collisions`)
        if (width > 1100) {
          assert.ok(result.sectionBottom <= result.controlsTop + 1, `${id}: scene runs under the controls by ${Math.round(result.sectionBottom - result.controlsTop)}px`)
          assert.deepEqual(result.textOutside, [], `${id}: diagram text outside frame`)
          if (name !== 'distributed') assert.ok(result.svgHeight >= 220, `${id}: diagram too small (${result.svgHeight}px)`)
        }
      }
    }
  }

  // Full motion: entrance settles, rotor turns about its hub, interactions update state.
  const motion = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  listen(motion)
  await motion.goto(base)
  await lang(motion, 'en')
  await go(motion, scenes[0][1])
  await motion.waitForTimeout(450)
  const early = await motion.evaluate(() => ({
    arrows: Math.max(...[...document.querySelectorAll('[data-flow-step]')].map((el) => Number(getComputedStyle(el).opacity))),
    equipment: Math.max(...[...document.querySelectorAll('[data-stage]')].map((el) => Number(getComputedStyle(el).opacity))),
  }))
  report.push({ id: 'storage-entrance-450ms', ...early })
  assert.ok(early.arrows === 0 && early.equipment > 0, 'arrows wait until equipment has appeared')
  await motion.waitForTimeout(2000)
  const settled = await motion.locator('[data-enter], [data-stage]').evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1' && !el.matches('[data-active="false"]')).length)
  assert.equal(settled, 0, 'entrance completes at full opacity')
  const hub = () => motion.locator('.energy-turbine__rotor circle').first().evaluate((el) => { const r = el.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2] })
  const samples = []
  for (let i = 0; i < 4; i++) { samples.push(await hub()); await motion.waitForTimeout(700) }
  const drift = Math.max(...samples.map(([x, y]) => Math.hypot(x - samples[0][0], y - samples[0][1])))
  report.push({ id: 'rotor-hub-drift-px', drift })
  assert.ok(drift < 1.5, `turbine hub wobbles ${drift.toFixed(1)}px`)
  await motion.locator('.storage-controls button').nth(1).click()
  assert.equal(await motion.locator('.power-storage-scene').getAttribute('data-mode'), 'supply')
  await motion.waitForTimeout(450)
  assert.equal(await motion.locator('.flow-path--grid').evaluate((el) => getComputedStyle(el).opacity), '1')
  await motion.locator('.storage-controls button').nth(0).click()
  await motion.screenshot({ path: `${out}/motion-storage.png` })

  await go(motion, scenes[1][1])
  await motion.waitForTimeout(1200)
  await motion.locator('.backup-scenario').nth(2).click()
  await motion.locator('.backup-sequence-button').click()
  await motion.waitForTimeout(2300)
  assert.equal(await motion.locator('.distributed-power-scene').getAttribute('data-power-stage'), 'restored')
  assert.equal(await motion.locator('.backup-scenario[data-selected="true"]').getAttribute('data-power-state'), 'restored')
  await motion.screenshot({ path: `${out}/motion-distributed.png` })
  await motion.locator('.backup-sequence-button').click()
  assert.equal(await motion.locator('.distributed-power-scene').getAttribute('data-power-stage'), 'normal')

  await go(motion, scenes[2][1])
  await motion.waitForTimeout(1800)
  await motion.screenshot({ path: `${out}/motion-cofiring.png` })
  await motion.close()

  assert.deepEqual(errors, [], 'console errors')
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log(`Batch 4 browser QA passed: scenes ${scenes.map(([, n]) => n).join(', ')}, ${report.length - 1} viewport/language cases, fit above controls, no label collisions, entrance, rotor pivot, mode switch, backup sequence, no console errors.`)
} catch (error) {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.error(errors)
  throw error
} finally {
  await browser.close()
}
