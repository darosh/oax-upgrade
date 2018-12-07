#!/usr/bin/env node

/* eslint-disable no-new-func */

const { sync: mkdirpSync } = require('mkdirp')
const rimraf = require('rimraf')
const puppeteer = require('puppeteer')
const cfg = require('./screenshots.json')
const progress = require('cli-progress')

const TARGET = process.argv[2]
const BASE = process.argv[3]
const SIZES = process.argv[4]
const headless = !process.argv[5]

// let about = true

if (SIZES) {
  const pick = SIZES.split(',')

  Object.keys(cfg.screens).map(k => {
    if (pick.indexOf(k) === -1) {
      delete cfg.screens[k]
    }
  })
}

mkdirpSync(`${TARGET}/images`)

if (headless) {
  rimraf.sync(`${TARGET}/images/**/*.png`)
}

const bar = new progress.Bar({
  etaBuffer: 8,
  barsize: 10,
  hideCursor: true,
  format: '[{bar}] {percentage}% | {eta}s | {value}/{total} | {duration}s | {item}'
}, progress.Presets.rect)

;(async () => {
  let counter = 0
  const total = Object.keys(cfg.screens).length * cfg.shots.length * Object.keys(cfg.themes).length

  bar.start(total, counter, { item: 'Browser launching' })

  const browser = await puppeteer.launch({ headless, args: ['--no-sandbox', '--disable-setuid-sandbox'] })

  bar.update(counter, { item: 'Page opening' })

  // let page = await browser.newPage()
  let page = (await browser.pages())[0]

  for (const screen in cfg.screens) {
    bar.update(counter, { item: `${screen}` })

    await page.goto('about:blank')
    await page.setViewport({ width: cfg.screens[screen][0], height: cfg.screens[screen][1], deviceScaleFactor: 1 })

    let index = 0

    for (const shot in cfg.shots) {
      const s = cfg.shots[shot]

      bar.update(counter, { item: `${screen}-${shot}-${s.title}` })

      if (s.evalBefore) {
        await page.evaluate(s.evalBefore)
      }

      if (s.url) {
        await page.goto(`${BASE}/#${s.url}`, { waitUntil: 'networkidle2' })
        await page.evaluate('location.href')
        // about = false

        if (cfg.before) {
          await page.evaluate(new Function(cfg.before))
        }
      }

      if (s.wait) {
        await page.waitFor(s.wait)
      }

      if (s.waitPreEvalFnc) {
        await page.waitFor(new Function(s.waitPreEvalFnc))
      }

      if (s.eval) {
        await page.evaluate(s.eval)
      }

      if (s.waitEval) {
        await page.waitFor(s.waitEval)
      }

      if (s.waitFnc) {
        await page.waitFor(new Function(s.waitFnc))
      }

      if (s.skip) {
        continue
      }

      index++

      for (const theme in cfg.themes) {
        counter++
        await page.evaluate(new Function(cfg.themes[theme].eval))
        const path = imagePath(theme, screen, s.title, index)
        const item = `${screen}-${shot}-${s.title}-${theme}`

        if (process.stderr.isTTY) {
          bar.update(counter, { item })
        } else {
          console.log(`${counter}/${total}`, item)
        }

        if (headless) {
          await page.screenshot({ path })
        }
      }

      if (s.evalAfter) {
        await page.evaluate(s.evalAfter)
      }
    }

    // await page.goto('about:blank')
    // about = true
  }

  if (headless) {
    browser.close()
  }

  bar.update(counter, { item: '' })
  bar.stop()
})()

function imagePath (theme, screen, shot, index) {
  return `${TARGET}/images/${theme}_${screen}_${index < 10
    ? '0' + index
    : index}_${shot}.png`
}
