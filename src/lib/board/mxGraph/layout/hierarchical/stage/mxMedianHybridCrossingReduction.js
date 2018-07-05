import MxHierarchicalLayoutStage from './MxHierarchicalLayoutStage'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxMedianHybridCrossingReduction
 *
 * Sets the horizontal locations of node and edge dummy nodes on each layer.
 * Uses median down and up weighings as well heuristic to straighten edges as
 * far as possible.
 *
 * Constructor: MxMedianHybridCrossingReduction
 *
 * Creates a coordinate assignment.
 *
 * Arguments:
 *
 * intraCellSpacing - the minimum buffer between cells on the same rank
 * interRankCellSpacing - the minimum distance between cells on adjacent ranks
 * orientation - the position of the root node(s) relative to the graph
 * initialX - the leftmost coordinate node placement starts at
 */
export default class MxMedianHybridCrossingReduction {
  constructor(layout) {
    this.layout = layout
  }
}

/**
 * Extends MxMedianHybridCrossingReduction.
 */
MxMedianHybridCrossingReduction.prototype = new MxHierarchicalLayoutStage()
MxMedianHybridCrossingReduction.prototype.constructor = MxMedianHybridCrossingReduction

/**
 * Variable: layout
 *
 * Reference to the enclosing <mxHierarchicalLayout>.
 */
MxMedianHybridCrossingReduction.prototype.layout = null

/**
 * Variable: maxIterations
 *
 * The maximum number of iterations to perform whilst reducing edge
 * crossings. Default is 24.
 */
MxMedianHybridCrossingReduction.prototype.maxIterations = 24

/**
 * Variable: nestedBestRanks
 *
 * Stores each rank as a collection of cells in the best order found for
 * each layer so far
 */
MxMedianHybridCrossingReduction.prototype.nestedBestRanks = null

/**
 * Variable: currentBestCrossings
 *
 * The total number of crossings found in the best configuration so far
 */
MxMedianHybridCrossingReduction.prototype.currentBestCrossings = 0

/**
 * Variable: iterationsWithoutImprovement
 *
 * The total number of crossings found in the best configuration so far
 */
MxMedianHybridCrossingReduction.prototype.iterationsWithoutImprovement = 0

/**
 * Variable: maxNoImprovementIterations
 *
 * The total number of crossings found in the best configuration so far
 */
MxMedianHybridCrossingReduction.prototype.maxNoImprovementIterations = 2

/**
 * Function: execute
 *
 * Performs a vertex ordering within ranks as described by Gansner et al
 * 1993
 */
MxMedianHybridCrossingReduction.prototype.execute = function(parent) {
  let model = this.layout.getModel()

  // Stores initial ordering as being the best one found so far
  this.nestedBestRanks = []

  for (let i = 0; i < model.ranks.length; i++) {
    this.nestedBestRanks[i] = model.ranks[i].slice()
  }

  let iterationsWithoutImprovement = 0
  let currentBestCrossings = this.calculateCrossings(model)

  for (let i = 0; i < this.maxIterations && iterationsWithoutImprovement < this.maxNoImprovementIterations; i++) {
    this.weightedMedian(i, model)
    this.transpose(i, model)
    let candidateCrossings = this.calculateCrossings(model)

    if (candidateCrossings < currentBestCrossings) {
      currentBestCrossings = candidateCrossings
      iterationsWithoutImprovement = 0

      // Store the current rankings as the best ones
      for (let j = 0; j < this.nestedBestRanks.length; j++) {
        let rank = model.ranks[j]

        for (let k = 0; k < rank.length; k++) {
          let cell = rank[k]
          this.nestedBestRanks[j][cell.getGeneralPurposeVariable(j)] = cell
        }
      }
    } else {
      // Increase count of iterations where we haven't improved the
      // layout
      iterationsWithoutImprovement++

      // Restore the best values to the cells
      for (let j = 0; j < this.nestedBestRanks.length; j++) {
        let rank = model.ranks[j]

        for (let k = 0; k < rank.length; k++) {
          let cell = rank[k]
          cell.setGeneralPurposeVariable(j, k)
        }
      }
    }

    if (currentBestCrossings === 0) {
      // Do nothing further
      break
    }
  }

  // Store the best rankings but in the model
  let ranks = []
  let rankList = []

  for (let i = 0; i < model.maxRank + 1; i++) {
    rankList[i] = []
    ranks[i] = rankList[i]
  }

  for (let i = 0; i < this.nestedBestRanks.length; i++) {
    for (let j = 0; j < this.nestedBestRanks[i].length; j++) {
      rankList[i].push(this.nestedBestRanks[i][j])
    }
  }

  model.ranks = ranks
}

