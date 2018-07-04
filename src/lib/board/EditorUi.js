import Board from './Board'
import Base64 from 'js-base64'

import EditorUi from './drawio/js/EditorUi'
import Graph from './Graph'

import mxClient from './mxGraph/mxClient'
import mxUtils from './mxGraph/util/mxUtils'
import mxEvent from './mxGraph/util/mxEvent'
import mxResources from './mxGraph/util/mxResources'
import mxGraphModel from './mxGraph/model/mxGraphModel'
import mxEventObject from './mxGraph/util/mxEventObject'

export default class extends EditorUi {
  /**
   * Defines the maximum size for images.
   */
  maxImageSize = 520

  /**
   * Maximum allowed size for images is 1 MB.
   */
  maxImageBytes = 1000000

  /**
   * Images above 100K should be resampled.
   */
  resampleThreshold = 100000

  init() {
    editorUiInit.apply(this, arguments)

    var graph = this.editor.graph

    if (!this.editor.chromeless) {
      var textInput = document.createElement('div')

      textInput.style.position = 'absolute'
      textInput.style.whiteSpace = 'nowrap'
      textInput.style.overflow = 'hidden'
      textInput.style.display = 'block'
      textInput.contentEditable = true

      mxUtils.setOpacity(textInput, 0)

      textInput.style.width = '1px'
      textInput.style.height = '1px'
      textInput.innerHTML = '&nbsp;'

      var restoreFocus = false

      // Disables built-in cut, copy and paste shortcuts
      this.keyHandler.bindControlKey(88, null)
      this.keyHandler.bindControlKey(67, null)
      this.keyHandler.bindControlKey(86, null)
      this.keyHandler.bindControlKey(83, null)

      graph.container.addEventListener(
        'paste',
        mxUtils.bind(this, function(evt) {
          var graph = this.editor.graph

          if (!mxEvent.isConsumed(evt)) {
            try {
              var data = evt.clipboardData || evt.originalEvent.clipboardData
              var containsText = false

              // Workaround for asynchronous paste event processing in textInput
              // is to ignore this event if it contains text/html/rtf (see below).
              // NOTE: Image is not pasted into textInput so can't listen there.
              for (var i = 0; i < data.types.length; i++) {
                if (data.types[i].substring(0, 5) === 'text/') {
                  containsText = true
                  break
                }
              }

              if (!containsText) {
                var items = data.items

                for (index in items) {
                  var item = items[index]

                  if (item.kind === 'file') {
                    if (graph.isEditing()) {
                      this.importFiles(
                        [item.getAsFile()],
                        0,
                        0,
                        this.maxImageSize,
                        function(data, mimeType, x, y, w, h) {
                          // Inserts image into current text box
                          graph.insertImage(data, w, h)
                        },
                        function() {
                          // No post processing
                        },
                        function(file) {
                          // Handles only images
                          return file.type.substring(0, 6) == 'image/'
                        },
                        function(queue) {
                          // Invokes elements of queue in order
                          for (var i = 0; i < queue.length; i++) {
                            queue[i]()
                          }
                        }
                      )
                    } else {
                      var pt = this.editor.graph.getInsertPoint()

                      this.snapshoot()
                      this.importFiles(
                        [item.getAsFile()],
                        pt.x,
                        pt.y,
                        this.maxImageSize
                      )

                      mxEvent.consume(evt)
                    }

                    break
                  }
                }
              }
            } catch (e) {
              console.error(e)
              // ignore
            }
          }
        }),
        false
      )

      mxEvent.addListener(
        graph.container,
        'keydown',
        mxUtils.bind(this, function(evt) {
          var source = mxEvent.getSource(evt)

          if (
            graph.container != null &&
            graph.isEnabled() &&
            !graph.isMouseDown &&
            !graph.isEditing() &&
            this.dialog == null &&
            source.nodeName != 'INPUT' &&
            source.nodeName != 'TEXTAREA'
          ) {
            if (
              evt.keyCode == 224 /* FF */ ||
              (!mxClient.IS_MAC && evt.keyCode == 17) /* Control */ ||
              (mxClient.IS_MAC && evt.keyCode == 91) /* Meta */
            ) {
              if (!restoreFocus) {
                // Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
                textInput.style.left = graph.container.scrollLeft + 10 + 'px'
                textInput.style.top = graph.container.scrollTop + 10 + 'px'

                graph.container.appendChild(textInput)
                restoreFocus = true

                // Workaround for selected document content in quirks mode
                if (mxClient.IS_QUIRKS) {
                  window.setTimeout(function() {
                    textInput.focus()
                    document.execCommand('selectAll', false, null)
                  }, 0)
                } else {
                  textInput.focus()
                  document.execCommand('selectAll', false, null)
                }
              }
            }
          }
        })
      )

      mxEvent.addListener(
        graph.container,
        'keyup',
        mxUtils.bind(this, function(evt) {
          // Workaround for asynchronous event read invalid in IE quirks mode
          var keyCode = evt.keyCode

          // Asynchronous workaround for scroll to origin after paste if the
          // Ctrl-key is not pressed for long enough in FF on Windows
          window.setTimeout(
            mxUtils.bind(this, function() {
              if (
                restoreFocus &&
                (keyCode == 224 /* FF */ ||
                keyCode == 17 /* Control */ ||
                  keyCode == 91) /* Meta */
              ) {
                restoreFocus = false

                if (
                  !graph.isEditing() &&
                  this.dialog == null &&
                  graph.container != null
                ) {
                  graph.container.focus()
                }

                textInput.parentNode.removeChild(textInput)
              }
            }),
            0
          )
        })
      )

      // Clears input and restores focus and selection
      function clearInput() {
        window.setTimeout(function() {
          textInput.innerHTML = '&nbsp;'
          textInput.focus()
          document.execCommand('selectAll', false, null)
        }, 0)
      }

      mxEvent.addListener(
        textInput,
        'copy',
        mxUtils.bind(this, function(evt) {
          if (graph.isEnabled()) {
            mxClipboard.copy(graph)
            this.copyCells(textInput)
            clearInput()
          }
        })
      )

      mxEvent.addListener(
        textInput,
        'cut',
        mxUtils.bind(this, function(evt) {
          if (graph.isEnabled()) {
            this.copyCells(textInput, true)
            clearInput()
          }
        })
      )

      mxEvent.addListener(
        textInput,
        'paste',
        mxUtils.bind(this, function(evt) {
          if (
            graph.isEnabled() &&
            !graph.isCellLocked(graph.getDefaultParent())
          ) {
            textInput.innerHTML = '&nbsp;'
            textInput.focus()

            window.setTimeout(
              mxUtils.bind(this, function() {
                this.pasteCells(evt, textInput)
                textInput.innerHTML = '&nbsp;'
              }),
              0
            )
          }
        }),
        true
      )

      var isSelectionAllowed = this.isSelectionAllowed
      this.isSelectionAllowed = function(evt) {
        if (mxEvent.getSource(evt) == textInput) {
          return true
        }

        return isSelectionAllowed.apply(this, arguments)
      }
    }

    var y =
      Math.max(
        document.body.clientHeight || 0,
        document.documentElement.clientHeight || 0
      ) / 2
    var x = document.body.clientWidth / 2 - 2

    this.spinner = this.createSpinner(x, y, 24)
  }

