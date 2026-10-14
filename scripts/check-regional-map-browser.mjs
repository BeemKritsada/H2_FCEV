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
const out = 'tmp/regional-map/qa'
const config = await readFile('src/scenes/scene-config.ts', 'utf8')
const sceneIds = [...config.matchAll(/id: '(scene-[a-z0-9-]+)'/g)].map(([, id]) => id)
const position = sceneIds.indexOf('scene-regional-map') + 1
assert.ok(position > 0, 'scene registered')
assert.equal(sceneIds.at(-1), 'scene-closing', 'closing stays last')
assert.equal(sceneIds.at(-2), 'scene-regional-map', 'regional map sits just before closing')
const facts = JSON.parse(await readFile('src/content/regional-map-facts.json', 'utf8'))
const locales = Object.fromEntries(await Promise.all(['en', 'th'].map(async (lang) => [lang, JSON.parse(await readFile(`src/content/${lang}/regional-map.json`, 'utf8'))])))
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
const selector = (target, index) => target.locator('.rmap-selectors button').nth(index + 1)
await mkdir(out, { recursive: true })

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
listen(page)
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      await go(page, position)
      await page.locator('.rmap-svg path').first().waitFor()
      assert.equal(await page.locator('.rmap-svg path').count(), 33, '31 provinces + HK + Macao')
      assert.equal(await page.locator('.rmap-selectors button').count(), 6)
      assert.equal(await page.locator('#scene-title').textContent(), locales[language].title)
      for (let index = -1; index < 5; index++) {
        const region = facts.regions[index]
        if (index < 0) await page.locator('.rmap-selectors__overview').click()
        else await selector(page, index).click()
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('.rmap-scene img')].map((img) => img.decode().catch(() => {}))) })
        const state = region?.id ?? 'overview'
        assert.equal(await page.locator('.rmap-scene').getAttribute('data-active-region'), state)
        if (region) {
          assert.equal(await page.locator('.rmap-panel h2').textContent(), locales[language].regions[region.id].name)
          assert.equal(await page.locator('.rmap-panel__body').textContent(), locales[language].regions[region.id].body)
          assert.equal(await page.locator('.rmap-city').count(), region.cities.length)
          assert.equal(await page.locator('.rmap-svg path[data-state="active"]').count(), region.provinces.length + (region.contextProvinces?.length ?? 0))
        } else {
          assert.equal(await page.locator('.rmap-city').count(), 0)
          assert.equal(await page.locator('.rmap-badge').count(), 5)
        }
        if (state === 'gba') assert.equal(await page.locator('.rmap-stat .animated-number__tick').textContent(), '69')
        if (state === 'yrd') {
          assert.equal(await page.locator('.rmap-svg path[data-province="shandong"]').getAttribute('data-state'), 'none', 'Shandong not shaded as YRD')
          assert.equal(await page.locator('.rmap-city[data-external]').count(), 2)
        }
        const result = await page.evaluate(() => {
          const section = document.querySelector('.rmap-scene')
          const map = section.querySelector('.rmap-map').getBoundingClientRect()
          const panel = section.querySelector('.rmap-panel')
          const labels = [...section.querySelectorAll('.rmap-city__label, .rmap-province-label, .rmap-area-label, .rmap-badge__tag')].map((el) => ({ text: el.textContent, r: el.getBoundingClientRect() }))
          const cityLabels = [...section.querySelectorAll('.rmap-city__label, .rmap-city__dot')].map((el) => ({ text: el.textContent || 'dot', r: el.getBoundingClientRect() }))
          const overlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
          const collisions = []
          const textLabels = labels.filter(({ text }) => text)
          textLabels.forEach((a, i) => textLabels.slice(i + 1).forEach((b) => { if (overlap(a.r, b.r)) collisions.push(`${a.text} × ${b.text}`) }))
          cityLabels.filter(({ text }) => text !== 'dot').forEach((a) => cityLabels.filter(({ text }) => text === 'dot').forEach((b) => { if (overlap(a.r, b.r)) collisions.push(`${a.text} × dot`) }))
          const controls = document.querySelector('.presentation-controls')?.getBoundingClientRect()
          return {
            horizontal: document.documentElement.scrollWidth > innerWidth + 1,
            outsideMap: textLabels.filter(({ text }) => !/^0\d$/.test(text)).filter(({ r }) => r.left < map.left - 1 || r.right > map.right + 1 || r.top < map.top - 1 || r.bottom > map.bottom + 1).map(({ text }) => text),
            collisions,
            panelScroll: panel.scrollHeight - panel.clientHeight,
            clipped: [...section.querySelectorAll('h1,h2,p,.rmap-selectors button,.rmap-overview-list button,.rmap-back,.rmap-apps li')].filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent.slice(0, 30)),
            missing: [...section.querySelectorAll('img')].filter((img) => !img.complete || !img.naturalWidth).map((img) => img.src),
            mapSize: [Math.round(map.width), Math.round(map.height)],
            sourceBottom: section.querySelector('.rmap-source').getBoundingClientRect().bottom, controlsTop: controls?.top ?? innerHeight,
          }
        })
        const name = `${width}x${height}-${language}-${state}`
        await page.screenshot({ path: `${out}/${name}.png`, fullPage: width < 800 })
        report.push({ name, ...result })
        assert.equal(result.horizontal, false, `${name}: horizontal overflow`)
        assert.deepEqual(result.missing, [], `${name}: missing images`)
        assert.deepEqual(result.clipped, [], `${name}: clipped text`)
        if (state !== 'overview') assert.deepEqual(result.outsideMap, [], `${name}: labels outside map`)
        if (state !== 'overview') assert.deepEqual(result.collisions, [], `${name}: label collisions`)
        if (width > 1100) {
          assert.ok(result.panelScroll <= 2, `${name}: panel overflows by ${result.panelScroll}px`)
          assert.ok(result.sourceBottom <= result.controlsTop + 1, `${name}: footer under controls`)
        }
      }
    }
  }

  // Language switch keeps the selected region and the panel without replaying the entrance.
  await page.setViewportSize({ width: 1440, height: 900 })
  await lang(page, 'en')
  await go(page, position)
  await selector(page, 2).click()
  await lang(page, 'th')
  assert.equal(await page.locator('.rmap-scene').getAttribute('data-active-region'), 'yrd')
  assert.equal(await page.locator('.rmap-panel h2').textContent(), locales.th.regions.yrd.name)
  assert.equal(await page.locator('.rmap-city__label').first().textContent(), locales.th.cities.shanghai)
  await lang(page, 'en')

  // Neighbouring scenes still navigate normally.
  await page.evaluate(() => document.activeElement?.blur())
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(400)
  assert.notEqual(await page.locator('.rmap-scene').count(), 1, 'previous scene')
  await page.keyboard.press('ArrowRight')
  await page.locator('.rmap-scene').waitFor()
  await page.evaluate(() => document.activeElement?.blur())
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(400)
  assert.equal(await page.locator('.rmap-scene').count(), 0, 'closing after map')
  await page.locator('.scene-picker').click()
  assert.equal(await page.locator('.scene-overview__item').count(), sceneIds.length)
  await page.keyboard.press('Escape')

  // Full motion: count-up once, rapid selections settle on the last region, overview zooms back out.
  const motion = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  listen(motion)
  await motion.goto(base)
  await lang(motion, 'en')
  await go(motion, position)
  await motion.locator('.rmap-svg path').first().waitFor()
  const overviewTransform = await motion.locator('.rmap-svg g').getAttribute('transform')
  await selector(motion, 0).click()
  await motion.waitForTimeout(700)
  const midCount = await motion.locator('.rmap-stat .animated-number__tick').textContent()
  await motion.waitForTimeout(1600)
  assert.equal(await motion.locator('.rmap-stat .animated-number__tick').textContent(), '69')
  report.push({ name: 'count-up', midCount })
  await motion.screenshot({ path: `${out}/motion-gba.png` })
  for (let round = 0; round < 3; round++) for (let index = 0; index < 5; index++) await selector(motion, index).click({ delay: 0 })
  await selector(motion, 3).click()
  await motion.waitForTimeout(1600)
  assert.equal(await motion.locator('.rmap-scene').getAttribute('data-active-region'), 'cc')
  assert.equal(await motion.locator('.rmap-city').count(), 2)
  const opacities = await motion.locator('.rmap-city').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))
  assert.deepEqual(opacities, ['1', '1'], 'markers fully revealed after rapid clicks')
  await selector(motion, 0).click()
  await motion.waitForTimeout(1600)
  assert.equal(await motion.locator('.rmap-stat .animated-number__tick').textContent(), '69', 'no replay on revisit')
  await motion.locator('.rmap-back').click()
  await motion.waitForTimeout(1400)
  assert.equal(await motion.locator('.rmap-svg g').getAttribute('transform'), overviewTransform, 'overview restores national camera')
  await motion.locator('.rmap-badge').nth(1).locator('.rmap-badge__tag').click()
  await motion.waitForTimeout(1700)
  assert.deepEqual(await motion.locator('.rmap-city').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity)), ['1', '1', '1', '1', '1'], 'all five JJJ cities revealed')
  assert.equal(await motion.locator('.rmap-scene').getAttribute('data-active-region'), 'jjj', 'map badge selects region')
  await motion.screenshot({ path: `${out}/motion-jjj.png` })
  await motion.close()

  assert.deepEqual(errors, [], 'console errors')
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log(`Regional map QA passed: scene ${position}/${sceneIds.length}, ${report.length - 1} viewport/language/state cases, language persistence, navigation, count-up, rapid selection, overview reset, no console errors.`)
} catch (error) {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.error(errors)
  throw error
} finally {
  await browser.close()
}
