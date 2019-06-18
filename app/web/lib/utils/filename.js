const getBareFilename = filename => {
  let filenames = filename.split('.')
  filenames.pop()
  return filenames.join('.')
}

const getFileExt = file => {
  let { filename, type } = file
  filename = filename || file.name
  let ext = /.+\./.test(filename) ? filename.split('.').pop() : type
  ext = (ext || '').toLowerCase()
  return ext
}

const getFileSizeText = (bite = 0) => {
  let KBVal = (bite / 1024)
    .toFixed(2)
    .toString()
    .replace(/\.*0*$/, '')
  let MBVal = (bite / 1024 / 1024)
    .toFixed(2)
    .toString()
    .replace(/\.*0*$/, '')
  let GBVal = (bite / 1024 / 1024 / 1024)
    .toFixed(2)
    .toString()
    .replace(/\.*0*$/, '')
  return KBVal < 100 ? `${KBVal}KB` : MBVal < 100 ? `${MBVal}MB` : `${GBVal}GB`
}

export { getBareFilename, getFileExt, getFileSizeText }
