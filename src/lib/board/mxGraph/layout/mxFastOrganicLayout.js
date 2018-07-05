import MxGraphLayout from './MxGraphLayout'
import MxObjectIdentity from '../util/MxObjectIdentity'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxFastOrganicLayout
 *
 * Extends <MxGraphLayout> to implement a fast organic layout algorithm.
 * The vertices need to be connected for this layout to work, vertices
 * with no connections are ignored.
 *
 * Example:
 *
 * (code)
 * let layout = new MxFastOrganicLayout(graph);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: mxCompactTreeLayout
 *
 * Constructs a new fast organic layout for the specified graph.
 */

export default class MxFastOrganicLayout {
  constructor(graph) {
    MxGraphLayout.call(this, graph)
  };
}

/**
 * Extends MxGraphLayout.
 */
MxFastOrganicLayout.prototype = new MxGraphLayout()
MxFastOrganicLayout.prototype.constructor = MxFastOrganicLayout

/**
 * Variable: useInputOrigin
 *
 * Specifies if the top left corner of the input cells should be the origin
 * of the layout result. Default is true.
 */
MxFastOrganicLayout.prototype.useInputOrigin = true

/**
 * Variable: resetEdges
 *
 * Specifies if all edge points of traversed edges should be removed.
 * Default is true.
 */
MxFastOrganicLayout.prototype.resetEdges = true

/**
 * Variable: disableEdgeStyle
 *
 * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
 * modified by the result. Default is true.
 */
MxFastOrganicLayout.prototype.disableEdgeStyle = true

/**
 * Variable: forceConstant
 *
 * The force constant by which the attractive forces are divided and the
 * replusive forces are multiple by the square of. The value equates to the
 * average radius there is of free space around each node. Default is 50.
 */
MxFastOrganicLayout.prototype.forceConstant = 50

/**
 * Variable: forceConstantSquared
 *
 * Cache of <forceConstant>^2 for performance.
 */
MxFastOrganicLayout.prototype.forceConstantSquared = 0

/**
 * Variable: minDistanceLimit
 *
 * Minimal distance limit. Default is 2. Prevents of
 * dividing by zero.
 */
MxFastOrganicLayout.prototype.minDistanceLimit = 2

/**
 * Variable: minDistanceLimit
 *
 * Minimal distance limit. Default is 2. Prevents of
 * dividing by zero.
 */
MxFastOrganicLayout.prototype.maxDistanceLimit = 500

/**
 * Variable: minDistanceLimitSquared
 *
 * Cached version of <minDistanceLimit> squared.
 */
MxFastOrganicLayout.prototype.minDistanceLimitSquared = 4

/**
 * Variable: initialTemp
 *
 * Start value of temperature. Default is 200.
 */
MxFastOrganicLayout.prototype.initialTemp = 200

/**
 * Variable: temperature
 *
 * Temperature to limit displacement at later stages of layout.
 */
MxFastOrganicLayout.prototype.temperature = 0

/**
 * Variable: maxIterations
 *
 * Total number of iterations to run the layout though.
 */
MxFastOrganicLayout.prototype.maxIterations = 0

/**
 * Variable: iteration
 *
 * Current iteration count.
 */
MxFastOrganicLayout.prototype.iteration = 0

/**
 * Variable: vertexArray
 *
 * An array of all vertices to be laid out.
 */
MxFastOrganicLayout.prototype.vertexArray = []

/**
 * Variable: dispX
 *
 * An array of locally stored X co-ordinate displacements for the vertices.
 */
MxFastOrganicLayout.prototype.dispX = []

/**
 * Variable: dispY
 *
 * An array of locally stored Y co-ordinate displacements for the vertices.
 */
MxFastOrganicLayout.prototype.dispY = []

/**
 * Variable: cellLocation
 *
 * An array of locally stored co-ordinate positions for the vertices.
 */
MxFastOrganicLayout.prototype.cellLocation = []

/**
 * Variable: radius
 *
 * The approximate radius of each cell, nodes only.
 */
MxFastOrganicLayout.prototype.radius = null

/**
 * Variable: radiusSquared
 *
 * The approximate radius squared of each cell, nodes only.
 */
MxFastOrganicLayout.prototype.radiusSquared = null

/**
 * Variable: isMoveable
 *
 * Array of booleans representing the movable states of the vertices.
 */
MxFastOrganicLayout.prototype.isMoveable = []

/**
 * Variable: neighbours
 *
 * Local copy of cell neighbours.
 */
MxFastOrganicLayout.prototype.neighbours = null

/**
 * Variable: indices
 *
 * Hashtable from cells to local indices.
 */
MxFastOrganicLayout.prototype.indices = null

/**
 * Variable: allowedToRun
 *
 * Boolean flag that specifies if the layout is allowed to run. If this is
 * set to false, then the layout exits in the following iteration.
 */
MxFastOrganicLayout.prototype.allowedToRun = true

/**
 * Function: isVertexIgnored
 *
 * Returns a boolean indicating if the given <mxCell> should be ignored as a
 * vertex. This returns true if the cell has no connections.
 *
 * Parameters:
 *
 * vertex - <mxCell> whose ignored state should be returned.
 */
