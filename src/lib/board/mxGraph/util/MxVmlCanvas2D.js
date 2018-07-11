/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: MxVmlCanvas2D
 *
 * Implements a canvas to be used for rendering VML. Here is an example of implementing a
 * fallback for SVG images which are not supported in VML-based browsers.
 *
 * (code)
 * let mxVmlCanvas2DImage = MxVmlCanvas2D.prototype.image;
 * MxVmlCanvas2D.prototype.image = function(x, y, w, h, src, aspect, flipH, flipV)
 * {
 *   if (src.substring(src.length - 4, src.length) === '.svg')
 *   {
 *     src = 'http://www.jgraph.com/images/mxgraph.gif';
 *   }
 *
 *   mxVmlCanvas2DImage.apply(this, arguments);
 * };
 * (end)
 *
 * To disable anti-aliasing in the output, use the following code.
 *
 * (code)
 * document.createStyleSheet().cssText = MxClient.VML_PREFIX + '\\:*{antialias:false;)}';
 * (end)
 *
 * A description of the public API is available in <mxXmlCanvas2D>. Note that
 * there is a known issue in VML where gradients are painted using the outer
 * bounding box of rotated shapes, not the actual bounds of the shape. See
 * also <text> for plain text label restrictions in shapes for VML.
 */

import MxAbstractCanvas2D from './MxAbstractCanvas2D'
import MxUtils from './MxUtils'
import MxClient from '@/lib/board/mxGraph/MxClient'
import MxConstants from './MxConstants'

export default class MxVmlCanvas2D {
  constructor(root) {
    MxAbstractCanvas2D.call(this)

    /**
     * Variable: root
     *
     * Reference to the container for the SVG content.
     */
    this.root = root
  }
}

/**
 * Extends MxAbstractCanvas2D
 */
MxUtils.extend(MxVmlCanvas2D, MxAbstractCanvas2D)

/**
 * Variable: path
 *
 * Holds the current DOM node.
 */
MxVmlCanvas2D.prototype.node = null

/**
 * Variable: textEnabled
 *
 * Specifies if text output should be enabledetB. Default is true.
 */
MxVmlCanvas2D.prototype.textEnabled = true

/**
 * Variable: moveOp
 *
 * Contains the string used for moving in paths. Default is 'm'.
 */
MxVmlCanvas2D.prototype.moveOp = 'm'

/**
 * Variable: lineOp
 *
 * Contains the string used for moving in paths. Default is 'l'.
 */
MxVmlCanvas2D.prototype.lineOp = 'l'

/**
 * Variable: curveOp
 *
 * Contains the string used for bezier curves. Default is 'c'.
 */
MxVmlCanvas2D.prototype.curveOp = 'c'

/**
 * Variable: closeOp
 *
 * Holds the operator for closing curves. Default is 'x e'.
 */
MxVmlCanvas2D.prototype.closeOp = 'x'

/**
 * Variable: rotatedHtmlBackground
 *
 * Background color for rotated HTML. Default is ''. This can be set to eg.
 * white to improve rendering of rotated text in VML for IE9.
 */
MxVmlCanvas2D.prototype.rotatedHtmlBackground = ''

/**
 * Variable: vmlScale
 *
 * Specifies the scale used to draw VML shapes.
 */
MxVmlCanvas2D.prototype.vmlScale = 1

/**
 * Function: createElement
 *
 * Creates the given element using the document.
 */
MxVmlCanvas2D.prototype.createElement = function(name) {
  return document.createElement(name)
}

/**
 * Function: createVmlElement
 *
 * Creates a new element using <createElement> and prefixes the given name with
 * <MxClient.VML_PREFIX>.
 */
MxVmlCanvas2D.prototype.createVmlElement = function(name) {
  return this.createElement(MxClient.VML_PREFIX + ':' + name)
}

/**
 * Function: addNode
 *
 * Adds the current node to the <root>.
 */
