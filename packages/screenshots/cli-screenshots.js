#!/usr/bin/env node

/* eslint-disable no-new-func */

const rimraf = require('rimraf')
const puppeteer = require('puppeteer')
const cfg = require('./screenshots.json')

const TARGET = process.argv[2]
const BASE = process.argv[3]
const SIZES = process.argv[4]

let about = true

if (SIZES) {
  const pick = SIZES.split(',')

  Object.keys(cfg.screens).map(k => {
    if (pick.indexOf(k) === -1) {
      delete cfg.screens[k]
    }
  })
}

rimraf.sync(`${TARGET}/images/**/*.png`)

function imagePath (theme, screen, shot, index) {
  console.log(screen, `${index < 10 ? '0' + index : index}`, shot, theme)
  return `${TARGET}/images/${theme}_${screen}_${index < 10
    ? '0' + index
    : index}_${shot}.png`
}

;(async () => {
  const browser = await puppeteer.launch()

  let page = await browser.newPage()

  for (const screen in cfg.screens) {
    await page.setViewport(
      { width: cfg.screens[screen][0], height: cfg.screens[screen][1] })

    let index = 0

    for (const shot in cfg.shots) {
      const s = cfg.shots[shot]

      if (s.evalBefore) {
        await page.evaluate(s.evalBefore)
      }

      if (s.url) {
        // await page.goto('about:url')
        await page.goto(BASE + s.url, { waitUntil: 'networkidle2' })
        about = false

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
        await page.evaluate(new Function(cfg.themes[theme].eval))
        const path = imagePath(theme, screen, s.title, index)
        console.log(path)
        await page.screenshot({ path })
      }

      if (s.evalAfter) {
        await page.evaluate(s.evalAfter)
      }
    }

    await page.goto('about:blank')
    about = true
  }

  browser.close()
})()
