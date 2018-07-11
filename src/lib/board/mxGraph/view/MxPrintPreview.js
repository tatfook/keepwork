/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Class: MxPrintPreview
 *
 * Implements printing of a diagram across multiple pages. The following opens
 * a print preview for an existing graph:
 *
 * (code)
 * let preview = new MxPrintPreview(graph);
 * preview.open();
 * (end)
 *
 * Use <MxUtils.getScaleForPageCount> as follows in order to print the graph
 * across a given number of pages:
 *
 * (code)
 * let pageCount = MxUtils.prompt('Enter page count', '1');
 *
 * if (pageCount !== null)
 * {
 *   let scale = MxUtils.getScaleForPageCount(pageCount, graph);
 *   let preview = new MxPrintPreview(graph, scale);
 *   preview.open();
 * }
 * (end)
 *
 * Additional pages:
 *
 * To add additional pages before and after the output, <getCoverPages> and
 * <getAppendices> can be used, respectively.
 *
 * (code)
 * let preview = new MxPrintPreview(graph, 1);
 *
 * preview.getCoverPages = function(w, h)
 * {
 *   return [this.renderPage(w, h, 0, 0, MxUtils.bind(this, function(div)
 *   {
 *     div.innerHTML = '<div style="position:relative;margin:4px;">Cover Page</p>'
 *   }))];
 * };
 *
 * preview.getAppendices = function(w, h)
 * {
 *   return [this.renderPage(w, h, 0, 0, MxUtils.bind(this, function(div)
 *   {
 *     div.innerHTML = '<div style="position:relative;margin:4px;">Appendix</p>'
 *   }))];
 * };
 *
 * preview.open();
 * (end)
 *
 * CSS:
 *
 * The CSS from the original page is not carried over to the print preview.
 * To add CSS to the page, use the css argument in the <open> function or
 * override <writeHead> to add the respective link tags as follows:
 *
 * (code)
 * let writeHead = preview.writeHead;
 * preview.writeHead = function(doc, css)
 * {
 *   writeHead.apply(this, arguments);
 *   doc.writeln('<link rel="stylesheet" type="text/css" href="style.css">');
 * };
 * (end)
 *
 * Padding:
 *
 * To add a padding to the page in the preview (but not the print output), use
 * the following code:
 *
 * (code)
 * preview.writeHead = function(doc)
 * {
 *   writeHead.apply(this, arguments);
 *
 *   doc.writeln('<style type="text/css">');
 *   doc.writeln('@media screen {');
 *   doc.writeln('  body > div { padding-top:30px;padding-left:40px;box-sizing:content-box; }');
 *   doc.writeln('}');
 *   doc.writeln('</style>');
 * };
 * (end)
 *
 * Headers:
 *
 * Apart from setting the title argument in the MxPrintPreview constructor you
 * can override <renderPage> as follows to add a header to any page:
 *
 * (code)
 * let oldRenderPage = MxPrintPreview.prototype.renderPage;
 * MxPrintPreview.prototype.renderPage = function(w, h, x, y, content, pageNumber)
 * {
 *   let div = oldRenderPage.apply(this, arguments);
 *
 *   let header = document.createElement('div');
 *   header.style.position = 'absolute';
 *   header.style.top = '0px';
 *   header.style.width = '100%';
 *   header.style.textAlign = 'right';
 *   MxUtils.write(header, 'Your header here');
 *   div.firstChild.appendChild(header);
 *
 *   return div;
 * };
 * (end)
 *
 * The pageNumber argument contains the number of the current page, starting at
 * 1. To display a header on the first page only, check pageNumber and add a
 * vertical offset in the constructor call for the height of the header.
 *
 * Page Format:
 *
 * For landscape printing, use <MxConstants.PAGE_FORMAT_A4_LANDSCAPE> as
 * the pageFormat in <MxUtils.getScaleForPageCount> and <MxPrintPreview>.
 * Keep in mind that one can not set the defaults for the print dialog
 * of the operating system from JavaScript so the user must manually choose
 * a page format that matches this setting.
 *
 * You can try passing the following CSS directive to <open> to set the
 * page format in the print dialog to landscape. However, this CSS
 * directive seems to be ignored in most major browsers, including IE.
 *
 * (code)
 * @page {
 *   size: landscape;
 * }
 * (end)
 *
 * Note that the print preview behaves differently in IE when used from the
 * filesystem or via HTTP so printing should always be tested via HTTP.
 *
 * If you are using a DOCTYPE in the source page you can override <getDoctype>
 * and provide the same DOCTYPE for the print preview if required. Here is
 * an example for IE8 standards mode.
 *
 * (code)
 * let preview = new MxPrintPreview(graph);
 * preview.getDoctype = function()
 * {
 *   return '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=8" ><![endif]-->';
 * };
 * preview.open();
 * (end)
 *
 * Constructor: MxPrintPreview
 *
 * Constructs a new print preview for the given parameters.
 *
 * Parameters:
 *
 * graph - <mxGraph> to be previewed.
 * scale - Optional scale of the output. Default is 1 / <mxGraph.pageScale>.
 * border - Border in pixels along each side of every page. Note that the
 * actual print function in the browser will add another border for
 * printing.
 * pageFormat - <MxRectangle> that specifies the page format (in pixels).
 * This should match the page format of the printer. Default uses the
 * <mxGraph.pageFormat> of the given graph.
 * x0 - Optional left offset of the output. Default is 0.
 * y0 - Optional top offset of the output. Default is 0.
 * borderColor - Optional color of the page border. Default is no border.
 * Note that a border is sometimes useful to highlight the printed page
 * border in the print preview of the browser.
 * title - Optional string that is used for the window title. Default
 * is 'Printer-friendly version'.
 * pageSelector - Optional boolean that specifies if the page selector
 * should appear in the window with the print preview. Default is true.
 */
