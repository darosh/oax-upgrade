#!/usr/bin/env node

const simpleGit = require('simple-git/promise')
let git = simpleGit()
const { copy, pathExists } = require('fs-extra')
const { promisify } = require('util')
const copyAsync = promisify(copy)
const globby = require('globby')
const del = require('del')

;(async () => {
  const status = await git.getRemotes(true)
  const fetch = status[0].refs.fetch

  if (!await pathExists('screenshots-repo')) {
    await git.clone(fetch, 'screenshots-repo', '-n')
  }

  git = simpleGit('screenshots-repo')

  const branch = await git.branch()
  const is = branch.all.find(d => d.includes('/screenshots'))

  if (is) {
    console.log('remote exists')
    try {
      await git.checkoutBranch('screenshots', 'origin/screenshots')
    } catch (error) {
    }

    await del(['screenshots-repo/images_diff'])
    await require('./screenshots-compare')('./screenshots/images', './screenshots-repo/images')
  } else {
    console.log('creating new')
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

  const diffs = (await globby('screenshots-repo/images_diff/**/*')).map(d => d.replace(/^screenshots-repo\//, ''))

  await git.add(['-f'].concat(files).concat(diffs))
  await git.commit(`Screenshots ${(new Date()).toISOString()}`)
  await git.push(fetch, 'screenshots')
})()