/**
 * Function: calculateCrossings
 *
 * Calculates the total number of edge crossing in the current graph.
 * Returns the current number of edge crossings in the hierarchy graph
 * model in the current candidate layout
 *
 * Parameters:
 *
 * model - the internal model describing the hierarchy
 */
MxMedianHybridCrossingReduction.prototype.calculateCrossings = function(model) {
  let numRanks = model.ranks.length
  let totalCrossings = 0

  for (let i = 1; i < numRanks; i++) {
    totalCrossings += this.calculateRankCrossing(i, model)
  }

  return totalCrossings
}

/**
 * Function: calculateRankCrossing
 *
 * Calculates the number of edges crossings between the specified rank and
 * the rank below it. Returns the number of edges crossings with the rank
 * beneath
 *
 * Parameters:
 *
 * i -  the topmost rank of the pair ( higher rank value )
 * model - the internal model describing the hierarchy
 */
MxMedianHybridCrossingReduction.prototype.calculateRankCrossing = function(i, model) {
  let totalCrossings = 0
  let rank = model.ranks[i]
  let previousRank = model.ranks[i - 1]

  let tmpIndices = []

  // Iterate over the top rank and fill in the connection information
  for (let j = 0; j < rank.length; j++) {
    let node = rank[j]
    let rankPosition = node.getGeneralPurposeVariable(i)
    let connectedCells = node.getPreviousLayerConnectedCells(i)
    let nodeIndices = []

    for (let k = 0; k < connectedCells.length; k++) {
      let connectedNode = connectedCells[k]
      let otherCellRankPosition = connectedNode.getGeneralPurposeVariable(i - 1)
      nodeIndices.push(otherCellRankPosition)
    }

    nodeIndices.sort(function(x, y) { return x - y })
    tmpIndices[rankPosition] = nodeIndices
  }

  let indices = []

  for (let j = 0; j < tmpIndices.length; j++) {
    indices = indices.concat(tmpIndices[j])
  }

  let firstIndex = 1

  while (firstIndex < previousRank.length) {
    firstIndex <<= 1
  }

  let treeSize = 2 * firstIndex - 1
  firstIndex -= 1

  let tree = []

  for (let j = 0; j < treeSize; ++j) {
    tree[j] = 0
  }

  for (let j = 0; j < indices.length; j++) {
    let index = indices[j]
    let treeIndex = index + firstIndex
    ++tree[treeIndex]

    while (treeIndex > 0) {
      if (treeIndex % 2) {
        totalCrossings += tree[treeIndex + 1]
      }

      treeIndex = (treeIndex - 1) >> 1
      ++tree[treeIndex]
    }
  }

  return totalCrossings
}

/**
 * Function: transpose
 *
 * Takes each possible adjacent cell pair on each rank and checks if
 * swapping them around reduces the number of crossing
 *
 * Parameters:
 *
 * mainLoopIteration - the iteration number of the main loop
 * model - the internal model describing the hierarchy
 */