  /**
   * Creates the format panel and adds overrides.
   */
  copyCells(elt, removeCells) {
    var graph = this.editor.graph

    if (!graph.isSelectionEmpty()) {
      var cells = mxUtils.sortCells(
        graph.model.getTopmostCells(graph.getSelectionCells())
      )

      // LATER: Add span with XML in data attribute
      // var span = document.createElement('span');
      // span.setAttribute('data-jgraph-type', 'application/vnd.jgraph.xml');
      // span.setAttribute('data-jgraph-content', mxUtils.getXml(graph.encodeCells(clones)));

      // Fixes cross-platform clipboard UTF8 issues by encoding as URI
      var xml = mxUtils.getXml(this.editor.graph.encodeCells(cells))
      mxUtils.setTextContent(elt, encodeURIComponent(xml))

      if (removeCells) {
        graph.removeCells(cells, false)
        graph.lastPasteXml = null
      } else {
        graph.lastPasteXml = xml
        graph.pasteCounter = 0
      }

      elt.focus()
      document.execCommand('selectAll', false, null)
    } else {
      // Disables copy on focused element
      elt.innerHTML = ''
    }
  }

  /**
   * Creates the format panel and adds overrides.
   */
  pasteCells(evt, elt) {
    if (!mxEvent.isConsumed(evt)) {
      var spans = elt.getElementsByTagName('span')

      if (
        spans != null &&
        spans.length > 0 &&
        spans[0].getAttribute('data-lucid-type') ===
          'application/vnd.lucid.chart.objects'
      ) {
        var content = spans[0].getAttribute('data-lucid-content')

        if (content != null && content.length > 0) {
          this.importLucidChart(content, 0, 0)
          mxEvent.consume(evt)
        }
      } else {
        var graph = this.editor.graph
        var xml = mxUtils.trim(
          mxClient.IS_QUIRKS || document.documentMode === 8
            ? mxUtils.getTextContent(elt)
            : elt.textContent
        )
        var compat = false

        // Workaround for junk after XML in VM
        try {
          var idx = xml.lastIndexOf('%3E')

          if (idx >= 0 && idx < xml.length - 3) {
            xml = xml.substring(0, idx + 3)
          }
        } catch (e) {
          // ignore
        }

        // Checks for embedded XML content
        try {
          var spans = elt.getElementsByTagName('span')
          var tmp =
            spans != null && spans.length > 0
              ? mxUtils.trim(decodeURIComponent(spans[0].textContent))
              : decodeURIComponent(xml)

          if (this.isCompatibleString(tmp)) {
            compat = true
            xml = tmp
          }
        } catch (e) {
          // ignore
        }

        if (graph.lastPasteXml === xml) {
          graph.pasteCounter++
        } else {
          graph.lastPasteXml = xml
          graph.pasteCounter = 0
        }

        var dx = graph.pasteCounter * graph.gridSize

        if (xml != null && xml.length > 0) {
          if (compat || this.isCompatibleString(xml)) {
            graph.setSelectionCells(this.importXml(xml, dx, dx))
          } else {
            var pt = graph.getInsertPoint()

            if (graph.isMouseInsertPoint()) {
              dx = 0

              // No offset for insert at mouse position
              if (graph.lastPasteXml === xml && graph.pasteCounter > 0) {
                graph.pasteCounter--
              }
            }

            graph.setSelectionCells(
              this.insertTextAt(xml, pt.x + dx, pt.y + dx, true)
            )
          }

          if (!graph.isSelectionEmpty()) {
            graph.scrollCellToVisible(graph.getSelectionCell())

            if (this.hoverIcons != null) {
              this.hoverIcons.update(
                graph.view.getState(graph.getSelectionCell())
              )
            }

            try {
              mxEvent.consume(evt)
            } catch (e) {
              // ignore event no longer exists in async handler in IE8-
            }
          }
        }
      }
    }
  }