MxVmlCanvas2D.prototype.addNode = function(filled, stroked) {
  let node = this.node
  let s = this.state

  if (node !== null) {
    if (node.nodeName === 'shape') {
      // Checks if the path is not empty
      if (this.path !== null && this.path.length > 0) {
        node.path = this.path.join(' ') + ' e'
        node.style.width = this.root.style.width
        node.style.height = this.root.style.height
        node.coordsize =
          parseInt(node.style.width) + ' ' + parseInt(node.style.height)
      } else {
        return
      }
    }

    node.strokeweight =
      this.format(Math.max(1, (s.strokeWidth * s.scale) / this.vmlScale)) + 'px'

    if (s.shadow) {
      this.root.appendChild(
        this.createShadow(
          node,
          filled && s.fillColor !== null,
          stroked && s.strokeColor !== null
        )
      )
    }

    if (stroked && s.strokeColor !== null) {
      node.stroked = 'true'
      node.strokecolor = s.strokeColor
    } else {
      node.stroked = 'false'
    }

    node.appendChild(this.createStroke())

    if (filled && s.fillColor !== null) {
      node.appendChild(this.createFill())
    } else if (
      this.pointerEvents &&
      (node.nodeName !== 'shape' ||
        this.path[this.path.length - 1] === this.closeOp)
    ) {
      node.appendChild(this.createTransparentFill())
    } else {
      node.filled = 'false'
    }

    // LATER: Update existing DOM for performance
    this.root.appendChild(node)
  }
}

/**
 * Function: createTransparentFill
 *
 * Creates a transparent fill.
 */
MxVmlCanvas2D.prototype.createTransparentFill = function() {
  let fill = this.createVmlElement('fill')
  fill.src = MxClient.imageBasePath + '/transparent.gif'
  fill.type = 'tile'

  return fill
}

/**
 * Function: createFill
 *
 * Creates a fill for the current state.
 */
MxVmlCanvas2D.prototype.createFill = function() {
  let s = this.state

  // Gradients in foregrounds not supported because special gradients
  // with bounds must be created for each element in graphics-canvases
  let fill = this.createVmlElement('fill')
  fill.color = s.fillColor

  if (s.gradientColor !== null) {
    fill.type = 'gradient'
    fill.method = 'none'
    fill.color2 = s.gradientColor
    let angle = 180 - s.rotation

    if (s.gradientDirection === MxConstants.DIRECTION_WEST) {
      angle -= 90 + (this.root.style.flip === 'x' ? 180 : 0)
    } else if (s.gradientDirection === MxConstants.DIRECTION_EAST) {
      angle += 90 + (this.root.style.flip === 'x' ? 180 : 0)
    } else if (s.gradientDirection === MxConstants.DIRECTION_NORTH) {
      angle -= 180 + (this.root.style.flip === 'y' ? -180 : 0)
    } else {
      angle += this.root.style.flip === 'y' ? -180 : 0
    }

    if (this.root.style.flip === 'x' || this.root.style.flip === 'y') {
      angle *= -1
    }

    // LATER: Fix outer bounding box for rotated shapes used in VML.
    fill.angle = MxUtils.mod(angle, 360)
    fill.opacity = s.alpha * s.gradientFillAlpha * 100 + '%'
    fill.setAttribute(
      MxClient.OFFICE_PREFIX + ':opacity2',
      s.alpha * s.gradientAlpha * 100 + '%'
    )
  } else if (s.alpha < 1 || s.fillAlpha < 1) {
    fill.opacity = s.alpha * s.fillAlpha * 100 + '%'
  }

  return fill
}
/**
 * Function: createStroke
 *
 * Creates a fill for the current state.
 */