MxFastOrganicLayout.prototype.isVertexIgnored = function(vertex) {
  return MxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(vertex).length === 0
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>. This operates on all children of the
 * given parent where <isVertexIgnored> returns false.
 */
MxFastOrganicLayout.prototype.execute = function(parent) {
  let model = this.graph.getModel()
  this.vertexArray = []
  let cells = this.graph.getChildVertices(parent)

  for (let i = 0; i < cells.length; i++) {
    if (!this.isVertexIgnored(cells[i])) {
      this.vertexArray.push(cells[i])
    }
  }

  let initialBounds = (this.useInputOrigin)
    ? this.graph.getBoundingBoxFromGeometry(this.vertexArray)
    : null
  let n = this.vertexArray.length

  this.indices = []
  this.dispX = []
  this.dispY = []
  this.cellLocation = []
  this.isMoveable = []
  this.neighbours = []
  this.radius = []
  this.radiusSquared = []

  if (this.forceConstant < 0.001) {
    this.forceConstant = 0.001
  }

  this.forceConstantSquared = this.forceConstant * this.forceConstant

  // Create a map of vertices first. This is required for the array of
  // arrays called neighbours which holds, for each vertex, a list of
  // ints which represents the neighbours cells to that vertex as
  // the indices into vertexArray
  for (let i = 0; i < this.vertexArray.length; i++) {
    let vertex = this.vertexArray[i]
    this.cellLocation[i] = []

    // Set up the mapping from array indices to cells
    let id = MxObjectIdentity.get(vertex)
    this.indices[id] = i
    let bounds = this.getVertexBounds(vertex)

    // Set the X,Y value of the internal version of the cell to
    // the center point of the vertex for better positioning
    let width = bounds.width
    let height = bounds.height

    // Randomize (0, 0) locations
    let x = bounds.x
    let y = bounds.y

    this.cellLocation[i][0] = x + width / 2.0
    this.cellLocation[i][1] = y + height / 2.0
    this.radius[i] = Math.min(width, height)
    this.radiusSquared[i] = this.radius[i] * this.radius[i]
  }

  // Moves cell location back to top-left from center locations used in
  // algorithm, resetting the edge points is part of the transaction
  model.beginUpdate()
  try {
    for (let i = 0; i < n; i++) {
      this.dispX[i] = 0
      this.dispY[i] = 0
      this.isMoveable[i] = this.isVertexMovable(this.vertexArray[i])

      // Get lists of neighbours to all vertices, translate the cells
      // obtained in indices into vertexArray and store as an array
      // against the orginial cell index
      let edges = this.graph.getConnections(this.vertexArray[i], parent)
      let cells = this.graph.getOpposites(edges, this.vertexArray[i])
      this.neighbours[i] = []

      for (let j = 0; j < cells.length; j++) {
        // Resets the points on the traversed edge
        if (this.resetEdges) {
          this.graph.resetEdge(edges[j])
        }
        if (this.disableEdgeStyle) {
          this.setEdgeStyleEnabled(edges[j], false)
        }

        // Looks the cell up in the indices dictionary
        let id = MxObjectIdentity.get(cells[j])
        let index = this.indices[id]

        // Check the connected cell in part of the vertex list to be
        // acted on by this layout
        if (index !== null) {
          this.neighbours[i][j] = index
        } else {
          // Else if index of the other cell doesn't correspond to
          // any cell listed to be acted upon in this layout. Set
          // the index to the value of this vertex (a dummy self-loop)
          // so the attraction force of the edge is not calculated
          this.neighbours[i][j] = i
        }
      }
    }
    this.temperature = this.initialTemp

    // If max number of iterations has not been set, guess it
    if (this.maxIterations === 0) {
      this.maxIterations = 20 * Math.sqrt(n)
    }

    // Main iteration loop
    for (this.iteration = 0; this.iteration < this.maxIterations; this.iteration++) {
      if (!this.allowedToRun) {
        return
      }

      // Calculate repulsive forces on all vertices
      this.calcRepulsion()

      // Calculate attractive forces through edges
      this.calcAttraction()

      this.calcPositions()
      this.reduceTemperature()
    }

    let minx = null
    let miny = null

    for (let i = 0; i < this.vertexArray.length; i++) {
      let vertex = this.vertexArray[i]

      if (this.isVertexMovable(vertex)) {
        let bounds = this.getVertexBounds(vertex)

        if (bounds !== null) {
          this.cellLocation[i][0] -= bounds.width / 2.0
          this.cellLocation[i][1] -= bounds.height / 2.0

          let x = this.graph.snap(Math.round(this.cellLocation[i][0]))
          let y = this.graph.snap(Math.round(this.cellLocation[i][1]))

          this.setVertexLocation(vertex, x, y)

          if (minx === null) {
            minx = x
          } else {
            minx = Math.min(minx, x)
          }

          if (miny === null) {
            miny = y
          } else {
            miny = Math.min(miny, y)
          }
        }
      }
    }

    // Modifies the cloned geometries in-place. Not needed
    // to clone the geometries again as we're in the same
    // undoable change.
    let dx = -(minx || 0) + 1
    let dy = -(miny || 0) + 1

    if (initialBounds !== null) {
      dx += initialBounds.x
      dy += initialBounds.y
    }

    this.graph.moveCells(this.vertexArray, dx, dy)
  } finally {
    model.endUpdate()
  }
}

/**
 * Function: calcPositions
 *
 * Takes the displacements calculated for each cell and applies them to the
 * local cache of cell positions. Limits the displacement to the current
 * temperature.
 */
MxFastOrganicLayout.prototype.calcPositions = function() {
  for (let index = 0; index < this.vertexArray.length; index++) {
    if (this.isMoveable[index]) {
      // Get the distance of displacement for this node for this
      // iteration
      let deltaLength = Math.sqrt(this.dispX[index] * this.dispX[index] + this.dispY[index] * this.dispY[index])

      if (deltaLength < 0.001) {
        deltaLength = 0.001
      }

      // Scale down by the current temperature if less than the
      // displacement distance
      let newXDisp = this.dispX[index] / deltaLength * Math.min(deltaLength, this.temperature)

      let newYDisp = this.dispY[index] / deltaLength * Math.min(deltaLength, this.temperature)

      // reset displacements
      this.dispX[index] = 0
      this.dispY[index] = 0

      // Update the cached cell locations
      this.cellLocation[index][0] += newXDisp
      this.cellLocation[index][1] += newYDisp
    }
  }
}

/**
 * Function: calcAttraction
 *
 * Calculates the attractive forces between all laid out nodes linked by
 * edges
 */
MxFastOrganicLayout.prototype.calcAttraction = function() {
  // Check the neighbours of each vertex and calculate the attractive
  // force of the edge connecting them
  for (let i = 0; i < this.vertexArray.length; i++) {
    for (let k = 0; k < this.neighbours[i].length; k++) {
      // Get the index of the othe cell in the vertex array
      let j = this.neighbours[i][k]

      // Do not proceed self-loops
      if (i !== j && this.isMoveable[i] && this.isMoveable[j]) {
        let xDelta = this.cellLocation[i][0] - this.cellLocation[j][0]
        let yDelta = this.cellLocation[i][1] - this.cellLocation[j][1]

        // The distance between the nodes
        let deltaLengthSquared = xDelta * xDelta + yDelta * yDelta - this.radiusSquared[i] - this.radiusSquared[j]

        if (deltaLengthSquared < this.minDistanceLimitSquared) {
          deltaLengthSquared = this.minDistanceLimitSquared
        }

        let deltaLength = Math.sqrt(deltaLengthSquared)
        let force = (deltaLengthSquared) / this.forceConstant

        let displacementX = (xDelta / deltaLength) * force
        let displacementY = (yDelta / deltaLength) * force

        this.dispX[i] -= displacementX
        this.dispY[i] -= displacementY

        this.dispX[j] += displacementX
        this.dispY[j] += displacementY
      }
    }
  }
}

/**
 * Function: calcRepulsion
 *
 * Calculates the repulsive forces between all laid out nodes
 */
MxFastOrganicLayout.prototype.calcRepulsion = function() {
  let vertexCount = this.vertexArray.length

  for (let i = 0; i < vertexCount; i++) {
    for (let j = i; j < vertexCount; j++) {
      // Exits if the layout is no longer allowed to run
      if (!this.allowedToRun) {
        return
      }

      if (j !== i && this.isMoveable[i] && this.isMoveable[j]) {
        let xDelta = this.cellLocation[i][0] - this.cellLocation[j][0]
        let yDelta = this.cellLocation[i][1] - this.cellLocation[j][1]

        if (xDelta === 0) {
          xDelta = 0.01 + Math.random()
        }

        if (yDelta === 0) {
          yDelta = 0.01 + Math.random()
        }

        // Distance between nodes
        let deltaLength = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta))
        let deltaLengthWithRadius = deltaLength - this.radius[i] - this.radius[j]

        if (deltaLengthWithRadius > this.maxDistanceLimit) {
          // Ignore vertices too far apart
          continue
        }

        if (deltaLengthWithRadius < this.minDistanceLimit) {
          deltaLengthWithRadius = this.minDistanceLimit
        }

        let force = this.forceConstantSquared / deltaLengthWithRadius

        let displacementX = (xDelta / deltaLength) * force
        let displacementY = (yDelta / deltaLength) * force

        this.dispX[i] += displacementX
        this.dispY[i] += displacementY

        this.dispX[j] -= displacementX
        this.dispY[j] -= displacementY
      }
    }
  }
}

/**
 * Function: reduceTemperature
 *
 * Reduces the temperature of the layout from an initial setting in a linear
 * fashion to zero.
 */
MxFastOrganicLayout.prototype.reduceTemperature = function() {
  this.temperature = this.initialTemp * (1.0 - this.iteration / this.maxIterations)
}
