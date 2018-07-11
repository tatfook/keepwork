/**
 * Copyright (c) 2006-2015, JGraph Ltd
 */
import MxCylinder from '@/lib/board/mxGraph/shape/MxCylinder'
import MxUtils from '@/lib/board/mxGraph/util/MxUtils'
import MxRectangle from '@/lib/board/mxGraph/util/MxRectangle'
import MxCellRenderer from '@/lib/board/mxGraph/view/MxCellRenderer'
import MxActor from '@/lib/board/mxGraph/shape/MxActor'
import MxConstants from '@/lib/board/mxGraph/util/MxConstants'
import MxPoint from '@/lib/board/mxGraph/util/MxPoint'
import MxShape from '@/lib/board/mxGraph/shape/MxShape'
import MxRhombus from '@/lib/board/mxGraph/shape/MxRhombus'
import MxRectangleShape from '@/lib/board/mxGraph/shape/MxRectangleShape'
import MxHexagon from '@/lib/board/mxGraph/shape/MxHexagon'
import MxEllipse from '@/lib/board/mxGraph/shape/MxEllipse'
import MxPerimeter from '@/lib/board/mxGraph/view/MxPerimeter'
import MxStyleRegistry from '@/lib/board/mxGraph/view/MxStyleRegistry'
import MxDoubleEllipse from '@/lib/board/mxGraph/shape/MxDoubleEllipse'
import MxArrowConnector from '@/lib/board/mxGraph/shape/MxArrowConnector'
import MxConnector from '@/lib/board/mxGraph/shape/MxConnector'
import { StyleFormatPanel } from './Format'
import MxResources from '@/lib/board/mxGraph/util/MxResources'
import MxMarker from '@/lib/board/mxGraph/shape/MxMarker'
import MxHandle from '@/lib/board/mxGraph/handler/MxHandle'
import MxVertexHandler from '@/lib/board/mxGraph/handler/MxVertexHandler'
import MxEvent from '@/lib/board/mxGraph/util/MxEvent'
import Graph from './Graph'
import MxStencilRegistry from '@/lib/board/mxGraph/shape/MxStencilRegistry'
import MxEdgeHandler from '@/lib/board/mxGraph/handler/MxEdgeHandler'
import MxEdgeStyle from '@/lib/board/mxGraph/view/MxEdgeStyle'
import MxElbowEdgeHandler from '@/lib/board/mxGraph/handler/MxElbowEdgeHandler'
import MxConnectionConstraint from '@/lib/board/mxGraph/view/MxConnectionConstraint'
import MxLabel from '@/lib/board/mxGraph/shape/MxLabel'
import MxImageShape from '@/lib/board/mxGraph/shape/MxImageShape'
import MxSwimlane from '@/lib/board/mxGraph/shape/MxSwimlane'
import MxLine from '@/lib/board/mxGraph/shape/MxLine'
import MxTriangle from '@/lib/board/mxGraph/shape/MxTriangle'
import MxCloud from '@/lib/board/mxGraph/shape/MxCloud'
import MxArrow from '@/lib/board/mxGraph/shape/MxArrow'

/**
 * Registers shapes.
 */
