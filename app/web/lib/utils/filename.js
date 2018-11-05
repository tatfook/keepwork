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

export {
  getBareFilename,
  getFileExt
}