import MxRectangle from '../util/MxRectangle'
import MxClient from '../MxClient'
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxConstants from '../util/MxConstants'
import MxPoint from '../util/MxPoint'
import MxTemporaryCellStates from './MxTemporaryCellStates'

export default class MxPrintPreview {
  constructor(graph, scale, pageFormat, border, x0, y0, borderColor, title, pageSelector) {
    this.graph = graph
    this.scale = (scale !== null) ? scale : 1 / graph.pageScale
    this.border = (border !== null) ? border : 0
    this.pageFormat = MxRectangle.fromRectangle((pageFormat !== null) ? pageFormat : graph.pageFormat)
    this.title = (title !== null) ? title : 'Printer-friendly version'
    this.x0 = (x0 !== null) ? x0 : 0
    this.y0 = (y0 !== null) ? y0 : 0
    this.borderColor = borderColor
    this.pageSelector = (pageSelector !== null) ? pageSelector : true
  };
}

/**
 * Variable: graph
 *
 * Reference to the <mxGraph> that should be previewed.
 */
MxPrintPreview.prototype.graph = null

/**
 * Variable: pageFormat
 *
 * Holds the <MxRectangle> that defines the page format.
 */
MxPrintPreview.prototype.pageFormat = null

/**
 * Variable: scale
 *
 * Holds the scale of the print preview.
 */
MxPrintPreview.prototype.scale = null

/**
 * Variable: border
 *
 * The border inset around each side of every page in the preview. This is set
 * to 0 if autoOrigin is false.
 */
MxPrintPreview.prototype.border = 0

/**
 * Variable: marginTop
 *
 * The margin at the top of the page (number). Default is 0.
 */
MxPrintPreview.prototype.marginTop = 0

/**
 * Variable: marginBottom
 *
 * The margin at the bottom of the page (number). Default is 0.
 */
MxPrintPreview.prototype.marginBottom = 0

/**
 * Variable: x0
 *
 * Holds the horizontal offset of the output.
 */
MxPrintPreview.prototype.x0 = 0

/**
 * Variable: y0
 *
 * Holds the vertical offset of the output.
 */
MxPrintPreview.prototype.y0 = 0

/**
 * Variable: autoOrigin
 *
 * Specifies if the origin should be automatically computed based on the top,
 * left corner of the actual diagram contents. The required offset will be added
 * to <x0> and <y0> in <open>. Default is true.
 */
MxPrintPreview.prototype.autoOrigin = true