(function() {
  // Cube Shape, supports size style
  function CubeShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(CubeShape, MxCylinder)
  CubeShape.prototype.size = 20
  CubeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    let s = Math.max(0, Math.min(w, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))))

    if (isForeground) {
      path.moveTo(s, h)
      path.lineTo(s, s)
      path.lineTo(0, 0)
      path.moveTo(s, s)
      path.lineTo(w, s)
      path.end()
    } else {
      path.moveTo(0, 0)
      path.lineTo(w - s, 0)
      path.lineTo(w, s)
      path.lineTo(w, h)
      path.lineTo(s, h)
      path.lineTo(0, h - s)
      path.lineTo(0, 0)
      path.close()
      path.end()
    }
  }
  CubeShape.prototype.getLabelMargins = function(rect) {
    if (MxUtils.getValue(this.style, 'boundedLbl', false)) {
      let s = parseFloat(MxUtils.getValue(this.style, 'size', this.size)) * this.scale
      return new MxRectangle(s, s, 0, 0)
    }
    return null
  }

  MxCellRenderer.registerShape('cube', CubeShape)

  let tan30 = Math.tan(MxUtils.toRadians(30))
  let tan30Dx = (0.5 - tan30) / 2

  // Cube Shape, supports size style
  function IsoRectangleShape() {
    MxActor.call(this)
  }
  MxUtils.extend(IsoRectangleShape, MxActor)
  IsoRectangleShape.prototype.size = 20
  IsoRectangleShape.prototype.redrawPath = function(path, x, y, w, h) {
    let m = Math.min(w, h / tan30)

    path.translate((w - m) / 2, (h - m) / 2 + m / 4)
    path.moveTo(0, 0.25 * m)
    path.lineTo(0.5 * m, m * tan30Dx)
    path.lineTo(m, 0.25 * m)
    path.lineTo(0.5 * m, (0.5 - tan30Dx) * m)
    path.lineTo(0, 0.25 * m)
    path.close()
    path.end()
  }

  MxCellRenderer.registerShape('isoRectangle', IsoRectangleShape)

  // Cube Shape, supports size style
  function IsoCubeShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(IsoCubeShape, MxCylinder)
  IsoCubeShape.prototype.size = 20
  IsoCubeShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    let m = Math.min(w, h / (0.5 + tan30))

    if (isForeground) {
      path.moveTo(0, 0.25 * m)
      path.lineTo(0.5 * m, (0.5 - tan30Dx) * m)
      path.lineTo(m, 0.25 * m)
      path.moveTo(0.5 * m, (0.5 - tan30Dx) * m)
      path.lineTo(0.5 * m, (1 - tan30Dx) * m)
      path.end()
    } else {
      path.translate((w - m) / 2, (h - m) / 2)
      path.moveTo(0, 0.25 * m)
      path.lineTo(0.5 * m, m * tan30Dx)
      path.lineTo(m, 0.25 * m)
      path.lineTo(m, 0.75 * m)
      path.lineTo(0.5 * m, (1 - tan30Dx) * m)
      path.lineTo(0, 0.75 * m)
      path.close()
      path.end()
    }
  }

  MxCellRenderer.registerShape('isoCube', IsoCubeShape)

  // DataStore Shape, supports size style
  function DataStoreShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(DataStoreShape, MxCylinder)

  DataStoreShape.prototype.redrawPath = function(c, x, y, w, h, isForeground) {
    let dy = Math.min(h / 2, Math.round(h / 8) + this.strokewidth - 1)
    if ((isForeground && this.fill !== null) || (!isForeground && this.fill === null)) {
      c.moveTo(0, dy)
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy)

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke()
        c.begin()
      }

      c.translate(0, dy / 2)
      c.moveTo(0, dy)
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy)

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke()
        c.begin()
      }

      c.translate(0, dy / 2)
      c.moveTo(0, dy)
      c.curveTo(0, 2 * dy, w, 2 * dy, w, dy)

      // Needs separate shapes for correct hit-detection
      if (!isForeground) {
        c.stroke()
        c.begin()
      }

      c.translate(0, -dy)
    }

    if (!isForeground) {
      c.moveTo(0, dy)
      c.curveTo(0, -dy / 3, w, -dy / 3, w, dy)
      c.lineTo(w, h - dy)
      c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy)
      c.close()
    }
  }
  DataStoreShape.prototype.getLabelMargins = function(rect) {
    return new MxRectangle(0, 2.5 * Math.min(rect.height / 2, Math.round(rect.height / 8) +
      this.strokewidth - 1) * this.scale, 0, 0)
  }

  MxCellRenderer.registerShape('datastore', DataStoreShape)

  // Note Shape, supports size style
  function NoteShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(NoteShape, MxCylinder)
  NoteShape.prototype.size = 30
  NoteShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    let s = Math.max(0, Math.min(w, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))))

    if (isForeground) {
      path.moveTo(w - s, 0)
      path.lineTo(w - s, s)
      path.lineTo(w, s)
      path.end()
    } else {
      path.moveTo(0, 0)
      path.lineTo(w - s, 0)
      path.lineTo(w, s)
      path.lineTo(w, h)
      path.lineTo(0, h)
      path.lineTo(0, 0)
      path.close()
      path.end()
    }
  }

  MxCellRenderer.registerShape('note', NoteShape)

  // Note Shape, supports size style
  function SwitchShape() {
    MxActor.call(this)
  }
  MxUtils.extend(SwitchShape, MxActor)
  SwitchShape.prototype.redrawPath = function(c, x, y, w, h) {
    let curve = 0.5
    c.moveTo(0, 0)
    c.quadTo(w / 2, h * curve, w, 0)
    c.quadTo(w * (1 - curve), h / 2, w, h)
    c.quadTo(w / 2, h * (1 - curve), 0, h)
    c.quadTo(w * curve, h / 2, 0, 0)
    c.end()
  }

  MxCellRenderer.registerShape('switch', SwitchShape)

  // Folder Shape, supports tabWidth, tabHeight styles
  function FolderShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(FolderShape, MxCylinder)
  FolderShape.prototype.tabWidth = 60
  FolderShape.prototype.tabHeight = 20
  FolderShape.prototype.tabPosition = 'right'
  FolderShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    let dx = Math.max(0, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'tabWidth', this.tabWidth))))
    let dy = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'tabHeight', this.tabHeight))))
    let tp = MxUtils.getValue(this.style, 'tabPosition', this.tabPosition)

    if (isForeground) {
      if (tp === 'left') {
        path.moveTo(0, dy)
        path.lineTo(dx, dy)
      } else {
        // Right is default
        path.moveTo(w - dx, dy)
        path.lineTo(w, dy)
      }

      path.end()
    } else {
      if (tp === 'left') {
        path.moveTo(0, 0)
        path.lineTo(dx, 0)
        path.lineTo(dx, dy)
        path.lineTo(w, dy)
      } else {
        // Right is default
        path.moveTo(0, dy)
        path.lineTo(w - dx, dy)
        path.lineTo(w - dx, 0)
        path.lineTo(w, 0)
      }

      path.lineTo(w, h)
      path.lineTo(0, h)
      path.lineTo(0, dy)
      path.close()
      path.end()
    }
  }

  MxCellRenderer.registerShape('folder', FolderShape)

  // Card shape
  function CardShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CardShape, MxActor)
  CardShape.prototype.size = 30
  CardShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = Math.max(0, Math.min(w, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(s, 0), new MxPoint(w, 0), new MxPoint(w, h), new MxPoint(0, h), new MxPoint(0, s)],
      this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('card', CardShape)

  // Tape shape
  function TapeShape() {
    MxActor.call(this)
  }
  MxUtils.extend(TapeShape, MxActor)
  TapeShape.prototype.size = 0.4
  TapeShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dy = h * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let fy = 1.4

    c.moveTo(0, dy / 2)
    c.quadTo(w / 4, dy * fy, w / 2, dy / 2)
    c.quadTo(w * 3 / 4, dy * (1 - fy), w, dy / 2)
    c.lineTo(w, h - dy / 2)
    c.quadTo(w * 3 / 4, h - dy * fy, w / 2, h - dy / 2)
    c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2)
    c.lineTo(0, dy / 2)
    c.close()
    c.end()
  }

  TapeShape.prototype.getLabelBounds = function(rect) {
    if (MxUtils.getValue(this.style, 'boundedLbl', false)) {
      let size = MxUtils.getValue(this.style, 'size', this.size)
      let w = rect.width
      let h = rect.height

      if (this.direction === null ||
          this.direction === MxConstants.DIRECTION_EAST ||
          this.direction === MxConstants.DIRECTION_WEST
      ) {
        let dy = h * size

        return new MxRectangle(rect.x, rect.y + dy, w, h - 2 * dy)
      } else {
        let dx = w * size

        return new MxRectangle(rect.x + dx, rect.y, w - 2 * dx, h)
      }
    }

    return rect
  }

  MxCellRenderer.registerShape('tape', TapeShape)

  // Document shape
  function DocumentShape() {
    MxActor.call(this)
  }
  MxUtils.extend(DocumentShape, MxActor)
  DocumentShape.prototype.size = 0.3
  DocumentShape.prototype.getLabelMargins = function(rect) {
    if (MxUtils.getValue(this.style, 'boundedLbl', false)) {
      return new MxRectangle(0, 0, 0, parseFloat(MxUtils.getValue(
        this.style, 'size', this.size)) * rect.height)
    }

    return null
  }
  DocumentShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dy = h * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let fy = 1.4

    c.moveTo(0, 0)
    c.lineTo(w, 0)
    c.lineTo(w, h - dy / 2)
    c.quadTo(w * 3 / 4, h - dy * fy, w / 2, h - dy / 2)
    c.quadTo(w / 4, h - dy * (1 - fy), 0, h - dy / 2)
    c.lineTo(0, dy / 2)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('document', DocumentShape)

  MxCylinder.prototype.getLabelMargins = function(rect) {
    if (MxUtils.getValue(this.style, 'boundedLbl', false)) {
      return new MxRectangle(0, Math.min(this.maxHeight * this.scale, rect.height * 0.3), 0, 0)
    }

    return null
  }

  // Parallelogram shape
  function ParallelogramShape() {
    MxActor.call(this)
  }
  MxUtils.extend(ParallelogramShape, MxActor)
  ParallelogramShape.prototype.size = 0.2
  ParallelogramShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, h), new MxPoint(dx, 0), new MxPoint(w, 0), new MxPoint(w - dx, h)],
      this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('parallelogram', ParallelogramShape)

  // Trapezoid shape
  function TrapezoidShape() {
    MxActor.call(this)
  }
  MxUtils.extend(TrapezoidShape, MxActor)
  TrapezoidShape.prototype.size = 0.2
  TrapezoidShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = w * Math.max(0, Math.min(0.5, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, h), new MxPoint(dx, 0), new MxPoint(w - dx, 0), new MxPoint(w, h)],
      this.isRounded, arcSize, true)
  }

  MxCellRenderer.registerShape('trapezoid', TrapezoidShape)

  // Curly Bracket shape
  function CurlyBracketShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CurlyBracketShape, MxActor)
  CurlyBracketShape.prototype.size = 0.5
  CurlyBracketShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.setFillColor(null)
    let s = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(w, 0), new MxPoint(s, 0), new MxPoint(s, h / 2),
      new MxPoint(0, h / 2), new MxPoint(s, h / 2), new MxPoint(s, h),
      new MxPoint(w, h)], this.isRounded, arcSize, false)
    c.end()
  }

  MxCellRenderer.registerShape('curlyBracket', CurlyBracketShape)

  // Parallel marker shape
  function ParallelMarkerShape() {
    MxActor.call(this)
  }
  MxUtils.extend(ParallelMarkerShape, MxActor)
  ParallelMarkerShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.setStrokeWidth(1)
    c.setFillColor(this.stroke)
    let w2 = w / 5
    c.rect(0, 0, w2, h)
    c.fillAndStroke()
    c.rect(2 * w2, 0, w2, h)
    c.fillAndStroke()
    c.rect(4 * w2, 0, w2, h)
    c.fillAndStroke()
  }

  MxCellRenderer.registerShape('parallelMarker', ParallelMarkerShape)

  /**
   * Adds handJiggle style (jiggle=n sets jiggle)
   */
  function HandJiggle(canvas, defaultVariation) {
    this.canvas = canvas

    // Avoids "spikes" in the output
    this.canvas.setLineJoin('round')
    this.canvas.setLineCap('round')

    this.defaultVariation = defaultVariation

    this.originalLineTo = this.canvas.lineTo
    this.canvas.lineTo = MxUtils.bind(this, HandJiggle.prototype.lineTo)

    this.originalMoveTo = this.canvas.moveTo
    this.canvas.moveTo = MxUtils.bind(this, HandJiggle.prototype.moveTo)

    this.originalClose = this.canvas.close
    this.canvas.close = MxUtils.bind(this, HandJiggle.prototype.close)

    this.originalQuadTo = this.canvas.quadTo
    this.canvas.quadTo = MxUtils.bind(this, HandJiggle.prototype.quadTo)

    this.originalCurveTo = this.canvas.curveTo
    this.canvas.curveTo = MxUtils.bind(this, HandJiggle.prototype.curveTo)

    this.originalArcTo = this.canvas.arcTo
    this.canvas.arcTo = MxUtils.bind(this, HandJiggle.prototype.arcTo)
  }

  HandJiggle.prototype.moveTo = function(endX, endY) {
    this.originalMoveTo.apply(this.canvas, arguments)
    this.lastX = endX
    this.lastY = endY
    this.firstX = endX
    this.firstY = endY
  }

  HandJiggle.prototype.close = function() {
    if (this.firstX !== null && this.firstY !== null) {
      this.lineTo(this.firstX, this.firstY)
      this.originalClose.apply(this.canvas, arguments)
    }

    this.originalClose.apply(this.canvas, arguments)
  }

  HandJiggle.prototype.quadTo = function(x1, y1, x2, y2) {
    this.originalQuadTo.apply(this.canvas, arguments)
    this.lastX = x2
    this.lastY = y2
  }

  HandJiggle.prototype.curveTo = function(x1, y1, x2, y2, x3, y3) {
    this.originalCurveTo.apply(this.canvas, arguments)
    this.lastX = x3
    this.lastY = y3
  }

  HandJiggle.prototype.arcTo = function(rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
    this.originalArcTo.apply(this.canvas, arguments)
    this.lastX = x
    this.lastY = y
  }

  HandJiggle.prototype.lineTo = function(endX, endY) {
    // LATER: Check why this.canvas.lastX cannot be used
    if (this.lastX !== null && this.lastY !== null) {
      let dx = Math.abs(endX - this.lastX)
      let dy = Math.abs(endY - this.lastY)
      let dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 2) {
        this.originalLineTo.apply(this.canvas, arguments)
        this.lastX = endX
        this.lastY = endY

        return
      }

      let segs = Math.round(dist / 10)
      let variation = this.defaultVariation

      if (segs < 5) {
        segs = 5
        variation /= 3
      }

      const sign = function(x) {
        return typeof x === 'number' ? ((x ? (x < 0 ? -1 : 1) : x) === x ? 0 : NaN) : NaN
      }

      let stepX = sign(endX - this.lastX) * dx / segs
      let stepY = sign(endY - this.lastY) * dy / segs

      let fx = dx / dist
      let fy = dy / dist

      for (let s = 0; s < segs; s++) {
        let x = stepX * s + this.lastX
        let y = stepY * s + this.lastY

        let offset = (Math.random() - 0.5) * variation
        this.originalLineTo.call(this.canvas, x - offset * fy, y - offset * fx)
      }

      this.originalLineTo.call(this.canvas, endX, endY)
      this.lastX = endX
      this.lastY = endY
    } else {
      this.originalLineTo.apply(this.canvas, arguments)
      this.lastX = endX
      this.lastY = endY
    }
  }

  HandJiggle.prototype.destroy = function() {
    this.canvas.lineTo = this.originalLineTo
    this.canvas.moveTo = this.originalMoveTo
    this.canvas.close = this.originalClose
    this.canvas.quadTo = this.originalQuadTo
    this.canvas.curveTo = this.originalCurveTo
    this.canvas.arcTo = this.originalArcTo
  }

  // Installs hand jiggle in all shapes
  let mxShapePaint0 = MxShape.prototype.paint
  MxShape.prototype.defaultJiggle = 1.5
  MxShape.prototype.paint = function(c) {
    // NOTE: getValue does not return a boolean value so !('0') would return true here and below
    if (this.style !== null && MxUtils.getValue(this.style, 'comic', '0') !== '0' && c.handHiggle === null) {
      c.handJiggle = new HandJiggle(c, MxUtils.getValue(this.style, 'jiggle', this.defaultJiggle))
    }

    mxShapePaint0.apply(this, arguments)

    if (c.handJiggle !== null) {
      c.handJiggle.destroy()
      delete c.handJiggle
    }
  }

  // Sets default jiggle for diamond
  MxRhombus.prototype.defaultJiggle = 2

  /**
   * Overrides to avoid call to rect
   */
  let mxRectangleShapeIsHtmlAllowed0 = MxRectangleShape.prototype.isHtmlAllowed
  MxRectangleShape.prototype.isHtmlAllowed = function() {
    return (this.style === null || MxUtils.getValue(this.style, 'comic', '0') === '0') &&
      mxRectangleShapeIsHtmlAllowed0.apply(this, arguments)
  }

  let mxRectangleShapePaintBackground0 = MxRectangleShape.prototype.paintBackground
  MxRectangleShape.prototype.paintBackground = function(c, x, y, w, h) {
    if (c.handJiggle === null) {
      mxRectangleShapePaintBackground0.apply(this, arguments)
    } else {
      let events = true

      if (this.style !== null) {
        events = MxUtils.getValue(this.style, MxConstants.STYLE_POINTER_EVENTS, '1') === '1'
      }

      if (events || (this.fill !== null && this.fill !== MxConstants.NONE) ||
        (this.stroke !== null && this.stroke !== MxConstants.NONE)
      ) {
        if (!events && (this.fill === null || this.fill === MxConstants.NONE)) {
          c.pointerEvents = false
        }

        c.begin()

        if (this.isRounded) {
          let r = 0

          if (MxUtils.getValue(this.style, MxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
            r = Math.min(w / 2, Math.min(h / 2, MxUtils.getValue(this.style,
              MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2))
          } else {
            let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
            r = Math.min(w * f, h * f)
          }

          c.moveTo(x + r, y)
          c.lineTo(x + w - r, y)
          c.quadTo(x + w, y, x + w, y + r)
          c.lineTo(x + w, y + h - r)
          c.quadTo(x + w, y + h, x + w - r, y + h)
          c.lineTo(x + r, y + h)
          c.quadTo(x, y + h, x, y + h - r)
          c.lineTo(x, y + r)
          c.quadTo(x, y, x + r, y)
        } else {
          c.moveTo(x, y)
          c.lineTo(x + w, y)
          c.lineTo(x + w, y + h)
          c.lineTo(x, y + h)
          c.lineTo(x, y)
        }

        // LATER: Check if close is needed here
        c.close()
        c.end()

        c.fillAndStroke()
      }
    }
  }

  /**
   * Disables glass effect with hand jiggle.
   */
  let mxRectangleShapePaintForeground0 = MxRectangleShape.prototype.paintForeground
  MxRectangleShape.prototype.paintForeground = function(c, x, y, w, h) {
    if (c.handJiggle === null) {
      mxRectangleShapePaintForeground0.apply(this, arguments)
    }
  }

  // End of hand jiggle integration

  // Process Shape
  function ProcessShape() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(ProcessShape, MxRectangleShape)
  ProcessShape.prototype.size = 0.1
  ProcessShape.prototype.isHtmlAllowed = function() {
    return false
  }
  ProcessShape.prototype.getLabelBounds = function(rect) {
    if (MxUtils.getValue(this.state.style, MxConstants.STYLE_HORIZONTAL, true) ===
      (this.direction === null ||
      this.direction === MxConstants.DIRECTION_EAST ||
      this.direction === MxConstants.DIRECTION_WEST)
    ) {
      let w = rect.width
      let h = rect.height
      let r = new MxRectangle(rect.x, rect.y, w, h)

      let inset = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))

      if (this.isRounded) {
        let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE,
          MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
        inset = Math.max(inset, Math.min(w * f, h * f))
      }

      r.x += Math.round(inset)
      r.width -= Math.round(2 * inset)

      return r
    }

    return rect
  }
  ProcessShape.prototype.paintForeground = function(c, x, y, w, h) {
    let inset = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))

    if (this.isRounded) {
      let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE,
        MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
      inset = Math.max(inset, Math.min(w * f, h * f))
    }

    // Crisp rendering of inner lines
    inset = Math.round(inset)

    c.begin()
    c.moveTo(x + inset, y)
    c.lineTo(x + inset, y + h)
    c.moveTo(x + w - inset, y)
    c.lineTo(x + w - inset, y + h)
    c.end()
    c.stroke()
    MxRectangleShape.prototype.paintForeground.apply(this, arguments)
  }

  MxCellRenderer.registerShape('process', ProcessShape)

  // Transparent Shape
  function TransparentShape() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(TransparentShape, MxRectangleShape)
  TransparentShape.prototype.paintBackground = function(c, x, y, w, h) {
    c.setFillColor(MxConstants.NONE)
    c.rect(x, y, w, h)
    c.fill()
  }
  TransparentShape.prototype.paintForeground = function(c, x, y, w, h) { }

  MxCellRenderer.registerShape('transparent', TransparentShape)

  // Callout shape
  function CalloutShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CalloutShape, MxHexagon)
  CalloutShape.prototype.size = 30
  CalloutShape.prototype.position = 0.5
  CalloutShape.prototype.position2 = 0.5
  CalloutShape.prototype.base = 20
  CalloutShape.prototype.getLabelMargins = function() {
    return new MxRectangle(0, 0, 0, parseFloat(MxUtils.getValue(
      this.style, 'size', this.size)) * this.scale)
  }
  CalloutShape.prototype.redrawPath = function(c, x, y, w, h) {
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    let s = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let dx = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'position', this.position))))
    let dx2 = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'position2', this.position2))))
    let base = Math.max(0, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'base', this.base))))

    this.addPoints(c,
      [new MxPoint(0, 0), new MxPoint(w, 0), new MxPoint(w, h - s),
        new MxPoint(Math.min(w, dx + base), h - s), new MxPoint(dx2, h),
        new MxPoint(Math.max(0, dx), h - s), new MxPoint(0, h - s)],
      this.isRounded, arcSize, true, [4]
    )
  }

  MxCellRenderer.registerShape('callout', CalloutShape)

  // Step shape
  function StepShape() {
    MxActor.call(this)
  }
  MxUtils.extend(StepShape, MxActor)
  StepShape.prototype.size = 0.2
  StepShape.prototype.fixedSize = 20
  StepShape.prototype.redrawPath = function(c, x, y, w, h) {
    let fixed = MxUtils.getValue(this.style, 'fixedSize', '0') !== '0'
    let s = (fixed) ? Math.max(0, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'size', this.fixedSize)))) : w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, 0), new MxPoint(w - s, 0), new MxPoint(w, h / 2), new MxPoint(w - s, h),
      new MxPoint(0, h), new MxPoint(s, h / 2)], this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('step', StepShape)

  // Hexagon shape
  function HexagonShape() {
    MxActor.call(this)
  }
  MxUtils.extend(HexagonShape, MxHexagon)
  HexagonShape.prototype.size = 0.25
  HexagonShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(s, 0), new MxPoint(w - s, 0), new MxPoint(w, 0.5 * h), new MxPoint(w - s, h),
      new MxPoint(s, h), new MxPoint(0, 0.5 * h)], this.isRounded, arcSize, true)
  }

  MxCellRenderer.registerShape('hexagon', HexagonShape)

  // Plus Shape
  function PlusShape() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(PlusShape, MxRectangleShape)
  PlusShape.prototype.isHtmlAllowed = function() {
    return false
  }
  PlusShape.prototype.paintForeground = function(c, x, y, w, h) {
    let border = Math.min(w / 5, h / 5) + 1

    c.begin()
    c.moveTo(x + w / 2, y + border)
    c.lineTo(x + w / 2, y + h - border)
    c.moveTo(x + border, y + h / 2)
    c.lineTo(x + w - border, y + h / 2)
    c.end()
    c.stroke()
    MxRectangleShape.prototype.paintForeground.apply(this, arguments)
  }

  MxCellRenderer.registerShape('plus', PlusShape)

  // Overrides painting of rhombus shape to allow for double style
  let mxRhombusPaintVertexShape = MxRhombus.prototype.paintVertexShape
  MxRhombus.prototype.getLabelBounds = function(rect) {
    if (this.style['double'] === 1) {
      let margin = (Math.max(2, this.strokewidth + 1) * 2 + parseFloat(
        this.style[MxConstants.STYLE_MARGIN] || 0)) * this.scale

      return new MxRectangle(rect.x + margin, rect.y + margin,
        rect.width - 2 * margin, rect.height - 2 * margin)
    }

    return rect
  }
  MxRhombus.prototype.paintVertexShape = function(c, x, y, w, h) {
    mxRhombusPaintVertexShape.apply(this, arguments)

    if (!this.outline && this.style['double'] === 1) {
      let margin = Math.max(2, this.strokewidth + 1) * 2 + parseFloat(this.style[MxConstants.STYLE_MARGIN] || 0)
      x += margin
      y += margin
      w -= 2 * margin
      h -= 2 * margin

      if (w > 0 && h > 0) {
        c.setShadow(false)

        // Workaround for closure compiler bug where the lines with x and y above
        // are removed if arguments is used as second argument in call below.
        mxRhombusPaintVertexShape.apply(this, [c, x, y, w, h])
      }
    }
  }

  // CompositeShape
  function ExtendedShape() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(ExtendedShape, MxRectangleShape)
  ExtendedShape.prototype.isHtmlAllowed = function() {
    return false
  }
  ExtendedShape.prototype.getLabelBounds = function(rect) {
    if (this.style['double'] === 1) {
      let margin = (Math.max(2, this.strokewidth + 1) + parseFloat(
        this.style[MxConstants.STYLE_MARGIN] || 0)) * this.scale

      return new MxRectangle(rect.x + margin, rect.y + margin,
        rect.width - 2 * margin, rect.height - 2 * margin)
    }

    return rect
  }

  ExtendedShape.prototype.paintForeground = function(c, x, y, w, h) {
    if (this.style !== null) {
      if (!this.outline && this.style['double'] === 1) {
        let margin = Math.max(2, this.strokewidth + 1) + parseFloat(this.style[MxConstants.STYLE_MARGIN] || 0)
        x += margin
        y += margin
        w -= 2 * margin
        h -= 2 * margin

        if (w > 0 && h > 0) {
          MxRectangleShape.prototype.paintBackground.apply(this, arguments)
        }
      }

      c.setDashed(false)

      // Draws the symbols defined in the style. The symbols are
      // numbered from 1...n. Possible postfixes are align,
      // verticalAlign, spacing, arcSpacing, width, height
      let counter = 0
      let shape = null

      do {
        shape = MxCellRenderer.defaultShapes[this.style['symbol' + counter]]

        if (shape !== null) {
          let align = this.style['symbol' + counter + 'Align']
          let valign = this.style['symbol' + counter + 'VerticalAlign']
          let width = this.style['symbol' + counter + 'Width']
          let height = this.style['symbol' + counter + 'Height']
          let spacing = this.style['symbol' + counter + 'Spacing'] || 0
          let vspacing = this.style['symbol' + counter + 'VSpacing'] || spacing
          let arcspacing = this.style['symbol' + counter + 'ArcSpacing']

          if (arcspacing !== null) {
            let arcSize = this.getArcSize(w + this.strokewidth, h + this.strokewidth) * arcspacing
            spacing += arcSize
            vspacing += arcSize
          }

          let x2 = x
          let y2 = y

          if (align === MxConstants.ALIGN_CENTER) {
            x2 += (w - width) / 2
          } else if (align === MxConstants.ALIGN_RIGHT) {
            x2 += w - width - spacing
          } else {
            x2 += spacing
          }

          if (valign === MxConstants.ALIGN_MIDDLE) {
            y2 += (h - height) / 2
          } else if (valign === MxConstants.ALIGN_BOTTOM) {
            y2 += h - height - vspacing
          } else {
            y2 += vspacing
          }

          c.save()

          // Small hack to pass style along into subshape
          let tmp = new shape()
          // TODO: Clone style and override settings (eg. strokewidth)
          tmp.style = this.style
          shape.prototype.paintVertexShape.call(tmp, c, x2, y2, width, height)
          c.restore()
        }

        counter++
      }
      while (shape !== null)
    }

    // Paints glass effect
    MxRectangleShape.prototype.paintForeground.apply(this, arguments)
  }

  MxCellRenderer.registerShape('ext', ExtendedShape)

  // Tape Shape, supports size style
  function MessageShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(MessageShape, MxCylinder)
  MessageShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    if (isForeground) {
      path.moveTo(0, 0)
      path.lineTo(w / 2, h / 2)
      path.lineTo(w, 0)
      path.end()
    } else {
      path.moveTo(0, 0)
      path.lineTo(w, 0)
      path.lineTo(w, h)
      path.lineTo(0, h)
      path.close()
    }
  }

  MxCellRenderer.registerShape('message', MessageShape)

  // UML Actor Shape
  function UmlActorShape() {
    MxShape.call(this)
  }
  MxUtils.extend(UmlActorShape, MxShape)
  UmlActorShape.prototype.paintBackground = function(c, x, y, w, h) {
    c.translate(x, y)

    // Head
    c.ellipse(w / 4, 0, w / 2, h / 4)
    c.fillAndStroke()

    c.begin()
    c.moveTo(w / 2, h / 4)
    c.lineTo(w / 2, 2 * h / 3)

    // Arms
    c.moveTo(w / 2, h / 3)
    c.lineTo(0, h / 3)
    c.moveTo(w / 2, h / 3)
    c.lineTo(w, h / 3)

    // Legs
    c.moveTo(w / 2, 2 * h / 3)
    c.lineTo(0, h)
    c.moveTo(w / 2, 2 * h / 3)
    c.lineTo(w, h)
    c.end()

    c.stroke()
  }

  // Replaces existing actor shape
  MxCellRenderer.registerShape('umlActor', UmlActorShape)

  // UML Boundary Shape
  function UmlBoundaryShape() {
    MxShape.call(this)
  }
  MxUtils.extend(UmlBoundaryShape, MxShape)
  UmlBoundaryShape.prototype.getLabelMargins = function(rect) {
    return new MxRectangle(rect.width / 6, 0, 0, 0)
  }
  UmlBoundaryShape.prototype.paintBackground = function(c, x, y, w, h) {
    c.translate(x, y)

    // Base line
    c.begin()
    c.moveTo(0, h / 4)
    c.lineTo(0, h * 3 / 4)
    c.end()
    c.stroke()

    // Horizontal line
    c.begin()
    c.moveTo(0, h / 2)
    c.lineTo(w / 6, h / 2)
    c.end()
    c.stroke()

    // Circle
    c.ellipse(w / 6, 0, w * 5 / 6, h)
    c.fillAndStroke()
  }

  // Replaces existing actor shape
  MxCellRenderer.registerShape('umlBoundary', UmlBoundaryShape)

  // UML Entity Shape
  function UmlEntityShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(UmlEntityShape, MxEllipse)
  UmlEntityShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxEllipse.prototype.paintVertexShape.apply(this, arguments)

    c.begin()
    c.moveTo(x + w / 8, y + h)
    c.lineTo(x + w * 7 / 8, y + h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('umlEntity', UmlEntityShape)

  // UML Destroy Shape
  function UmlDestroyShape() {
    MxShape.call(this)
  }
  MxUtils.extend(UmlDestroyShape, MxShape)
  UmlDestroyShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    c.translate(x, y)

    c.begin()
    c.moveTo(w, 0)
    c.lineTo(0, h)
    c.moveTo(0, 0)
    c.lineTo(w, h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('umlDestroy', UmlDestroyShape)

  // UML Control Shape
  function UmlControlShape() {
    MxShape.call(this)
  }
  MxUtils.extend(UmlControlShape, MxShape)
  UmlControlShape.prototype.getLabelBounds = function(rect) {
    return new MxRectangle(rect.x, rect.y + rect.height / 8, rect.width, rect.height * 7 / 8)
  }
  UmlControlShape.prototype.paintBackground = function(c, x, y, w, h) {
    c.translate(x, y)

    // Upper line
    c.begin()
    c.moveTo(w * 3 / 8, h / 8 * 1.1)
    c.lineTo(w * 5 / 8, 0)
    c.end()
    c.stroke()

    // Circle
    c.ellipse(0, h / 8, w, h * 7 / 8)
    c.fillAndStroke()
  }
  UmlControlShape.prototype.paintForeground = function(c, x, y, w, h) {
    // Lower line
    c.begin()
    c.moveTo(w * 3 / 8, h / 8 * 1.1)
    c.lineTo(w * 5 / 8, h / 4)
    c.end()
    c.stroke()
  }

  // Replaces existing actor shape
  MxCellRenderer.registerShape('umlControl', UmlControlShape)

  // UML Lifeline Shape
  function UmlLifeline() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(UmlLifeline, MxRectangleShape)
  UmlLifeline.prototype.size = 40
  UmlLifeline.prototype.isHtmlAllowed = function() {
    return false
  }
  UmlLifeline.prototype.getLabelBounds = function(rect) {
    let size = Math.max(0, Math.min(rect.height, parseFloat(
      MxUtils.getValue(this.style, 'size', this.size)) * this.scale))

    return new MxRectangle(rect.x, rect.y, rect.width, size)
  }
  UmlLifeline.prototype.paintBackground = function(c, x, y, w, h) {
    let size = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let participant = MxUtils.getValue(this.style, 'participant')

    if (participant === null || this.state === null) {
      MxRectangleShape.prototype.paintBackground.call(this, c, x, y, w, size)
    } else {
      let ctor = this.state.view.graph.cellRenderer.getShape(participant)

      if (ctor !== null && ctor !== UmlLifeline) {
        let shape = new ctor()
        shape.apply(this.state)
        c.save()
        shape.paintVertexShape(c, x, y, w, size)
        c.restore()
      }
    }

    if (size < h) {
      c.setDashed(true)
      c.begin()
      c.moveTo(x + w / 2, y + size)
      c.lineTo(x + w / 2, y + h)
      c.end()
      c.stroke()
    }
  }
  UmlLifeline.prototype.paintForeground = function(c, x, y, w, h) {
    let size = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    MxRectangleShape.prototype.paintForeground.call(this, c, x, y, w, Math.min(h, size))
  }

  MxCellRenderer.registerShape('umlLifeline', UmlLifeline)

  // UML Frame Shape
  function UmlFrame() {
    MxShape.call(this)
  }
  MxUtils.extend(UmlFrame, MxShape)
  UmlFrame.prototype.width = 60
  UmlFrame.prototype.height = 30
  UmlFrame.prototype.corner = 10
  UmlFrame.prototype.getLabelMargins = function(rect) {
    return new MxRectangle(0, 0,
      rect.width - (parseFloat(MxUtils.getValue(this.style, 'width', this.width) * this.scale)),
      rect.height - (parseFloat(MxUtils.getValue(this.style, 'height', this.height) * this.scale)))
  }
  UmlFrame.prototype.paintBackground = function(c, x, y, w, h) {
    let co = this.corner
    let w0 = Math.min(w, Math.max(co, parseFloat(MxUtils.getValue(this.style, 'width', this.width))))
    let h0 = Math.min(h, Math.max(co * 1.5, parseFloat(MxUtils.getValue(this.style, 'height', this.height))))
    let bg = MxUtils.getValue(this.style, MxConstants.STYLE_SWIMLANE_FILLCOLOR, MxConstants.NONE)

    if (bg !== MxConstants.NONE) {
      c.setFillColor(bg)
      c.rect(x, y, w, h)
      c.fill()
    }

    if (this.fill !== null && this.fill !== MxConstants.NONE && this.gradient && this.gradient !== MxConstants.NONE) {
      let b = this.getGradientBounds(c, x, y, w, h) // eslint-disable-line no-unused-vars
      c.setGradient(this.fill, this.gradient, x, y, w, h, this.gradientDirection)
    } else {
      c.setFillColor(this.fill)
    }

    c.begin()
    c.moveTo(x, y)
    c.lineTo(x + w0, y)
    c.lineTo(x + w0, y + Math.max(0, h0 - co * 1.5))
    c.lineTo(x + Math.max(0, w0 - co), y + h0)
    c.lineTo(x, y + h0)
    c.close()
    c.fillAndStroke()

    c.begin()
    c.moveTo(x + w0, y)
    c.lineTo(x + w, y)
    c.lineTo(x + w, y + h)
    c.lineTo(x, y + h)
    c.lineTo(x, y + h0)
    c.stroke()
  }

  MxCellRenderer.registerShape('umlFrame', UmlFrame)

  MxPerimeter.LifelinePerimeter = function(bounds, vertex, next, orthogonal) {
    let size = UmlLifeline.prototype.size

    if (vertex !== null) {
      size = MxUtils.getValue(vertex.style, 'size', size) * vertex.view.scale
    }

    let sw = (parseFloat(vertex.style[MxConstants.STYLE_STROKEWIDTH] || 1) * vertex.view.scale / 2) - 1

    if (next.x < bounds.getCenterX()) {
      sw += 1
      sw *= -1
    }

    return new MxPoint(bounds.getCenterX() + sw, Math.min(bounds.y + bounds.height, Math.max(bounds.y + size, next.y)))
  }

  MxStyleRegistry.putValue('lifelinePerimeter', MxPerimeter.LifelinePerimeter)

  MxPerimeter.OrthogonalPerimeter = function(bounds, vertex, next, orthogonal) {
    orthogonal = true

    return MxPerimeter.RectanglePerimeter.apply(this, arguments)
  }

  MxStyleRegistry.putValue('orthogonalPerimeter', MxPerimeter.OrthogonalPerimeter)

  MxPerimeter.BackbonePerimeter = function(bounds, vertex, next, orthogonal) {
    let sw = (parseFloat(vertex.style[MxConstants.STYLE_STROKEWIDTH] || 1) * vertex.view.scale / 2) - 1

    if (vertex.style['backboneSize'] !== null) {
      sw += (parseFloat(vertex.style['backboneSize']) * vertex.view.scale / 2) - 1
    }

    if (vertex.style[MxConstants.STYLE_DIRECTION] === 'south' || vertex.style[MxConstants.STYLE_DIRECTION] === 'north') {
      if (next.x < bounds.getCenterX()) {
        sw += 1
        sw *= -1
      }

      return new MxPoint(bounds.getCenterX() + sw, Math.min(bounds.y + bounds.height, Math.max(bounds.y, next.y)))
    } else {
      if (next.y < bounds.getCenterY()) {
        sw += 1
        sw *= -1
      }

      return new MxPoint(Math.min(bounds.x + bounds.width, Math.max(bounds.x, next.x)),
        bounds.getCenterY() + sw)
    }
  }

  MxStyleRegistry.putValue('backbonePerimeter', MxPerimeter.BackbonePerimeter)

  // Callout Perimeter
  MxPerimeter.CalloutPerimeter = function(bounds, vertex, next, orthogonal) {
    return MxPerimeter.RectanglePerimeter(MxUtils.getDirectedBounds(bounds, new MxRectangle(0, 0, 0,
      Math.max(0, Math.min(bounds.height, parseFloat(MxUtils.getValue(vertex.style, 'size',
        CalloutShape.prototype.size)) * vertex.view.scale))),
    vertex.style), vertex, next, orthogonal)
  }

  MxStyleRegistry.putValue('calloutPerimeter', MxPerimeter.CalloutPerimeter)

  // Parallelogram Perimeter
  MxPerimeter.ParallelogramPerimeter = function(bounds, vertex, next, orthogonal) {
    let size = ParallelogramShape.prototype.size

    if (vertex !== null) {
      size = MxUtils.getValue(vertex.style, 'size', size)
    }

    let x = bounds.x
    let y = bounds.y
    let w = bounds.width
    let h = bounds.height

    let direction = (vertex !== null) ? MxUtils.getValue(
      vertex.style, MxConstants.STYLE_DIRECTION,
      MxConstants.DIRECTION_EAST) : MxConstants.DIRECTION_EAST
    let vertical = direction === MxConstants.DIRECTION_NORTH ||
      direction === MxConstants.DIRECTION_SOUTH
    let points

    if (vertical) {
      let dy = h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y), new MxPoint(x + w, y + dy),
        new MxPoint(x + w, y + h), new MxPoint(x, y + h - dy), new MxPoint(x, y)]
    } else {
      let dx = w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x + dx, y), new MxPoint(x + w, y),
        new MxPoint(x + w - dx, y + h), new MxPoint(x, y + h), new MxPoint(x + dx, y)]
    }

    let cx = bounds.getCenterX()
    let cy = bounds.getCenterY()

    let p1 = new MxPoint(cx, cy)

    if (orthogonal) {
      if (next.x < x || next.x > x + w) {
        p1.y = next.y
      } else {
        p1.x = next.x
      }
    }

    return MxUtils.getPerimeterPoint(points, p1, next)
  }

  MxStyleRegistry.putValue('parallelogramPerimeter', MxPerimeter.ParallelogramPerimeter)

  // Trapezoid Perimeter
  MxPerimeter.TrapezoidPerimeter = function(bounds, vertex, next, orthogonal) {
    let size = TrapezoidShape.prototype.size

    if (vertex !== null) {
      size = MxUtils.getValue(vertex.style, 'size', size)
    }

    let x = bounds.x
    let y = bounds.y
    let w = bounds.width
    let h = bounds.height

    let direction = (vertex !== null) ? MxUtils.getValue(
      vertex.style, MxConstants.STYLE_DIRECTION,
      MxConstants.DIRECTION_EAST) : MxConstants.DIRECTION_EAST
    let points

    if (direction === MxConstants.DIRECTION_EAST) {
      let dx = w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x + dx, y), new MxPoint(x + w - dx, y),
        new MxPoint(x + w, y + h), new MxPoint(x, y + h), new MxPoint(x + dx, y)]
    } else if (direction === MxConstants.DIRECTION_WEST) {
      let dx = w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y), new MxPoint(x + w, y),
        new MxPoint(x + w - dx, y + h), new MxPoint(x + dx, y + h), new MxPoint(x, y)]
    } else if (direction === MxConstants.DIRECTION_NORTH) {
      let dy = h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y + dy), new MxPoint(x + w, y),
        new MxPoint(x + w, y + h), new MxPoint(x, y + h - dy), new MxPoint(x, y + dy)]
    } else {
      let dy = h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y), new MxPoint(x + w, y + dy),
        new MxPoint(x + w, y + h - dy), new MxPoint(x, y + h), new MxPoint(x, y)]
    }

    let cx = bounds.getCenterX()
    let cy = bounds.getCenterY()

    let p1 = new MxPoint(cx, cy)

    if (orthogonal) {
      if (next.x < x || next.x > x + w) {
        p1.y = next.y
      } else {
        p1.x = next.x
      }
    }

    return MxUtils.getPerimeterPoint(points, p1, next)
  }

  MxStyleRegistry.putValue('trapezoidPerimeter', MxPerimeter.TrapezoidPerimeter)

  // Step Perimeter
  MxPerimeter.StepPerimeter = function(bounds, vertex, next, orthogonal) {
    let fixed = MxUtils.getValue(vertex.style, 'fixedSize', '0') !== '0'
    let size = (fixed) ? StepShape.prototype.fixedSize : StepShape.prototype.size

    if (vertex !== null) {
      size = MxUtils.getValue(vertex.style, 'size', size)
    }

    let x = bounds.x
    let y = bounds.y
    let w = bounds.width
    let h = bounds.height

    let cx = bounds.getCenterX()
    let cy = bounds.getCenterY()

    let direction = (vertex !== null) ? MxUtils.getValue(
      vertex.style, MxConstants.STYLE_DIRECTION,
      MxConstants.DIRECTION_EAST) : MxConstants.DIRECTION_EAST
    let points

    if (direction === MxConstants.DIRECTION_EAST) {
      let dx = (fixed) ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y), new MxPoint(x + w - dx, y), new MxPoint(x + w, cy),
        new MxPoint(x + w - dx, y + h), new MxPoint(x, y + h),
        new MxPoint(x + dx, cy), new MxPoint(x, y)]
    } else if (direction === MxConstants.DIRECTION_WEST) {
      let dx = (fixed) ? Math.max(0, Math.min(w, size)) : w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x + dx, y), new MxPoint(x + w, y), new MxPoint(x + w - dx, cy),
        new MxPoint(x + w, y + h), new MxPoint(x + dx, y + h),
        new MxPoint(x, cy), new MxPoint(x + dx, y)]
    } else if (direction === MxConstants.DIRECTION_NORTH) {
      let dy = (fixed) ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y + dy), new MxPoint(cx, y), new MxPoint(x + w, y + dy),
        new MxPoint(x + w, y + h), new MxPoint(cx, y + h - dy),
        new MxPoint(x, y + h), new MxPoint(x, y + dy)]
    } else {
      let dy = (fixed) ? Math.max(0, Math.min(h, size)) : h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x, y), new MxPoint(cx, y + dy), new MxPoint(x + w, y),
        new MxPoint(x + w, y + h - dy), new MxPoint(cx, y + h),
        new MxPoint(x, y + h - dy), new MxPoint(x, y)]
    }

    let p1 = new MxPoint(cx, cy)

    if (orthogonal) {
      if (next.x < x || next.x > x + w) {
        p1.y = next.y
      } else {
        p1.x = next.x
      }
    }

    return MxUtils.getPerimeterPoint(points, p1, next)
  }

  MxStyleRegistry.putValue('stepPerimeter', MxPerimeter.StepPerimeter)

  // Hexagon Perimeter 2 (keep existing one)
  MxPerimeter.HexagonPerimeter2 = function(bounds, vertex, next, orthogonal) {
    let size = HexagonShape.prototype.size

    if (vertex !== null) {
      size = MxUtils.getValue(vertex.style, 'size', size)
    }

    let x = bounds.x
    let y = bounds.y
    let w = bounds.width
    let h = bounds.height

    let cx = bounds.getCenterX()
    let cy = bounds.getCenterY()

    let direction = (vertex !== null) ? MxUtils.getValue(
      vertex.style, MxConstants.STYLE_DIRECTION,
      MxConstants.DIRECTION_EAST) : MxConstants.DIRECTION_EAST
    let vertical = direction === MxConstants.DIRECTION_NORTH ||
      direction === MxConstants.DIRECTION_SOUTH
    let points

    if (vertical) {
      let dy = h * Math.max(0, Math.min(1, size))
      points = [new MxPoint(cx, y), new MxPoint(x + w, y + dy), new MxPoint(x + w, y + h - dy),
        new MxPoint(cx, y + h), new MxPoint(x, y + h - dy),
        new MxPoint(x, y + dy), new MxPoint(cx, y)
      ]
    } else {
      let dx = w * Math.max(0, Math.min(1, size))
      points = [new MxPoint(x + dx, y), new MxPoint(x + w - dx, y), new MxPoint(x + w, cy),
        new MxPoint(x + w - dx, y + h), new MxPoint(x + dx, y + h),
        new MxPoint(x, cy), new MxPoint(x + dx, y)
      ]
    }

    let p1 = new MxPoint(cx, cy)

    if (orthogonal) {
      if (next.x < x || next.x > x + w) {
        p1.y = next.y
      } else {
        p1.x = next.x
      }
    }

    return MxUtils.getPerimeterPoint(points, p1, next)
  }

  MxStyleRegistry.putValue('hexagonPerimeter2', MxPerimeter.HexagonPerimeter2)

  // Lollipop Shape
  function LollipopShape() {
    MxShape.call(this)
  }
  MxUtils.extend(LollipopShape, MxShape)
  LollipopShape.prototype.size = 10
  LollipopShape.prototype.paintBackground = function(c, x, y, w, h) {
    let sz = parseFloat(MxUtils.getValue(this.style, 'size', this.size))
    c.translate(x, y)

    c.ellipse((w - sz) / 2, 0, sz, sz)
    c.fillAndStroke()

    c.begin()
    c.moveTo(w / 2, sz)
    c.lineTo(w / 2, h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('lollipop', LollipopShape)

  // Lollipop Shape
  function RequiresShape() {
    MxShape.call(this)
  }
  MxUtils.extend(RequiresShape, MxShape)
  RequiresShape.prototype.size = 10
  RequiresShape.prototype.inset = 2
  RequiresShape.prototype.paintBackground = function(c, x, y, w, h) {
    let sz = parseFloat(MxUtils.getValue(this.style, 'size', this.size))
    let inset = parseFloat(MxUtils.getValue(this.style, 'inset', this.inset)) + this.strokewidth
    c.translate(x, y)

    c.begin()
    c.moveTo(w / 2, sz + inset)
    c.lineTo(w / 2, h)
    c.end()
    c.stroke()

    c.begin()
    c.moveTo((w - sz) / 2 - inset, sz / 2)
    c.quadTo((w - sz) / 2 - inset, sz + inset, w / 2, sz + inset)
    c.quadTo((w + sz) / 2 + inset, sz + inset, (w + sz) / 2 + inset, sz / 2)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('requires', RequiresShape)

  // Component shape
  function ComponentShape() {
    MxCylinder.call(this)
  }
  MxUtils.extend(ComponentShape, MxCylinder)
  ComponentShape.prototype.jettyWidth = 32
  ComponentShape.prototype.jettyHeight = 12
  ComponentShape.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
    let dx = parseFloat(MxUtils.getValue(this.style, 'jettyWidth', this.jettyWidth))
    let dy = parseFloat(MxUtils.getValue(this.style, 'jettyHeight', this.jettyHeight))
    let x0 = dx / 2
    let x1 = x0 + dx / 2
    let y0 = 0.3 * h - dy / 2
    let y1 = 0.7 * h - dy / 2

    if (isForeground) {
      path.moveTo(x0, y0)
      path.lineTo(x1, y0)
      path.lineTo(x1, y0 + dy)
      path.lineTo(x0, y0 + dy)
      path.moveTo(x0, y1)
      path.lineTo(x1, y1)
      path.lineTo(x1, y1 + dy)
      path.lineTo(x0, y1 + dy)
      path.end()
    } else {
      path.moveTo(x0, 0)
      path.lineTo(w, 0)
      path.lineTo(w, h)
      path.lineTo(x0, h)
      path.lineTo(x0, y1 + dy)
      path.lineTo(0, y1 + dy)
      path.lineTo(0, y1)
      path.lineTo(x0, y1)
      path.lineTo(x0, y0 + dy)
      path.lineTo(0, y0 + dy)
      path.lineTo(0, y0)
      path.lineTo(x0, y0)
      path.close()
      path.end()
    }
  }

  MxCellRenderer.registerShape('component', ComponentShape)

  // State Shapes derives from double ellipse
  function StateShape() {
    MxDoubleEllipse.call(this)
  }
  MxUtils.extend(StateShape, MxDoubleEllipse)
  StateShape.prototype.outerStroke = true
  StateShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    let inset = Math.min(4, Math.min(w / 5, h / 5))

    if (w > 0 && h > 0) {
      c.ellipse(x + inset, y + inset, w - 2 * inset, h - 2 * inset)
      c.fillAndStroke()
    }

    c.setShadow(false)

    if (this.outerStroke) {
      c.ellipse(x, y, w, h)
      c.stroke()
    }
  }

  MxCellRenderer.registerShape('endState', StateShape)

  function StartStateShape() {
    StateShape.call(this)
  }
  MxUtils.extend(StartStateShape, StateShape)
  StartStateShape.prototype.outerStroke = false

  MxCellRenderer.registerShape('startState', StartStateShape)

  // Link shape
  function LinkShape() {
    MxArrowConnector.call(this)
    this.spacing = 0
  }
  MxUtils.extend(LinkShape, MxArrowConnector)
  LinkShape.prototype.defaultWidth = 4

  LinkShape.prototype.isOpenEnded = function() {
    return true
  }

  LinkShape.prototype.getEdgeWidth = function() {
    return MxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1)
  }

  LinkShape.prototype.isArrowRounded = function() {
    return this.isRounded
  }

  // Registers the link shape
  MxCellRenderer.registerShape('link', LinkShape)

  // Generic arrow
  function FlexArrowShape() {
    MxArrowConnector.call(this)
    this.spacing = 0
  }
  MxUtils.extend(FlexArrowShape, MxArrowConnector)
  FlexArrowShape.prototype.defaultWidth = 10
  FlexArrowShape.prototype.defaultArrowWidth = 20

  FlexArrowShape.prototype.getStartArrowWidth = function() {
    return this.getEdgeWidth() + MxUtils.getNumber(this.style, 'startWidth', this.defaultArrowWidth)
  }

  FlexArrowShape.prototype.getEndArrowWidth = function() {
    return this.getEdgeWidth() + MxUtils.getNumber(this.style, 'endWidth', this.defaultArrowWidth)
  }

  FlexArrowShape.prototype.getEdgeWidth = function() {
    return MxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1)
  }

  // Registers the link shape
  MxCellRenderer.registerShape('flexArrow', FlexArrowShape)

  // Manual Input shape
  function ManualInputShape() {
    MxActor.call(this)
  }
  MxUtils.extend(ManualInputShape, MxActor)
  ManualInputShape.prototype.size = 30
  ManualInputShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, h), new MxPoint(0, s), new MxPoint(w, 0), new MxPoint(w, h)],
      this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('manualInput', ManualInputShape)

  // Internal storage
  function InternalStorageShape() {
    MxRectangleShape.call(this)
  }
  MxUtils.extend(InternalStorageShape, MxRectangleShape)
  InternalStorageShape.prototype.dx = 20
  InternalStorageShape.prototype.dy = 20
  InternalStorageShape.prototype.isHtmlAllowed = function() {
    return false
  }
  InternalStorageShape.prototype.paintForeground = function(c, x, y, w, h) {
    MxRectangleShape.prototype.paintForeground.apply(this, arguments)
    let inset = 0

    if (this.isRounded) {
      let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE,
        MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
      inset = Math.max(inset, Math.min(w * f, h * f))
    }

    let dx = Math.max(inset, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'dx', this.dx))))
    let dy = Math.max(inset, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'dy', this.dy))))

    c.begin()
    c.moveTo(x, y + dy)
    c.lineTo(x + w, y + dy)
    c.end()
    c.stroke()

    c.begin()
    c.moveTo(x + dx, y)
    c.lineTo(x + dx, y + h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('internalStorage', InternalStorageShape)

  // Internal storage
  function CornerShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CornerShape, MxActor)
  CornerShape.prototype.dx = 20
  CornerShape.prototype.dy = 20

  // Corner
  CornerShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = Math.max(0, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'dx', this.dx))))
    let dy = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'dy', this.dy))))

    let s = Math.min(w / 2, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))) // eslint-disable-line no-unused-vars
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, 0), new MxPoint(w, 0), new MxPoint(w, dy), new MxPoint(dx, dy),
      new MxPoint(dx, h), new MxPoint(0, h)
    ], this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('corner', CornerShape)

  // Crossbar shape
  function CrossbarShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CrossbarShape, MxActor)

  CrossbarShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.moveTo(0, 0)
    c.lineTo(0, h)
    c.end()

    c.moveTo(w, 0)
    c.lineTo(w, h)
    c.end()

    c.moveTo(0, h / 2)
    c.lineTo(w, h / 2)
    c.end()
  }

  MxCellRenderer.registerShape('crossbar', CrossbarShape)

  // Internal storage
  function TeeShape() {
    MxActor.call(this)
  }
  MxUtils.extend(TeeShape, MxActor)
  TeeShape.prototype.dx = 20
  TeeShape.prototype.dy = 20

  // Corner
  TeeShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = Math.max(0, Math.min(w, parseFloat(MxUtils.getValue(this.style, 'dx', this.dx))))
    let dy = Math.max(0, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'dy', this.dy))))
    let w2 = Math.abs(w - dx) / 2 // eslint-disable-line no-unused-vars

    let s = Math.min(w / 2, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size)))) // eslint-disable-line no-unused-vars
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, 0), new MxPoint(w, 0), new MxPoint(w, dy), new MxPoint((w + dx) / 2, dy),
      new MxPoint((w + dx) / 2, h), new MxPoint((w - dx) / 2, h), new MxPoint((w - dx) / 2, dy),
      new MxPoint(0, dy)
    ], this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('tee', TeeShape)

  // Arrow
  function SingleArrowShape() {
    MxActor.call(this)
  }
  MxUtils.extend(SingleArrowShape, MxActor)
  SingleArrowShape.prototype.arrowWidth = 0.3
  SingleArrowShape.prototype.arrowSize = 0.2
  SingleArrowShape.prototype.redrawPath = function(c, x, y, w, h) {
    let aw = h * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'arrowWidth', this.arrowWidth))))
    let as = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'arrowSize', this.arrowSize))))
    let at = (h - aw) / 2
    let ab = at + aw

    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c,
      [new MxPoint(0, at), new MxPoint(w - as, at), new MxPoint(w - as, 0), new MxPoint(w, h / 2),
        new MxPoint(w - as, h), new MxPoint(w - as, ab), new MxPoint(0, ab)],
      this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('singleArrow', SingleArrowShape)

  // Arrow
  function DoubleArrowShape() {
    MxActor.call(this)
  }
  MxUtils.extend(DoubleArrowShape, MxActor)
  DoubleArrowShape.prototype.redrawPath = function(c, x, y, w, h) {
    let aw = h * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'arrowWidth', SingleArrowShape.prototype.arrowWidth))))
    let as = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'arrowSize', SingleArrowShape.prototype.arrowSize))))
    let at = (h - aw) / 2
    let ab = at + aw

    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c,
      [new MxPoint(0, h / 2), new MxPoint(as, 0), new MxPoint(as, at), new MxPoint(w - as, at),
        new MxPoint(w - as, 0), new MxPoint(w, h / 2), new MxPoint(w - as, h),
        new MxPoint(w - as, ab), new MxPoint(as, ab), new MxPoint(as, h)],
      this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('doubleArrow', DoubleArrowShape)

  // Data storage
  function DataStorageShape() {
    MxActor.call(this)
  }
  MxUtils.extend(DataStorageShape, MxActor)
  DataStorageShape.prototype.size = 0.1
  DataStorageShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = w * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))

    c.moveTo(s, 0)
    c.lineTo(w, 0)
    c.quadTo(w - s * 2, h / 2, w, h)
    c.lineTo(s, h)
    c.quadTo(s - s * 2, h / 2, s, 0)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('dataStorage', DataStorageShape)

  // Or
  function OrShape() {
    MxActor.call(this)
  }
  MxUtils.extend(OrShape, MxActor)
  OrShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('or', OrShape)

  // Xor
  function XorShape() {
    MxActor.call(this)
  }
  MxUtils.extend(XorShape, MxActor)
  XorShape.prototype.redrawPath = function(c, x, y, w, h) {
    c.moveTo(0, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, 0, h)
    c.quadTo(w / 2, h / 2, 0, 0)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('xor', XorShape)

  // Loop limit
  function LoopLimitShape() {
    MxActor.call(this)
  }
  MxUtils.extend(LoopLimitShape, MxActor)
  LoopLimitShape.prototype.size = 20
  LoopLimitShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = Math.min(w / 2, Math.min(h, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(s, 0), new MxPoint(w - s, 0), new MxPoint(w, s * 0.8), new MxPoint(w, h),
      new MxPoint(0, h), new MxPoint(0, s * 0.8)
    ], this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('loopLimit', LoopLimitShape)

  // Off page connector
  function OffPageConnectorShape() {
    MxActor.call(this)
  }
  MxUtils.extend(OffPageConnectorShape, MxActor)
  OffPageConnectorShape.prototype.size = 3 / 8
  OffPageConnectorShape.prototype.redrawPath = function(c, x, y, w, h) {
    let s = h * Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
    this.addPoints(c, [new MxPoint(0, 0), new MxPoint(w, 0), new MxPoint(w, h - s), new MxPoint(w / 2, h),
      new MxPoint(0, h - s)
    ], this.isRounded, arcSize, true)
    c.end()
  }

  MxCellRenderer.registerShape('offPageConnector', OffPageConnectorShape)

  // Internal storage
  function TapeDataShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(TapeDataShape, MxEllipse)
  TapeDataShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxEllipse.prototype.paintVertexShape.apply(this, arguments)

    c.begin()
    c.moveTo(x + w / 2, y + h)
    c.lineTo(x + w, y + h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('tapeData', TapeDataShape)

  // OrEllipseShape
  function OrEllipseShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(OrEllipseShape, MxEllipse)
  OrEllipseShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxEllipse.prototype.paintVertexShape.apply(this, arguments)

    c.setShadow(false)
    c.begin()
    c.moveTo(x, y + h / 2)
    c.lineTo(x + w, y + h / 2)
    c.end()
    c.stroke()

    c.begin()
    c.moveTo(x + w / 2, y)
    c.lineTo(x + w / 2, y + h)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('orEllipse', OrEllipseShape)

  // SumEllipseShape
  function SumEllipseShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(SumEllipseShape, MxEllipse)
  SumEllipseShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxEllipse.prototype.paintVertexShape.apply(this, arguments)
    let s2 = 0.145

    c.setShadow(false)
    c.begin()
    c.moveTo(x + w * s2, y + h * s2)
    c.lineTo(x + w * (1 - s2), y + h * (1 - s2))
    c.end()
    c.stroke()

    c.begin()
    c.moveTo(x + w * (1 - s2), y + h * s2)
    c.lineTo(x + w * s2, y + h * (1 - s2))
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('sumEllipse', SumEllipseShape)

  // SortShape
  function SortShape() {
    MxRhombus.call(this)
  }
  MxUtils.extend(SortShape, MxRhombus)
  SortShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxRhombus.prototype.paintVertexShape.apply(this, arguments)

    c.setShadow(false)
    c.begin()
    c.moveTo(x, y + h / 2)
    c.lineTo(x + w, y + h / 2)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('sortShape', SortShape)

  // CollateShape
  function CollateShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(CollateShape, MxEllipse)
  CollateShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    c.begin()
    c.moveTo(x, y)
    c.lineTo(x + w, y)
    c.lineTo(x + w / 2, y + h / 2)
    c.close()
    c.fillAndStroke()

    c.begin()
    c.moveTo(x, y + h)
    c.lineTo(x + w, y + h)
    c.lineTo(x + w / 2, y + h / 2)
    c.close()
    c.fillAndStroke()
  }

  MxCellRenderer.registerShape('collate', CollateShape)

  // DimensionShape
  function DimensionShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(DimensionShape, MxEllipse)
  DimensionShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    // Arrow size
    let al = 10
    let cy = y + h - al / 2

    c.begin()
    c.moveTo(x, y)
    c.lineTo(x, y + h)
    c.moveTo(x, cy)
    c.lineTo(x + al, cy - al / 2)
    c.moveTo(x, cy)
    c.lineTo(x + al, cy + al / 2)
    c.moveTo(x, cy)
    c.lineTo(x + w, cy)

    // Opposite side
    c.moveTo(x + w, y)
    c.lineTo(x + w, y + h)
    c.moveTo(x + w, cy)
    c.lineTo(x + w - al, cy - al / 2)
    c.moveTo(x + w, cy)
    c.lineTo(x + w - al, cy + al / 2)
    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('dimension', DimensionShape)

  // PartialRectangleShape
  function PartialRectangleShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(PartialRectangleShape, MxEllipse)
  PartialRectangleShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    if (!this.outline) {
      c.setStrokeColor(null)
    }

    MxRectangleShape.prototype.paintBackground.apply(this, arguments)

    if (this.style !== null) {
      c.setStrokeColor(this.stroke)
      c.rect(x, y, w, h)
      c.fill()

      c.begin()
      c.moveTo(x, y)

      if (MxUtils.getValue(this.style, 'top', '1') === '1') {
        c.lineTo(x + w, y)
      } else {
        c.moveTo(x + w, y)
      }

      if (MxUtils.getValue(this.style, 'right', '1') === '1') {
        c.lineTo(x + w, y + h)
      } else {
        c.moveTo(x + w, y + h)
      }

      if (MxUtils.getValue(this.style, 'bottom', '1') === '1') {
        c.lineTo(x, y + h)
      } else {
        c.moveTo(x, y + h)
      }

      if (MxUtils.getValue(this.style, 'left', '1') === '1') {
        c.lineTo(x, y - this.strokewidth / 2)
      }

      c.end()
      c.stroke()
    }
  }

  MxCellRenderer.registerShape('partialRectangle', PartialRectangleShape)

  // LineEllipseShape
  function LineEllipseShape() {
    MxEllipse.call(this)
  }
  MxUtils.extend(LineEllipseShape, MxEllipse)
  LineEllipseShape.prototype.paintVertexShape = function(c, x, y, w, h) {
    MxEllipse.prototype.paintVertexShape.apply(this, arguments)

    c.setShadow(false)
    c.begin()

    if (MxUtils.getValue(this.style, 'line') === 'vertical') {
      c.moveTo(x + w / 2, y)
      c.lineTo(x + w / 2, y + h)
    } else {
      c.moveTo(x, y + h / 2)
      c.lineTo(x + w, y + h / 2)
    }

    c.end()
    c.stroke()
  }

  MxCellRenderer.registerShape('lineEllipse', LineEllipseShape)

  // Delay
  function DelayShape() {
    MxActor.call(this)
  }
  MxUtils.extend(DelayShape, MxActor)
  DelayShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = Math.min(w, h / 2)
    c.moveTo(0, 0)
    c.lineTo(w - dx, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, w - dx, h)
    c.lineTo(0, h)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('delay', DelayShape)

  // Cross Shape
  function CrossShape() {
    MxActor.call(this)
  }
  MxUtils.extend(CrossShape, MxActor)
  CrossShape.prototype.size = 0.2
  CrossShape.prototype.redrawPath = function(c, x, y, w, h) {
    let m = Math.min(h, w)
    let size = Math.max(0, Math.min(m, m * parseFloat(MxUtils.getValue(this.style, 'size', this.size))))
    let t = (h - size) / 2
    let b = t + size
    let l = (w - size) / 2
    let r = l + size

    c.moveTo(0, t)
    c.lineTo(l, t)
    c.lineTo(l, 0)
    c.lineTo(r, 0)
    c.lineTo(r, t)
    c.lineTo(w, t)
    c.lineTo(w, b)
    c.lineTo(r, b)
    c.lineTo(r, h)
    c.lineTo(l, h)
    c.lineTo(l, b)
    c.lineTo(0, b)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('cross', CrossShape)

  // Display
  function DisplayShape() {
    MxActor.call(this)
  }
  MxUtils.extend(DisplayShape, MxActor)
  DisplayShape.prototype.size = 0.25
  DisplayShape.prototype.redrawPath = function(c, x, y, w, h) {
    let dx = Math.min(w, h / 2)
    let s = Math.min(w - dx, Math.max(0, parseFloat(MxUtils.getValue(this.style, 'size', this.size))) * w)

    c.moveTo(0, h / 2)
    c.lineTo(s, 0)
    c.lineTo(w - dx, 0)
    c.quadTo(w, 0, w, h / 2)
    c.quadTo(w, h, w - dx, h)
    c.lineTo(s, h)
    c.close()
    c.end()
  }

  MxCellRenderer.registerShape('display', DisplayShape)

  // FilledEdge shape
  function FilledEdge() {
    MxConnector.call(this)
  }
  MxUtils.extend(FilledEdge, MxConnector)

  FilledEdge.prototype.origPaintEdgeShape = FilledEdge.prototype.paintEdgeShape
  FilledEdge.prototype.paintEdgeShape = function(c, pts, rounded) {
    // Markers modify incoming points array
    let temp = []

    for (let i = 0; i < pts.length; i++) {
      temp.push(MxUtils.clone(pts[i]))
    }

    // paintEdgeShape resets dashed to false
    let dashed = c.state.dashed
    let fixDash = c.state.fixDash
    FilledEdge.prototype.origPaintEdgeShape.apply(this, [c, temp, rounded])

    if (c.state.strokeWidth >= 3) {
      let fillClr = MxUtils.getValue(this.style, 'fillColor', null)

      if (fillClr !== null) {
        c.setStrokeColor(fillClr)
        c.setStrokeWidth(c.state.strokeWidth - 2)
        c.setDashed(dashed, fixDash)

        FilledEdge.prototype.origPaintEdgeShape.apply(this, [c, pts, rounded])
      }
    }
  }

  // Registers the link shape
  MxCellRenderer.registerShape('filledEdge', FilledEdge)

  // Implements custom colors for shapes
  if (typeof StyleFormatPanel !== 'undefined') {
    (function() {
      let styleFormatPanelGetCustomColors = StyleFormatPanel.prototype.getCustomColors

      StyleFormatPanel.prototype.getCustomColors = function() {
        let ss = this.format.getSelectionState()
        let result = styleFormatPanelGetCustomColors.apply(this, arguments)

        if (ss.style.shape === 'umlFrame') {
          result.push({
            title: MxResources.get('laneColor'),
            key: 'swimlaneFillColor',
            defaultValue: '#ffffff'
          })
        }

        return result
      }
    })()
  }

  // Registers and defines the custom marker
  MxMarker.addMarker('dash', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let nx = unitX * (size + sw + 1)
    let ny = unitY * (size + sw + 1)

    return function() {
      c.begin()
      c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2)
      c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2)
      c.stroke()
    }
  })

  // Registers and defines the custom marker
  MxMarker.addMarker('cross', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let nx = unitX * (size + sw + 1)
    let ny = unitY * (size + sw + 1)

    return function() {
      c.begin()
      c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2)
      c.lineTo(pe.x + ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 - nx / 2)
      c.moveTo(pe.x - nx / 2 + ny / 2, pe.y - ny / 2 - nx / 2)
      c.lineTo(pe.x - ny / 2 - 3 * nx / 2, pe.y - 3 * ny / 2 + nx / 2)
      c.stroke()
    }
  })

  function circleMarker(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let a = size / 2 // eslint-disable-line no-unused-vars
    size = size + sw // eslint-disable-line no-unused-vars

    let pt = pe.clone()

    pe.x -= unitX * (2 * size + sw)
    pe.y -= unitY * (2 * size + sw)

    unitX = unitX * (size + sw)
    unitY = unitY * (size + sw)

    return function() {
      c.ellipse(pt.x - unitX - size, pt.y - unitY - size, 2 * size, 2 * size)

      if (filled) {
        c.fillAndStroke()
      } else {
        c.stroke()
      }
    }
  }

  MxMarker.addMarker('circle', circleMarker)
  MxMarker.addMarker('circlePlus', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    let pt = pe.clone()
    let fn = circleMarker.apply(this, arguments)
    let nx = unitX * (size + 2 * sw) // (size + sw + 1)
    let ny = unitY * (size + 2 * sw) // (size + sw + 1)

    return function() {
      fn.apply(this, arguments)

      c.begin()
      c.moveTo(pt.x - unitX * (sw), pt.y - unitY * (sw))
      c.lineTo(pt.x - 2 * nx + unitX * (sw), pt.y - 2 * ny + unitY * (sw))
      c.moveTo(pt.x - nx - ny + unitY * sw, pt.y - ny + nx - unitX * sw)
      c.lineTo(pt.x + ny - nx - unitY * sw, pt.y - ny - nx + unitX * sw)
      c.stroke()
    }
  })

  MxMarker.addMarker('async', function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    let endOffsetX = unitX * sw * 1.118
    let endOffsetY = unitY * sw * 1.118

    unitX = unitX * (size + sw)
    unitY = unitY * (size + sw)

    let pt = pe.clone()
    pt.x -= endOffsetX
    pt.y -= endOffsetY

    let f = 1
    pe.x += -unitX * f - endOffsetX
    pe.y += -unitY * f - endOffsetY

    return function() {
      c.begin()
      c.moveTo(pt.x, pt.y)

      if (source) {
        c.lineTo(pt.x - unitX - unitY / 2, pt.y - unitY + unitX / 2)
      } else {
        c.lineTo(pt.x + unitY / 2 - unitX, pt.y - unitY - unitX / 2)
      }

      c.lineTo(pt.x - unitX, pt.y - unitY)
      c.close()

      if (filled) {
        c.fillAndStroke()
      } else {
        c.stroke()
      }
    }
  })

  function createOpenAsyncArrow(widthFactor) {
    widthFactor = (widthFactor !== null) ? widthFactor : 2

    return function(c, shape, type, pe, unitX, unitY, size, source, sw, filled) {
      unitX = unitX * (size + sw)
      unitY = unitY * (size + sw)

      let pt = pe.clone()

      return function() {
        c.begin()
        c.moveTo(pt.x, pt.y)

        if (source) {
          c.lineTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor)
        } else {
          c.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor)
        }

        c.stroke()
      }
    }
  }

  MxMarker.addMarker('openAsync', createOpenAsyncArrow(2))

  // eslint-disable-line no-unused-vars
  // function arrow(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled) {
  //   // The angle of the forward facing arrow sides against the x axis is
  //   // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
  //   // only half the strokewidth is processed ).
  //   let endOffsetX = unitX * sw * 1.118
  //   let endOffsetY = unitY * sw * 1.118

  //   unitX = unitX * (size + sw)
  //   unitY = unitY * (size + sw)

  //   let pt = pe.clone()
  //   pt.x -= endOffsetX
  //   pt.y -= endOffsetY

  //   let f = (type !== MxConstants.ARROW_CLASSIC && type !== MxConstants.ARROW_CLASSIC_THIN) ? 1 : 3 / 4
  //   pe.x += -unitX * f - endOffsetX
  //   pe.y += -unitY * f - endOffsetY

  //   return function() {
  //     canvas.begin()
  //     canvas.moveTo(pt.x, pt.y)
  //     canvas.lineTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor)

  //     if (type === MxConstants.ARROW_CLASSIC || type === MxConstants.ARROW_CLASSIC_THIN) {
  //       canvas.lineTo(pt.x - unitX * 3 / 4, pt.y - unitY * 3 / 4)
  //     }

  //     canvas.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor)
  //     canvas.close()

  //     if (filled) {
  //       canvas.fillAndStroke()
  //     } else {
  //       canvas.stroke()
  //     }
  //   }
  // }

  function createHandle(state, keys, getPositionFn, setPositionFn, ignoreGrid, redrawEdges) {
    let handle = new MxHandle(state, null, MxVertexHandler.prototype.secondaryHandleImage)

    handle.execute = function() {
      for (let i = 0; i < keys.length; i++) {
        this.copyStyle(keys[i])
      }
    }

    handle.getPosition = getPositionFn
    handle.setPosition = setPositionFn
    handle.ignoreGrid = (ignoreGrid !== null) ? ignoreGrid : true

    // Overridden to update connected edges
    if (redrawEdges) {
      let positionChanged = handle.positionChanged

      handle.positionChanged = function() {
        positionChanged.apply(this, arguments)

        // Redraws connected edges TODO: Include child edges
        state.view.invalidate(this.state.cell)
        state.view.validate()
      }
    }

    return handle
  }

  function createArcHandle(state, yOffset) {
    return createHandle(state, [MxConstants.STYLE_ARCSIZE],
      function(bounds) {
        let tmp = (yOffset !== null) ? yOffset : bounds.height / 8

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
          let arcSize = MxUtils.getValue(state.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2

          return new MxPoint(bounds.x + bounds.width - Math.min(bounds.width / 2, arcSize), bounds.y + tmp)
        } else {
          let arcSize = Math.max(0, parseFloat(MxUtils.getValue(state.style, MxConstants.STYLE_ARCSIZE, MxConstants.RECTANGLE_ROUNDING_FACTOR * 100))) / 100

          return new MxPoint(bounds.x + bounds.width - Math.min(Math.max(bounds.width / 2, bounds.height / 2), Math.min(bounds.width, bounds.height) * arcSize), bounds.y + tmp)
        }
      },
      function(bounds, pt, me) {
        if (MxUtils.getValue(state.style, MxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
          this.state.style[MxConstants.STYLE_ARCSIZE] = Math.round(Math.max(0, Math.min(bounds.width, (bounds.x + bounds.width - pt.x) * 2)))
        } else {
          let f = Math.min(50, Math.max(0, (bounds.width - pt.x + bounds.x) * 100 / Math.min(bounds.width, bounds.height)))
          this.state.style[MxConstants.STYLE_ARCSIZE] = Math.round(f)
        }
      }
    )
  }

  function createArcHandleFunction() {
    return function(state) {
      let handles = []

      if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
        handles.push(createArcHandle(state))
      }

      return handles
    }
  }

  function createTrapezoidHandleFunction(max) {
    return function(state) {
      let handles = [createHandle(state, ['size'],
        function(bounds) {
          let size = Math.max(0, Math.min(max, parseFloat(MxUtils.getValue(this.state.style, 'size', TrapezoidShape.prototype.size))))

          return new MxPoint(bounds.x + size * bounds.width * 0.75, bounds.y + bounds.height / 4)
        },
        function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(max, (pt.x - bounds.x) / (bounds.width * 0.75)))
        },
        null, true)]

      if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
        handles.push(createArcHandle(state))
      }

      return handles
    }
  }

  function createDisplayHandleFunction(defaultValue, allowArcHandle, max, redrawEdges, fixedDefaultValue) {
    max = (max !== null) ? max : 1

    return function(state) {
      let handles = [createHandle(state, ['size'],
        function(bounds) {
          let fixed = (fixedDefaultValue !== null) ? MxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0' : null
          let size = parseFloat(MxUtils.getValue(this.state.style, 'size', (fixed) ? fixedDefaultValue : defaultValue))

          return new MxPoint(bounds.x + Math.max(0, Math.min(bounds.width, size * ((fixed) ? 1 : bounds.width))), bounds.getCenterY())
        },
        function(bounds, pt, me) {
          let fixed = (fixedDefaultValue !== null) ? MxUtils.getValue(this.state.style, 'fixedSize', '0') !== '0' : null
          let size = (fixed) ? (pt.x - bounds.x) : Math.max(0, Math.min(max, (pt.x - bounds.x) / bounds.width))

          if (fixed && !MxEvent.isAltDown(me.getEvent())) {
            size = state.view.graph.snap(size)
          }

          this.state.style['size'] = size
        },
        null, redrawEdges
      )]

      if (allowArcHandle && MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
        handles.push(createArcHandle(state))
      }

      return handles
    }
  }

  function createCubeHandleFunction(factor, defaultValue, allowArcHandle) {
    return function(state) {
      let handles = [createHandle(state, ['size'],
        function(bounds) {
          let size = Math.max(0, Math.min(bounds.width, Math.min(bounds.height, parseFloat(MxUtils.getValue(this.state.style, 'size', defaultValue))))) * factor

          return new MxPoint(bounds.x + size, bounds.y + size)
        },
        function(bounds, pt) {
          this.state.style['size'] = Math.round(Math.max(0, Math.min(Math.min(bounds.width, pt.x - bounds.x), Math.min(bounds.height, pt.y - bounds.y))) / factor)
        }
      )]

      if (allowArcHandle && MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
        handles.push(createArcHandle(state))
      }

      return handles
    }
  }

  function createArrowHandleFunction(maxSize) {
    return function(state) {
      return [createHandle(state, ['arrowWidth', 'arrowSize'],
        function(bounds) {
          let aw = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'arrowWidth', SingleArrowShape.prototype.arrowWidth)))
          let as = Math.max(0, Math.min(maxSize, MxUtils.getValue(this.state.style, 'arrowSize', SingleArrowShape.prototype.arrowSize)))

          return new MxPoint(bounds.x + (1 - as) * bounds.width, bounds.y + (1 - aw) * bounds.height / 2)
        },
        function(bounds, pt) {
          this.state.style['arrowWidth'] = Math.max(0, Math.min(1, Math.abs(bounds.y + bounds.height / 2 - pt.y) / bounds.height * 2))
          this.state.style['arrowSize'] = Math.max(0, Math.min(maxSize, (bounds.x + bounds.width - pt.x) / (bounds.width)))
        }
      )]
    }
  }

  function createEdgeHandle(state, keys, start, getPosition, setPosition) {
    return createHandle(state, keys,
      function(bounds) {
        let pts = state.absolutePoints
        let n = pts.length - 1

        let tr = state.view.translate
        let s = state.view.scale

        let p0 = (start) ? pts[0] : pts[n]
        let p1 = (start) ? pts[1] : pts[n - 1]
        let dx = (start) ? p1.x - p0.x : p1.x - p0.x
        let dy = (start) ? p1.y - p0.y : p1.y - p0.y

        let dist = Math.sqrt(dx * dx + dy * dy)

        let pt = getPosition.call(this, dist, dx / dist, dy / dist, p0, p1)

        return new MxPoint(pt.x / s - tr.x, pt.y / s - tr.y)
      },
      function(bounds, pt, me) {
        let pts = state.absolutePoints
        let n = pts.length - 1

        let tr = state.view.translate
        let s = state.view.scale

        let p0 = (start) ? pts[0] : pts[n]
        let p1 = (start) ? pts[1] : pts[n - 1]
        let dx = (start) ? p1.x - p0.x : p1.x - p0.x
        let dy = (start) ? p1.y - p0.y : p1.y - p0.y

        let dist = Math.sqrt(dx * dx + dy * dy)
        pt.x = (pt.x + tr.x) * s
        pt.y = (pt.y + tr.y) * s

        setPosition.call(this, dist, dx / dist, dy / dist, p0, p1, pt, me)
      }
    )
  }

  function createEdgeWidthHandle(state, start, spacing) {
    return createEdgeHandle(state, ['width'], start,
      function(dist, nx, ny, p0, p1) {
        let w = state.shape.getEdgeWidth() * state.view.scale + spacing

        return new MxPoint(p0.x + nx * dist / 4 + ny * w / 2, p0.y + ny * dist / 4 - nx * w / 2)
      },
      function(dist, nx, ny, p0, p1, pt) {
        let w = Math.sqrt(MxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y))
        state.style['width'] = Math.round(w * 2) / state.view.scale - spacing
      }
    )
  }

  // eslint-disable-line no-unused-vars
  // function ptLineDistance(x1, y1, x2, y2, x0, y0) {
  //   return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1))
  // }

  // Handlers are only added if MxVertexHandler is defined (ie. not in embedded graph)
  if (typeof MxVertexHandler !== 'undefined') {
    let handleFactory = {
      'link': function(state) {
        let spacing = 10

        return [createEdgeWidthHandle(state, true, spacing), createEdgeWidthHandle(state, false, spacing)]
      },
      'flexArrow': function(state) {
        // Do not use state.shape.startSize/endSize since it is cached
        let tol = state.view.graph.gridSize / state.view.scale
        let handles = []

        if (MxUtils.getValue(state.style, MxConstants.STYLE_STARTARROW, MxConstants.NONE) !== MxConstants.NONE) {
          handles.push(createEdgeHandle(state, ['width', MxConstants.STYLE_STARTSIZE, MxConstants.STYLE_ENDSIZE], true, function(dist, nx, ny, p0, p1) {
            let w = (state.shape.getEdgeWidth() - state.shape.strokewidth) * state.view.scale
            let l = MxUtils.getNumber(state.style, MxConstants.STYLE_STARTSIZE, MxConstants.ARROW_SIZE / 5) * 3 * state.view.scale

            return new MxPoint(p0.x + nx * (l + state.shape.strokewidth * state.view.scale) + ny * w / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) - nx * w / 2)
          }, function(dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(MxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y))
            let l = MxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y)

            state.style[MxConstants.STYLE_STARTSIZE] = Math.round((l - state.shape.strokewidth) * 100 / 3) / 100 / state.view.scale
            state.style['width'] = Math.round(w * 2) / state.view.scale

            // Applies to opposite side
            if (MxEvent.isControlDown(me.getEvent())) {
              state.style[MxConstants.STYLE_ENDSIZE] = state.style[MxConstants.STYLE_STARTSIZE]
            }

            // Snaps to end geometry
            if (!MxEvent.isAltDown(me.getEvent())) {
              if (Math.abs(parseFloat(state.style[MxConstants.STYLE_STARTSIZE]) - parseFloat(state.style[MxConstants.STYLE_ENDSIZE])) < tol / 6) {
                state.style[MxConstants.STYLE_STARTSIZE] = state.style[MxConstants.STYLE_ENDSIZE]
              }
            }
          }))

          handles.push(createEdgeHandle(state, ['startWidth', 'endWidth', MxConstants.STYLE_STARTSIZE, MxConstants.STYLE_ENDSIZE], true, function(dist, nx, ny, p0, p1) {
            let w = (state.shape.getStartArrowWidth() - state.shape.strokewidth) * state.view.scale
            let l = MxUtils.getNumber(state.style, MxConstants.STYLE_STARTSIZE, MxConstants.ARROW_SIZE / 5) * 3 * state.view.scale

            return new MxPoint(p0.x + nx * (l + state.shape.strokewidth * state.view.scale) + ny * w / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) - nx * w / 2)
          }, function(dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(MxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y))
            let l = MxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y)

            state.style[MxConstants.STYLE_STARTSIZE] = Math.round((l - state.shape.strokewidth) * 100 / 3) / 100 / state.view.scale
            state.style['startWidth'] = Math.max(0, Math.round(w * 2) - state.shape.getEdgeWidth()) / state.view.scale

            // Applies to opposite side
            if (MxEvent.isControlDown(me.getEvent())) {
              state.style[MxConstants.STYLE_ENDSIZE] = state.style[MxConstants.STYLE_STARTSIZE]
              state.style['endWidth'] = state.style['startWidth']
            }

            // Snaps to endWidth
            if (!MxEvent.isAltDown(me.getEvent())) {
              if (Math.abs(parseFloat(state.style[MxConstants.STYLE_STARTSIZE]) - parseFloat(state.style[MxConstants.STYLE_ENDSIZE])) < tol / 6) {
                state.style[MxConstants.STYLE_STARTSIZE] = state.style[MxConstants.STYLE_ENDSIZE]
              }

              if (Math.abs(parseFloat(state.style['startWidth']) - parseFloat(state.style['endWidth'])) < tol) {
                state.style['startWidth'] = state.style['endWidth']
              }
            }
          }))
        }

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ENDARROW, MxConstants.NONE) !== MxConstants.NONE) {
          handles.push(createEdgeHandle(state, ['width', MxConstants.STYLE_STARTSIZE, MxConstants.STYLE_ENDSIZE], false, function(dist, nx, ny, p0, p1) {
            let w = (state.shape.getEdgeWidth() - state.shape.strokewidth) * state.view.scale
            let l = MxUtils.getNumber(state.style, MxConstants.STYLE_ENDSIZE, MxConstants.ARROW_SIZE / 5) * 3 * state.view.scale

            return new MxPoint(p0.x + nx * (l + state.shape.strokewidth * state.view.scale) - ny * w / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) + nx * w / 2)
          }, function(dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(MxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y))
            let l = MxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y)

            state.style[MxConstants.STYLE_ENDSIZE] = Math.round((l - state.shape.strokewidth) * 100 / 3) / 100 / state.view.scale
            state.style['width'] = Math.round(w * 2) / state.view.scale

            // Applies to opposite side
            if (MxEvent.isControlDown(me.getEvent())) {
              state.style[MxConstants.STYLE_STARTSIZE] = state.style[MxConstants.STYLE_ENDSIZE]
            }

            // Snaps to start geometry
            if (!MxEvent.isAltDown(me.getEvent())) {
              if (Math.abs(parseFloat(state.style[MxConstants.STYLE_ENDSIZE]) - parseFloat(state.style[MxConstants.STYLE_STARTSIZE])) < tol / 6) {
                state.style[MxConstants.STYLE_ENDSIZE] = state.style[MxConstants.STYLE_STARTSIZE]
              }
            }
          }))

          handles.push(createEdgeHandle(state, ['startWidth', 'endWidth', MxConstants.STYLE_STARTSIZE, MxConstants.STYLE_ENDSIZE], false, function(dist, nx, ny, p0, p1) {
            let w = (state.shape.getEndArrowWidth() - state.shape.strokewidth) * state.view.scale
            let l = MxUtils.getNumber(state.style, MxConstants.STYLE_ENDSIZE, MxConstants.ARROW_SIZE / 5) * 3 * state.view.scale

            return new MxPoint(p0.x + nx * (l + state.shape.strokewidth * state.view.scale) - ny * w / 2,
              p0.y + ny * (l + state.shape.strokewidth * state.view.scale) + nx * w / 2)
          }, function(dist, nx, ny, p0, p1, pt, me) {
            let w = Math.sqrt(MxUtils.ptSegDistSq(p0.x, p0.y, p1.x, p1.y, pt.x, pt.y))
            let l = MxUtils.ptLineDist(p0.x, p0.y, p0.x + ny, p0.y - nx, pt.x, pt.y)

            state.style[MxConstants.STYLE_ENDSIZE] = Math.round((l - state.shape.strokewidth) * 100 / 3) / 100 / state.view.scale
            state.style['endWidth'] = Math.max(0, Math.round(w * 2) - state.shape.getEdgeWidth()) / state.view.scale

            // Applies to opposite side
            if (MxEvent.isControlDown(me.getEvent())) {
              state.style[MxConstants.STYLE_STARTSIZE] = state.style[MxConstants.STYLE_ENDSIZE]
              state.style['startWidth'] = state.style['endWidth']
            }

            // Snaps to start geometry
            if (!MxEvent.isAltDown(me.getEvent())) {
              if (Math.abs(parseFloat(state.style[MxConstants.STYLE_ENDSIZE]) - parseFloat(state.style[MxConstants.STYLE_STARTSIZE])) < tol / 6) {
                state.style[MxConstants.STYLE_ENDSIZE] = state.style[MxConstants.STYLE_STARTSIZE]
              }

              if (Math.abs(parseFloat(state.style['endWidth']) - parseFloat(state.style['startWidth'])) < tol) {
                state.style['endWidth'] = state.style['startWidth']
              }
            }
          }))
        }

        return handles
      },
      'swimlane': function(state) {
        let handles = [createHandle(state, [MxConstants.STYLE_STARTSIZE], function(bounds) {
          let size = parseFloat(MxUtils.getValue(state.style, MxConstants.STYLE_STARTSIZE, MxConstants.DEFAULT_STARTSIZE))

          if (MxUtils.getValue(state.style, MxConstants.STYLE_HORIZONTAL, 1) === 1) {
            return new MxPoint(bounds.getCenterX(), bounds.y + Math.max(0, Math.min(bounds.height, size)))
          } else {
            return new MxPoint(bounds.x + Math.max(0, Math.min(bounds.width, size)), bounds.getCenterY())
          }
        }, function(bounds, pt) {
          state.style[MxConstants.STYLE_STARTSIZE] =
            (MxUtils.getValue(this.state.style, MxConstants.STYLE_HORIZONTAL, 1) === 1)
              ? Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
              : Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)))
        })]

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED)) {
          let size = parseFloat(MxUtils.getValue(state.style, MxConstants.STYLE_STARTSIZE, MxConstants.DEFAULT_STARTSIZE))
          handles.push(createArcHandle(state, size / 2))
        }

        return handles
      },
      'label': createArcHandleFunction(),
      'ext': createArcHandleFunction(),
      'rectangle': createArcHandleFunction(),
      'triangle': createArcHandleFunction(),
      'rhombus': createArcHandleFunction(),
      'umlLifeline': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(bounds.height, parseFloat(MxUtils.getValue(this.state.style, 'size', UmlLifeline.prototype.size))))

          return new MxPoint(bounds.getCenterX(), bounds.y + size)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
        }, false)]
      },
      'umlFrame': function(state) {
        let handles = [createHandle(state, ['width', 'height'], function(bounds) {
          let w0 = Math.max(UmlFrame.prototype.corner, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'width', UmlFrame.prototype.width)))
          let h0 = Math.max(UmlFrame.prototype.corner * 1.5, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'height', UmlFrame.prototype.height)))

          return new MxPoint(bounds.x + w0, bounds.y + h0)
        }, function(bounds, pt) {
          this.state.style['width'] = Math.round(Math.max(UmlFrame.prototype.corner, Math.min(bounds.width, pt.x - bounds.x)))
          this.state.style['height'] = Math.round(Math.max(UmlFrame.prototype.corner * 1.5, Math.min(bounds.height, pt.y - bounds.y)))
        }, false)]

        return handles
      },
      'process': function(state) {
        let handles = [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(0.5, parseFloat(MxUtils.getValue(this.state.style, 'size', ProcessShape.prototype.size))))

          return new MxPoint(bounds.x + bounds.width * size, bounds.y + bounds.height / 4)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(0.5, (pt.x - bounds.x) / bounds.width))
        })]

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
          handles.push(createArcHandle(state))
        }

        return handles
      },
      'cross': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let m = Math.min(bounds.width, bounds.height)
          let size = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'size', CrossShape.prototype.size))) * m / 2

          return new MxPoint(bounds.getCenterX() - size, bounds.getCenterY() - size)
        }, function(bounds, pt) {
          let m = Math.min(bounds.width, bounds.height)
          this.state.style['size'] = Math.max(0, Math.min(1, Math.min((Math.max(0, bounds.getCenterY() - pt.y) / m) * 2, (Math.max(0, bounds.getCenterX() - pt.x) / m) * 2)))
        })]
      },
      'note': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(bounds.width, Math.min(bounds.height, parseFloat(
            MxUtils.getValue(this.state.style, 'size', NoteShape.prototype.size)))))

          return new MxPoint(bounds.x + bounds.width - size, bounds.y + size)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.round(Math.max(0, Math.min(Math.min(bounds.width, bounds.x + bounds.width - pt.x),
            Math.min(bounds.height, pt.y - bounds.y))))
        })]
      },
      'manualInput': function(state) {
        let handles = [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'size', ManualInputShape.prototype.size)))

          return new MxPoint(bounds.x + bounds.width / 4, bounds.y + size * 3 / 4)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.round(Math.max(0, Math.min(bounds.height, (pt.y - bounds.y) * 4 / 3)))
        })]

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
          handles.push(createArcHandle(state))
        }

        return handles
      },
      'dataStorage': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.state.style, 'size', DataStorageShape.prototype.size))))

          return new MxPoint(bounds.x + (1 - size) * bounds.width, bounds.getCenterY())
        }, function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(1, (bounds.x + bounds.width - pt.x) / bounds.width))
        })]
      },
      'callout': function(state) {
        let handles = [createHandle(state, ['size', 'position'], function(bounds) {
          let size = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'size', CalloutShape.prototype.size)))
          let position = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)))
          let base = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base))) // eslint-disable-line no-unused-vars

          return new MxPoint(bounds.x + position * bounds.width, bounds.y + bounds.height - size)
        }, function(bounds, pt) {
          let base = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base))) // eslint-disable-line no-unused-vars
          this.state.style['size'] = Math.round(Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y)))
          this.state.style['position'] = Math.round(Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width)) * 100) / 100
        }), createHandle(state, ['position2'], function(bounds) {
          let position2 = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'position2', CalloutShape.prototype.position2)))

          return new MxPoint(bounds.x + position2 * bounds.width, bounds.y + bounds.height)
        }, function(bounds, pt) {
          this.state.style['position2'] = Math.round(Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width)) * 100) / 100
        }), createHandle(state, ['base'], function(bounds) {
          let size = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'size', CalloutShape.prototype.size)))
          let position = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)))
          let base = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'base', CalloutShape.prototype.base)))

          return new MxPoint(bounds.x + Math.min(bounds.width, position * bounds.width + base), bounds.y + bounds.height - size)
        }, function(bounds, pt) {
          let position = Math.max(0, Math.min(1, MxUtils.getValue(this.state.style, 'position', CalloutShape.prototype.position)))

          this.state.style['base'] = Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x - position * bounds.width)))
        })]

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
          handles.push(createArcHandle(state))
        }

        return handles
      },
      'internalStorage': function(state) {
        let handles = [createHandle(state, ['dx', 'dy'], function(bounds) {
          let dx = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'dx', InternalStorageShape.prototype.dx)))
          let dy = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'dy', InternalStorageShape.prototype.dy)))

          return new MxPoint(bounds.x + dx, bounds.y + dy)
        }, function(bounds, pt) {
          this.state.style['dx'] = Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)))
          this.state.style['dy'] = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
        })]

        if (MxUtils.getValue(state.style, MxConstants.STYLE_ROUNDED, false)) {
          handles.push(createArcHandle(state))
        }

        return handles
      },
      'corner': function(state) {
        return [createHandle(state, ['dx', 'dy'], function(bounds) {
          let dx = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'dx', CornerShape.prototype.dx)))
          let dy = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'dy', CornerShape.prototype.dy)))

          return new MxPoint(bounds.x + dx, bounds.y + dy)
        }, function(bounds, pt) {
          this.state.style['dx'] = Math.round(Math.max(0, Math.min(bounds.width, pt.x - bounds.x)))
          this.state.style['dy'] = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
        })]
      },
      'tee': function(state) {
        return [createHandle(state, ['dx', 'dy'], function(bounds) {
          let dx = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'dx', TeeShape.prototype.dx)))
          let dy = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'dy', TeeShape.prototype.dy)))

          return new MxPoint(bounds.x + (bounds.width + dx) / 2, bounds.y + dy)
        }, function(bounds, pt) {
          this.state.style['dx'] = Math.round(Math.max(0, Math.min(bounds.width / 2, (pt.x - bounds.x - bounds.width / 2)) * 2))
          this.state.style['dy'] = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
        })]
      },
      'singleArrow': createArrowHandleFunction(1),
      'doubleArrow': createArrowHandleFunction(0.5),
      'folder': function(state) {
        return [createHandle(state, ['tabWidth', 'tabHeight'], function(bounds) {
          let tw = Math.max(0, Math.min(bounds.width, MxUtils.getValue(this.state.style, 'tabWidth', FolderShape.prototype.tabWidth)))
          let th = Math.max(0, Math.min(bounds.height, MxUtils.getValue(this.state.style, 'tabHeight', FolderShape.prototype.tabHeight)))

          if (MxUtils.getValue(this.state.style, 'tabPosition', FolderShape.prototype.tabPosition) === MxConstants.ALIGN_RIGHT) {
            tw = bounds.width - tw
          }

          return new MxPoint(bounds.x + tw, bounds.y + th)
        }, function(bounds, pt) {
          let tw = Math.max(0, Math.min(bounds.width, pt.x - bounds.x))

          if (MxUtils.getValue(this.state.style, 'tabPosition', FolderShape.prototype.tabPosition) === MxConstants.ALIGN_RIGHT) {
            tw = bounds.width - tw
          }

          this.state.style['tabWidth'] = Math.round(tw)
          this.state.style['tabHeight'] = Math.round(Math.max(0, Math.min(bounds.height, pt.y - bounds.y)))
        })]
      },
      'document': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.state.style, 'size', DocumentShape.prototype.size))))

          return new MxPoint(bounds.x + 3 * bounds.width / 4, bounds.y + (1 - size) * bounds.height)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(1, (bounds.y + bounds.height - pt.y) / bounds.height))
        })]
      },
      'tape': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.state.style, 'size', TapeShape.prototype.size))))

          return new MxPoint(bounds.getCenterX(), bounds.y + size * bounds.height / 2)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(1, ((pt.y - bounds.y) / bounds.height) * 2))
        })]
      },
      'offPageConnector': function(state) {
        return [createHandle(state, ['size'], function(bounds) {
          let size = Math.max(0, Math.min(1, parseFloat(MxUtils.getValue(this.state.style, 'size', OffPageConnectorShape.prototype.size))))

          return new MxPoint(bounds.getCenterX(), bounds.y + (1 - size) * bounds.height)
        }, function(bounds, pt) {
          this.state.style['size'] = Math.max(0, Math.min(1, (bounds.y + bounds.height - pt.y) / bounds.height))
        })]
      },
      'step': createDisplayHandleFunction(StepShape.prototype.size, true, null, true, StepShape.prototype.fixedSize),
      'hexagon': createDisplayHandleFunction(HexagonShape.prototype.size, true, 0.5, true),
      'curlyBracket': createDisplayHandleFunction(CurlyBracketShape.prototype.size, false),
      'display': createDisplayHandleFunction(DisplayShape.prototype.size, false),
      'cube': createCubeHandleFunction(1, CubeShape.prototype.size, false),
      'card': createCubeHandleFunction(0.5, CardShape.prototype.size, true),
      'loopLimit': createCubeHandleFunction(0.5, LoopLimitShape.prototype.size, true),
      'trapezoid': createTrapezoidHandleFunction(0.5),
      'parallelogram': createTrapezoidHandleFunction(1)
    }

    // Exposes custom handles
    Graph.createHandle = createHandle
    Graph.handleFactory = handleFactory

    MxVertexHandler.prototype.createCustomHandles = function() {
      // Not rotatable means locked
      if (this.state.view.graph.getSelectionCount() === 1) {
        if (this.graph.isCellRotatable(this.state.cell)) {
        // LATER: Make locked state independent of rotatable flag, fix toggle if default is false
        // if (this.graph.isCellResizable(this.state.cell) || this.graph.isCellMovable(this.state.cell))

          let name = this.state.style['shape']

          if (MxCellRenderer.defaultShapes[name] === null &&
            MxStencilRegistry.getStencil(name) === null) {
            name = MxConstants.SHAPE_RECTANGLE
          }

          let fn = handleFactory[name]

          if (fn !== null) {
            return fn(this.state)
          }
        }
      }

      return null
    }

    MxEdgeHandler.prototype.createCustomHandles = function() {
      if (this.state.view.graph.getSelectionCount() === 1) {
        let name = this.state.style['shape']

        if (MxCellRenderer.defaultShapes[name] === null &&
          MxStencilRegistry.getStencil(name) === null) {
          name = MxConstants.SHAPE_CONNECTOR
        }

        let fn = handleFactory[name]

        if (fn !== null) {
          return fn(this.state)
        }
      }

      return null
    }
  } else {
    // Dummy entries to avoid NPE in embed mode
    Graph.createHandle = function() {}
    Graph.handleFactory = {}
  }

  let isoHVector = new MxPoint(1, 0)
  let isoVVector = new MxPoint(1, 0)

  let alpha1 = MxUtils.toRadians(-30)

  let cos1 = Math.cos(alpha1)
  let sin1 = Math.sin(alpha1)

  isoHVector = MxUtils.getRotatedPoint(isoHVector, cos1, sin1)

  let alpha2 = MxUtils.toRadians(-150)

  let cos2 = Math.cos(alpha2)
  let sin2 = Math.sin(alpha2)

  isoVVector = MxUtils.getRotatedPoint(isoVVector, cos2, sin2)

  MxEdgeStyle.IsometricConnector = function(state, source, target, points, result) {
    let view = state.view
    let pt = (points !== null && points.length > 0) ? points[0] : null
    let pts = state.absolutePoints
    let p0 = pts[0]
    let pe = pts[pts.length - 1]

    if (pt !== null) {
      pt = view.transformControlPoint(state, pt)
    }

    if (p0 === null) {
      if (source !== null) {
        p0 = new MxPoint(source.getCenterX(), source.getCenterY())
      }
    }

    if (pe === null) {
      if (target !== null) {
        pe = new MxPoint(target.getCenterX(), target.getCenterY())
      }
    }

    let a1 = isoHVector.x
    let a2 = isoHVector.y

    let b1 = isoVVector.x
    let b2 = isoVVector.y

    let elbow = MxUtils.getValue(state.style, 'elbow', 'horizontal') === 'horizontal'

    if (pe !== null && p0 !== null) {
      let last = p0

      const isoLineTo = function(x, y, ignoreFirst) {
        let c1 = x - last.x
        let c2 = y - last.y

        // Solves for isometric base vectors
        let h = (b2 * c1 - b1 * c2) / (a1 * b2 - a2 * b1)
        let v = (a2 * c1 - a1 * c2) / (a2 * b1 - a1 * b2)

        if (elbow) {
          if (ignoreFirst) {
            last = new MxPoint(last.x + a1 * h, last.y + a2 * h)
            result.push(last)
          }

          last = new MxPoint(last.x + b1 * v, last.y + b2 * v)
          result.push(last)
        } else {
          if (ignoreFirst) {
            last = new MxPoint(last.x + b1 * v, last.y + b2 * v)
            result.push(last)
          }

          last = new MxPoint(last.x + a1 * h, last.y + a2 * h)
          result.push(last)
        }
      }

      if (pt === null) {
        pt = new MxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2)
      }

      isoLineTo(pt.x, pt.y, true)
      isoLineTo(pe.x, pe.y, false)
    }
  }

  MxStyleRegistry.putValue('isometricEdgeStyle', MxEdgeStyle.IsometricConnector)

  let graphCreateEdgeHandler = Graph.prototype.createEdgeHandler
  Graph.prototype.createEdgeHandler = function(state, edgeStyle) {
    if (edgeStyle === MxEdgeStyle.IsometricConnector) {
      let handler = new MxElbowEdgeHandler(state)
      handler.snapToTerminals = false

      return handler
    }

    return graphCreateEdgeHandler.apply(this, arguments)
  }

  // Defines connection points for all shapes
  IsoRectangleShape.prototype.constraints = []
  IsoCubeShape.prototype.constraints = []
  CalloutShape.prototype.constraints = []
  MxRectangleShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.75, 0), true),
    new MxConnectionConstraint(new MxPoint(0, 0.25), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(1, 0.25), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.25, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.75, 1), true)
  ]
  MxEllipse.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0), true), new MxConnectionConstraint(new MxPoint(1, 0), true),
    new MxConnectionConstraint(new MxPoint(0, 1), true), new MxConnectionConstraint(new MxPoint(1, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true), new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true), new MxConnectionConstraint(new MxPoint(1, 0.5))
  ]
  MxLabel.prototype.constraints = MxRectangleShape.prototype.constraints
  MxImageShape.prototype.constraints = MxRectangleShape.prototype.constraints
  MxSwimlane.prototype.constraints = MxRectangleShape.prototype.constraints
  PlusShape.prototype.constraints = MxRectangleShape.prototype.constraints
  NoteShape.prototype.constraints = MxRectangleShape.prototype.constraints
  CardShape.prototype.constraints = MxRectangleShape.prototype.constraints
  CubeShape.prototype.constraints = MxRectangleShape.prototype.constraints
  FolderShape.prototype.constraints = MxRectangleShape.prototype.constraints
  InternalStorageShape.prototype.constraints = MxRectangleShape.prototype.constraints
  DataStorageShape.prototype.constraints = MxRectangleShape.prototype.constraints
  TapeDataShape.prototype.constraints = MxEllipse.prototype.constraints
  OrEllipseShape.prototype.constraints = MxEllipse.prototype.constraints
  SumEllipseShape.prototype.constraints = MxEllipse.prototype.constraints
  LineEllipseShape.prototype.constraints = MxEllipse.prototype.constraints
  ManualInputShape.prototype.constraints = MxRectangleShape.prototype.constraints
  DelayShape.prototype.constraints = MxRectangleShape.prototype.constraints
  DisplayShape.prototype.constraints = MxRectangleShape.prototype.constraints
  LoopLimitShape.prototype.constraints = MxRectangleShape.prototype.constraints
  OffPageConnectorShape.prototype.constraints = MxRectangleShape.prototype.constraints
  MxCylinder.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.15, 0.05), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.85, 0.05), false),
    new MxConnectionConstraint(new MxPoint(0, 0.3), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.7), true),
    new MxConnectionConstraint(new MxPoint(1, 0.3), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.7), true),
    new MxConnectionConstraint(new MxPoint(0.15, 0.95), false),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.85, 0.95), false)
  ]
  UmlActorShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0.1), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0), false),
    new MxConnectionConstraint(new MxPoint(0.75, 0.1), false),
    new MxConnectionConstraint(new MxPoint(0, 1 / 3), false),
    new MxConnectionConstraint(new MxPoint(0, 1), false),
    new MxConnectionConstraint(new MxPoint(1, 1 / 3), false),
    new MxConnectionConstraint(new MxPoint(1, 1), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0.5), false)
  ]
  ComponentShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.75, 0), true),
    new MxConnectionConstraint(new MxPoint(0, 0.3), true),
    new MxConnectionConstraint(new MxPoint(0, 0.7), true),
    new MxConnectionConstraint(new MxPoint(1, 0.25), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.25, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.75, 1), true)
  ]
  MxActor.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.25, 0.2), false),
    new MxConnectionConstraint(new MxPoint(0.1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.75, 0.25), false),
    new MxConnectionConstraint(new MxPoint(0.9, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.25, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.75, 1), true)
  ]
  SwitchShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0.25), false),
    new MxConnectionConstraint(new MxPoint(1, 0), false),
    new MxConnectionConstraint(new MxPoint(0.25, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.75, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0, 1), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0.75), false),
    new MxConnectionConstraint(new MxPoint(1, 1), false)
  ]
  TapeShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.35), false),
    new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0, 0.65), false),
    new MxConnectionConstraint(new MxPoint(1, 0.35), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.65), false),
    new MxConnectionConstraint(new MxPoint(0.25, 1), false),
    new MxConnectionConstraint(new MxPoint(0.75, 0), false)
  ]
  StepShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.75, 0), true),
    new MxConnectionConstraint(new MxPoint(0.25, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.75, 1), true),
    new MxConnectionConstraint(new MxPoint(0, 0.25), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(1, 0.25), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true)
  ]
  MxLine.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.25, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.75, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false)
  ]
  LollipopShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.5, 0), false),
    new MxConnectionConstraint(new MxPoint(0.5, 1), false)
  ]
  MxDoubleEllipse.prototype.constraints = MxEllipse.prototype.constraints
  MxRhombus.prototype.constraints = MxEllipse.prototype.constraints
  MxTriangle.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.25), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true)
  ]
  MxHexagon.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.375, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.625, 0), true),
    new MxConnectionConstraint(new MxPoint(0, 0.25), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(1, 0.25), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true),
    new MxConnectionConstraint(new MxPoint(0.375, 1), true),
    new MxConnectionConstraint(new MxPoint(0.5, 1), true),
    new MxConnectionConstraint(new MxPoint(0.625, 1), true)
  ]
  MxCloud.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0.25), false),
    new MxConnectionConstraint(new MxPoint(0.4, 0.1), false),
    new MxConnectionConstraint(new MxPoint(0.16, 0.55), false),
    new MxConnectionConstraint(new MxPoint(0.07, 0.4), false),
    new MxConnectionConstraint(new MxPoint(0.31, 0.8), false),
    new MxConnectionConstraint(new MxPoint(0.13, 0.77), false),
    new MxConnectionConstraint(new MxPoint(0.8, 0.8), false),
    new MxConnectionConstraint(new MxPoint(0.55, 0.95), false),
    new MxConnectionConstraint(new MxPoint(0.875, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.96, 0.7), false),
    new MxConnectionConstraint(new MxPoint(0.625, 0.2), false),
    new MxConnectionConstraint(new MxPoint(0.88, 0.25), false)
  ]
  ParallelogramShape.prototype.constraints = MxRectangleShape.prototype.constraints
  TrapezoidShape.prototype.constraints = MxRectangleShape.prototype.constraints
  DocumentShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.25, 0), true),
    new MxConnectionConstraint(new MxPoint(0.5, 0), true),
    new MxConnectionConstraint(new MxPoint(0.75, 0), true),
    new MxConnectionConstraint(new MxPoint(0, 0.25), true),
    new MxConnectionConstraint(new MxPoint(0, 0.5), true),
    new MxConnectionConstraint(new MxPoint(0, 0.75), true),
    new MxConnectionConstraint(new MxPoint(1, 0.25), true),
    new MxConnectionConstraint(new MxPoint(1, 0.5), true),
    new MxConnectionConstraint(new MxPoint(1, 0.75), true)
  ]
  MxArrow.prototype.constraints = null
  TeeShape.prototype.constraints = null
  CornerShape.prototype.constraints = null
  CrossbarShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0), false),
    new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0, 1), false),
    new MxConnectionConstraint(new MxPoint(0.25, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.75, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 1), false)
  ]

  SingleArrowShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false)
  ]
  DoubleArrowShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false)
  ]
  CrossShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.5, 0), false),
    new MxConnectionConstraint(new MxPoint(0.5, 1), false)
  ]
  UmlLifeline.prototype.constraints = null
  OrShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0, 0.25), false),
    new MxConnectionConstraint(new MxPoint(0, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0, 0.75), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.7, 0.1), false),
    new MxConnectionConstraint(new MxPoint(0.7, 0.9), false)
  ]
  XorShape.prototype.constraints = [new MxConnectionConstraint(new MxPoint(0.175, 0.25), false),
    new MxConnectionConstraint(new MxPoint(0.25, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.175, 0.75), false),
    new MxConnectionConstraint(new MxPoint(1, 0.5), false),
    new MxConnectionConstraint(new MxPoint(0.7, 0.1), false),
    new MxConnectionConstraint(new MxPoint(0.7, 0.9), false)
  ]
})()
