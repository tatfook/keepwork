import Board from './Board'
import Base64 from 'js-base64'

import EditorUi from './drawio/js/EditorUi'
import Graph from './Graph'

import MxClient from './mxGraph/MxClient'
import MxUtils from './mxGraph/util/MxUtils'
import MxEvent from './mxGraph/util/MxEvent'
import MxResources from './mxGraph/util/MxResources'
import MxGraphModel from './mxGraph/model/MxGraphModel'
import MxEventObject from './mxGraph/util/MxEventObject'
import MxClipboard from './mxGraph/util/MxClipboard'
import MxCodec from './mxGraph/io/MxCodec'
import { MxSettings } from './Settings'
import { ConfirmDialog, ErrorDialog } from './Dialog'
import Editor from './Editor'
import pako from 'pako'

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

    let graph = this.editor.graph

    if (!this.editor.chromeless) {
      let textInput = document.createElement('div')

      textInput.style.position = 'absolute'
      textInput.style.whiteSpace = 'nowrap'
      textInput.style.overflow = 'hidden'
      textInput.style.display = 'block'
      textInput.contentEditable = true

      MxUtils.setOpacity(textInput, 0)

      textInput.style.width = '1px'
      textInput.style.height = '1px'
      textInput.innerHTML = '&nbsp;'

      let restoreFocus = false

      // Disables built-in cut, copy and paste shortcuts
      this.keyHandler.bindControlKey(88, null)
      this.keyHandler.bindControlKey(67, null)
      this.keyHandler.bindControlKey(86, null)
      this.keyHandler.bindControlKey(83, null)

      graph.container.addEventListener(
        'paste',
        MxUtils.bind(this, function(evt) {
          let graph = this.editor.graph

          if (!MxEvent.isConsumed(evt)) {
            try {
              let data = evt.clipboardData || evt.originalEvent.clipboardData
              let containsText = false

              // Workaround for asynchronous paste event processing in textInput
              // is to ignore this event if it contains text/html/rtf (see below).
              // NOTE: Image is not pasted into textInput so can't listen there.
              for (let i = 0; i < data.types.length; i++) {
                if (data.types[i].substring(0, 5) === 'text/') {
                  containsText = true
                  break
                }
              }

              if (!containsText) {
                let items = data.items

                for (let index in items) {
                  let item = items[index]

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
                          return file.type.substring(0, 6) === 'image/'
                        },
                        function(queue) {
                          // Invokes elements of queue in order
                          for (let i = 0; i < queue.length; i++) {
                            queue[i]()
                          }
                        }
                      )
                    } else {
                      let pt = this.editor.graph.getInsertPoint()

                      this.snapshoot()
                      this.importFiles(
                        [item.getAsFile()],
                        pt.x,
                        pt.y,
                        this.maxImageSize
                      )

                      MxEvent.consume(evt)
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

      MxEvent.addListener(
        graph.container,
        'keydown',
        MxUtils.bind(this, function(evt) {
          let source = MxEvent.getSource(evt)

          if (
            graph.container !== null &&
            graph.isEnabled() &&
            !graph.isMouseDown &&
            !graph.isEditing() &&
            this.dialog === null &&
            source.nodeName !== 'INPUT' &&
            source.nodeName !== 'TEXTAREA'
          ) {
            if (
              evt.keyCode === 224 /* FF */ ||
              (!MxClient.IS_MAC && evt.keyCode === 17) /* Control */ ||
              (MxClient.IS_MAC && evt.keyCode === 91) /* Meta */
            ) {
              if (!restoreFocus) {
                // Avoid autoscroll but allow handling of all pass-through ctrl shortcuts
                textInput.style.left = graph.container.scrollLeft + 10 + 'px'
                textInput.style.top = graph.container.scrollTop + 10 + 'px'

                graph.container.appendChild(textInput)
                restoreFocus = true

                // Workaround for selected document content in quirks mode
                if (MxClient.IS_QUIRKS) {
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

      MxEvent.addListener(
        graph.container,
        'keyup',
        MxUtils.bind(this, function(evt) {
          // Workaround for asynchronous event read invalid in IE quirks mode
          let keyCode = evt.keyCode

          // Asynchronous workaround for scroll to origin after paste if the
          // Ctrl-key is not pressed for long enough in FF on Windows
          window.setTimeout(
            MxUtils.bind(this, function() {
              if (
                restoreFocus &&
                (keyCode === 224 /* FF */ ||
                keyCode === 17 /* Control */ ||
                  keyCode === 91) /* Meta */
              ) {
                restoreFocus = false

                if (
                  !graph.isEditing() &&
                  this.dialog === null &&
                  graph.container !== null
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
      const clearInput = function() {
        window.setTimeout(function() {
          textInput.innerHTML = '&nbsp;'
          textInput.focus()
          document.execCommand('selectAll', false, null)
        }, 0)
      }

      MxEvent.addListener(
        textInput,
        'copy',
        MxUtils.bind(this, function(evt) {
          if (graph.isEnabled()) {
            MxClipboard.copy(graph)
            this.copyCells(textInput)
            clearInput()
          }
        })
      )

      MxEvent.addListener(
        textInput,
        'cut',
        MxUtils.bind(this, function(evt) {
          if (graph.isEnabled()) {
            this.copyCells(textInput, true)
            clearInput()
          }
        })
      )

      MxEvent.addListener(
        textInput,
        'paste',
        MxUtils.bind(this, function(evt) {
          if (
            graph.isEnabled() &&
            !graph.isCellLocked(graph.getDefaultParent())
          ) {
            textInput.innerHTML = '&nbsp;'
            textInput.focus()

            window.setTimeout(
              MxUtils.bind(this, function() {
                this.pasteCells(evt, textInput)
                textInput.innerHTML = '&nbsp;'
              }),
              0
            )
          }
        }),
        true
      )

      let isSelectionAllowed = this.isSelectionAllowed
      this.isSelectionAllowed = function(evt) {
        if (MxEvent.getSource(evt) === textInput) {
          return true
        }

        return isSelectionAllowed.apply(this, arguments)
      }
    }

    let y =
      Math.max(
        document.body.clientHeight || 0,
        document.documentElement.clientHeight || 0
      ) / 2
    let x = document.body.clientWidth / 2 - 2

    this.spinner = this.createSpinner(x, y, 24)
  }

  /**
   * Creates the format panel and adds overrides.
   */
  copyCells(elt, removeCells) {
    let graph = this.editor.graph

    if (!graph.isSelectionEmpty()) {
      let cells = MxUtils.sortCells(
        graph.model.getTopmostCells(graph.getSelectionCells())
      )

      // LATER: Add span with XML in data attribute
      // let span = document.createElement('span');
      // span.setAttribute('data-jgraph-type', 'application/vnd.jgraph.xml');
      // span.setAttribute('data-jgraph-content', MxUtils.getXml(graph.encodeCells(clones)));

      // Fixes cross-platform clipboard UTF8 issues by encoding as URI
      let xml = MxUtils.getXml(this.editor.graph.encodeCells(cells))
      MxUtils.setTextContent(elt, encodeURIComponent(xml))

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
    if (!MxEvent.isConsumed(evt)) {
      let spans = elt.getElementsByTagName('span')

      if (
        spans !== null &&
        spans.length > 0 &&
        spans[0].getAttribute('data-lucid-type') ===
          'application/vnd.lucid.chart.objects'
      ) {
        let content = spans[0].getAttribute('data-lucid-content')

        if (content !== null && content.length > 0) {
          this.importLucidChart(content, 0, 0)
          MxEvent.consume(evt)
        }
      } else {
        let graph = this.editor.graph
        let xml = MxUtils.trim(
          MxClient.IS_QUIRKS || document.documentMode === 8
            ? MxUtils.getTextContent(elt)
            : elt.textContent
        )
        let compat = false

        // Workaround for junk after XML in VM
        try {
          let idx = xml.lastIndexOf('%3E')

          if (idx >= 0 && idx < xml.length - 3) {
            xml = xml.substring(0, idx + 3)
          }
        } catch (e) {
          // ignore
        }

        // Checks for embedded XML content
        try {
          let spans = elt.getElementsByTagName('span')
          let tmp =
            spans !== null && spans.length > 0
              ? MxUtils.trim(decodeURIComponent(spans[0].textContent))
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

        let dx = graph.pasteCounter * graph.gridSize

        if (xml !== null && xml.length > 0) {
          if (compat || this.isCompatibleString(xml)) {
            graph.setSelectionCells(this.importXml(xml, dx, dx))
          } else {
            let pt = graph.getInsertPoint()

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

            if (this.hoverIcons !== null) {
              this.hoverIcons.update(
                graph.view.getState(graph.getSelectionCell())
              )
            }

            try {
              MxEvent.consume(evt)
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
      let doc = MxUtils.parseXml(data)
      let node = this.editor.extractGraphModel(doc.documentElement, true)

      return (
        node !== null && node.getElementsByTagName('parsererror').length === 0
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
    crop = crop !== null ? crop : true
    resizeImages = resizeImages !== null ? resizeImages : true

    // Handles special case for Gliffy data which requires async server-side for parsing
    if (text !== null) {
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
          MxUtils.bind(this, function(xhr) {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 299) {
              this.editor.graph.setSelectionCells(
                this.insertTextAt(xhr.responseText, dx, dy, true)
              )
            }
          })
        )

        // Returns empty cells array as it is aysynchronous
        return []
      } else if (
        // Handles special case of data URI which requires async loading for finding size
        text.substring(0, 5) === 'data:' ||
        (!this.isOffline() &&
          (asImage || /\.(gif|jpg|jpeg|tiff|png|svg)$/i.test(text)))
      ) {
        let graph = this.editor.graph

        // Checks for embedded XML in PNG
        if (text.substring(0, 22) === 'data:image/png;base64,') {
          let xml = this.extractGraphModelFromPng(text)
          let result = this.importXml(xml, dx, dy, crop, true)

          if (result.length > 0) {
            return result
          }
        }

        // Tries to extract embedded XML from SVG data URI
        if (text.substring(0, 19) === 'data:image/svg+xml;') {
          try {
            let xml = null

            if (text.substring(0, 26) === 'data:image/svg+xml;base64,') {
              xml = text.substring(text.indexOf(',') + 1)
              xml =
                window.atob && !MxClient.IS_SF
                  ? atob(xml)
                  : Base64.decode(xml, true)
            } else {
              xml = decodeURIComponent(text.substring(text.indexOf(',') + 1))
            }

            let result = this.importXml(xml, dx, dy, crop, true)

            if (result.length > 0) {
              return result
            }
          } catch (e) {
            // Ignore
          }
        }

        this.loadImage(
          text,
          MxUtils.bind(this, function(img) {
            if (text.substring(0, 5) === 'data:') {
              this.resizeImage(
                img,
                text,
                MxUtils.bind(this, function(data2, w2, h2) {
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
              let s = Math.min(
                1,
                Math.min(
                  this.maxImageSize / img.width,
                  this.maxImageSize / img.height
                )
              )
              let w = Math.round(img.width * s)
              let h = Math.round(img.height * s)

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
          MxUtils.bind(this, function() {
            let cell = null

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
                new MxEventObject('textInserted', 'cells', [cell])
              )
            } finally {
              graph.getModel().endUpdate()
            }

            graph.setSelectionCell(cell)
          })
        )

        return []
      } else {
        text = this.editor.graph.zapGremlins(MxUtils.trim(text))

        if (this.isCompatibleString(text)) {
          return this.importXml(text, dx, dy, crop)
        } else if (text.length > 0) {
          if (text.substring(0, 26) === '{"state":"{\\"Properties\\":') {
            this.importLucidChart(text, dx, dy, crop)
          } else {
            let graph = this.editor.graph
            let cell = null

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
                new MxEventObject('textInserted', 'cells', [cell])
              )

              // Apply value and updates the cell size to fit the text block
              cell.value = text
              graph.updateCellSize(cell)

              // See http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
              let regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/i

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
    dx = dx !== null ? dx : 0
    dy = dy !== null ? dy : 0
    let cells = []

    try {
      let graph = this.editor.graph

      if (xml !== null && xml.length > 0) {
        let doc = MxUtils.parseXml(xml)

        // Checks for mxfile with multiple pages
        let node = this.editor.extractGraphModel(
          doc.documentElement,
          this.pages !== null
        )

        if (node !== null && node.nodeName === 'mxfile' && this.pages !== null) {
          let diagrams = node.getElementsByTagName('diagram')

          if (diagrams.length === 1) {
            node = MxUtils.parseXml(
              graph.decompress(MxUtils.getTextContent(diagrams[0]))
            ).documentElement
          } else if (diagrams.length > 1) {
            // Adds pages
            graph.model.beginUpdate()
            try {
              for (let i = 0; i < diagrams.length; i++) {
                let page = this.updatePageRoot(new DiagramPage(diagrams[i]))
                let index = this.pages.length

                // Checks for invalid page names
                if (page.getName() === null) {
                  page.setName(MxResources.get('pageWithNumber', [index + 1]))
                }

                graph.model.execute(new ChangePage(this, page, page, index))
              }
            } finally {
              graph.model.endUpdate()
            }
          }
        }

        if (node !== null && node.nodeName === 'MxGraphModel') {
          let model = new MxGraphModel()
          let codec = new MxCodec(node.ownerDocument)
          codec.decode(node, model)

          let childCount = model.getChildCount(model.getRoot())
          let targetChildCount = graph.model.getChildCount( // eslint-disable-line no-unused-vars
            graph.model.getRoot()
          )

          // Merges into active layer if one layer is pasted
          graph.model.beginUpdate()
          try {
            // Mapping for multiple calls to cloneCells with the same set of cells
            let mapping = new Object()

            for (let i = 0; i < childCount; i++) {
              let parent = model.getChildAt(model.getRoot(), i)

              // Adds cells to existing layer if not locked
              if (
                childCount === 1 &&
                !graph.isCellLocked(graph.getDefaultParent())
              ) {
                let children = model.getChildren(parent)
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
                let children = graph.model.getChildren(parent)
                graph.moveCells(children, dx, dy)
                cells = cells.concat(children)
              }
            }

            if (crop) {
              if (graph.isGridEnabled()) {
                dx = graph.snap(dx)
                dy = graph.snap(dy)
              }

              let bounds = graph.getBoundingBoxFromGeometry(cells, true)

              if (bounds !== null) {
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
        this.handleError(e, MxResources.get('invalidOrMissingFile'))
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
    return window.urlParams['offline'] === '1'
  }

  /**
   * Returns true if this offline app is offline.
   */
  isOffline() {
    return (
      this.isOfflineApp() || !navigator.onLine || window.urlParams['stealth'] === '1'
    )
  }

  /**
   * Returns true for Gliffy or GraphML data or .vsdx filenames.
   */
  isRemoteFileFormat(data, filename) {
    return (
      /(\.*<graphml xmlns=".*)/.test(data) ||
      /("contentType":\s*"application\/gliffy\+json")/.test(data) ||
      (filename !== null && /(\.vsdx)($|\?)/i.test(filename)) ||
      (filename !== null && /(\.vssx)($|\?)/i.test(filename))
    )
  }

  getCurrentCompressData() {
    let currentGraphElement = this.editor.getGraphXml()

    if (
      currentGraphElement &&
      currentGraphElement.childNodes[0] &&
      currentGraphElement.childNodes[0].childNodes.length <= 2
    ) {
      return null
    }

    let currentGraphXml = MxUtils.getXml(currentGraphElement)
    let currentCompressText = this.editor.graph.compress(
      this.editor.graph.zapGremlins(currentGraphXml)
    )

    let container = document.createElement('div')
    let diagram = document.createElement('diagram')

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
    x = x !== null ? x : 0
    y = y !== null ? y : 0

    maxSize = maxSize !== null ? maxSize : this.maxImageSize
    maxBytes = maxBytes !== null ? maxBytes : this.maxImageBytes

    let crop = x !== null && y !== null
    let resizeImages = true

    // Checks if large images are imported
    let largeImages = false

    if (!MxClient.IS_CHROMEAPP && files !== null) {
      let thresh = resampleThreshold || this.resampleThreshold

      for (let i = 0; i < files.length; i++) {
        if (
          files[i].type.substring(0, 6) === 'image/' &&
          files[i].size > thresh
        ) {
          largeImages = true

          break
        }
      }
    }

    let doImportFiles = MxUtils.bind(this, function() {
      let graph = this.editor.graph
      let gs = graph.gridSize

      fn =
        fn !== null
          ? fn
          : MxUtils.bind(this, function(
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
            if (data !== null && data.substring(0, 10) === '<mxlibrary') {
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
        resultFn !== null
          ? resultFn
          : MxUtils.bind(this, function(cells) {
            graph.setSelectionCells(cells)
          })

      if (this.spinner.spin(document.body, MxResources.get('loading'))) {
        let count = files.length
        let remain = count
        let queue = []

        // Barrier waits for all files to be loaded asynchronously
        let barrier = MxUtils.bind(this, function(index, fnc) {
          queue[index] = fnc

          if (--remain === 0) {
            this.spinner.stop()
            let cells = []

            if (barrierFn !== null) {
              barrierFn(queue)
            } else {
              graph.getModel().beginUpdate()
              try {
                for (let j = 0; j < queue.length; j++) {
                  let tmp = queue[j]()

                  if (tmp !== null) {
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

        for (let i = 0; i < count; i++) {
          MxUtils.bind(this, function(index) {
            let file = files[index]
            let reader = new FileReader()

            reader.onload = MxUtils.bind(this, function(e) {
              if (filterFn === null || filterFn(file)) {
                if (file.type.substring(0, 6) === 'image/') {
                  if (file.type.substring(0, 9) === 'image/svg') {
                    // Checks if SVG contains content attribute
                    let data = e.target.result
                    let comma = data.indexOf(',')
                    let svgText = atob(data.substring(comma + 1))
                    let root = MxUtils.parseXml(svgText)
                    let svgs = root.getElementsByTagName('svg')

                    if (svgs.length > 0) {
                      let svgRoot = svgs[0]
                      let cont = ignoreEmbeddedXml
                        ? null
                        : svgRoot.getAttribute('content')

                      if (
                        cont !== null &&
                        cont.charAt(0) !== '<' &&
                        cont.charAt(0) !== '%'
                      ) {
                        cont = unescape(
                          window.atob ? atob(cont) : Base64.decode(cont, true)
                        )
                      }

                      if (cont !== null && cont.charAt(0) === '%') {
                        cont = decodeURIComponent(cont)
                      }

                      if (
                        cont !== null &&
                        (cont.substring(0, 8) === '<mxfile ' ||
                          cont.substring(0, 14) === '<MxGraphModel ')
                      ) {
                        barrier(
                          index,
                          MxUtils.bind(this, function() {
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
                          MxUtils.bind(this, function() {
                            try {
                              let prefix = data.substring(0, comma + 1) // eslint-disable-line no-unused-vars

                              // Parses SVG and find width and height
                              if (root !== null) {
                                let svgs = root.getElementsByTagName('svg')

                                if (svgs.length > 0) {
                                  let svgRoot = svgs[0]
                                  let w = parseFloat(
                                    svgRoot.getAttribute('width')
                                  )
                                  let h = parseFloat(
                                    svgRoot.getAttribute('height')
                                  )

                                  // Check if viewBox attribute already exists
                                  let vb = svgRoot.getAttribute('viewBox')

                                  if (vb === null || vb.length === 0) {
                                    svgRoot.setAttribute(
                                      'viewBox',
                                      '0 0 ' + w + ' ' + h
                                    )
                                  } else if (isNaN(w) || isNaN(h)) {
                                  // Uses width and height from viewbox for
                                  // missing width and height attributes
                                    let tokens = vb.split(' ')

                                    if (tokens.length > 3) {
                                      w = parseFloat(tokens[2])
                                      h = parseFloat(tokens[3])
                                    }
                                  }

                                  data = this.createSvgDataUri(
                                    MxUtils.getXml(svgs[0])
                                  )

                                  let s = Math.min(
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
                    let containsModel = false

                    if (file.type === 'image/png') {
                      let xml = ignoreEmbeddedXml
                        ? null
                        : this.extractGraphModelFromPng(e.target.result)

                      if (xml !== null && xml.length > 0) {
                        let img = new Image()
                        img.src = e.target.result

                        barrier(
                          index,
                          MxUtils.bind(this, function() {
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
                      if (MxClient.IS_CHROMEAPP) {
                        this.spinner.stop()
                        this.showError(
                          MxResources.get('error'),
                          MxResources.get('dragAndDropNotSupported'),
                          MxResources.get('cancel'),
                          MxUtils.bind(this, function() {
                            // Hides the dialog
                          }),
                          null,
                          MxResources.get('ok'),
                          MxUtils.bind(this, function() {
                            // Redirects to import function
                            this.actions.get('import').funct()
                          })
                        )
                      } else {
                        this.loadImage(
                          e.target.result,
                          MxUtils.bind(this, function(img) {
                            this.resizeImage(
                              img,
                              e.target.result,
                              MxUtils.bind(this, function(data2, w2, h2) {
                                barrier(
                                  index,
                                  MxUtils.bind(this, function() {
                                    // Refuses to insert images above a certain size as they kill the app
                                    if (
                                      data2 !== null &&
                                      data2.length < maxBytes
                                    ) {
                                      let s =
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
                                        message: MxResources.get('imageTooBig')
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
            } else if (file.type.substring(0, 5) === 'image') {
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
    force = force !== null ? force : false

    let resume =
      this.spinner !== null && this.spinner.pause !== null
        ? this.spinner.pause()
        : function() {}
    let resizeImages =
      isLocalStorage || MxClient.IS_CHROMEAPP
        ? MxSettings.getResizeImages()
        : null

    let wrapper = function(remember, resize) {
      if (remember || force) {
        MxSettings.setResizeImages(remember ? resize : null)
        MxSettings.save()
      }

      resume()
      fn(resize)
    }

    if (resizeImages !== null && !force) {
      wrapper(false, resizeImages)
    } else {
      this.showDialog(
        new ConfirmDialog(
          this,
          MxResources.get('resizeLargeImages'),
          function(remember) {
            wrapper(remember, true)
          },
          function(remember) {
            wrapper(remember, false)
          },
          MxResources.get('resize'),
          MxResources.get('actualSize'),
          '<img style="margin-top:8px;" src="' + Editor.loResImage + '"/>',
          '<img style="margin-top:8px;" src="' + Editor.hiResImage + '"/>',
          isLocalStorage || MxClient.IS_CHROMEAPP
        ).container,
        340,
        isLocalStorage || MxClient.IS_CHROMEAPP ? 220 : 200,
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
    size = size !== null ? size : 24

    let spinner = new Spinner({
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
    let oldSpin = spinner.spin

    spinner.spin = function(container, label) {
      let result = false

      if (!this.active) {
        oldSpin.call(this, container)
        this.active = true

        if (label !== null) {
          let status = document.createElement('div')

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

          MxUtils.setPrefixedStyle(status.style, 'borderRadius', '6px')
          MxUtils.setPrefixedStyle(
            status.style,
            'boxShadow',
            '2px 2px 3px 0px #ddd'
          )
          MxUtils.setPrefixedStyle(
            status.style,
            'transform',
            'translate(-50%,-50%)'
          )

          status.innerHTML = label + '...'
          container.appendChild(status)
          spinner.status = status

          // Centers the label in older IE versions
          if (
            MxClient.IS_VML &&
            (document.documentMode === null || document.documentMode <= 8)
          ) {
            status.style.left =
              Math.round(Math.max(0, x - status.offsetWidth / 2)) + 'px'
            status.style.top =
              Math.round(Math.max(0, y + 70 - status.offsetHeight / 2)) + 'px'
          }
        }

        // Pause returns a function to resume the spinner
        this.pause = MxUtils.bind(this, function() {
          let fn = function() {}

          if (this.active) {
            fn = MxUtils.bind(this, function() {
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
    let oldStop = spinner.stop

    spinner.stop = function() {
      oldStop.call(this)
      this.active = false

      if (spinner.status !== null) {
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
    let result = null

    try {
      let base64 = data.substring(data.indexOf(',') + 1)

      // Workaround for invalid character error in Safari
      let binary =
        window.atob && !MxClient.IS_SF
          ? atob(base64)
          : Base64.decode(base64, true)

      EditorUi.parsePng(
        binary,
        MxUtils.bind(this, function(pos, type, length) {
          let value = binary.substring(pos + 8, pos + 8 + length)

          if (type === 'zTXt') {
            let idx = value.indexOf(String.fromCharCode(0))

            if (value.substring(0, idx) === 'MxGraphModel') {
              // Workaround for Java URL Encoder using + for spaces, which isn't compatible with JS
              let xmlData = this.editor.graph
                .bytesToString(pako.inflateRaw(value.substring(idx + 2)))
                .replace(/\+/g, ' ')

              if (xmlData !== null && xmlData.length > 0) {
                result = xmlData
              }
            }
          } else if (type === 'tEXt') {
          // Uncompressed section is normally not used
            let vals = value.split(String.fromCharCode(0))

            if (vals.length > 1 && vals[0] === 'MxGraphModel') {
              result = vals[1]
            }
          }

          if (result !== null || type === 'IDAT') {
            // Stops processing the file as our text chunks
            // are always placed before the data section
            return true
          }
        })
      )
    } catch (e) {
      // ignores decoding errors
    }

    if (result !== null && result.charAt(0) === '%') {
      result = decodeURIComponent(result)
    }

    // Workaround for double encoded content
    if (result !== null && result.charAt(0) === '%') {
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
    let img = new Image()

    img.onload = function() {
      onload(img)
    }

    if (onerror !== null) {
      img.onerror = onerror
    }

    img.src = uri
  }

  /**
   * Resizes the given image if <maxImageBytes> is not null.
   */
  resizeImage(img, data, fn, enabled, maxSize, thresh) {
    maxSize = maxSize !== null ? maxSize : this.maxImageSize
    let w = Math.max(1, img.width)
    let h = Math.max(1, img.height)

    if (enabled && this.isResampleImage(data, thresh)) {
      try {
        let factor = Math.max(w / maxSize, h / maxSize)

        if (factor > 1) {
          let w2 = Math.round(w / factor)
          let h2 = Math.round(h / factor)

          let canvas = document.createElement('canvas')
          canvas.width = w2
          canvas.height = h2

          let ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w2, h2)

          let tmp = canvas.toDataURL()

          // Uses new image if smaller
          if (tmp.length < data.length) {
            // Checks if the image is empty by comparing
            // with an empty image of the same size
            let canvas2 = document.createElement('canvas')
            canvas2.width = w2
            canvas2.height = h2
            let tmp2 = canvas2.toDataURL()

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
    thresh = thresh !== null ? thresh : this.resampleThreshold

    return data.length > thresh
  }

  /**
   * Translates this point by the given vector.
   *
   * @param {number} dx X-coordinate of the translation.
   * @param {number} dy Y-coordinate of the translation.
   */
  handleError(resp, title, fn) {
    let resume =
      this.spinner !== null && this.spinner.pause !== null
        ? this.spinner.pause()
        : function() {}
    let e = resp !== null && resp.error !== null ? resp.error : resp

    if (e !== null || title !== null) {
      let msg = MxUtils.htmlEntities(MxResources.get('unknownError'))
      let btn = MxResources.get('ok')
      let retry = null
      title = title !== null ? title : MxResources.get('error')

      if (e !== null) {
        if (e.retry !== null) {
          btn = MxResources.get('cancel')
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
          msg = MxUtils.htmlEntities(MxResources.get('forbidden'))
        } else if (
          e.code === 404 ||
          e.status === 404 ||
          (typeof gapi !== 'undefined' &&
            typeof gapi.drive !== 'undefined' &&
            typeof gapi.drive.realtime !== 'undefined' &&
            e.type === gapi.drive.realtime.ErrorType.NOT_FOUND)
        ) {
          msg = MxUtils.htmlEntities(MxResources.get('fileNotFoundOrDenied'))
          let id = window.location.hash

          if (id !== null && id.substring(0, 2) === '#G') {
            id = id.substring(2)
            msg +=
              ' <a href="https://drive.google.com/open?id=' +
              id +
              '" target="_blank">' +
              MxUtils.htmlEntities(MxResources.get('tryOpeningViaThisPage')) +
              '</a>'
          }
        } else if (e.code === Board.ERROR_TIMEOUT) {
          msg = MxUtils.htmlEntities(MxResources.get('timeout'))
        } else if (e.code === Board.ERROR_BUSY) {
          msg = MxUtils.htmlEntities(MxResources.get('busy'))
        } else if (e.message !== null) {
          msg = MxUtils.htmlEntities(e.message)
        } else if (e.response !== null && e.response.error !== null) {
          msg = MxUtils.htmlEntities(e.response.error)
        }
      }

      this.showError(title, msg, btn, fn, retry)
    } else if (fn !== null) {
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
    let dlg = new ErrorDialog(this, title, msg, btn, fn, retry, btn2, fn2)
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
    crop = crop !== null ? crop : true

    let async = false
    let cells = null

    if (mimeType.substring(0, 5) === 'image') {
      let containsModel = false

      if (mimeType.substring(0, 9) === 'image/png') {
        let xml = ignoreEmbeddedXml ? null : this.extractGraphModelFromPng(data)

        if (xml !== null && xml.length > 0) {
          cells = this.importXml(xml, dx, dy, crop)
          containsModel = true
        }
      }

      if (!containsModel) {
        let graph = this.editor.graph

        // Strips encoding bit (eg. ;base64,) for cell style
        let semi = data.indexOf(';')

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
        file !== null
          ? file
          : new Blob([data], { type: 'application/octet-stream' }),
        MxUtils.bind(this, function(xhr) {
          if (xhr.readyState === 4) {
            let importedCells = null

            if (xhr.status >= 200 && xhr.status <= 299) {
              let xml = xhr.responseText

              if (xml !== null && xml.substring(0, 10) === '<mxlibrary') {
                if (
                  filename !== null &&
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

            if (done !== null) {
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

    if (!async && done !== null) {
      done(cells)
    }

    return cells
  }

  snapshoot() {
    let snd = new Audio(Board.CAMERA_SOUND)

    snd.play()
  }
}

// let updatePasteActionStates = EditorUi.prototype.updatePasteActionStates;
// EditorUi.prototype.updatePasteActionStates = function(){
//     updatePasteActionStates.call(this, arguments);

//     let paste = this.actions.get('paste');
//     paste.setEnabled(true);
// }