/**
 * Variable: printOverlays
 *
 * Specifies if overlays should be printed. Default is false.
 */
MxPrintPreview.prototype.printOverlays = false

/**
 * Variable: printControls
 *
 * Specifies if controls (such as folding icons) should be printed. Default is
 * false.
 */
MxPrintPreview.prototype.printControls = false

/**
 * Variable: printBackgroundImage
 *
 * Specifies if the background image should be printed. Default is false.
 */
MxPrintPreview.prototype.printBackgroundImage = false

/**
 * Variable: backgroundColor
 *
 * Holds the color value for the page background color. Default is #ffffff.
 */
MxPrintPreview.prototype.backgroundColor = '#ffffff'

/**
 * Variable: borderColor
 *
 * Holds the color value for the page border.
 */
MxPrintPreview.prototype.borderColor = null

/**
 * Variable: title
 *
 * Holds the title of the preview window.
 */
MxPrintPreview.prototype.title = null

/**
 * Variable: pageSelector
 *
 * Boolean that specifies if the page selector should be
 * displayed. Default is true.
 */
MxPrintPreview.prototype.pageSelector = null

/**
 * Variable: wnd
 *
 * Reference to the preview window.
 */
MxPrintPreview.prototype.wnd = null

/**
 * Variable: targetWindow
 *
 * Assign any window here to redirect the rendering in <open>.
 */
MxPrintPreview.prototype.targetWindow = null

/**
 * Variable: pageCount
 *
 * Holds the actual number of pages in the preview.
 */
MxPrintPreview.prototype.pageCount = 0

/**
 * Variable: clipping
 *
 * Specifies is clipping should be used to avoid creating too many cell states
 * in large diagrams. The bounding box of the cells in the original diagram is
 * used if this is enabled. Default is true.
 */
MxPrintPreview.prototype.clipping = true

/**
 * Function: getWindow
 *
 * Returns <wnd>.
 */
MxPrintPreview.prototype.getWindow = function() {
  return this.wnd
}

/**
 * Function: getDocType
 *
 * Returns the string that should go before the HTML tag in the print preview
 * page. This implementation returns an X-UA meta tag for IE5 in quirks mode,
 * IE8 in IE8 standards mode and edge in IE9 standards mode.
 */
MxPrintPreview.prototype.getDoctype = function() {
  let dt = ''

  if (document.documentMode === 5) {
    dt = '<meta http-equiv="X-UA-Compatible" content="IE=5">'
  } else if (document.documentMode === 8) {
    dt = '<meta http-equiv="X-UA-Compatible" content="IE=8">'
  } else if (document.documentMode > 8) {
    // Comment needed to make standards doctype apply in IE
    dt = '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->'
  }

  return dt
}

/**
 * Function: appendGraph
 *
 * Adds the given graph to the existing print preview.
 *
 * Parameters:
 *
 * css - Optional CSS string to be used in the head section.
 * targetWindow - Optional window that should be used for rendering. If
 * this is specified then no HEAD tag, CSS and BODY tag will be written.
 */
MxPrintPreview.prototype.appendGraph = function(graph, scale, x0, y0, forcePageBreaks, keepOpen) {
  this.graph = graph
  this.scale = (scale !== null) ? scale : 1 / graph.pageScale
  this.x0 = x0
  this.y0 = y0
  this.open(null, null, forcePageBreaks, keepOpen)
}

/**
 * Function: open
 *
 * Shows the print preview window. The window is created here if it does
 * not exist.
 *
 * Parameters:
 *
 * css - Optional CSS string to be used in the head section.
 * targetWindow - Optional window that should be used for rendering. If
 * this is specified then no HEAD tag, CSS and BODY tag will be written.
 */