MxVmlCanvas2D.prototype.createStroke = function() {
  let s = this.state
  let stroke = this.createVmlElement('stroke')
  stroke.endcap = s.lineCap || 'flat'
  stroke.joinstyle = s.lineJoin || 'miter'
  stroke.miterlimit = s.miterLimit || '10'

  if (s.alpha < 1 || s.strokeAlpha < 1) {
    stroke.opacity = s.alpha * s.strokeAlpha * 100 + '%'
  }

  if (s.dashed) {
    stroke.dashstyle = this.getVmlDashStyle()
  }

  return stroke
}

/**
 * Function: getVmlDashPattern
 *
 * Returns a VML dash pattern for the current dashPattern.
 * See http://msdn.microsoft.com/en-us/library/bb264085(v=vs.85).aspx
 */
MxVmlCanvas2D.prototype.getVmlDashStyle = function() {
  let result = 'dash'

  if (typeof this.state.dashPattern === 'string') {
    let tok = this.state.dashPattern.split(' ')

    if (tok.length > 0 && tok[0] === 1) {
      result = '0 2'
    }
  }

  return result
}

/**
 * Function: createShadow
 *
 * Creates a shadow for the given node.
 */
MxVmlCanvas2D.prototype.createShadow = function(node, filled, stroked) {
  let s = this.state
  let rad = -s.rotation * (Math.PI / 180)
  let cos = Math.cos(rad)
  let sin = Math.sin(rad)

  let dx = s.shadowDx * s.scale
  let dy = s.shadowDy * s.scale

  if (this.root.style.flip === 'x') {
    dx *= -1
  } else if (this.root.style.flip === 'y') {
    dy *= -1
  }

  let shadow = node.cloneNode(true)
  shadow.style.marginLeft = Math.round(dx * cos - dy * sin) + 'px'
  shadow.style.marginTop = Math.round(dx * sin + dy * cos) + 'px'

  // Workaround for wrong cloning in IE8 standards mode
  if (document.documentMode === 8) {
    shadow.strokeweight = node.strokeweight

    if (node.nodeName === 'shape') {
      shadow.path = this.path.join(' ') + ' e'
      shadow.style.width = this.root.style.width
      shadow.style.height = this.root.style.height
      shadow.coordsize =
        parseInt(node.style.width) + ' ' + parseInt(node.style.height)
    }
  }

  if (stroked) {
    shadow.strokecolor = s.shadowColor
    shadow.appendChild(this.createShadowStroke())
  } else {
    shadow.stroked = 'false'
  }

  if (filled) {
    shadow.appendChild(this.createShadowFill())
  } else {
    shadow.filled = 'false'
  }

  return shadow
}

/**
 * Function: createShadowFill
 *
 * Creates the fill for the shadow.
 */
MxVmlCanvas2D.prototype.createShadowFill = function() {
  let fill = this.createVmlElement('fill')
  fill.color = this.state.shadowColor
  fill.opacity = this.state.alpha * this.state.shadowAlpha * 100 + '%'

  return fill
}

/**
 * Function: createShadowStroke
 *
 * Creates the stroke for the shadow.
 */
MxVmlCanvas2D.prototype.createShadowStroke = function() {
  let stroke = this.createStroke()
  stroke.opacity = this.state.alpha * this.state.shadowAlpha * 100 + '%'

  return stroke
}

/**
 * Function: rotate
 *
 * Sets the rotation of the canvas. Note that rotation cannot be concatenated.
 */
MxVmlCanvas2D.prototype.rotate = function(theta, flipH, flipV, cx, cy) {
  if (flipH && flipV) {
    theta += 180
  } else if (flipH) {
    this.root.style.flip = 'x'
  } else if (flipV) {
    this.root.style.flip = 'y'
  }

  if (flipH ? !flipV : flipV) {
    theta *= -1
  }

  this.root.style.rotation = theta
  this.state.rotation = this.state.rotation + theta
  this.state.rotationCx = cx
  this.state.rotationCy = cy
}

/**
 * Function: begin
 *
 * Extends superclass to create path.
 */
MxVmlCanvas2D.prototype.begin = function() {
  MxAbstractCanvas2D.prototype.begin.apply(this, arguments)
  this.node = this.createVmlElement('shape')
  this.node.style.position = 'absolute'
}