  /**
   * Returns true if the given string contains a compatible graph model.
   */
  isCompatibleString(data) {
    try {
      var doc = mxUtils.parseXml(data)
      var node = this.editor.extractGraphModel(doc.documentElement, true)

      return (
        node != null && node.getElementsByTagName('parsererror').length === 0
      )
    } catch (e) {
      console.log(e)
      // ignore
    }

    return false
  }

  /**
   * Imports the given XML into the existing diagram.
   * TODO: Make this function asynchronous
   */
  insertTextAt(text, dx, dy, html, asImage, crop, resizeImages) {
    crop = crop != null ? crop : true
    resizeImages = resizeImages != null ? resizeImages : true

    // Handles special case for Gliffy data which requires async server-side for parsing
    if (text != null) {
      if (
        Graph.fileSupport &&
        !this.isOffline() &&
        new XMLHttpRequest().upload &&
        this.isRemoteFileFormat(text)
      ) {
        // Fixes possible parsing problems with ASCII 160 (non-breaking space)
        this.parseFile(
          new Blob([text.replace(/\s+/g, ' ')], {
            type: 'application/octet-stream'
          }),
          mxUtils.bind(this, function(xhr) {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 299) {
              this.editor.graph.setSelectionCells(
                this.insertTextAt(xhr.responseText, dx, dy, true)
              )
            }
          })
        )

        // Returns empty cells array as it is aysynchronous
        return []
      }
      // Handles special case of data URI which requires async loading for finding size
      else if (
        text.substring(0, 5) === 'data:' ||
        (!this.isOffline() &&
          (asImage || /\.(gif|jpg|jpeg|tiff|png|svg)$/i.test(text)))
      ) {
        var graph = this.editor.graph

        // Checks for embedded XML in PNG
        if (text.substring(0, 22) == 'data:image/png;base64,') {
          var xml = this.extractGraphModelFromPng(text)
          var result = this.importXml(xml, dx, dy, crop, true)

          if (result.length > 0) {
            return result
          }
        }

        // Tries to extract embedded XML from SVG data URI
        if (text.substring(0, 19) === 'data:image/svg+xml;') {
          try {
            var xml = null

            if (text.substring(0, 26) === 'data:image/svg+xml;base64,') {
              xml = text.substring(text.indexOf(',') + 1)
              xml =
                window.atob && !mxClient.IS_SF
                  ? atob(xml)
                  : Base64.decode(xml, true)
            } else {
              xml = decodeURIComponent(text.substring(text.indexOf(',') + 1))
            }

            var result = this.importXml(xml, dx, dy, crop, true)

            if (result.length > 0) {
              return result
            }
          } catch (e) {
            // Ignore
          }
        }

        this.loadImage(
          text,
          mxUtils.bind(this, function(img) {
            if (text.substring(0, 5) === 'data:') {
              this.resizeImage(
                img,
                text,
                mxUtils.bind(this, function(data2, w2, h2) {
                  graph.setSelectionCell(
                    graph.insertVertex(
                      null,
                      null,
                      '',
                      graph.snap(dx),
                      graph.snap(dy),
                      w2,
                      h2,
                      'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
                        'verticalAlign=top;aspect=fixed;imageAspect=0;image=' +
                        this.convertDataUri(data2) +
                        ';'
                    )
                  )
                }),
                resizeImages,
                this.maxImageSize
              )
            } else {
              var s = Math.min(
                1,
                Math.min(
                  this.maxImageSize / img.width,
                  this.maxImageSize / img.height
                )
              )
              var w = Math.round(img.width * s)
              var h = Math.round(img.height * s)

              graph.setSelectionCell(
                graph.insertVertex(
                  null,
                  null,
                  '',
                  graph.snap(dx),
                  graph.snap(dy),
                  w,
                  h,
                  'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
                    'verticalAlign=top;aspect=fixed;imageAspect=0;image=' +
                    text +
                    ';'
                )
              )
            }
          }),
          mxUtils.bind(this, function() {
            var cell = null

            // Inserts invalid data URIs as text
            graph.getModel().beginUpdate()
            try {
              cell = graph.insertVertex(
                graph.getDefaultParent(),
                null,
                text,
                graph.snap(dx),
                graph.snap(dy),
                1,
                1,
                'text;' + (html ? 'html=1;' : '')
              )
              graph.updateCellSize(cell)
              graph.fireEvent(
                new mxEventObject('textInserted', 'cells', [cell])
              )
            } finally {
              graph.getModel().endUpdate()
            }

            graph.setSelectionCell(cell)
          })
        )

        return []
      } else {
        text = this.editor.graph.zapGremlins(mxUtils.trim(text))

        if (this.isCompatibleString(text)) {
          return this.importXml(text, dx, dy, crop)
        } else if (text.length > 0) {
          if (text.substring(0, 26) === '{"state":"{\\"Properties\\":') {
            this.importLucidChart(text, dx, dy, crop)
          } else {
            var graph = this.editor.graph
            var cell = null

            graph.getModel().beginUpdate()
            try {
              // Fires cellsInserted to apply the current style to the inserted text.
              // This requires the value to be empty when the event is fired.
              cell = graph.insertVertex(
                graph.getDefaultParent(),
                null,
                '',
                graph.snap(dx),
                graph.snap(dy),
                1,
                1,
                'text;' + (html ? 'html=1;' : '')
              )
              graph.fireEvent(
                new mxEventObject('textInserted', 'cells', [cell])
              )

              // Apply value and updates the cell size to fit the text block
              cell.value = text
              graph.updateCellSize(cell)

              // See http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
              var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i

              if (regexp.test(cell.value)) {
                graph.setLinkForCell(cell, cell.value)
              }

              // Adds spacing
              cell.geometry.width += graph.gridSize
              cell.geometry.height += graph.gridSize
            } finally {
              graph.getModel().endUpdate()
            }

            return [cell]
          }
        }
      }
    }