MxPrintPreview.prototype.open = function(css, targetWindow, forcePageBreaks, keepOpen) {
  // Closing the window while the page is being rendered may cause an
  // exception in IE. This and any other exceptions are simply ignored.
  let previousInitializeOverlay = this.graph.cellRenderer.initializeOverlay
  let div = null

  try {
    // Temporarily overrides the method to redirect rendering of overlays
    // to the draw pane so that they are visible in the printout
    if (this.printOverlays) {
      this.graph.cellRenderer.initializeOverlay = function(state, overlay) {
        overlay.init(state.view.getDrawPane())
      }
    }

    if (this.printControls) {
      this.graph.cellRenderer.initControl = function(state, control, handleEvents, clickHandler) {
        control.dialect = state.view.graph.dialect
        control.init(state.view.getDrawPane())
      }
    }

    this.wnd = (targetWindow !== null) ? targetWindow : this.wnd
    let isNewWindow = false

    if (this.wnd === null) {
      isNewWindow = true
      this.wnd = window.open()
    }

    let doc = this.wnd.document

    if (isNewWindow) {
      let dt = this.getDoctype()

      if (dt !== null && dt.length > 0) {
        doc.writeln(dt)
      }

      if (MxClient.IS_VML) {
        doc.writeln('<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">')
      } else {
        if (document.compatMode === 'CSS1Compat') {
          doc.writeln('<!DOCTYPE html>')
        }

        doc.writeln('<html>')
      }

      doc.writeln('<head>')
      this.writeHead(doc, css)
      doc.writeln('</head>')
      doc.writeln('<body class="mxPage">')
    }

    // Computes the horizontal and vertical page count
    let bounds = this.graph.getGraphBounds().clone()
    let currentScale = this.graph.getView().getScale()
    let sc = currentScale / this.scale
    let tr = this.graph.getView().getTranslate()

    // Uses the absolute origin with no offset for all printing
    if (!this.autoOrigin) {
      this.x0 -= tr.x * this.scale
      this.y0 -= tr.y * this.scale
      bounds.width += bounds.x
      bounds.height += bounds.y
      bounds.x = 0
      bounds.y = 0
      this.border = 0
    }

    // Store the available page area
    let availableWidth = this.pageFormat.width - (this.border * 2)
    let availableHeight = this.pageFormat.height - (this.border * 2)

    // Adds margins to page format
    this.pageFormat.height += this.marginTop + this.marginBottom

    // Compute the unscaled, untranslated bounds to find
    // the number of vertical and horizontal pages
    bounds.width /= sc
    bounds.height /= sc

    let hpages = Math.max(1, Math.ceil((bounds.width + this.x0) / availableWidth))
    let vpages = Math.max(1, Math.ceil((bounds.height + this.y0) / availableHeight))
    this.pageCount = hpages * vpages

    let writePageSelector = MxUtils.bind(this, function() {
      if (this.pageSelector && (vpages > 1 || hpages > 1)) {
        let table = this.createPageSelector(vpages, hpages)
        doc.body.appendChild(table)

        // Implements position: fixed in IE quirks mode
        if ((MxClient.IS_IE && doc.documentMode === null) || doc.documentMode === 5 || doc.documentMode === 8 || doc.documentMode === 7) {
          table.style.position = 'absolute'

          let update = function() {
            table.style.top = ((doc.body.scrollTop || doc.documentElement.scrollTop) + 10) + 'px'
          }

          MxEvent.addListener(this.wnd, 'scroll', function(evt) {
            update()
          })

          MxEvent.addListener(this.wnd, 'resize', function(evt) {
            update()
          })
        }
      }
    })

    let addPage = MxUtils.bind(this, function(div, addBreak) {
      // Border of the DIV (aka page) inside the document
      if (this.borderColor !== null) {
        div.style.borderColor = this.borderColor
        div.style.borderStyle = 'solid'
        div.style.borderWidth = '1px'
      }

      // Needs to be assigned directly because IE doesn't support
      // child selectors, eg. body > div { background: white; }
      div.style.background = this.backgroundColor

      if (forcePageBreaks || addBreak) {
        div.style.pageBreakAfter = 'always'
      }

      // NOTE: We are dealing with cross-window DOM here, which
      // is a problem in IE, so we copy the HTML markup instead.
      // The underlying problem is that the graph display markup
      // creation (in mxShape, mxGraphView) is hardwired to using
      // document.createElement and hence we must use this document
      // to create the complete page and then copy it over to the
      // new window.document. This can be fixed later by using the
      // ownerDocument of the container in mxShape and mxGraphView.
      if (isNewWindow && (MxClient.IS_IE || document.documentMode >= 11 || MxClient.IS_EDGE)) {
        // For some obscure reason, removing the DIV from the
        // parent before fetching its outerHTML has missing
        // fillcolor properties and fill children, so the div
        // must be removed afterwards to keep the fillcolors.
        doc.writeln(div.outerHTML)
        div.parentNode.removeChild(div)
      } else {
        div.parentNode.removeChild(div)
        doc.body.appendChild(div)
      }

      if (forcePageBreaks || addBreak) {
        this.addPageBreak(doc)
      }
    })

    let cov = this.getCoverPages(this.pageFormat.width, this.pageFormat.height)

    if (cov !== null) {
      for (let i = 0; i < cov.length; i++) {
        addPage(cov[i], true)
      }
    }

    let apx = this.getAppendices(this.pageFormat.width, this.pageFormat.height)

    // Appends each page to the page output for printing, making
    // sure there will be a page break after each page (ie. div)
    for (let i = 0; i < vpages; i++) {
      let dy = i * availableHeight / this.scale - this.y0 / this.scale + (bounds.y - tr.y * currentScale) / currentScale

      for (let j = 0; j < hpages; j++) {
        if (this.wnd === null) {
          return null
        }

        let dx = j * availableWidth / this.scale - this.x0 / this.scale + (bounds.x - tr.x * currentScale) / currentScale
        let pageNum = i * hpages + j + 1
        let clip = new MxRectangle(dx, dy, availableWidth, availableHeight)
        div = this.renderPage(this.pageFormat.width, this.pageFormat.height, 0, 0, MxUtils.bind(this, function(div) {
          this.addGraphFragment(-dx, -dy, this.scale, pageNum, div, clip)

          if (this.printBackgroundImage) {
            this.insertBackgroundImage(div, -dx, -dy)
          }
        }), pageNum)

        // Gives the page a unique ID for later accessing the page
        div.setAttribute('id', 'mxPage-' + pageNum)

        addPage(div, apx !== null || i < vpages - 1 || j < hpages - 1)
      }
    }

    if (apx !== null) {
      for (let i = 0; i < apx.length; i++) {
        addPage(apx[i], i < apx.length - 1)
      }
    }

    if (isNewWindow && !keepOpen) {
      this.closeDocument()
      writePageSelector()
    }

    this.wnd.focus()
  } catch (e) {
    // Removes the DIV from the document in case of an error
    if (div !== null && div.parentNode !== null) {
      div.parentNode.removeChild(div)
    }
  } finally {
    this.graph.cellRenderer.initializeOverlay = previousInitializeOverlay
  }

  return this.wnd
}

