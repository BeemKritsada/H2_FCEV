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
const out = 'tmp/executive-hero/qa'
const copy = Object.fromEntries(await Promise.all(['en', 'th'].map(async (lang) => [lang, JSON.parse(await readFile(`src/content/${lang}/opening-hero.json`, 'utf8'))])))
const year = { en: 'Presentation Reference Year: 2026', th: 'ปีอ้างอิงการนำเสนอ: 2026' }
const errors = [], report = []
const listen = (target) => {
  target.on('pageerror', (error) => errors.push(error.message))
  target.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
}
const lang = (target, language) => target.locator('.language-toggle__option').filter({ hasText: language.toUpperCase() }).click()
await mkdir(out, { recursive: true })

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
listen(page)
try {
  await page.goto(base)
  for (const [width, height] of [[1920, 1080], [1440, 900], [1366, 768], [390, 844]]) {
    await page.setViewportSize({ width, height })
    for (const language of ['en', 'th']) {
      await lang(page, language)
      await page.locator('.executive-hero').waitFor()
      await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.executive-hero__truck').decode() })
      assert.equal(await page.locator('.executive-hero__name').textContent(), 'H2 FCEV')
      assert.equal(await page.locator('.executive-hero__subtitle').textContent(), copy[language].subtitle)
      assert.equal(await page.locator('.executive-hero__support').textContent(), copy[language].support)
      assert.equal(await page.locator('.opening-reference-year').textContent(), year[language])
      assert.deepEqual(await page.locator('.executive-hero__theme > span').allTextContents(), Object.values(copy[language].themes))
      const r = await page.evaluate(() => {
        const box = (s) => document.querySelector(s).getBoundingClientRect()
        const section = box('.executive-hero'), name = box('.executive-hero__name'), copy = box('.executive-hero__copy'), truck = box('.executive-hero__truck')
        const img = document.querySelector('.executive-hero__truck')
        const controls = document.querySelector('.presentation-controls')?.getBoundingClientRect()
        const texts = [...document.querySelectorAll('.executive-hero__copy p, .executive-hero__copy h1 span, .executive-hero__theme')].map((el) => el.getBoundingClientRect())
        const overlap = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1
        return {
          horizontal: document.documentElement.scrollWidth > innerWidth + 1,
          vertical: document.documentElement.scrollHeight > innerHeight + 1,
          nameWithinCopy: name.right <= copy.right + 1 && name.width <= copy.width + 1,
          ratioError: Math.abs(truck.width / truck.height - img.naturalWidth / img.naturalHeight),
          truck: [Math.round(truck.width), Math.round(truck.height)], truckOnText: texts.filter((t) => overlap(t, truck)).length,
          sectionBottom: section.bottom, controlsTop: controls?.top ?? innerHeight,
          fontName: parseFloat(getComputedStyle(document.querySelector('.executive-hero__name')).fontSize),
          fontSubtitle: parseFloat(getComputedStyle(document.querySelector('.executive-hero__subtitle')).fontSize),
          clipped: [...document.querySelectorAll('.executive-hero h1 span, .executive-hero p, .executive-hero__theme')].filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent),
        }
      })
      const id = `${width}x${height}-${language}`
      await page.screenshot({ path: `${out}/${id}.png`, fullPage: width < 800 })
      report.push({ id, ...r })
      assert.equal(r.horizontal, false, `${id}: horizontal overflow`)
      assert.ok(r.nameWithinCopy, `${id}: title overflows its column`)
      assert.ok(r.ratioError < 0.01, `${id}: truck distorted`)
      assert.equal(r.truckOnText, 0, `${id}: truck overlaps text`)
      assert.deepEqual(r.clipped, [], `${id}: clipped text`)
      if (width > 1100) {
        assert.equal(r.vertical, false, `${id}: vertical scroll`)
        assert.ok(r.sectionBottom <= r.controlsTop + 1, `${id}: hero under the controls`)
        assert.ok(r.fontName >= 100 && r.fontName <= 145, `${id}: title size ${r.fontName}`)
        assert.ok(r.fontSubtitle >= 40 && r.fontSubtitle <= 58, `${id}: subtitle size ${r.fontSubtitle}`)
        assert.ok(r.truck[0] >= 600, `${id}: truck too small (${r.truck[0]}px)`)
      }
    }
  }

  // Entrance order and settling, then a calm static composition.
  const motion = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  listen(motion)
  await motion.goto(base)
  await motion.locator('.executive-hero').waitFor()
  const sample = () => motion.evaluate(() => Object.fromEntries(['label', 'title', 'subtitle', 'truck', 'support', 'theme'].map((key) => [key, Number(getComputedStyle(document.querySelector(`[data-hero="${key}"]`)).opacity).toFixed(2)])))
  await motion.waitForTimeout(450)
  const early = await sample()
  await motion.waitForTimeout(2200)
  const settled = await sample()
  const transformA = await motion.locator('.executive-hero__truck').evaluate((el) => getComputedStyle(el).transform)
  await motion.waitForTimeout(1200)
  const transformB = await motion.locator('.executive-hero__truck').evaluate((el) => getComputedStyle(el).transform)
  report.push({ id: 'motion', early, settled })
  assert.ok(Number(early.label) > Number(early.truck), 'label before truck')
  assert.equal(early.theme, '0.00', 'themes last')
  assert.deepEqual(Object.values(settled), ['1.00', '1.00', '1.00', '1.00', '1.00', '1.00'])
  assert.equal(transformA, transformB, 'truck stays still after entrance')
  await motion.screenshot({ path: `${out}/motion-settled.png` })
  await motion.locator('.navigation-button--next').click()
  await motion.locator('#scene-title').waitFor()
  assert.equal(await motion.locator('.executive-hero').count(), 0, 'next scene button still advances')
  await motion.close()

  assert.deepEqual(errors, [], 'console errors')
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.log(`Executive hero QA passed: ${report.length - 1} viewport/language cases, exact TH/EN copy, no overflow, undistorted truck, staged entrance, static after entrance, navigation, no console errors.`)
} catch (error) {
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2))
  console.error(errors)
  throw error
} finally {
  await browser.close()
}