MxMedianHybridCrossingReduction.prototype.transpose = function(mainLoopIteration, model) {
  let improved = true

  // Track the number of iterations in case of looping
  let count = 0
  let maxCount = 10
  while (improved && count++ < maxCount) {
    // On certain iterations allow allow swapping of cell pairs with
    // equal edge crossings switched or not switched. This help to
    // nudge a stuck layout into a lower crossing total.
    let nudge = mainLoopIteration % 2 === 1 && count % 2 === 1
    improved = false

    for (let i = 0; i < model.ranks.length; i++) {
      let rank = model.ranks[i]
      let orderedCells = []

      for (let j = 0; j < rank.length; j++) {
        let cell = rank[j]
        let tempRank = cell.getGeneralPurposeVariable(i)

        // FIXME: Workaround to avoid negative tempRanks
        if (tempRank < 0) {
          tempRank = j
        }
        orderedCells[tempRank] = cell
      }

      let leftCellAboveConnections = null
      let leftCellBelowConnections = null
      let rightCellAboveConnections = null
      let rightCellBelowConnections = null

      let leftAbovePositions = null
      let leftBelowPositions = null
      let rightAbovePositions = null
      let rightBelowPositions = null

      let leftCell = null
      let rightCell = null

      for (let j = 0; j < (rank.length - 1); j++) {
        // For each intra-rank adjacent pair of cells
        // see if swapping them around would reduce the
        // number of edges crossing they cause in total
        // On every cell pair except the first on each rank, we
        // can save processing using the previous values for the
        // right cell on the new left cell
        if (j === 0) {
          leftCell = orderedCells[j]
          leftCellAboveConnections = leftCell
            .getNextLayerConnectedCells(i)
          leftCellBelowConnections = leftCell
            .getPreviousLayerConnectedCells(i)
          leftAbovePositions = []
          leftBelowPositions = []

          for (let k = 0; k < leftCellAboveConnections.length; k++) {
            leftAbovePositions[k] = leftCellAboveConnections[k].getGeneralPurposeVariable(i + 1)
          }

          for (let k = 0; k < leftCellBelowConnections.length; k++) {
            leftBelowPositions[k] = leftCellBelowConnections[k].getGeneralPurposeVariable(i - 1)
          }
        } else {
          leftCellAboveConnections = rightCellAboveConnections
          leftCellBelowConnections = rightCellBelowConnections
          leftAbovePositions = rightAbovePositions
          leftBelowPositions = rightBelowPositions
          leftCell = rightCell
        }

        rightCell = orderedCells[j + 1]
        rightCellAboveConnections = rightCell
          .getNextLayerConnectedCells(i)
        rightCellBelowConnections = rightCell
          .getPreviousLayerConnectedCells(i)

        rightAbovePositions = []
        rightBelowPositions = []

        for (let k = 0; k < rightCellAboveConnections.length; k++) {
          rightAbovePositions[k] = rightCellAboveConnections[k].getGeneralPurposeVariable(i + 1)
        }

        for (let k = 0; k < rightCellBelowConnections.length; k++) {
          rightBelowPositions[k] = rightCellBelowConnections[k].getGeneralPurposeVariable(i - 1)
        }

        let totalCurrentCrossings = 0
        let totalSwitchedCrossings = 0

        for (let k = 0; k < leftAbovePositions.length; k++) {
          for (let ik = 0; ik < rightAbovePositions.length; ik++) {
            if (leftAbovePositions[k] > rightAbovePositions[ik]) {
              totalCurrentCrossings++
            }

            if (leftAbovePositions[k] < rightAbovePositions[ik]) {
              totalSwitchedCrossings++
            }
          }
        }

        for (let k = 0; k < leftBelowPositions.length; k++) {
          for (let ik = 0; ik < rightBelowPositions.length; ik++) {
            if (leftBelowPositions[k] > rightBelowPositions[ik]) {
              totalCurrentCrossings++
            }

            if (leftBelowPositions[k] < rightBelowPositions[ik]) {
              totalSwitchedCrossings++
            }
          }
        }

        if ((totalSwitchedCrossings < totalCurrentCrossings) || (totalSwitchedCrossings === totalCurrentCrossings && nudge)) {
          let temp = leftCell.getGeneralPurposeVariable(i)
          leftCell.setGeneralPurposeVariable(i, rightCell
            .getGeneralPurposeVariable(i))
          rightCell.setGeneralPurposeVariable(i, temp)

          // With this pair exchanged we have to switch all of
          // values for the left cell to the right cell so the
          // next iteration for this rank uses it as the left
          // cell again
          rightCellAboveConnections = leftCellAboveConnections
          rightCellBelowConnections = leftCellBelowConnections
          rightAbovePositions = leftAbovePositions
          rightBelowPositions = leftBelowPositions
          rightCell = leftCell

          if (!nudge) {
            // Don't count nudges as improvement or we'll end
            // up stuck in two combinations and not finishing
            // as early as we should
            improved = true
          }
        }
      }
    }
  }
}

/**
 * Function: weightedMedian
 *
 * Sweeps up or down the layout attempting to minimise the median placement
 * of connected cells on adjacent ranks
 *
 * Parameters:
 *
 * iteration - the iteration number of the main loop
 * model - the internal model describing the hierarchy
 */
MxMedianHybridCrossingReduction.prototype.weightedMedian = function(iteration, model) {
  // Reverse sweep direction each time through this method
  let downwardSweep = (iteration % 2 === 0)
  if (downwardSweep) {
    for (let j = model.maxRank - 1; j >= 0; j--) {
      this.medianRank(j, downwardSweep)
    }
  } else {
    for (let j = 1; j < model.maxRank; j++) {
      this.medianRank(j, downwardSweep)
    }
  }
}

