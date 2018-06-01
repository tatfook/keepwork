import _ from 'lodash'

export const EMPTY_GIT_FOLDER_KEEPER = '.gitignore.md'
export const CONFIG_FOLDER_NAME = '_config'

let protocol = location && location.protocol ? location.protocol : 'http:'
export const webTemplateProject = {
  rawBaseUrl: `${protocol}//git.keepwork.com`,
  dataSourceUsername: 'gitlab_rls_official',
  projectName: 'keepwork-template-v2',
  projectId: 36332,
  configFullPath: 'config.json'
}

/*doc
  # gitTree2NestedArray

  git tree results => nested array with children as key
*/

export const gitTree2NestedArray = (files, rootPath) => {
  let keysSeperator = '<~>'
  let temporaryChildrenKey = '<~children~>'
  let treeWithChildren = {}

  files.forEach(file => {
    if (file.path.indexOf(rootPath) !== 0 || file.path === rootPath) return
    let setKeys = file.path
      .substr(rootPath.length + 1)
      .split('/')
      .join(`${keysSeperator}${temporaryChildrenKey}${keysSeperator}`)
      .split(keysSeperator)
    // _.setWith Object
    // _.set will handle number in setKeys with Array, that's not what we want
    let temporaryObject = _.setWith({}, setKeys, { ...file }, Object)
    _.merge(treeWithChildren, temporaryObject)
  })

  let convertChildren2ArrayInTree = tree => {
    if (_.has(tree, temporaryChildrenKey)) {
      tree.children = _.values(tree[temporaryChildrenKey])
      _.unset(tree, temporaryChildrenKey)
      tree.children.forEach(convertChildren2ArrayInTree)
    }

    return tree
  }

  let nestedArray = convertChildren2ArrayInTree({
    [temporaryChildrenKey]: treeWithChildren
  })['children']
  return _.isEmpty(nestedArray) ? [] : nestedArray
}

/*doc
  suffixFileExtension
  add fileExtension to str if there's no fileExtension

  suffixFileExtension('filename.md', 'md') => 'filename.md'
  suffixFileExtension('filename', 'md') => 'filename.md'
*/

export const suffixFileExtension = (() => {
  let cache = {}
  return (str, fileExtension = 'md') => {
    let cacheKey = str + fileExtension
    if (!cache[cacheKey]) {
      // ignore json file, todo: add more ignore file suffix
      if (/\.json$/.test(str)) {
        cache[cacheKey] = str
      } else {
        let suffixStr = '.' + fileExtension
        let strArr = str.split(suffixStr)
        if (strArr[strArr.length - 1] !== '') strArr[strArr.length] = ''
        cache[cacheKey] = strArr.join(suffixStr)
      }
    }
    return cache[cacheKey]
  }
})()

/*doc
  getFileFullPathByPath

  there's only username and sitename, add index.md
  elsewise fix .md suffix

  getFileFullPathByPath('username/sitename') => 'kaitlyn/kaitlyn/index.md'
  getFileFullPathByPath('/username/sitename') => 'kaitlyn/kaitlyn/index.md'
  getFileFullPathByPath('/username/sitename/pagename') => 'kaitlyn/kaitlyn/pagename.md'
  getFileFullPathByPath('/username/sitename/pagename.md') => 'kaitlyn/kaitlyn/pagename.md'
*/
export const getFileFullPathByPath = (() => {
  let cache = {}
  return path => {
    let cacheKey = path
    if (!cache[cacheKey]) {
      let [username, name, ...pagenames] = path.split('/').filter(x => x)
      let isSiteRootPath = !pagenames.length

      let fullPathNames = isSiteRootPath
        ? [username, name, 'index']
        : [username, name, ...pagenames]
      let fullPath = fullPathNames.join('/')
      fullPath = suffixFileExtension(fullPath, 'md')
      cache[cacheKey] = fullPath
    }
    return cache[cacheKey]
  }
})()

export const getFileSitePathByPath = path => {
  let [username, name] = path.split('/').filter(x => x)
  return [username, name].join('/')
}

export const getRelativePathByPath = path => {
  let [, , ...subPaths] = path.split('/').filter(x => x)
  return subPaths.join('/')
}

export const getPageInfoByPath = path => {
  let pageInfos = path.split('/').filter(x => x)
  let [username, sitename] = pageInfos
  let isLegal = username && sitename
  let sitepath = isLegal ? `${username}/${sitename}` : ''
  let fullPath = isLegal ? getFileFullPathByPath(path) : ''
  let barePath = fullPath.replace(/\.md$/, '')
  let [, , ...paths] = fullPath.split('/').filter(x => x)
  let relativePath = paths.join('/')
  let bareRelativePath = relativePath.replace(/\.md$/, '')
  return { username, sitename, isLegal, barePath, fullPath, sitepath, paths, relativePath, bareRelativePath }
}

/**
 * @param {*} filename string
 * @param {*} ext string
 * ('filename', 'ext') => 'filename.ext'
 * ('filename.ext', 'ext') => 'filename.ext'
 */
export const getFilenameWithExt = (filename, ext) => {
  let filenameExt = /.+\./.test(filename) ? filename.split('.').pop() : ''
  filenameExt = filenameExt.toLowerCase()
  filename = filenameExt !== ext ? `${filename}.${ext}` : filename
  return filename
}

export default {
  EMPTY_GIT_FOLDER_KEEPER,
  CONFIG_FOLDER_NAME,
  webTemplateProject,
  gitTree2NestedArray,
  suffixFileExtension,
  getFileFullPathByPath,
  getFileSitePathByPath,
  getRelativePathByPath,
  getPageInfoByPath,
  getFilenameWithExt
}