/**
 * Function: addPageBreak
 *
 * Adds a page break to the given document.
 */
MxPrintPreview.prototype.addPageBreak = function(doc) {
  let hr = doc.createElement('hr')
  hr.className = 'mxPageBreak'
  doc.body.appendChild(hr)
}

/**
 * Function: closeDocument
 *
 * Writes the closing tags for body and page after calling <writePostfix>.
 */
MxPrintPreview.prototype.closeDocument = function() {
  if (this.wnd !== null && this.wnd.document !== null) {
    let doc = this.wnd.document

    this.writePostfix(doc)
    doc.writeln('</body>')
    doc.writeln('</html>')
    doc.close()

    // Removes all event handlers in the print output
    MxEvent.release(doc.body)
  }
}

/**
 * Function: writeHead
 *
 * Writes the HEAD section into the given document, without the opening
 * and closing HEAD tags.
 */
MxPrintPreview.prototype.writeHead = function(doc, css) {
  if (this.title !== null) {
    doc.writeln('<title>' + this.title + '</title>')
  }

  // Adds required namespaces
  if (MxClient.IS_VML) {
    doc.writeln('<style type="text/css">v\\:*{behavior:url(#default#VML)}o\\:*{behavior:url(#default#VML)}</style>')
  }

  // Adds all required stylesheets
  MxClient.link('stylesheet', MxClient.basePath + '/css/common.css', doc)

  // Removes horizontal rules and page selector from print output
  doc.writeln('<style type="text/css">')
  doc.writeln('@media print {')
  doc.writeln('  table.mxPageSelector { display: none; }')
  doc.writeln('  hr.mxPageBreak { display: none; }')
  doc.writeln('}')
  doc.writeln('@media screen {')

  // NOTE: position: fixed is not supported in IE, so the page selector
  // position (absolute) needs to be updated in IE (see below)
  doc.writeln('  table.mxPageSelector { position: fixed; right: 10px; top: 10px;' + 'font-family: Arial; font-size:10pt; border: solid 1px darkgray;' + 'background: white; border-collapse:collapse; }')
  doc.writeln('  table.mxPageSelector td { border: solid 1px gray; padding:4px; }')
  doc.writeln('  body.mxPage { background: gray; }')
  doc.writeln('}')

  if (css !== null) {
    doc.writeln(css)
  }

  doc.writeln('</style>')
}

