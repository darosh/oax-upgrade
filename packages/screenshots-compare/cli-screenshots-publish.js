#!/usr/bin/env node

const simpleGit = require('simple-git/promise')
let git = simpleGit()
const { copy, pathExists } = require('fs-extra')
const { promisify } = require('util')
const copyAsync = promisify(copy)
const globby = require('globby')
const del = require('del')
const compare = require('./screenshots-compare')

;(async () => {
  const status = await git.getRemotes(true)
  let fetch = status[0].refs.fetch

  if (!await pathExists('screenshots-repo')) {
    await git.clone(fetch, 'screenshots-repo', '-n')
  }

  git = simpleGit('screenshots-repo')

  const branch = await git.branch()
  const hasScreenshotsRemote = branch.all.find(d => d.includes('/screenshots'))

  if (hasScreenshotsRemote) {
    try {
      await git.checkoutBranch('screenshots', 'origin/screenshots')
    } catch (error) {
    }

    const useBase = await pathExists('screenshots-repo/images_base')
    await del(['screenshots-repo/images_diff'])
    const oldShots = useBase ? './screenshots-repo/images_base' : './screenshots-repo/images'
    await compare('./screenshots/images', oldShots)
  } else {
    await git.checkout(['--orphan', 'screenshots'])
    await git.raw(['rm', '--cached', '-r', '*'])
  }

  await del([
    'screenshots-repo/**/*',
    '!screenshots-repo',
    '!screenshots-repo/.git',
    '!screenshots-repo/images_diff',
    '!screenshots-repo/.git/**/*',
    '!screenshots-repo/images_diff/**/*'
  ], { dot: true })

  const files = (await globby('screenshots')).map(d => d.replace(/^screenshots\//, ''))

  for (const file of files) {
    await copyAsync(`screenshots/${file}`, `screenshots-repo/${file}`, { overwrite: true })
  }

  const diffs = (await globby('screenshots-repo/images_diff/**/*'))
    .map(d => d.replace(/^screenshots-repo\//, ''))

  await git.add(['-f'].concat(files).concat(diffs))
  await git.commit(`Screenshots ${(new Date()).toISOString()}`)

  if (process.env.GH_TOKEN) {
    fetch = fetch.replace('https://', `https://${process.env.GH_TOKEN}@`)
  }

  await git.push(fetch, 'screenshots')
})()
