#!/usr/bin/env node

const rimraf = require('rimraf')
const {sync: mkdirpSync} = require('mkdirp')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const template = require('lodash.template')
const cfg = require('./screenshots.json')
const resolveDir = dir => resolve(__dirname, dir)

const TARGET = process.argv[2]
const SIZES = process.argv[3]

if (SIZES) {
  const pick = SIZES.split(',')

  Object.keys(cfg.screens).map(k => {
    if (pick.indexOf(k) === -1) {
      delete cfg.screens[k]
    }
  })
}

mkdirpSync(TARGET)

rimraf.sync(`${TARGET}/**/*.md`)

const tmpl = readFileSync(resolveDir('screenshots.md'), 'utf8')
const tmplIndex = readFileSync(resolveDir('screenshots_index.md'), 'utf8')
const tmplShot = readFileSync(resolveDir('screenshot.md'), 'utf8')

const compiled = template(tmpl)
const compiledIndex = template(tmplIndex)
const compiledShot = template(tmplShot)
const files = []

function path (theme, screen, shot, index) {
  return `./images/${theme}_${screen}_${index < 10
    ? '0' + index
    : index}_${shot}.png`
}

for (const theme in cfg.themes) {
  for (const screen in cfg.screens) {
    const size = cfg.screens[screen]
    let index = 0

    const screens = []

    for (const shot in cfg.shots) {
      const s = cfg.shots[shot]

      if (s.skip) {
        continue
      }

      index++

      screens.push({
        title: s.title,
        path: path(theme, screen, s.title, index)
      })
    }

    writeFileSync(`${TARGET}/${theme}-${screen}.md`, compiled({
      screen,
      size,
      theme,
      screens
    }))

    files[theme] = files[theme] || []
    files[theme][screen] = `${theme}-${screen}.md`
  }
}

const shots = cfg.shots.filter(v => !v.skip)

shots.forEach((shot, index) => {
  writeFileSync(
    `${TARGET}/${(index + 1) < 10 ? '0' + (index + 1) : (index +
      1)}_${shot.title}.md`, compiledShot({
      index,
      shot,
      shots,
      screens: cfg.screens,
      themes: cfg.themes
    }))
})

writeFileSync(`${TARGET}/README.md`, compiledIndex({
  files,
  themes: cfg.themes,
  screens: cfg.screens,
  shots: shots.map(v => v.title)
}))