/**
 * Function: writePostfix
 *
 * Called before closing the body of the page. This implementation is empty.
 */
MxPrintPreview.prototype.writePostfix = function(doc) {
  // empty
}

/**
 * Function: createPageSelector
 *
 * Creates the page selector table.
 */
MxPrintPreview.prototype.createPageSelector = function(vpages, hpages) {
  let doc = this.wnd.document
  let table = doc.createElement('table')
  table.className = 'mxPageSelector'
  table.setAttribute('border', '0')

  let tbody = doc.createElement('tbody')

  for (let i = 0; i < vpages; i++) {
    let row = doc.createElement('tr')

    for (let j = 0; j < hpages; j++) {
      let pageNum = i * hpages + j + 1
      let cell = doc.createElement('td')
      let a = doc.createElement('a')
      a.setAttribute('href', '#mxPage-' + pageNum)

      // Workaround for FF where the anchor is appended to the URL of the original document
      if (MxClient.IS_NS && !MxClient.IS_SF && !MxClient.IS_GC) {
        let js = 'let page = document.getElementById(\'mxPage-' + pageNum + '\');page.scrollIntoView(true);event.preventDefault();'
        a.setAttribute('onclick', js)
      }

      MxUtils.write(a, pageNum, doc)
      cell.appendChild(a)
      row.appendChild(cell)
    }

    tbody.appendChild(row)
  }

  table.appendChild(tbody)

  return table
}

/**
 * Function: renderPage
 *
 * Creates a DIV that prints a single page of the given
 * graph using the given scale and returns the DIV that
 * represents the page.
 *
 * Parameters:
 *
 * w - Width of the page in pixels.
 * h - Height of the page in pixels.
 * dx - Optional horizontal page offset in pixels (used internally).
 * dy - Optional vertical page offset in pixels (used internally).
 * content - Callback that adds the HTML content to the inner div of a page.
 * Takes the inner div as the argument.
 * pageNumber - Integer representing the page number.
 */
