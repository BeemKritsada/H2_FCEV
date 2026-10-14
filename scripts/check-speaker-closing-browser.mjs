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
const out = 'tmp/speaker-closing/qa'
const speaker = JSON.parse(await readFile('src/content/speaker.json', 'utf8'))
const config = await readFile('src/scenes/scene-config.ts', 'utf8')
const sceneIds = [...config.matchAll(/id: '(scene-[a-z0-9-]+)'/g)].map(([, id]) => id)
const position = sceneIds.indexOf('scene-closing') + 1
assert.equal(position, sceneIds.length, 'speaker closing is the last scene')
const errors = [], report = []
const listen = (target) => {
  target.on('pageerror', (error) => errors.push(error.message))
  target.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
}
const go = async (target) => {
  await target.locator('.scene-picker').click()
  await target.locator('.scene-overview__item').nth(position - 1).click()
  await target.locator('.speaker-closing #scene-title').waitFor()
}
const lang = (target, language) => target.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
await mkdir(out, { recursive: true })

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
listen(page)
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1792, 891], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      await go(page)
      await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.speaker-closing img').decode() })
      // The speaker block is identical in both languages.
      assert.equal(await page.locator('.speaker-closing h1').textContent(), speaker.nameTh)
      assert.equal(await page.locator('.speaker-closing__name-en').textContent(), speaker.nameEn)
      assert.deepEqual(await page.locator('.speaker-closing__positions li').allTextContents(), speaker.positions)
      const result = await page.evaluate(() => {
        const section = document.querySelector('.speaker-closing')
        const img = section.querySelector('img')
        const r = img.getBoundingClientRect(), copy = section.querySelector('.speaker-closing__copy').getBoundingClientRect()
        const controls = document.querySelector('.presentation-controls')?.getBoundingClientRect()
        const texts = [...section.querySelectorAll('h1, p, li')].map((el) => el.getBoundingClientRect())
        const overlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
        return {
          src: img.currentSrc, natural: [img.naturalWidth, img.naturalHeight], shown: [Math.round(r.width), Math.round(r.height)],
          ratioError: Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight),
          textOnPhoto: texts.filter((t) => overlap(t, r)).length,
          photoRightGap: Math.round(innerWidth - r.right), photoBottom: r.bottom, copyBottom: copy.bottom,
          controlsTop: controls?.top ?? innerHeight, sectionBottom: section.getBoundingClientRect().bottom,
          horizontal: document.documentElement.scrollWidth > innerWidth + 1,
          clipped: [...section.querySelectorAll('h1, p, li')].filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent.slice(0, 30)),
        }
      })
      const id = `${width}x${height}-${language}`
      await page.screenshot({ path: `${out}/${id}.png`, fullPage: width < 800 })
      report.push({ id, ...result })
      assert.ok(result.src.endsWith('speaker/thibodee-harnprasert.jpg'), `${id}: real photo`)
      assert.deepEqual(result.natural, [1030, 954])
      assert.ok(result.ratioError < 0.01, `${id}: photo proportions preserved`)
      assert.equal(result.textOnPhoto, 0, `${id}: text over the portrait`)
      assert.equal(result.horizontal, false, `${id}: horizontal overflow`)
      assert.deepEqual(result.clipped, [], `${id}: clipped text`)
      if (width > 1100) {
        assert.ok(result.shown[1] >= 380, `${id}: portrait too small (${result.shown[1]}px)`)
        assert.ok(result.photoRightGap >= 40, `${id}: portrait too close to the edge`)
        assert.ok(result.sectionBottom <= result.controlsTop + 1, `${id}: runs under the controls`)
      }
    }
  }

  // Motion order: backdrop → portrait → name → positions → thank you, then everything settles.
  const motion = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  listen(motion)
  await motion.goto(base)
  await go(motion)
  const sample = () => motion.evaluate(() => Object.fromEntries(['portrait', 'identity', 'position', 'thanks'].map((key) => [key, Number(getComputedStyle(document.querySelector(`[data-closing="${key}"]`)).opacity).toFixed(2)])))
  const early = await sample()
  await motion.waitForTimeout(900)
  const middle = await sample()
  await motion.waitForTimeout(2600)
  const settled = await sample()
  report.push({ id: 'motion', early, middle, settled })
  assert.ok(Number(middle.portrait) > Number(middle.thanks), 'portrait before thank you')
  assert.equal(middle.thanks, '0.00', 'thank you appears last')
  assert.deepEqual(Object.values(settled), ['1.00', '1.00', '1.00', '1.00'])
  await motion.screenshot({ path: `${out}/motion-settled.png` })
  await motion.close()

  assert.deepEqual(errors, [], 'console errors')
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log(`Speaker closing QA passed: scene ${position}/${sceneIds.length}, ${report.length - 1} viewport/language cases, real photo at natural proportions, identical TH/EN speaker block, no text over the portrait, staged entrance, no console errors.`)
} catch (error) {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.error(errors)
  throw error
} finally {
  await browser.close()
}