/**
 * Function: quadTo
 *
 * Replaces quadratic curve with bezier curve in VML.
 */
MxVmlCanvas2D.prototype.quadTo = function(x1, y1, x2, y2) {
  let s = this.state

  let cpx0 = (this.lastX + s.dx) * s.scale
  let cpy0 = (this.lastY + s.dy) * s.scale
  let qpx1 = (x1 + s.dx) * s.scale
  let qpy1 = (y1 + s.dy) * s.scale
  let cpx3 = (x2 + s.dx) * s.scale
  let cpy3 = (y2 + s.dy) * s.scale

  let cpx1 = cpx0 + (2 / 3) * (qpx1 - cpx0)
  let cpy1 = cpy0 + (2 / 3) * (qpy1 - cpy0)

  let cpx2 = cpx3 + (2 / 3) * (qpx1 - cpx3)
  let cpy2 = cpy3 + (2 / 3) * (qpy1 - cpy3)

  this.path.push(
    'c ' +
      this.format(cpx1) +
      ' ' +
      this.format(cpy1) +
      ' ' +
      this.format(cpx2) +
      ' ' +
      this.format(cpy2) +
      ' ' +
      this.format(cpx3) +
      ' ' +
      this.format(cpy3)
  )
  this.lastX = cpx3 / s.scale - s.dx
  this.lastY = cpy3 / s.scale - s.dy
}

/**
 * Function: createRect
 *
 * Sets the glass gradient.
 */
MxVmlCanvas2D.prototype.createRect = function(nodeName, x, y, w, h) {
  let s = this.state
  let n = this.createVmlElement(nodeName)
  n.style.position = 'absolute'
  n.style.left = this.format((x + s.dx) * s.scale) + 'px'
  n.style.top = this.format((y + s.dy) * s.scale) + 'px'
  n.style.width = this.format(w * s.scale) + 'px'
  n.style.height = this.format(h * s.scale) + 'px'

  return n
}

/**
 * Function: rect
 *
 * Sets the current path to a rectangle.
 */
MxVmlCanvas2D.prototype.rect = function(x, y, w, h) {
  this.node = this.createRect('rect', x, y, w, h)
}

/**
 * Function: roundrect
 *
 * Sets the current path to a rounded rectangle.
 */
MxVmlCanvas2D.prototype.roundrect = function(x, y, w, h, dx, dy) {
  this.node = this.createRect('roundrect', x, y, w, h)
  // SetAttribute needed here for IE8
  this.node.setAttribute(
    'arcsize',
    Math.max((dx * 100) / w, (dy * 100) / h) + '%'
  )
}

/**
 * Function: ellipse
 *
 * Sets the current path to an ellipse.
 */
MxVmlCanvas2D.prototype.ellipse = function(x, y, w, h) {
  this.node = this.createRect('oval', x, y, w, h)
}

/**
 * Function: image
 *
 * Paints an image.
 */
MxVmlCanvas2D.prototype.image = function(
  x,
  y,
  w,
  h,
  src,
  aspect,
  flipH,
  flipV
) {
  let node = null

  if (!aspect) {
    node = this.createRect('image', x, y, w, h)
    node.src = src
  } else {
    // Uses fill with aspect to avoid asynchronous update of size
    node = this.createRect('rect', x, y, w, h)
    node.stroked = 'false'

    // Handles image aspect via fill
    let fill = this.createVmlElement('fill')
    fill.aspect = aspect ? 'atmost' : 'ignore'
    fill.rotate = 'true'
    fill.type = 'frame'
    fill.src = src

    node.appendChild(fill)
  }

  if (flipH && flipV) {
    node.style.rotation = '180'
  } else if (flipH) {
    node.style.flip = 'x'
  } else if (flipV) {
    node.style.flip = 'y'
  }

  if (this.state.alpha < 1 || this.state.fillAlpha < 1) {
    // KNOWN: Borders around transparent images in IE<9. Using fill.opacity
    // fixes this problem by adding a white background in all IE versions.
    node.style.filter +=
      'alpha(opacity=' + this.state.alpha * this.state.fillAlpha * 100 + ')'
  }

  this.root.appendChild(node)
}

