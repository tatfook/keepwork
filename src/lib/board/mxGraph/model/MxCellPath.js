/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
const MxCellPath =
{

  /**
 * Class: MxCellPath
 *
 * Implements a mechanism for temporary cell Ids.
 *
 * letiable: PATH_SEPARATOR
 *
 * Defines the separator between the path components. Default is ".".
 */
  PATH_SEPARATOR: '.',

  /**
 * Function: create
 *
 * Creates the cell path for the given cell. The cell path is a
 * concatenation of the indices of all ancestors on the (finite) path to
 * the root, eg. "0.0.0.1".
 *
 * Parameters:
 *
 * cell - Cell whose path should be returned.
 */
  create: function(cell) {
    let result = ''

    if (cell !== null) {
      let parent = cell.getParent()

      while (parent !== null) {
        let index = parent.getIndex(cell)
        result = index + MxCellPath.PATH_SEPARATOR + result

        cell = parent
        parent = cell.getParent()
      }
    }

    // Removes trailing separator
    let n = result.length

    if (n > 1) {
      result = result.substring(0, n - 1)
    }

    return result
  },

  /**
 * Function: getParentPath
 *
 * Returns the path for the parent of the cell represented by the given
 * path. Returns null if the given path has no parent.
 *
 * Parameters:
 *
 * path - Path whose parent path should be returned.
 */
  getParentPath: function(path) {
    if (path !== null) {
      let index = path.lastIndexOf(MxCellPath.PATH_SEPARATOR)

      if (index >= 0) {
        return path.substring(0, index)
      } else if (path.length > 0) {
        return ''
      }
    }

    return null
  },

  /**
 * Function: resolve
 *
 * Returns the cell for the specified cell path using the given root as the
 * root of the path.
 *
 * Parameters:
 *
 * root - Root cell of the path to be resolved.
 * path - String that defines the path.
 */
  resolve: function(root, path) {
    let parent = root

    if (path !== null) {
      let tokens = path.split(MxCellPath.PATH_SEPARATOR)

      for (let i = 0; i < tokens.length; i++) {
        parent = parent.getChildAt(parseInt(tokens[i]))
      }
    }

    return parent
  },

  /**
 * Function: compare
 *
 * Compares the given cell paths and returns -1 if p1 is smaller, 0 if
 * p1 is equal and 1 if p1 is greater than p2.
 */
  compare: function(p1, p2) {
    let min = Math.min(p1.length, p2.length)
    let comp = 0

    for (let i = 0; i < min; i++) {
      if (p1[i] !== p2[i]) {
        if (p1[i].length === 0 || p2[i].length === 0) {
          comp = (p1[i] === p2[i]) ? 0 : ((p1[i] > p2[i]) ? 1 : -1)
        } else {
          let t1 = parseInt(p1[i])
          let t2 = parseInt(p2[i])

          comp = (t1 === t2) ? 0 : ((t1 > t2) ? 1 : -1)
        }

        break
      }
    }

    // Compares path length if both paths are equal to this point
    if (comp === 0) {
      let t1 = p1.length
      let t2 = p2.length

      if (t1 !== t2) {
        comp = (t1 > t2) ? 1 : -1
      }
    }

    return comp
  }

}
export default MxCellPath