/**
 * Function: medianRank
 *
 * Attempts to minimise the median placement of connected cells on this rank
 * and one of the adjacent ranks
 *
 * Parameters:
 *
 * rankValue - the layer number of this rank
 * downwardSweep - whether or not this is a downward sweep through the graph
 */
MxMedianHybridCrossingReduction.prototype.medianRank = function(rankValue, downwardSweep) {
  let numCellsForRank = this.nestedBestRanks[rankValue].length
  let medianValues = []
  let reservedPositions = []

  for (let i = 0; i < numCellsForRank; i++) {
    let cell = this.nestedBestRanks[rankValue][i]
    let sorterEntry = new MedianCellSorter()
    sorterEntry.cell = cell

    // Flip whether or not equal medians are flipped on up and down
    // sweeps
    // TODO re-implement some kind of nudge
    // medianValues[i].nudge = !downwardSweep;
    let nextLevelConnectedCells

    if (downwardSweep) {
      nextLevelConnectedCells = cell
        .getNextLayerConnectedCells(rankValue)
    } else {
      nextLevelConnectedCells = cell
        .getPreviousLayerConnectedCells(rankValue)
    }

    let nextRankValue

    if (downwardSweep) {
      nextRankValue = rankValue + 1
    } else {
      nextRankValue = rankValue - 1
    }

    if (nextLevelConnectedCells !== null && nextLevelConnectedCells.length !== 0) {
      sorterEntry.medianValue = this.medianValue(
        nextLevelConnectedCells, nextRankValue)
      medianValues.push(sorterEntry)
    } else {
      // Nodes with no adjacent vertices are flagged in the reserved array
      // to indicate they should be left in their current position.
      reservedPositions[cell.getGeneralPurposeVariable(rankValue)] = true
    }
  }

  medianValues.sort(MedianCellSorter.prototype.compare)

  // Set the new position of each node within the rank using
  // its temp letiable
  for (let i = 0; i < numCellsForRank; i++) {
    if (reservedPositions[i] === null) {
      let cell = medianValues.shift().cell
      cell.setGeneralPurposeVariable(rankValue, i)
    }
  }
}

/**
 * Function: medianValue
 *
 * Calculates the median rank order positioning for the specified cell using
 * the connected cells on the specified rank. Returns the median rank
 * ordering value of the connected cells
 *
 * Parameters:
 *
 * connectedCells - the cells on the specified rank connected to the
 * specified cell
 * rankValue - the rank that the connected cell lie upon
 */
MxMedianHybridCrossingReduction.prototype.medianValue = function(connectedCells, rankValue) {
  let medianValues = []
  let arrayCount = 0

  for (let i = 0; i < connectedCells.length; i++) {
    let cell = connectedCells[i]
    medianValues[arrayCount++] = cell.getGeneralPurposeVariable(rankValue)
  }

  // Sort() sorts lexicographically by default (i.e. 11 before 9) so force
  // numerical order sort
  medianValues.sort(function(a, b) { return a - b })

  if (arrayCount % 2 === 1) {
    // For odd numbers of adjacent vertices return the median
    return medianValues[Math.floor(arrayCount / 2)]
  } else if (arrayCount === 2) {
    return ((medianValues[0] + medianValues[1]) / 2.0)
  } else {
    let medianPoint = arrayCount / 2
    let leftMedian = medianValues[medianPoint - 1] - medianValues[0]
    let rightMedian = medianValues[arrayCount - 1] - medianValues[medianPoint]

    return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint] * leftMedian) / (leftMedian + rightMedian)
  }
}

/**
 * Class: MedianCellSorter
 *
 * A utility class used to track cells whilst sorting occurs on the median
 * values. Does not violate (x.compareTo(y)===0) === (x.equals(y))
 *
 * Constructor: MedianCellSorter
 *
 * Constructs a new median cell sorter.
 */
class MedianCellSorter {
  // constructor() {
  //   // empty
  // }
  /**
   * Function: compare
   *
   * Compares two MedianCellSorters.
  */
  compare(a, b) {
    if (a !== null && b !== null) {
      if (b.medianValue > a.medianValue) {
        return -1
      } else if (b.medianValue < a.medianValue) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }
}
;

/**
 * Variable: medianValue
 *
 * The weighted value of the cell stored.
 */
MedianCellSorter.prototype.medianValue = 0

/**
 * Variable: cell
 *
 * The cell whose median value is being calculated
 */
MedianCellSorter.prototype.cell = false