/**
 * Function: createText
 *
 * Creates the innermost element that contains the HTML text.
 */
MxVmlCanvas2D.prototype.createDiv = function(str, align, valign, overflow) {
  let div = this.createElement('div')
  let state = this.state

  let css = ''

  if (state.fontBackgroundColor !== null) {
    css += 'background-color:' + state.fontBackgroundColor + ';'
  }

  if (state.fontBorderColor !== null) {
    css += 'border:1px solid ' + state.fontBorderColor + ';'
  }

  if (MxUtils.isNode(str)) {
    div.appendChild(str)
  } else {
    if (overflow !== 'fill' && overflow !== 'width') {
      let div2 = this.createElement('div')
      div2.style.cssText = css
      div2.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
      div2.style.zoom = '1'
      div2.style.textDecoration = 'inherit'
      div2.innerHTML = str
      div.appendChild(div2)
    } else {
      div.style.cssText = css
      div.innerHTML = str
    }
  }

  let style = div.style

  style.fontSize = state.fontSize / this.vmlScale + 'px'
  style.fontFamily = state.fontFamily
  style.color = state.fontColor
  style.verticalAlign = 'top'
  style.textAlign = align || 'left'
  style.lineHeight = MxConstants.ABSOLUTE_LINE_HEIGHT
    ? (state.fontSize * MxConstants.LINE_HEIGHT) / this.vmlScale + 'px'
    : MxConstants.LINE_HEIGHT

  if ((state.fontStyle & MxConstants.FONT_BOLD) === MxConstants.FONT_BOLD) {
    style.fontWeight = 'bold'
  }

  if ((state.fontStyle & MxConstants.FONT_ITALIC) === MxConstants.FONT_ITALIC) {
    style.fontStyle = 'italic'
  }

  if (
    (state.fontStyle & MxConstants.FONT_UNDERLINE) ===
    MxConstants.FONT_UNDERLINE
  ) {
    style.textDecoration = 'underline'
  }

  return div
}

/**
 * Function: text
 *
 * Paints the given text. Possible values for format are empty string for plain
 * text and html for HTML markup. Clipping, text background and border are not
 * supported for plain text in VML.
 */
