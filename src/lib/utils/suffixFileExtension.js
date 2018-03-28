const cache = {}

/*doc
  suffixFileExtension
  add fileExtension to str if there's no fileExtension

  suffixFileExtension('filename.md', 'md') => 'filename.md'
  suffixFileExtension('filename', 'md') => 'filename.md'
*/
const suffixFileExtension = (str, fileExtension) => {
  let cacheKey = str + fileExtension

  if (!cache[cacheKey]) {
    let suffixStr = '.' + fileExtension
    let strArr = str.split(suffixStr)
    if (strArr[strArr.length - 1] !== '') strArr[strArr.length] = ''
    cache[cacheKey] = strArr.join(suffixStr)
  }

  return cache[cacheKey]
}

export default suffixFileExtension