    return []
  }

  /**
   * Imports the given XML into the existing diagram.
   */
  importXml(xml, dx, dy, crop, noErrorHandling) {
    dx = dx != null ? dx : 0
    dy = dy != null ? dy : 0
    var cells = []

    try {
      var graph = this.editor.graph

      if (xml != null && xml.length > 0) {
        var doc = mxUtils.parseXml(xml)

        // Checks for mxfile with multiple pages
        var node = this.editor.extractGraphModel(
          doc.documentElement,
          this.pages != null
        )

        if (node != null && node.nodeName === 'mxfile' && this.pages != null) {
          var diagrams = node.getElementsByTagName('diagram')

          if (diagrams.length === 1) {
            node = mxUtils.parseXml(
              graph.decompress(mxUtils.getTextContent(diagrams[0]))
            ).documentElement
          } else if (diagrams.length > 1) {
            // Adds pages
            graph.model.beginUpdate()
            try {
              for (var i = 0; i < diagrams.length; i++) {
                var page = this.updatePageRoot(new DiagramPage(diagrams[i]))
                var index = this.pages.length

                // Checks for invalid page names
                if (page.getName() == null) {
                  page.setName(mxResources.get('pageWithNumber', [index + 1]))
                }

                graph.model.execute(new ChangePage(this, page, page, index))
              }
            } finally {
              graph.model.endUpdate()
            }
          }
        }

        if (node != null && node.nodeName === 'mxGraphModel') {
          var model = new mxGraphModel()
          var codec = new mxCodec(node.ownerDocument)
          codec.decode(node, model)

          var childCount = model.getChildCount(model.getRoot())
          var targetChildCount = graph.model.getChildCount(
            graph.model.getRoot()
          )

          // Merges into active layer if one layer is pasted
          graph.model.beginUpdate()
          try {
            // Mapping for multiple calls to cloneCells with the same set of cells
            var mapping = new Object()

            for (var i = 0; i < childCount; i++) {
              var parent = model.getChildAt(model.getRoot(), i)

              // Adds cells to existing layer if not locked
              if (
                childCount == 1 &&
                !graph.isCellLocked(graph.getDefaultParent())
              ) {
                var children = model.getChildren(parent)
                cells = cells.concat(
                  graph.importCells(
                    children,
                    dx,
                    dy,
                    graph.getDefaultParent(),
                    null,
                    mapping
                  )
                )
              } else {
                // Delta is non cascading, needs separate move for layers
                parent = graph.importCells(
                  [parent],
                  0,
                  0,
                  graph.model.getRoot(),
                  null,
                  mapping
                )[0]
                var children = graph.model.getChildren(parent)
                graph.moveCells(children, dx, dy)
                cells = cells.concat(children)
              }
            }

            if (crop) {
              if (graph.isGridEnabled()) {
                dx = graph.snap(dx)
                dy = graph.snap(dy)
              }

              var bounds = graph.getBoundingBoxFromGeometry(cells, true)

              if (bounds != null) {
                graph.moveCells(cells, dx - bounds.x, dy - bounds.y)
              }
            }
          } finally {
            graph.model.endUpdate()
          }
        }
      }
    } catch (e) {
      if (!noErrorHandling) {
        this.handleError(e, mxResources.get('invalidOrMissingFile'))
      }

      throw e
    }

    return cells
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  isOfflineApp() {
    return urlParams['offline'] == '1'
  }

  /**
   * Returns true if this offline app is offline.
   */
  isOffline() {
    return (
      this.isOfflineApp() || !navigator.onLine || urlParams['stealth'] == '1'
    )
  }

  /**
   * Returns true for Gliffy or GraphML data or .vsdx filenames.
   */
  isRemoteFileFormat(data, filename) {
    return (
      /(\.*<graphml xmlns=\".*)/.test(data) ||
      /(\"contentType\":\s*\"application\/gliffy\+json\")/.test(data) ||
      (filename != null && /(\.vsdx)($|\?)/i.test(filename)) ||
      (filename != null && /(\.vssx)($|\?)/i.test(filename))
    )
  }

  getCurrentCompressData() {
    var currentGraphElement = this.editor.getGraphXml()

    if (
      currentGraphElement &&
      currentGraphElement.childNodes[0] &&
      currentGraphElement.childNodes[0].childNodes.length <= 2
    ) {
      return null
    }

    var currentGraphXml = mxUtils.getXml(currentGraphElement)
    var currentCompressText = this.editor.graph.compress(
      this.editor.graph.zapGremlins(currentGraphXml)
    )

    var container = document.createElement('div')
    var diagram = document.createElement('diagram')

    diagram.innerText = currentCompressText
    diagram.setAttribute('version', Board.VERSION)

    container.appendChild(diagram)

    return container.innerHTML
  }

  /**
   *
   */
  importFiles(
    files,
    x,
    y,
    maxSize,
    fn,
    resultFn,
    filterFn,
    barrierFn,
    resizeDialog,
    maxBytes,
    resampleThreshold,
    ignoreEmbeddedXml
  ) {
    x = x != null ? x : 0
    y = y != null ? y : 0

    maxSize = maxSize != null ? maxSize : this.maxImageSize
    maxBytes = maxBytes != null ? maxBytes : this.maxImageBytes

    var crop = x != null && y != null
    var resizeImages = true

    // Checks if large images are imported
    var largeImages = false

    if (!mxClient.IS_CHROMEAPP && files != null) {
      var thresh = resampleThreshold || this.resampleThreshold

      for (var i = 0; i < files.length; i++) {
        if (
          files[i].type.substring(0, 6) === 'image/' &&
          files[i].size > thresh
        ) {
          largeImages = true

          break
        }
      }
    }

    var doImportFiles = mxUtils.bind(this, function() {
      var graph = this.editor.graph
      var gs = graph.gridSize

      fn =
        fn != null
          ? fn
          : mxUtils.bind(this, function(
            data,
            mimeType,
            x,
            y,
            w,
            h,
            filename,
            done,
            file
          ) {
            if (data != null && data.substring(0, 10) === '<mxlibrary') {
              this.spinner.stop()
              this.loadLibrary(new LocalLibrary(this, data, filename))

              return null
            } else {
              return this.importFile(
                data,
                mimeType,
                x,
                y,
                w,
                h,
                filename,
                done,
                file,
                crop,
                ignoreEmbeddedXml
              )
            }
          })

      resultFn =
        resultFn != null
          ? resultFn
          : mxUtils.bind(this, function(cells) {
            graph.setSelectionCells(cells)
          })

      if (this.spinner.spin(document.body, mxResources.get('loading'))) {
        var count = files.length
        var remain = count
        var queue = []

        // Barrier waits for all files to be loaded asynchronously
        var barrier = mxUtils.bind(this, function(index, fnc) {
          queue[index] = fnc

          if (--remain === 0) {
            this.spinner.stop()

            if (barrierFn != null) {
              barrierFn(queue)
            } else {
              var cells = []

              graph.getModel().beginUpdate()
              try {
                for (var j = 0; j < queue.length; j++) {
                  var tmp = queue[j]()

                  if (tmp != null) {
                    cells = cells.concat(tmp)
                  }
                }
              } finally {
                graph.getModel().endUpdate()
              }
            }

            resultFn(cells)
          }
        })

        for (var i = 0; i < count; i++) {
          mxUtils.bind(this, function(index) {
            var file = files[index]
            var reader = new FileReader()

            reader.onload = mxUtils.bind(this, function(e) {
              if (filterFn == null || filterFn(file)) {
                if (file.type.substring(0, 6) === 'image/') {
                  if (file.type.substring(0, 9) === 'image/svg') {
                    // Checks if SVG contains content attribute
                    var data = e.target.result
                    var comma = data.indexOf(',')
                    var svgText = atob(data.substring(comma + 1))
                    var root = mxUtils.parseXml(svgText)
                    var svgs = root.getElementsByTagName('svg')

                    if (svgs.length > 0) {
                      var svgRoot = svgs[0]
                      var cont = ignoreEmbeddedXml
                        ? null
                        : svgRoot.getAttribute('content')

                      if (
                        cont != null &&
                        cont.charAt(0) != '<' &&
                        cont.charAt(0) != '%'
                      ) {
                        cont = unescape(
                          window.atob ? atob(cont) : Base64.decode(cont, true)
                        )
                      }

                      if (cont != null && cont.charAt(0) === '%') {
                        cont = decodeURIComponent(cont)
                      }

                      if (
                        cont != null &&
                        (cont.substring(0, 8) === '<mxfile ' ||
                          cont.substring(0, 14) === '<mxGraphModel ')
                      ) {
                        barrier(
                          index,
                          mxUtils.bind(this, function() {
                            return fn(
                              cont,
                              'text/xml',
                              x + index * gs,
                              y + index * gs,
                              0,
                              0,
                              file.name
                            )
                          })
                        )
                      } else {
                        // SVG needs special handling to add viewbox if missing and
                        // find initial size from SVG attributes (only for IE11)
                        barrier(
                          index,
                          mxUtils.bind(this, function() {
                            try {
                              var prefix = data.substring(0, comma + 1)

                              // Parses SVG and find width and height
                              if (root != null) {
                                var svgs = root.getElementsByTagName('svg')

                                if (svgs.length > 0) {
                                  var svgRoot = svgs[0]
                                  var w = parseFloat(
                                    svgRoot.getAttribute('width')
                                  )
                                  var h = parseFloat(
                                    svgRoot.getAttribute('height')
                                  )

                                  // Check if viewBox attribute already exists
                                  var vb = svgRoot.getAttribute('viewBox')

                                  if (vb == null || vb.length === 0) {
                                    svgRoot.setAttribute(
                                      'viewBox',
                                      '0 0 ' + w + ' ' + h
                                    )
                                  }
                                  // Uses width and height from viewbox for
                                  // missing width and height attributes
                                  else if (isNaN(w) || isNaN(h)) {
                                    var tokens = vb.split(' ')

                                    if (tokens.length > 3) {
                                      w = parseFloat(tokens[2])
                                      h = parseFloat(tokens[3])
                                    }
                                  }

                                  data = this.createSvgDataUri(
                                    mxUtils.getXml(svgs[0])
                                  )

                                  var s = Math.min(
                                    1,
                                    Math.min(maxSize / Math.max(1, w)),
                                    maxSize / Math.max(1, h)
                                  )

                                  return fn(
                                    data,
                                    file.type,
                                    x + index * gs,
                                    y + index * gs,
                                    Math.max(1, Math.round(w * s)),
                                    Math.max(1, Math.round(h * s)),
                                    file.name
                                  )
                                }
                              }
                            } catch (e) {
                              // ignores any SVG parsing errors
                            }

                            return null
                          })
                        )
                      }
                    }
                  } else {
                    // Checks if PNG+XML is available to bypass code below
                    var containsModel = false

                    if (file.type === 'image/png') {
                      var xml = ignoreEmbeddedXml
                        ? null
                        : this.extractGraphModelFromPng(e.target.result)

                      if (xml != null && xml.length > 0) {
                        var img = new Image()
                        img.src = e.target.result

                        barrier(
                          index,
                          mxUtils.bind(this, function() {
                            return fn(
                              xml,
                              'text/xml',
                              x + index * gs,
                              y + index * gs,
                              img.width,
                              img.height,
                              file.name
                            )
                          })
                        )

                        containsModel = true
                      }
                    }

                    // Additional asynchronous step for finding image size
                    if (!containsModel) {
                      // Cannot load local files in Chrome App
                      if (mxClient.IS_CHROMEAPP) {
                        this.spinner.stop()
                        this.showError(
                          mxResources.get('error'),
                          mxResources.get('dragAndDropNotSupported'),
                          mxResources.get('cancel'),
                          mxUtils.bind(this, function() {
                            // Hides the dialog
                          }),
                          null,
                          mxResources.get('ok'),
                          mxUtils.bind(this, function() {
                            // Redirects to import function
                            this.actions.get('import').funct()
                          })
                        )
                      } else {
                        this.loadImage(
                          e.target.result,
                          mxUtils.bind(this, function(img) {
                            this.resizeImage(
                              img,
                              e.target.result,
                              mxUtils.bind(this, function(data2, w2, h2) {
                                barrier(
                                  index,
                                  mxUtils.bind(this, function() {
                                    // Refuses to insert images above a certain size as they kill the app
                                    if (
                                      data2 != null &&
                                      data2.length < maxBytes
                                    ) {
                                      var s =
                                        !resizeImages ||
                                        !this.isResampleImage(
                                          e.target.result,
                                          resampleThreshold
                                        )
                                          ? 1
                                          : Math.min(
                                            1,
                                            Math.min(
                                              maxSize / w2,
                                              maxSize / h2
                                            )
                                          )

                                      return fn(
                                        data2,
                                        file.type,
                                        x + index * gs,
                                        y + index * gs,
                                        Math.round(w2 * s),
                                        Math.round(h2 * s),
                                        file.name
                                      )
                                    } else {
                                      this.handleError({
                                        message: mxResources.get('imageTooBig')
                                      })

                                      return null
                                    }
                                  })
                                )
                              }),
                              resizeImages,
                              maxSize,
                              resampleThreshold
                            )
                          })
                        )
                      }
                    }
                  }
                } else {
                  fn(
                    e.target.result,
                    file.type,
                    x + index * gs,
                    y + index * gs,
                    240,
                    160,
                    file.name,
                    function(cells) {
                      barrier(index, function() {
                        return cells
                      })
                    }
                  )
                }
              }
            })

            // Handles special case of binary file where the reader should not be used
            if (
              /(\.vsdx)($|\?)/i.test(file.name) ||
              /(\.vssx)($|\?)/i.test(file.name)
            ) {
              fn(
                null,
                file.type,
                x + index * gs,
                y + index * gs,
                240,
                160,
                file.name,
                function(cells) {
                  barrier(index, function() {
                    return cells
                  })
                },
                file
              )
            } else if (file.type.substring(0, 5) == 'image') {
              reader.readAsDataURL(file)
            } else {
              reader.readAsText(file)
            }
          })(i)
        }
      }
    })

    if (largeImages) {
      this.confirmImageResize(function(doResize) {
        resizeImages = doResize
        doImportFiles()
      }, resizeDialog)
    } else {
      doImportFiles()
    }
  }

  /**
   * Parses the file using XHR2 via the server. File can be a blob or file object.
   * Filename is an optional parameter for blobs (that do not have a filename).
   */
  confirmImageResize(fn, force) {
    force = force != null ? force : false

    var resume =
      this.spinner != null && this.spinner.pause != null
        ? this.spinner.pause()
        : function() {}
    var resizeImages =
      isLocalStorage || mxClient.IS_CHROMEAPP
        ? mxSettings.getResizeImages()
        : null

    var wrapper = function(remember, resize) {
      if (remember || force) {
        mxSettings.setResizeImages(remember ? resize : null)
        mxSettings.save()
      }

      resume()
      fn(resize)
    }

    if (resizeImages != null && !force) {
      wrapper(false, resizeImages)
    } else {
      this.showDialog(
        new ConfirmDialog(
          this,
          mxResources.get('resizeLargeImages'),
          function(remember) {
            wrapper(remember, true)
          },
          function(remember) {
            wrapper(remember, false)
          },
          mxResources.get('resize'),
          mxResources.get('actualSize'),
          '<img style="margin-top:8px;" src="' + Editor.loResImage + '"/>',
          '<img style="margin-top:8px;" src="' + Editor.hiResImage + '"/>',
          isLocalStorage || mxClient.IS_CHROMEAPP
        ).container,
        340,
        isLocalStorage || mxClient.IS_CHROMEAPP ? 220 : 200,
        true,
        true
      )
    }
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  createSpinner(x, y, size) {
    size = size != null ? size : 24

    var spinner = new Spinner({
      lines: 12, // The number of lines to draw
      length: size, // The length of each line
      width: Math.round(size / 3), // The line thickness
      radius: Math.round(size / 2), // The radius of the inner circle
      rotate: 0, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1.5, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      zIndex: 2e9 // The z-index (defaults to 2000000000)
    })

    // Extends spin method to include an optional label
    var oldSpin = spinner.spin

    spinner.spin = function(container, label) {
      var result = false

      if (!this.active) {
        oldSpin.call(this, container)
        this.active = true

        if (label != null) {
          var status = document.createElement('div')

          status.style.position = 'absolute'
          status.style.whiteSpace = 'nowrap'
          status.style.background = '#4B4243'
          status.style.color = 'white'
          status.style.fontFamily = 'Helvetica, Arial'
          status.style.fontSize = '9pt'
          status.style.padding = '6px'
          status.style.paddingLeft = '10px'
          status.style.paddingRight = '10px'
          status.style.zIndex = 2e9
          status.style.left = Math.max(0, x) + 'px'
          status.style.top = Math.max(0, y + 70) + 'px'

          mxUtils.setPrefixedStyle(status.style, 'borderRadius', '6px')
          mxUtils.setPrefixedStyle(
            status.style,
            'boxShadow',
            '2px 2px 3px 0px #ddd'
          )
          mxUtils.setPrefixedStyle(
            status.style,
            'transform',
            'translate(-50%,-50%)'
          )

          status.innerHTML = label + '...'
          container.appendChild(status)
          spinner.status = status

          // Centers the label in older IE versions
          if (
            mxClient.IS_VML &&
            (document.documentMode == null || document.documentMode <= 8)
          ) {
            status.style.left =
              Math.round(Math.max(0, x - status.offsetWidth / 2)) + 'px'
            status.style.top =
              Math.round(Math.max(0, y + 70 - status.offsetHeight / 2)) + 'px'
          }
        }

        // Pause returns a function to resume the spinner
        this.pause = mxUtils.bind(this, function() {
          var fn = function() {}

          if (this.active) {
            fn = mxUtils.bind(this, function() {
              this.spin(container, label)
            })
          }

          this.stop()

          return fn
        })

        result = true
      }

      return result
    }

    // Extends stop method to remove the optional label
    var oldStop = spinner.stop

    spinner.stop = function() {
      oldStop.call(this)
      this.active = false

      if (spinner.status != null) {
        spinner.status.parentNode.removeChild(spinner.status)
        spinner.status = null
      }
    }

    spinner.pause = function() {
      return function() {}
    }

    return spinner
  }

  /**
   * Extracts the XML from the compressed or non-compressed text chunk.
   */
  extractGraphModelFromPng(data) {
    var result = null

    try {
      var base64 = data.substring(data.indexOf(',') + 1)

      // Workaround for invalid character error in Safari
      var binary =
        window.atob && !mxClient.IS_SF
          ? atob(base64)
          : Base64.decode(base64, true)

      EditorUi.parsePng(
        binary,
        mxUtils.bind(this, function(pos, type, length) {
          var value = binary.substring(pos + 8, pos + 8 + length)

          if (type == 'zTXt') {
            var idx = value.indexOf(String.fromCharCode(0))

            if (value.substring(0, idx) == 'mxGraphModel') {
              // Workaround for Java URL Encoder using + for spaces, which isn't compatible with JS
              var xmlData = this.editor.graph
                .bytesToString(pako.inflateRaw(value.substring(idx + 2)))
                .replace(/\+/g, ' ')

              if (xmlData != null && xmlData.length > 0) {
                result = xmlData
              }
            }
          }
          // Uncompressed section is normally not used
          else if (type == 'tEXt') {
            var vals = value.split(String.fromCharCode(0))

            if (vals.length > 1 && vals[0] == 'mxGraphModel') {
              result = vals[1]
            }
          }

          if (result != null || type == 'IDAT') {
            // Stops processing the file as our text chunks
            // are always placed before the data section
            return true
          }
        })
      )
    } catch (e) {
      // ignores decoding errors
    }

    if (result != null && result.charAt(0) === '%') {
      result = decodeURIComponent(result)
    }

    // Workaround for double encoded content
    if (result != null && result.charAt(0) === '%') {
      result = decodeURIComponent(result)
    }

    return result
  }

  /**
   * Loads the image from the given URI.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  loadImage(uri, onload, onerror) {
    var img = new Image()

    img.onload = function() {
      onload(img)
    }

    if (onerror != null) {
      img.onerror = onerror
    }

    img.src = uri
  }

  /**
   * Resizes the given image if <maxImageBytes> is not null.
   */
  resizeImage(img, data, fn, enabled, maxSize, thresh) {
    maxSize = maxSize != null ? maxSize : this.maxImageSize
    var w = Math.max(1, img.width)
    var h = Math.max(1, img.height)

    if (enabled && this.isResampleImage(data, thresh)) {
      try {
        var factor = Math.max(w / maxSize, h / maxSize)

        if (factor > 1) {
          var w2 = Math.round(w / factor)
          var h2 = Math.round(h / factor)

          var canvas = document.createElement('canvas')
          canvas.width = w2
          canvas.height = h2

          var ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w2, h2)

          var tmp = canvas.toDataURL()

          // Uses new image if smaller
          if (tmp.length < data.length) {
            // Checks if the image is empty by comparing
            // with an empty image of the same size
            var canvas2 = document.createElement('canvas')
            canvas2.width = w2
            canvas2.height = h2
            var tmp2 = canvas2.toDataURL()

            if (tmp !== tmp2) {
              data = tmp
              w = w2
              h = h2
            }
          }
        }
      } catch (e) {
        // ignores image scaling errors
      }
    }

    fn(data, w, h)
  }

  /**
   *
   */
  isResampleImage(data, thresh) {
    thresh = thresh != null ? thresh : this.resampleThreshold

    return data.length > thresh
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  handleError(resp, title, fn) {
    var resume =
      this.spinner != null && this.spinner.pause != null
        ? this.spinner.pause()
        : function() {}
    var e = resp != null && resp.error != null ? resp.error : resp

    if (e != null || title != null) {
      var msg = mxUtils.htmlEntities(mxResources.get('unknownError'))
      var btn = mxResources.get('ok')
      var retry = null
      title = title != null ? title : mxResources.get('error')

      if (e != null) {
        if (e.retry != null) {
          btn = mxResources.get('cancel')
          retry = function() {
            resume()
            e.retry()
          }
        }

        if (
          typeof gapi !== 'undefined' &&
          typeof gapi.drive !== 'undefined' &&
          typeof gapi.drive.realtime !== 'undefined' &&
          e.type === gapi.drive.realtime.ErrorType.FORBIDDEN
        ) {
          msg = mxUtils.htmlEntities(mxResources.get('forbidden'))
        } else if (
          e.code === 404 ||
          e.status === 404 ||
          (typeof gapi !== 'undefined' &&
            typeof gapi.drive !== 'undefined' &&
            typeof gapi.drive.realtime !== 'undefined' &&
            e.type === gapi.drive.realtime.ErrorType.NOT_FOUND)
        ) {
          msg = mxUtils.htmlEntities(mxResources.get('fileNotFoundOrDenied'))
          var id = window.location.hash

          if (id != null && id.substring(0, 2) === '#G') {
            id = id.substring(2)
            msg +=
              ' <a href="https://drive.google.com/open?id=' +
              id +
              '" target="_blank">' +
              mxUtils.htmlEntities(mxResources.get('tryOpeningViaThisPage')) +
              '</a>'
          }
        } else if (e.code === Board.ERROR_TIMEOUT) {
          msg = mxUtils.htmlEntities(mxResources.get('timeout'))
        } else if (e.code === Board.ERROR_BUSY) {
          msg = mxUtils.htmlEntities(mxResources.get('busy'))
        } else if (e.message != null) {
          msg = mxUtils.htmlEntities(e.message)
        } else if (e.response != null && e.response.error != null) {
          msg = mxUtils.htmlEntities(e.response.error)
        }
      }

      this.showError(title, msg, btn, fn, retry)
    } else if (fn != null) {
      fn()
    }
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  showError(title, msg, btn, fn, retry, btn2, fn2) {
    var dlg = new ErrorDialog(this, title, msg, btn, fn, retry, btn2, fn2)
    this.showDialog(dlg.container, 340, 150, true, false)
    dlg.init()
  }

  /**
   * Imports the given XML into the existing diagram.
   */
  importFile(
    data,
    mimeType,
    dx,
    dy,
    w,
    h,
    filename,
    done,
    file,
    crop,
    ignoreEmbeddedXml
  ) {
    crop = crop != null ? crop : true

    var async = false
    var cells = null

    if (mimeType.substring(0, 5) === 'image') {
      var containsModel = false

      if (mimeType.substring(0, 9) === 'image/png') {
        var xml = ignoreEmbeddedXml ? null : this.extractGraphModelFromPng(data)

        if (xml != null && xml.length > 0) {
          cells = this.importXml(xml, dx, dy, crop)
          containsModel = true
        }
      }

      if (!containsModel) {
        var graph = this.editor.graph

        // Strips encoding bit (eg. ;base64,) for cell style
        var semi = data.indexOf(';')

        if (semi > 0) {
          data =
            data.substring(0, semi) +
            data.substring(data.indexOf(',', semi + 1))
        }

        if (crop && graph.isGridEnabled()) {
          dx = graph.snap(dx)
          dy = graph.snap(dy)
        }

        cells = [
          graph.insertVertex(
            null,
            null,
            '',
            dx,
            dy,
            w,
            h,
            'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;' +
              'verticalAlign=top;aspect=fixed;imageAspect=0;image=' +
              data +
              ';'
          )
        ]
      }
    } else if (
      !this.isOffline() &&
      new XMLHttpRequest().upload &&
      this.isRemoteFileFormat(data, filename)
    ) {
      //  LATER: done and async are a hack before making this asynchronous
      async = true

      // Returns empty cells array as it is aysynchronous
      this.parseFile(
        file != null
          ? file
          : new Blob([data], { type: 'application/octet-stream' }),
        mxUtils.bind(this, function(xhr) {
          if (xhr.readyState === 4) {
            var importedCells = null

            if (xhr.status >= 200 && xhr.status <= 299) {
              var xml = xhr.responseText

              if (xml != null && xml.substring(0, 10) === '<mxlibrary') {
                if (
                  filename != null &&
                  filename.toLowerCase().substring(filename.length - 5) ===
                    '.vssx'
                ) {
                  filename = filename.substring(0, filename.length - 5) + '.xml'
                }

                this.loadLibrary(new LocalLibrary(this, xml, filename))
              } else {
                importedCells = this.importXml(xml, dx, dy, crop)
              }
            }

            if (done != null) {
              done(importedCells)
            }
          }
        }),
        filename
      )
    } else if (!/(\.vsd)($|\?)/i.test(filename)) {
      cells = this.insertTextAt(
        this.validateFileData(data),
        dx,
        dy,
        true,
        null,
        crop
      )
    }

    if (!async && done != null) {
      done(cells)
    }

    return cells
  }

  snapshoot() {
    var snd = new Audio(Board.CAMERA_SOUND)

    snd.play()
  }
}

// var updatePasteActionStates = EditorUi.prototype.updatePasteActionStates;
// EditorUi.prototype.updatePasteActionStates = function(){
//     updatePasteActionStates.call(this, arguments);

//     var paste = this.actions.get('paste');
//     paste.setEnabled(true);
// }