MxPrintPreview.prototype.renderPage = function(w, h, dx, dy, content, pageNumber) {
  let doc = this.wnd.document
  let div = document.createElement('div')
  let arg = null

  try {
    // Workaround for ignored clipping in IE 9 standards
    // when printing with page breaks and HTML labels.
    if (dx !== 0 || dy !== 0) {
      div.style.position = 'relative'
      div.style.width = w + 'px'
      div.style.height = h + 'px'
      div.style.pageBreakInside = 'avoid'

      let innerDiv = document.createElement('div')
      innerDiv.style.position = 'relative'
      innerDiv.style.top = this.border + 'px'
      innerDiv.style.left = this.border + 'px'
      innerDiv.style.width = (w - 2 * this.border) + 'px'
      innerDiv.style.height = (h - 2 * this.border) + 'px'
      innerDiv.style.overflow = 'hidden'

      let viewport = document.createElement('div')
      viewport.style.position = 'relative'
      viewport.style.marginLeft = dx + 'px'
      viewport.style.marginTop = dy + 'px'

      // FIXME: IE8 standards output problems
      if (doc.documentMode === 8) {
        innerDiv.style.position = 'absolute'
        viewport.style.position = 'absolute'
      }

      if (doc.documentMode === 10) {
        viewport.style.width = '100%'
        viewport.style.height = '100%'
      }

      innerDiv.appendChild(viewport)
      div.appendChild(innerDiv)
      document.body.appendChild(div)
      arg = viewport
    } else {
      // FIXME: IE10/11 too many pages
      div.style.width = w + 'px'
      div.style.height = h + 'px'
      div.style.overflow = 'hidden'
      div.style.pageBreakInside = 'avoid'

      // IE8 uses above branch currently
      if (doc.documentMode === 8) {
        div.style.position = 'relative'
      }

      let innerDiv = document.createElement('div')
      innerDiv.style.width = (w - 2 * this.border) + 'px'
      innerDiv.style.height = (h - 2 * this.border) + 'px'
      innerDiv.style.overflow = 'hidden'

      if (MxClient.IS_IE && (doc.documentMode === null || doc.documentMode === 5 || doc.documentMode === 8 || doc.documentMode === 7)) {
        innerDiv.style.marginTop = this.border + 'px'
        innerDiv.style.marginLeft = this.border + 'px'
      } else {
        innerDiv.style.top = this.border + 'px'
        innerDiv.style.left = this.border + 'px'
      }

      if (this.graph.dialect === MxConstants.DIALECT_VML) {
        innerDiv.style.position = 'absolute'
      }

      div.appendChild(innerDiv)
      document.body.appendChild(div)
      arg = innerDiv
    }
  } catch (e) {
    div.parentNode.removeChild(div)
    div = null

    throw e
  }

  content(arg)

  return div
}

/**
 * Function: getRoot
 *
 * Returns the root cell for painting the graph.
 */
MxPrintPreview.prototype.getRoot = function() {
  let root = this.graph.view.currentRoot

  if (root === null) {
    root = this.graph.getModel().getRoot()
  }

  return root
}

/**
 * Function: addGraphFragment
 *
 * Adds a graph fragment to the given div.
 *
 * Parameters:
 *
 * dx - Horizontal translation for the diagram.
 * dy - Vertical translation for the diagram.
 * scale - Scale for the diagram.
 * pageNumber - Number of the page to be rendered.
 * div - Div that contains the output.
 * clip - Contains the clipping rectangle as an <MxRectangle>.
 */
