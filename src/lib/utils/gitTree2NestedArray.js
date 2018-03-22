import _ from 'lodash'

/*doc
  # gitTree2NestedArray

  git tree results => nested array with children as key
*/

const gitTree2NestedArray = (files, rootPath) => {
  let keysSeperator = '<~>'
  let temporaryChildrenKey = '<~children~>'
  let treeWithChildren = {}

  files.forEach(file => {
    let setKeys = file.path.substr(rootPath.length + 1).split('/').join(`${keysSeperator}${temporaryChildrenKey}${keysSeperator}`).split(keysSeperator)
    let temporaryObject = _.set({}, setKeys, {...file})
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

  let nestedArray = convertChildren2ArrayInTree({[temporaryChildrenKey]: treeWithChildren})['children']
  return nestedArray
}

export default gitTree2NestedArray
