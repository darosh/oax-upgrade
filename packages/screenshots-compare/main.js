import { unlink, copyFile } from 'fs'
import looksSameCb from 'looks-same'
import globCb from 'glob'
import { promisify } from 'util'
import { join, relative, dirname } from 'path'
import mkdirp from 'async-mkdirp'

const glob = promisify(globCb)
const createDiff = promisify(looksSameCb.createDiff)
const looksSame = promisify(looksSameCb)

const newDir = process.argv[2]
const oldDir = process.argv[3]

const compareOptions = { ignoreCaret: true, ignoreAntialiasing: true, antialiasingTolerance: 5, strict: false }

glob(join(oldDir, '**/*.png')).then(async files => {
  const newFiles = await getNewFiles(files)
  newFiles.forEach(file => console.log(`new: ${file}`))

  let updated = 0
  let deleted = 0
  let same = 0

  for (const oldFile of files) {
    const oldRelative = relative(oldDir, oldFile)
    const newFile = join(newDir, oldRelative)
    const isUpdated = await imageUpdated(oldFile, newFile)

    if (isUpdated) {
      updated++
      console.log(`updated: ${oldRelative}`)
      const diff = join(`${newDir}_diff`, oldRelative)
      await mkdirp(dirname(diff))
      await createDiff(Object.assign({
        reference: oldFile,
        current: newFile,
        diff,
        highlightColor: '#ff00ff'
      }, compareOptions))

      copyFile(newFile, oldFile, () => {})
    } else if (isUpdated === null) {
      deleted++
      console.log(`deleted: ${oldRelative}`)
      unlink(oldFile, () => {})
    } else {
      console.log(`same: ${oldRelative}`)
      same++
    }
  }

  console.log(`${newFiles.length} new`)
  console.log(`${updated} updated`)
  console.log(`${same} same`)
  console.log(`${deleted} deleted`)
})

function imageUpdated (oldFile, newFile) {
  return looksSame(oldFile, newFile, compareOptions)
    .then(equal => !equal)
    .catch(() => null)
}

function getNewFiles (oldFiles) {
  const oldRelatives = oldFiles.map(file => relative(oldDir, file))

  return glob(join(newDir, '**/*.png')).then(files => files
    .map(file => relative(newDir, file))
    .filter(file => oldRelatives.indexOf(file) === -1))
}