MxPrintPreview.prototype.addGraphFragment = function(dx, dy, scale, pageNumber, div, clip) {
  let view = this.graph.getView()
  let previousContainer = this.graph.container
  this.graph.container = div

  let canvas = view.getCanvas()
  let backgroundPane = view.getBackgroundPane()
  let drawPane = view.getDrawPane()
  let overlayPane = view.getOverlayPane()

  if (this.graph.dialect === MxConstants.DIALECT_SVG) {
    view.createSvg()
  } else if (this.graph.dialect === MxConstants.DIALECT_VML) {
    view.createVml()
  } else {
    view.createHtml()
  }

  // Disables events on the view
  let eventsEnabled = view.isEventsEnabled()
  view.setEventsEnabled(false)

  // Disables the graph to avoid cursors
  let graphEnabled = this.graph.isEnabled()
  this.graph.setEnabled(false)

  // Resets the translation
  let translate = view.getTranslate()
  view.translate = new MxPoint(dx, dy)

  // Redraws only states that intersect the clip
  let redraw = this.graph.cellRenderer.redraw
  let states = view.states
  let s = view.scale

  // Gets the transformed clip for intersection check below
  if (this.clipping) {
    let tempClip = new MxRectangle((clip.x + translate.x) * s, (clip.y + translate.y) * s,
      clip.width * s / scale, clip.height * s / scale)

    // Checks clipping rectangle for speedup
    // Must create terminal states for edge clipping even if terminal outside of clip
    this.graph.cellRenderer.redraw = function(state, force, rendering) {
      if (state !== null) {
        // Gets original state from graph to find bounding box
        let orig = states.get(state.cell)

        if (orig !== null) {
          let bbox = view.getBoundingBox(orig, false)

          // Stops rendering if outside clip for speedup
          if (bbox !== null && !MxUtils.intersects(tempClip, bbox)) {
            return
          }
        }
      }

      redraw.apply(this, arguments)
    }
  }

  let temp = null

  try {
    // Creates the temporary cell states in the view and
    // draws them onto the temporary DOM nodes in the view
    let cells = [this.getRoot()]
    temp = new MxTemporaryCellStates(view, scale, cells, null, MxUtils.bind(this, function(state) {
      return this.getLinkForCellState(state)
    }))
  } finally {
    // Removes overlay pane with selection handles
    // controls and icons from the print output
    if (MxClient.IS_IE) {
      view.overlayPane.innerHTML = ''
      view.canvas.style.overflow = 'hidden'
      view.canvas.style.position = 'relative'
      view.canvas.style.top = this.marginTop + 'px'
      view.canvas.style.width = clip.width + 'px'
      view.canvas.style.height = clip.height + 'px'
    } else {
      // Removes everything but the SVG node
      let tmp = div.firstChild

      while (tmp !== null) {
        let next = tmp.nextSibling
        let name = tmp.nodeName.toLowerCase()

        // Note: Width and height are required in FF 11
        if (name === 'svg') {
          tmp.style.overflow = 'hidden'
          tmp.style.position = 'relative'
          tmp.style.top = this.marginTop + 'px'
          tmp.setAttribute('width', clip.width)
          tmp.setAttribute('height', clip.height)
          tmp.style.width = ''
          tmp.style.height = ''
        } else if (tmp.style.cursor !== 'default' && name !== 'div') {
          // Tries to fetch all text labels and only text labels
          tmp.parentNode.removeChild(tmp)
        }

        tmp = next
      }
    }

    // Puts background image behind SVG output
    if (this.printBackgroundImage) {
      let svgs = div.getElementsByTagName('svg')

      if (svgs.length > 0) {
        svgs[0].style.position = 'absolute'
      }
    }

    // Completely removes the overlay pane to remove more handles
    view.overlayPane.parentNode.removeChild(view.overlayPane)

    // Restores the state of the view
    this.graph.setEnabled(graphEnabled)
    this.graph.container = previousContainer
    this.graph.cellRenderer.redraw = redraw
    view.canvas = canvas
    view.backgroundPane = backgroundPane
    view.drawPane = drawPane
    view.overlayPane = overlayPane
    view.translate = translate
    temp.destroy()
    view.setEventsEnabled(eventsEnabled)
  }
}

/**
 * Function: getLinkForCellState
 *
 * Returns the link for the given cell state. This returns null.
 */
MxPrintPreview.prototype.getLinkForCellState = function(state) {
  return this.graph.getLinkForCell(state.cell)
}

/**
 * Function: insertBackgroundImage
 *
 * Inserts the background image into the given div.
 */
MxPrintPreview.prototype.insertBackgroundImage = function(div, dx, dy) {
  let bg = this.graph.backgroundImage

  if (bg !== null) {
    let img = document.createElement('img')
    img.style.position = 'absolute'
    img.style.marginLeft = Math.round(dx * this.scale) + 'px'
    img.style.marginTop = Math.round(dy * this.scale) + 'px'
    img.setAttribute('width', Math.round(this.scale * bg.width))
    img.setAttribute('height', Math.round(this.scale * bg.height))
    img.src = bg.src

    div.insertBefore(img, div.firstChild)
  }
}

/**
 * Function: getCoverPages
 *
 * Returns the pages to be added before the print output. This returns null.
 */
MxPrintPreview.prototype.getCoverPages = function() {
  return null
}

/**
 * Function: getAppendices
 *
 * Returns the pages to be added after the print output. This returns null.
 */
MxPrintPreview.prototype.getAppendices = function() {
  return null
}

/**
 * Function: print
 *
 * Opens the print preview and shows the print dialog.
 *
 * Parameters:
 *
 * css - Optional CSS string to be used in the head section.
 */
MxPrintPreview.prototype.print = function(css) {
  let wnd = this.open(css)

  if (wnd !== null) {
    wnd.print()
  }
}

/**
 * Function: close
 *
 * Closes the print preview window.
 */
MxPrintPreview.prototype.close = function() {
  if (this.wnd !== null) {
    this.wnd.close()
    this.wnd = null
  }
}