MxVmlCanvas2D.prototype.text = function(
  x,
  y,
  w,
  h,
  str,
  align,
  valign,
  wrap,
  format,
  overflow,
  clip,
  rotation,
  dir
) {
  if (this.textEnabled && str !== null) {
    let s = this.state

    if (format === 'html') {
      if (s.rotation !== null) {
        let pt = this.rotatePoint(x, y, s.rotation, s.rotationCx, s.rotationCy)

        x = pt.x
        y = pt.y
      }

      if (document.documentMode === 8 && !MxClient.IS_EM) {
        x += s.dx
        y += s.dy

        // Workaround for rendering offsets
        if (overflow !== 'fill' && valign === MxConstants.ALIGN_TOP) {
          y -= 1
        }
      } else {
        x *= s.scale
        y *= s.scale
      }

      // Adds event transparency in IE8 standards without the transparent background
      // filter which cannot be used due to bugs in the zoomed bounding box (too slow)
      // FIXME: No event transparency if inside v:rect (ie part of shape)
      // KNOWN: Offset wrong for rotated text with word that are longer than the wrapping
      // width in IE8 because real width of text cannot be determined here.
      // This should be fixed in mxText.updateBoundingBox by calling before this and
      // passing the real width to this method if not clipped and wrapped.
      let abs =
        document.documentMode === 8 && !MxClient.IS_EM
          ? this.createVmlElement('group')
          : this.createElement('div')
      abs.style.position = 'absolute'
      abs.style.display = 'inline'
      abs.style.left = this.format(x) + 'px'
      abs.style.top = this.format(y) + 'px'
      abs.style.zoom = s.scale

      let box = this.createElement('div')
      box.style.position = 'relative'
      box.style.display = 'inline'

      let margin = MxUtils.getAlignmentAsPoint(align, valign)
      let dx = margin.x
      let dy = margin.y

      let div = this.createDiv(str, align, valign, overflow)
      let inner = this.createElement('div')

      if (dir !== null) {
        div.setAttribute('dir', dir)
      }

      if (wrap && w > 0) {
        if (!clip) {
          div.style.width = Math.round(w) + 'px'
        }

        div.style.wordWrap = MxConstants.WORD_WRAP
        div.style.whiteSpace = 'normal'

        // LATER: Check if other cases need to be handled
        if (div.style.wordWrap === 'break-word') {
          let tmp = div

          if (tmp.firstChild !== null && tmp.firstChild.nodeName === 'DIV') {
            tmp.firstChild.style.width = '100%'
          }
        }
      } else {
        div.style.whiteSpace = 'nowrap'
      }

      let rot = s.rotation + (rotation || 0)

      if (this.rotateHtml && rot !== 0) {
        inner.style.display = 'inline'
        inner.style.zoom = '1'
        inner.appendChild(div)

        // Box not needed for rendering in IE8 standards
        if (
          document.documentMode === 8 &&
          !MxClient.IS_EM &&
          this.root.nodeName !== 'DIV'
        ) {
          box.appendChild(inner)
          abs.appendChild(box)
        } else {
          abs.appendChild(inner)
        }
      } else if (document.documentMode === 8 && !MxClient.IS_EM) {
        box.appendChild(div)
        abs.appendChild(box)
      } else {
        div.style.display = 'inline'
        abs.appendChild(div)
      }

      // Inserts the node into the DOM
      if (this.root.nodeName !== 'DIV') {
        // Rectangle to fix position in group
        let rect = this.createVmlElement('rect')
        rect.stroked = 'false'
        rect.filled = 'false'

        rect.appendChild(abs)
        this.root.appendChild(rect)
      } else {
        this.root.appendChild(abs)
      }

      if (clip) {
        div.style.overflow = 'hidden'
        div.style.width = Math.round(w) + 'px'

        if (!MxClient.IS_QUIRKS) {
          div.style.maxHeight = Math.round(h) + 'px'
        }
      } else if (overflow === 'fill') {
        // KNOWN: Affects horizontal alignment in quirks
        // but fill should only be used with align=left
        div.style.overflow = 'hidden'
        div.style.width = Math.max(0, w) + 1 + 'px'
        div.style.height = Math.max(0, h) + 1 + 'px'
      } else if (overflow === 'width') {
        // KNOWN: Affects horizontal alignment in quirks
        // but fill should only be used with align=left
        div.style.overflow = 'hidden'
        div.style.width = Math.max(0, w) + 1 + 'px'
        div.style.maxHeight = Math.max(0, h) + 1 + 'px'
      }

      if (this.rotateHtml && rot !== 0) {
        let rad = rot * (Math.PI / 180)

        // Precalculate cos and sin for the rotation
        let realCos = parseFloat(parseFloat(Math.cos(rad)).toFixed(8))
        let realSin = parseFloat(parseFloat(Math.sin(-rad)).toFixed(8))

        rad %= 2 * Math.PI
        if (rad < 0) rad += 2 * Math.PI
        rad %= Math.PI
        if (rad > Math.PI / 2) rad = Math.PI - rad

        let cos = Math.cos(rad)
        let sin = Math.sin(rad)

        // Adds div to document to measure size
        if (document.documentMode === 8 && !MxClient.IS_EM) {
          div.style.display = 'inline-block'
          inner.style.display = 'inline-block'
          box.style.display = 'inline-block'
        }

        div.style.visibility = 'hidden'
        div.style.position = 'absolute'
        document.body.appendChild(div)

        let sizeDiv = div

        if (
          sizeDiv.firstChild !== null &&
          sizeDiv.firstChild.nodeName === 'DIV'
        ) {
          sizeDiv = sizeDiv.firstChild
        }

        let tmp = sizeDiv.offsetWidth + 3
        let oh = sizeDiv.offsetHeight

        if (clip) {
          w = Math.min(w, tmp)
          oh = Math.min(oh, h)
        } else {
          w = tmp
        }

        // Handles words that are longer than the given wrapping width
        if (wrap) {
          div.style.width = w + 'px'
        }

        // Simulates max-height in quirks
        if (MxClient.IS_QUIRKS && (clip || overflow === 'width') && oh > h) {
          oh = h

          // Quirks does not support maxHeight
          div.style.height = oh + 'px'
        }

        h = oh

        let topFix =
          (h - h * cos + w * -sin) / 2 -
          realSin * w * (dx + 0.5) +
          realCos * h * (dy + 0.5)
        let leftFix =
          (w - w * cos + h * -sin) / 2 +
          realCos * w * (dx + 0.5) +
          realSin * h * (dy + 0.5)

        if (abs.nodeName === 'group' && this.root.nodeName === 'DIV') {
          // Workaround for bug where group gets moved away if left and top are non-zero in IE8 standards
          let pos = this.createElement('div')
          pos.style.display = 'inline-block'
          pos.style.position = 'absolute'
          pos.style.left = this.format(x + (leftFix - w / 2) * s.scale) + 'px'
          pos.style.top = this.format(y + (topFix - h / 2) * s.scale) + 'px'

          abs.parentNode.appendChild(pos)
          pos.appendChild(abs)
        } else {
          let sc = document.documentMode === 8 && !MxClient.IS_EM ? 1 : s.scale

          abs.style.left = this.format(x + (leftFix - w / 2) * sc) + 'px'
          abs.style.top = this.format(y + (topFix - h / 2) * sc) + 'px'
        }

        // KNOWN: Rotated text rendering quality is bad for IE9 quirks
        inner.style.filter =
          'progid:DXImageTransform.Microsoft.Matrix(M11=' +
          realCos +
          ', M12=' +
          realSin +
          ', M21=' +
          -realSin +
          ', M22=' +
          realCos +
          ", sizingMethod='auto expand')"
        inner.style.backgroundColor = this.rotatedHtmlBackground

        if (this.state.alpha < 1) {
          inner.style.filter += 'alpha(opacity=' + this.state.alpha * 100 + ')'
        }

        // Restore parent node for DIV
        inner.appendChild(div)
        div.style.position = ''
        div.style.visibility = ''
      } else if (document.documentMode !== 8 || MxClient.IS_EM) {
        div.style.verticalAlign = 'top'

        if (this.state.alpha < 1) {
          abs.style.filter = 'alpha(opacity=' + this.state.alpha * 100 + ')'
        }

        // Adds div to document to measure size
        let divParent = div.parentNode
        div.style.visibility = 'hidden'
        document.body.appendChild(div)

        w = div.offsetWidth
        let oh = div.offsetHeight

        // Simulates max-height in quirks
        if (MxClient.IS_QUIRKS && clip && oh > h) {
          oh = h

          // Quirks does not support maxHeight
          div.style.height = oh + 'px'
        }

        h = oh

        div.style.visibility = ''
        divParent.appendChild(div)

        abs.style.left = this.format(x + w * dx * this.state.scale) + 'px'
        abs.style.top = this.format(y + h * dy * this.state.scale) + 'px'
      } else {
        if (this.state.alpha < 1) {
          div.style.filter = 'alpha(opacity=' + this.state.alpha * 100 + ')'
        }

        // Faster rendering in IE8 without offsetWidth/Height
        box.style.left = dx * 100 + '%'
        box.style.top = dy * 100 + '%'
      }
    } else {
      this.plainText(
        x,
        y,
        w,
        h,
        MxUtils.htmlEntities(str, false),
        align,
        valign,
        wrap,
        format,
        overflow,
        clip,
        rotation,
        dir
      )
    }
  }
}

