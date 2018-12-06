#!/usr/bin/env node

const simpleGit = require('simple-git/promise')
let git = simpleGit()
const { move } = require('fs-extra')
const { promisify } = require('util')
const moveAsync = promisify(move)
const globby = require('globby')
const del = require('del')

;(async () => {
  const status = await git.getRemotes(true)
  const fetch = status[0].refs.fetch
  await git.clone(fetch, 'screenshots-repo', '-n')
  git = simpleGit('screenshots-repo')

  const branch = await git.branch()
  const is = branch.all.find(d => d.includes('/screenshots'))

  if (is) {
    await git.checkoutBranch('screenshots', 'origin/screenshots')

    await require('./screenshots-compare')('./screenshots/images', './screenshots-repo/images')

    process.exit()
  } else {
    await git.checkout(['--orphan', 'screenshots'])
    await git.raw(['rm', '--cached', '-r', '*'])
  }

  await del([
    'screenshots-repo/**/*',
    '!screenshots-repo',
    '!screenshots-repo/.git',
    '!screenshots-repo/diff',
    '!screenshots-repo/.git/**/*',
    '!screenshots-repo/diff/**/*'
  ], { dot: true })

  const files = (await globby('screenshots')).map(d => d.replace(/^screenshots\//, ''))

  for (const file of files) {
    await moveAsync(`screenshots/${file}`, `screenshots-repo/${file}`, { overwrite: true })
  }

  await git.add(['-f'].concat(files))
  await git.commit(`Screenshots ${(new Date()).toISOString()}`)
  await git.push(fetch, 'screenshots')
})()
