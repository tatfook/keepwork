import _ from 'lodash'

export const EMPTY_GIT_FOLDER_KEEPER = '.gitignore.md'
export const EMPTY_GIT_FOLDER_KEEPER_REGEX = /^\.(git|keep|gitignore)/ // for .gitkeep, .keep, .gitignore, .gitignore.md
export const CONFIG_FOLDER_NAME = '_config'

export const webTemplateProject = {
  rawBaseUrl: 'https://api.keepwork.com/core/v0',
  dataSourceUsername: 'gitlab_rls_official',
  projectName: 'official/keepwork-template-v2',
  projectId: 36332,
  configFullPath: 'config.json',
  pageTemplateRoot: 'webpage',
  pageTemplateConfigFullPath: 'webpage/config.json'
}

// https://git-stage.keepwork.com/gitlab_www_official/keepwork-template-v2
// export const webTemplateProject = {
//   rawBaseUrl: 'https://api-stage.keepwork.com/git/v0',
//   dataSourceUsername: 'official',
//   projectName: 'official/keepwork-template-v2',
//   projectId: 36332,
//   configFullPath: 'config.json',
//   configName: 'config.json',
//   pageTemplateRoot: 'webpage',
//   // pageTemplateConfigFullPath: 'official/keepwork-template-v2/config.json/webpage/config.json'
//   pageTemplateConfigFullPath: 'webpage/config.json'
// }

const sortFile = (folder, rootPath) => {
  _.forEach(folder.children, item => {
    item.path = `${rootPath}/${item.path}`
    if (item.children && item.children.length) {
      sortFile(item, rootPath)
    }
  })
  const trees = _.filter(folder.children, file => file.isTree)
  const blobs = _.filter(folder.children, file => file.isBlob)
  folder.children = [...trees, ...blobs]
  folder.children = _.filter(folder.children, file => !EMPTY_GIT_FOLDER_KEEPER_REGEX.test(file.name))
}

export const sortFolder2Top = (files, rootPath) => {
  const trees = _.filter(files, file => file.isTree)
  const blobs = _.filter(files, file => file.isBlob && !EMPTY_GIT_FOLDER_KEEPER_REGEX.test(file.name))
  files = [...trees, ...blobs]
  _.forEach(files, item => {
    item.path = `${rootPath}/${item.path}`
    if (item.children && item.children.length) {
      sortFile(item, rootPath)
    }
  })
  return files
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
    if (file.path.indexOf(rootPath + '/') !== 0) return

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
      // tree.children = _.values(tree[temporaryChildrenKey])
      const children = _.values(tree[temporaryChildrenKey])
      tree.children = [..._.filter(children, i => i.type === 'tree'), ..._.filter(children, i => i.type !== 'tree')]
      _.unset(tree, temporaryChildrenKey)
      tree.children.forEach(convertChildren2ArrayInTree)
    }

    return tree
  }

  let nestedArray = convertChildren2ArrayInTree({
    [temporaryChildrenKey]: treeWithChildren
  }).children
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
  let pagename = (paths[paths.length - 1] || '').replace(/\.md$/, '')
  return { username, sitename, pagename, isLegal, barePath, fullPath, sitepath, paths, relativePath, bareRelativePath }
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

export const gitFilenameValidator = (filename = '') => {
  let validated = /^[^/\\:@&*=#"*?<>|\s]+$/.test(filename)
  validated = validated && /^[^_.]/.test(filename)
  return validated
}

export default {
  EMPTY_GIT_FOLDER_KEEPER,
  EMPTY_GIT_FOLDER_KEEPER_REGEX,
  CONFIG_FOLDER_NAME,
  webTemplateProject,
  gitTree2NestedArray,
  suffixFileExtension,
  getFileFullPathByPath,
  getFileSitePathByPath,
  getRelativePathByPath,
  getPageInfoByPath,
  getFilenameWithExt,
  gitFilenameValidator,
  sortFolder2Top
}