/**
 * Function: plainText
 *
 * Paints the outline of the current path.
 */
MxVmlCanvas2D.prototype.plainText = function(
  x,
  y,
  w,
  h,
  str,
  align,
  valign,
  wrap,
  format,
  overflow,
  clip,
  rotation,
  dir
) {
  // TextDirection is ignored since this code is not used (format is always HTML in the text function)
  let s = this.state
  x = (x + s.dx) * s.scale
  y = (y + s.dy) * s.scale

  let node = this.createVmlElement('shape')
  node.style.width = '1px'
  node.style.height = '1px'
  node.stroked = 'false'

  let fill = this.createVmlElement('fill')
  fill.color = s.fontColor
  fill.opacity = s.alpha * 100 + '%'
  node.appendChild(fill)

  let path = this.createVmlElement('path')
  path.textpathok = 'true'
  path.v =
    'm ' +
    this.format(0) +
    ' ' +
    this.format(0) +
    ' l ' +
    this.format(1) +
    ' ' +
    this.format(0)

  node.appendChild(path)

  // KNOWN: Font family and text decoration ignored
  let tp = this.createVmlElement('textpath')
  tp.style.cssText = 'v-text-align:' + align
  tp.style.align = align
  tp.style.fontFamily = s.fontFamily
  tp.string = str
  tp.on = 'true'

  // Scale via fontsize instead of node.style.zoom for correct offsets in IE8
  let size = (s.fontSize * s.scale) / this.vmlScale
  tp.style.fontSize = size + 'px'

  // Bold
  if ((s.fontStyle & MxConstants.FONT_BOLD) === MxConstants.FONT_BOLD) {
    tp.style.fontWeight = 'bold'
  }

  // Italic
  if ((s.fontStyle & MxConstants.FONT_ITALIC) === MxConstants.FONT_ITALIC) {
    tp.style.fontStyle = 'italic'
  }

  // Underline
  if (
    (s.fontStyle & MxConstants.FONT_UNDERLINE) ===
    MxConstants.FONT_UNDERLINE
  ) {
    tp.style.textDecoration = 'underline'
  }

  let lines = str.split('\n')
  let textHeight = size + (lines.length - 1) * size * MxConstants.LINE_HEIGHT
  let dx = 0
  let dy = 0

  if (valign === MxConstants.ALIGN_BOTTOM) {
    dy = -textHeight / 2
  } else if (valign !== MxConstants.ALIGN_MIDDLE) {
    // top
    dy = textHeight / 2
  }

  if (rotation !== null) {
    node.style.rotation = rotation
    let rad = rotation * (Math.PI / 180)
    dx = Math.sin(rad) * dy
    dy = Math.cos(rad) * dy
  }

  // FIXME: Clipping is relative to bounding box
  /* if (clip){
    node.style.clip = 'rect(0px ' + this.format(w) + 'px ' + this.format(h) + 'px 0px)';
  }*/

  node.appendChild(tp)
  node.style.left = this.format(x - dx) + 'px'
  node.style.top = this.format(y + dy) + 'px'

  this.root.appendChild(node)
}

/**
 * Function: stroke
 *
 * Paints the outline of the current path.
 */
MxVmlCanvas2D.prototype.stroke = function() {
  this.addNode(false, true)
}

/**
 * Function: fill
 *
 * Fills the current path.
 */
MxVmlCanvas2D.prototype.fill = function() {
  this.addNode(true, false)
}

/**
 * Function: fillAndStroke
 *
 * Fills and paints the outline of the current path.
 */
MxVmlCanvas2D.prototype.fillAndStroke = function() {
  this.addNode(true, true)
}
