/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */

import MxClient from '@/lib/board/mxGraph/MxClient.js'
import MxUtils from '@/lib/board/mxGraph/util/MxUtils.js'
import MxConstants from '@/lib/board/mxGraph/util/MxConstants.js'
import MxResources from '@/lib/board/mxGraph/util/MxResources.js'
import { FilenameDialog, ColorDialog } from './Dialogs.js'
import MxHierarchicalLayout from '@/lib/board/mxGraph/layout/hierarchical/MxHierarchicalLayout.js'
import MxCompactTreeLayout from '@/lib/board/mxGraph/layout/MxCompactTreeLayout.js'
import MxRadialTreeLayout from '@/lib/board/mxGraph/layout/MxRadialTreeLayout.js'
import MxFastOrganicLayout from '@/lib/board/mxGraph/layout/MxFastOrganicLayout.js'
import MxCircleLayout from '@/lib/board/mxGraph/layout/MxCircleLayout.js'
import MxEvent from '@/lib/board/mxGraph/util/MxEvent.js'
import MxEventObject from '@/lib/board/mxGraph/util/MxEventObject.js'
import Editor from './Editor.js'
import MxEdgeHandler from '@/lib/board/mxGraph/handler/MxEdgeHandler.js'
import MxMouseEvent from '@/lib/board/mxGraph/util/MxMouseEvent.js'
import MxPopupMenu from '@/lib/board/mxGraph/util/MxPopupMenu.js'
import MxEventSource from '@/lib/board/mxGraph/util/MxEventSource.js'
import EditorUi from './EditorUi.js'

export default class Menus {
  constructor(editorUi) {
    this.editorUi = editorUi
    this.menus = new Object()
    this.init()

    // Pre-fetches checkmark image
    if (!MxClient.IS_SVG) {
      new Image().src = this.checkmarkImage
    }
  }
}

/**
 * Sets the default font family.
 */
Menus.prototype.defaultFont = 'Helvetica'

/**
 * Sets the default font size.
 */
Menus.prototype.defaultFontSize = '12'

/**
 * Sets the default font size.
 */
Menus.prototype.defaultMenuItems = [
  'file',
  'edit',
  'view',
  'arrange',
  'extras',
  'help'
]

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.defaultFonts = [
  'Helvetica',
  'Verdana',
  'Times New Roman',
  'Garamond',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Lucida Console',
  'Tahoma'
]

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.init = function() {
  let graph = this.editorUi.editor.graph
  let isGraphEnabled = MxUtils.bind(graph, graph.isEnabled)

  this.customFonts = []
  this.customFontSizes = []

  this.put(
    'fontFamily',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        let addItem = MxUtils.bind(this, function(fontname) {
          let tr = this.styleChange(
            menu,
            fontname,
            [MxConstants.STYLE_FONTFAMILY],
            [fontname],
            null,
            parent,
            function() {
              document.execCommand('fontname', false, fontname)
            },
            function() {
              graph.updateLabelElements(graph.getSelectionCells(), function(
                elt
              ) {
                elt.removeAttribute('face')
                elt.style.fontFamily = null

                if (elt.nodeName === 'PRE') {
                  graph.replaceElement(elt, 'div')
                }
              })
            }
          )
          tr.firstChild.nextSibling.style.fontFamily = fontname
        })

        for (let i = 0; i < this.defaultFonts.length; i++) {
          addItem(this.defaultFonts[i])
        }

        menu.addSeparator(parent)

        if (this.customFonts.length > 0) {
          for (let i = 0; i < this.customFonts.length; i++) {
            addItem(this.customFonts[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            MxResources.get('reset'),
            null,
            MxUtils.bind(this, function() {
              this.customFonts = []
            }),
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          MxResources.get('custom') + '...',
          '',
          MxConstants.DEFAULT_FONTFAMILY,
          MxConstants.STYLE_FONTFAMILY,
          parent,
          true,
          MxUtils.bind(this, function(newValue) {
            this.customFonts.push(newValue)
          })
        )
      })
    )
  )
  this.put(
    'formatBlock',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        function addItem(label, tag) {
          return menu.addItem(
            label,
            null,
            MxUtils.bind(this, function() {
              // TODO: Check if visible
              graph.cellEditor.textarea.focus()
              document.execCommand('formatBlock', false, '<' + tag + '>')
            }),
            parent
          )
        }

        addItem(MxResources.get('normal'), 'p')

        addItem('', 'h1').firstChild.nextSibling.innerHTML =
          '<h1 style="margin:0px;">' + MxResources.get('heading') + ' 1</h1>'
        addItem('', 'h2').firstChild.nextSibling.innerHTML =
          '<h2 style="margin:0px;">' + MxResources.get('heading') + ' 2</h2>'
        addItem('', 'h3').firstChild.nextSibling.innerHTML =
          '<h3 style="margin:0px;">' + MxResources.get('heading') + ' 3</h3>'
        addItem('', 'h4').firstChild.nextSibling.innerHTML =
          '<h4 style="margin:0px;">' + MxResources.get('heading') + ' 4</h4>'
        addItem('', 'h5').firstChild.nextSibling.innerHTML =
          '<h5 style="margin:0px;">' + MxResources.get('heading') + ' 5</h5>'
        addItem('', 'h6').firstChild.nextSibling.innerHTML =
          '<h6 style="margin:0px;">' + MxResources.get('heading') + ' 6</h6>'

        addItem('', 'pre').firstChild.nextSibling.innerHTML =
          '<pre style="margin:0px;">' + MxResources.get('formatted') + '</pre>'
        addItem('', 'blockquote').firstChild.nextSibling.innerHTML =
          '<blockquote style="margin-top:0px;margin-bottom:0px;">' +
          MxResources.get('blockquote') +
          '</blockquote>'
      })
    )
  )
  this.put(
    'fontSize',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        let sizes = [6, 8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72]

        let addItem = MxUtils.bind(this, function(fontsize) {
          this.styleChange(
            menu,
            fontsize,
            [MxConstants.STYLE_FONTSIZE],
            [fontsize],
            null,
            parent,
            function() {
              // Creates an element with arbitrary size 3
              document.execCommand('fontSize', false, '3')

              // Changes the css font size of the first font element inside the in-place editor with size 3
              // hopefully the above element that we've just created. LATER: Check for new element using
              // previous result of getElementsByTagName (see other actions)
              let elts = graph.cellEditor.textarea.getElementsByTagName('font')

              for (let i = 0; i < elts.length; i++) {
                if (elts[i].getAttribute('size') === '3') {
                  elts[i].removeAttribute('size')
                  elts[i].style.fontSize = fontsize + 'px'

                  break
                }
              }
            }
          )
        })

        for (let i = 0; i < sizes.length; i++) {
          addItem(sizes[i])
        }

        menu.addSeparator(parent)

        if (this.customFontSizes.length > 0) {
          for (let i = 0; i < this.customFontSizes.length; i++) {
            addItem(this.customFontSizes[i])
          }

          menu.addSeparator(parent)

          menu.addItem(
            MxResources.get('reset'),
            null,
            MxUtils.bind(this, function() {
              this.customFontSizes = []
            }),
            parent
          )

          menu.addSeparator(parent)
        }

        this.promptChange(
          menu,
          MxResources.get('custom') + '...',
          '(pt)',
          '12',
          MxConstants.STYLE_FONTSIZE,
          parent,
          true,
          MxUtils.bind(this, function(newValue) {
            this.customFontSizes.push(newValue)
          })
        )
      })
    )
  )
  this.put(
    'direction',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        menu.addItem(
          MxResources.get('flipH'),
          null,
          function() {
            graph.toggleCellStyles(MxConstants.STYLE_FLIPH, false)
          },
          parent
        )
        menu.addItem(
          MxResources.get('flipV'),
          null,
          function() {
            graph.toggleCellStyles(MxConstants.STYLE_FLIPV, false)
          },
          parent
        )
        this.addMenuItems(menu, ['-', 'rotation'], parent)
      })
    )
  )
  this.put(
    'align',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        menu.addItem(
          MxResources.get('leftAlign'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_LEFT)
          },
          parent
        )
        menu.addItem(
          MxResources.get('center'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_CENTER)
          },
          parent
        )
        menu.addItem(
          MxResources.get('rightAlign'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_RIGHT)
          },
          parent
        )
        menu.addSeparator(parent)
        menu.addItem(
          MxResources.get('topAlign'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_TOP)
          },
          parent
        )
        menu.addItem(
          MxResources.get('middle'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_MIDDLE)
          },
          parent
        )
        menu.addItem(
          MxResources.get('bottomAlign'),
          null,
          function() {
            graph.alignCells(MxConstants.ALIGN_BOTTOM)
          },
          parent
        )
      })
    )
  )
  this.put(
    'distribute',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        menu.addItem(
          MxResources.get('horizontal'),
          null,
          function() {
            graph.distributeCells(true)
          },
          parent
        )
        menu.addItem(
          MxResources.get('vertical'),
          null,
          function() {
            graph.distributeCells(false)
          },
          parent
        )
      })
    )
  )
  this.put(
    'layout',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        let promptSpacing = MxUtils.bind(this, function(defaultValue, fn) {
          let dlg = new FilenameDialog(
            this.editorUi,
            defaultValue,
            MxResources.get('apply'),
            function(newValue) {
              fn(parseFloat(newValue))
            },
            MxResources.get('spacing')
          )
          this.editorUi.showDialog(dlg.container, 300, 80, true, true)
          dlg.init()
        })

        menu.addItem(
          MxResources.get('horizontalFlow'),
          null,
          MxUtils.bind(this, function() {
            let layout = new MxHierarchicalLayout(
              graph,
              MxConstants.DIRECTION_WEST
            )

            this.editorUi.executeLayout(function() {
              let selectionCells = graph.getSelectionCells()
              layout.execute(
                graph.getDefaultParent(),
                selectionCells.length === 0 ? null : selectionCells
              )
            }, true)
          }),
          parent
        )
        menu.addItem(
          MxResources.get('verticalFlow'),
          null,
          MxUtils.bind(this, function() {
            let layout = new MxHierarchicalLayout(
              graph,
              MxConstants.DIRECTION_NORTH
            )

            this.editorUi.executeLayout(function() {
              let selectionCells = graph.getSelectionCells()
              layout.execute(
                graph.getDefaultParent(),
                selectionCells.length === 0 ? null : selectionCells
              )
            }, true)
          }),
          parent
        )
        menu.addSeparator(parent)
        menu.addItem(
          MxResources.get('horizontalTree'),
          null,
          MxUtils.bind(this, function() {
            let tmp = graph.getSelectionCell()
            let roots = null

            if (tmp === null || graph.getModel().getChildCount(tmp) === 0) {
              if (graph.getModel().getEdgeCount(tmp) === 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots !== null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp !== null) {
              let layout = new MxCompactTreeLayout(graph, true)
              layout.edgeRouting = false
              layout.levelDistance = 30

              promptSpacing(
                layout.levelDistance,
                MxUtils.bind(this, function(newValue) {
                  layout.levelDistance = newValue

                  this.editorUi.executeLayout(function() {
                    layout.execute(graph.getDefaultParent(), tmp)
                  }, true)
                })
              )
            }
          }),
          parent
        )
        menu.addItem(
          MxResources.get('verticalTree'),
          null,
          MxUtils.bind(this, function() {
            let tmp = graph.getSelectionCell()
            let roots = null

            if (tmp === null || graph.getModel().getChildCount(tmp) === 0) {
              if (graph.getModel().getEdgeCount(tmp) === 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots !== null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp !== null) {
              let layout = new MxCompactTreeLayout(graph, false)
              layout.edgeRouting = false
              layout.levelDistance = 30

              promptSpacing(
                layout.levelDistance,
                MxUtils.bind(this, function(newValue) {
                  layout.levelDistance = newValue

                  this.editorUi.executeLayout(function() {
                    layout.execute(graph.getDefaultParent(), tmp)
                  }, true)
                })
              )
            }
          }),
          parent
        )
        menu.addItem(
          MxResources.get('radialTree'),
          null,
          MxUtils.bind(this, function() {
            let tmp = graph.getSelectionCell()
            let roots = null

            if (tmp === null || graph.getModel().getChildCount(tmp) === 0) {
              if (graph.getModel().getEdgeCount(tmp) === 0) {
                roots = graph.findTreeRoots(graph.getDefaultParent())
              }
            } else {
              roots = graph.findTreeRoots(tmp)
            }

            if (roots !== null && roots.length > 0) {
              tmp = roots[0]
            }

            if (tmp !== null) {
              let layout = new MxRadialTreeLayout(graph, false)
              layout.levelDistance = 80
              layout.autoRadius = true

              promptSpacing(
                layout.levelDistance,
                MxUtils.bind(this, function(newValue) {
                  layout.levelDistance = newValue

                  this.editorUi.executeLayout(function() {
                    layout.execute(graph.getDefaultParent(), tmp)

                    if (!graph.isSelectionEmpty()) {
                      tmp = graph.getModel().getParent(tmp)

                      if (graph.getModel().isVertex(tmp)) {
                        graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
                      }
                    }
                  }, true)
                })
              )
            }
          }),
          parent
        )
        menu.addSeparator(parent)
        menu.addItem(
          MxResources.get('organic'),
          null,
          MxUtils.bind(this, function() {
            let layout = new MxFastOrganicLayout(graph)

            promptSpacing(
              layout.forceConstant,
              MxUtils.bind(this, function(newValue) {
                layout.forceConstant = newValue

                this.editorUi.executeLayout(function() {
                  let tmp = graph.getSelectionCell()

                  if (
                    tmp === null ||
                    graph.getModel().getChildCount(tmp) === 0
                  ) {
                    tmp = graph.getDefaultParent()
                  }

                  layout.execute(tmp)

                  if (graph.getModel().isVertex(tmp)) {
                    graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
                  }
                }, true)
              })
            )
          }),
          parent
        )
        menu.addItem(
          MxResources.get('circle'),
          null,
          MxUtils.bind(this, function() {
            let layout = new MxCircleLayout(graph)

            this.editorUi.executeLayout(function() {
              let tmp = graph.getSelectionCell()

              if (tmp === null || graph.getModel().getChildCount(tmp) === 0) {
                tmp = graph.getDefaultParent()
              }

              layout.execute(tmp)

              if (graph.getModel().isVertex(tmp)) {
                graph.updateGroupBounds([tmp], graph.gridSize * 2, true)
              }
            }, true)
          }),
          parent
        )
      })
    )
  )
  this.put(
    'navigation',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(
          menu,
          [
            'home',
            '-',
            'exitGroup',
            'enterGroup',
            '-',
            'expand',
            'collapse',
            '-',
            'collapsible'
          ],
          parent
        )
      })
    )
  )
  this.put(
    'arrange',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent)
        this.addSubmenu('direction', menu, parent)
        this.addMenuItems(menu, ['turn', '-'], parent)
        this.addSubmenu('align', menu, parent)
        this.addSubmenu('distribute', menu, parent)
        menu.addSeparator(parent)
        this.addSubmenu('navigation', menu, parent)
        this.addSubmenu('insert', menu, parent)
        this.addSubmenu('layout', menu, parent)
        this.addMenuItems(
          menu,
          [
            '-',
            'group',
            'ungroup',
            'removeFromGroup',
            '-',
            'clearWaypoints',
            'autosize'
          ],
          parent
        )
      })
    )
  ).isEnabled = isGraphEnabled
  this.put(
    'insert',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, ['insertLink', 'insertImage'], parent)
      })
    )
  )
  this.put(
    'view',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(
          menu,
          (this.editorUi.format !== null ? ['formatPanel'] : []).concat(
            [
              'outline',
              'layers',
              '-',
              'pageView',
              'pageScale',
              '-',
              'scrollbars',
              'tooltips',
              '-',
              'grid',
              'guides',
              '-',
              'connectionArrows',
              'connectionPoints',
              '-',
              'resetView',
              'zoomIn',
              'zoomOut'
            ],
            parent
          )
        )
      })
    )
  )
  // Two special dropdowns that are only used in the toolbar
  this.put(
    'viewPanels',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        if (this.editorUi.format !== null) {
          this.addMenuItems(menu, ['formatPanel'], parent)
        }

        this.addMenuItems(menu, ['outline', 'layers'], parent)
      })
    )
  )
  this.put(
    'viewZoom',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, ['resetView', '-'], parent)
        let scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

        for (let i = 0; i < scales.length; i++) {
          ;(function(scale) {
            menu.addItem(
              scale * 100 + '%',
              null,
              function() {
                graph.zoomTo(scale)
              },
              parent
            )
          })(scales[i])
        }

        this.addMenuItems(
          menu,
          [
            '-',
            'fitWindow',
            'fitPageWidth',
            'fitPage',
            'fitTwoPages',
            '-',
            'customZoom'
          ],
          parent
        )
      })
    )
  )
  this.put(
    'file',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(
          menu,
          [
            'new',
            'open',
            '-',
            'save',
            'saveAs',
            '-',
            'import',
            'export',
            '-',
            'pageSetup',
            'print'
          ],
          parent
        )
      })
    )
  )
  this.put(
    'edit',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, [
          'undo',
          'redo',
          '-',
          'cut',
          'copy',
          'paste',
          'delete',
          '-',
          'duplicate',
          '-',
          'editData',
          'editTooltip',
          'editStyle',
          '-',
          'edit',
          '-',
          'editLink',
          'openLink',
          '-',
          'selectVertices',
          'selectEdges',
          'selectAll',
          'selectNone',
          '-',
          'lockUnlock'
        ])
      })
    )
  )
  this.put(
    'extras',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, [
          'copyConnect',
          'collapseExpand',
          '-',
          'editDiagram'
        ])
      })
    )
  )
  this.put(
    'help',
    new Menu(
      MxUtils.bind(this, function(menu, parent) {
        this.addMenuItems(menu, ['help', '-', 'about'])
      })
    )
  )
}

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.put = function(name, menu) {
  this.menus[name] = menu

  return menu
}

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.get = function(name) {
  return this.menus[name]
}

/**
 * Adds the given submenu.
 */
Menus.prototype.addSubmenu = function(name, menu, parent) {
  let enabled = this.get(name).isEnabled()

  if (menu.showDisabled || enabled) {
    let submenu = menu.addItem(
      MxResources.get(name),
      null,
      null,
      parent,
      null,
      enabled
    )
    this.addMenu(name, menu, submenu)
  }
}

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.addMenu = function(name, popupMenu, parent) {
  let menu = this.get(name)

  if (menu !== null && (popupMenu.showDisabled || menu.isEnabled())) {
    this.get(name).execute(popupMenu, parent)
  }
}

/**
 * Adds a menu item to insert a table.
 */
Menus.prototype.addInsertTableItem = function(menu) {
  // KNOWN: Does not work in IE8 standards and quirks
  let graph = this.editorUi.editor.graph

  function createTable(rows, cols) {
    let html = ['<table>']

    for (let i = 0; i < rows; i++) {
      html.push('<tr>')

      for (let j = 0; j < cols; j++) {
        html.push('<td><br></td>')
      }

      html.push('</tr>')
    }

    html.push('</table>')

    return html.join('')
  }

  // Show table size dialog
  let elt2 = menu.addItem(
    '',
    null,
    MxUtils.bind(this, function(evt) {
      let td = graph.getParentByName(MxEvent.getSource(evt), 'TD')

      if (td !== null) {
        let row2 = graph.getParentByName(td, 'TR')

        // To find the new link, we create a list of all existing links first
        // LATER: Refactor for reuse with code for finding inserted image below
        let tmp = graph.cellEditor.textarea.getElementsByTagName('table')
        let oldTables = []

        for (let i = 0; i < tmp.length; i++) {
          oldTables.push(tmp[i])
        }

        // Finding the new table will work with insertHTML, but IE does not support that
        graph.container.focus()
        graph.pasteHtmlAtCaret(
          createTable(row2.sectionRowIndex + 1, td.cellIndex + 1)
        )

        // Moves cursor to first table cell
        let newTables = graph.cellEditor.textarea.getElementsByTagName('table')

        if (newTables.length === oldTables.length + 1) {
          // Inverse order in favor of appended tables
          for (let i = newTables.length - 1; i >= 0; i--) {
            if (i === 0 || newTables[i] !== oldTables[i - 1]) {
              graph.selectNode(newTables[i].rows[0].cells[0])
              break
            }
          }
        }
      }
    })
  )

  // Quirks mode does not add cell padding if cell is empty, needs good old spacer solution
  let quirksCellHtml =
    '<img src="' +
    MxClient.imageBasePath +
    '/transparent.gif' +
    '" width="16" height="16"/>'

  function createPicker(rows, cols) {
    let table2 = document.createElement('table')
    table2.setAttribute('border', '1')
    table2.style.borderCollapse = 'collapse'

    if (!MxClient.IS_QUIRKS) {
      table2.setAttribute('cellPadding', '8')
    }

    for (let i = 0; i < rows; i++) {
      let row = table2.insertRow(i)

      for (let j = 0; j < cols; j++) {
        let cell = row.insertCell(-1)

        if (MxClient.IS_QUIRKS) {
          cell.innerHTML = quirksCellHtml
        }
      }
    }

    return table2
  }

  function extendPicker(picker, rows, cols) {
    for (let i = picker.rows.length; i < rows; i++) {
      let row = picker.insertRow(i)

      for (let j = 0; j < picker.rows[0].cells.length; j++) {
        let cell = row.insertCell(-1)

        if (MxClient.IS_QUIRKS) {
          cell.innerHTML = quirksCellHtml
        }
      }
    }

    for (let i = 0; i < picker.rows.length; i++) {
      let row = picker.rows[i]

      for (let j = row.cells.length; j < cols; j++) {
        let cell = row.insertCell(-1)

        if (MxClient.IS_QUIRKS) {
          cell.innerHTML = quirksCellHtml
        }
      }
    }
  }

  elt2.firstChild.innerHTML = ''
  let picker = createPicker(5, 5)
  elt2.firstChild.appendChild(picker)

  let label = document.createElement('div')
  label.style.padding = '4px'
  label.style.fontSize = Menus.prototype.defaultFontSize + 'px'
  label.innerHTML = '1x1'
  elt2.firstChild.appendChild(label)

  MxEvent.addListener(picker, 'mouseover', function(e) {
    let td = graph.getParentByName(MxEvent.getSource(e), 'TD')

    if (td !== null) {
      let row2 = graph.getParentByName(td, 'TR')
      extendPicker(
        picker,
        Math.min(20, row2.sectionRowIndex + 2),
        Math.min(20, td.cellIndex + 2)
      )
      label.innerHTML = td.cellIndex + 1 + 'x' + (row2.sectionRowIndex + 1)

      for (let i = 0; i < picker.rows.length; i++) {
        let r = picker.rows[i]

        for (let j = 0; j < r.cells.length; j++) {
          let cell = r.cells[j]

          if (i <= row2.sectionRowIndex && j <= td.cellIndex) {
            cell.style.backgroundColor = 'blue'
          } else {
            cell.style.backgroundColor = 'white'
          }
        }
      }

      MxEvent.consume(e)
    }
  })
}

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.edgeStyleChange = function(
  menu,
  label,
  keys,
  values,
  sprite,
  parent,
  reset
) {
  return menu.addItem(
    label,
    null,
    MxUtils.bind(this, function() {
      let graph = this.editorUi.editor.graph
      graph.stopEditing(false)

      graph.getModel().beginUpdate()
      try {
        let cells = graph.getSelectionCells()
        let edges = []

        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i]

          if (graph.getModel().isEdge(cell)) {
            if (reset) {
              let geo = graph.getCellGeometry(cell)

              // Resets all edge points
              if (geo !== null) {
                geo = geo.clone()
                geo.points = null
                graph.getModel().setGeometry(cell, geo)
              }
            }

            for (let j = 0; j < keys.length; j++) {
              graph.setCellStyles(keys[j], values[j], [cell])
            }

            edges.push(cell)
          }
        }

        this.editorUi.fireEvent(
          new MxEventObject(
            'styleChanged',
            'keys',
            keys,
            'values',
            values,
            'cells',
            edges
          )
        )
      } finally {
        graph.getModel().endUpdate()
      }
    }),
    parent,
    sprite
  )
}

/**
 * Adds a style change item to the given menu.
 */
Menus.prototype.styleChange = function(
  menu,
  label,
  keys,
  values,
  sprite,
  parent,
  fn,
  post
) {
  let apply = this.createStyleChangeFunction(keys, values)

  return menu.addItem(
    label,
    null,
    MxUtils.bind(this, function() {
      let graph = this.editorUi.editor.graph

      if (fn !== null && graph.cellEditor.isContentEditing()) {
        fn()
      } else {
        apply(post)
      }
    }),
    parent,
    sprite
  )
}

/**
 *
 */
Menus.prototype.createStyleChangeFunction = function(keys, values) {
  return MxUtils.bind(this, function(post) {
    let graph = this.editorUi.editor.graph
    graph.stopEditing(false)

    graph.getModel().beginUpdate()
    try {
      for (let i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i])
      }

      if (post !== null) {
        post()
      }

      this.editorUi.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          keys,
          'values',
          values,
          'cells',
          graph.getSelectionCells()
        )
      )
    } finally {
      graph.getModel().endUpdate()
    }
  })
}

/**
 * Adds a style change item with a prompt to the given menu.
 */
Menus.prototype.promptChange = function(
  menu,
  label,
  hint,
  defaultValue,
  key,
  parent,
  enabled,
  fn,
  sprite
) {
  return menu.addItem(
    label,
    null,
    MxUtils.bind(this, function() {
      let graph = this.editorUi.editor.graph
      let value = defaultValue
      let state = graph.getView().getState(graph.getSelectionCell())

      if (state !== null) {
        value = state.style[key] || value
      }

      let dlg = new FilenameDialog(
        this.editorUi,
        value,
        MxResources.get('apply'),
        MxUtils.bind(this, function(newValue) {
          if (newValue !== null && newValue.length > 0) {
            graph.getModel().beginUpdate()
            try {
              graph.stopEditing(false)
              graph.setCellStyles(key, newValue)
            } finally {
              graph.getModel().endUpdate()
            }

            if (fn !== null) {
              fn(newValue)
            }
          }
        }),
        MxResources.get('enterValue') + (hint.length > 0 ? ' ' + hint : '')
      )
      this.editorUi.showDialog(dlg.container, 300, 80, true, true)
      dlg.init()
    }),
    parent,
    sprite,
    enabled
  )
}

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.pickColor = function(key, cmd, defaultValue) {
  let graph = this.editorUi.editor.graph

  if (cmd !== null && graph.cellEditor.isContentEditing()) {
    // Saves and restores text selection for in-place editor
    let selState = graph.cellEditor.saveSelection()

    let dlg = new ColorDialog(
      this.editorUi,
      defaultValue || '000000',
      MxUtils.bind(this, function(color) {
        graph.cellEditor.restoreSelection(selState)
        document.execCommand(
          cmd,
          false,
          color !== MxConstants.NONE ? color : 'transparent'
        )
      }),
      function() {
        graph.cellEditor.restoreSelection(selState)
      }
    )
    this.editorUi.showDialog(dlg.container, 230, 430, true, true)
    dlg.init()
  } else {
    if (this.colorDialog === null) {
      this.colorDialog = new ColorDialog(this.editorUi)
    }

    this.colorDialog.currentColorKey = key
    let state = graph.getView().getState(graph.getSelectionCell())
    let color = 'none'

    if (state !== null) {
      color = state.style[key] || color
    }

    if (color === 'none') {
      color = 'ffffff'
      this.colorDialog.picker.fromString('ffffff')
      this.colorDialog.colorInput.value = 'none'
    } else {
      this.colorDialog.picker.fromString(color)
    }

    this.editorUi.showDialog(this.colorDialog.container, 230, 430, true, true)
    this.colorDialog.init()
  }
}

/**
 * Adds a handler for showing a menu in the given element.
 */
Menus.prototype.toggleStyle = function(key, defaultValue) {
  let graph = this.editorUi.editor.graph
  let value = graph.toggleCellStyles(key, defaultValue)
  this.editorUi.fireEvent(
    new MxEventObject(
      'styleChanged',
      'keys',
      [key],
      'values',
      [value],
      'cells',
      graph.getSelectionCells()
    )
  )
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItem = function(menu, key, parent, trigger, sprite) {
  let action = this.editorUi.actions.get(key)

  if (
    action !== null &&
    (menu.showDisabled || action.isEnabled()) &&
    action.visible
  ) {
    let item = menu.addItem(
      action.label,
      null,
      function() {
        action.funct(trigger)
      },
      parent,
      sprite,
      action.isEnabled()
    )

    // Adds checkmark image
    if (action.toggleAction && action.isSelected()) {
      menu.addCheckmark(item, Editor.checkmarkImage)
    }

    this.addShortcut(item, action)

    return item
  }

  return null
}

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addShortcut = function(item, action) {
  if (action.shortcut !== null) {
    let td = item.firstChild.nextSibling.nextSibling
    let span = document.createElement('span')
    span.style.color = 'gray'
    MxUtils.write(span, action.shortcut)
    td.appendChild(span)
  }
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItems = function(menu, keys, parent, trigger, sprites) {
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === '-') {
      menu.addSeparator(parent)
    } else {
      this.addMenuItem(
        menu,
        keys[i],
        parent,
        trigger,
        sprites !== null ? sprites[i] : null
      )
    }
  }
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createPopupMenu = function(menu, cell, evt) {
  let graph = this.editorUi.editor.graph
  menu.smartSeparators = true

  if (graph.isSelectionEmpty()) {
    this.addMenuItems(menu, ['undo', 'redo', 'pasteHere'], null, evt)
  } else {
    this.addMenuItems(
      menu,
      ['delete', '-', 'cut', 'copy', '-', 'duplicate'],
      null,
      evt
    )
  }

  if (!graph.isSelectionEmpty()) {
    if (graph.getSelectionCount() === 1) {
      this.addMenuItems(menu, ['setAsDefaultStyle'], null, evt)
    }

    menu.addSeparator()

    cell = graph.getSelectionCell()
    let state = graph.view.getState(cell)

    if (state !== null) {
      let hasWaypoints = false
      this.addMenuItems(menu, ['toFront', 'toBack', '-'], null, evt)

      if (
        graph.getModel().isEdge(cell) &&
        MxUtils.getValue(state.style, MxConstants.STYLE_EDGE, null) !==
          'entityRelationEdgeStyle' &&
        MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null) !== 'arrow'
      ) {
        let handler = graph.selectionCellsHandler.getHandler(cell)
        let isWaypoint = false

        if (
          handler instanceof MxEdgeHandler &&
          handler.bends !== null &&
          handler.bends.length > 2
        ) {
          let index = handler.getHandleForEvent(
            graph.updateMouseEvent(new MxMouseEvent(evt))
          )

          // Configures removeWaypoint action before execution
          // Using trigger parameter is cleaner but have to find waypoint here anyway.
          let rmWaypointAction = this.editorUi.actions.get('removeWaypoint')
          rmWaypointAction.handler = handler
          rmWaypointAction.index = index

          isWaypoint = index > 0 && index < handler.bends.length - 1
        }

        this.addMenuItems(
          menu,
          ['-', isWaypoint ? 'removeWaypoint' : 'addWaypoint'],
          null,
          evt
        )

        // Adds reset waypoints option if waypoints exist
        let geo = graph.getModel().getGeometry(cell)
        hasWaypoints =
          geo !== null && geo.points !== null && geo.points.length > 0
      }

      if (
        graph.getSelectionCount() === 1 &&
        (hasWaypoints ||
          (graph.getModel().isVertex(cell) &&
            graph.getModel().getEdgeCount(cell) > 0))
      ) {
        this.addMenuItems(menu, ['clearWaypoints'], null, evt)
      }

      if (graph.getSelectionCount() > 1) {
        menu.addSeparator()
        this.addMenuItems(menu, ['group'], null, evt)
      } else if (
        graph.getSelectionCount() === 1 &&
        !graph.getModel().isEdge(cell) &&
        !graph.isSwimlane(cell) &&
        graph.getModel().getChildCount(cell) > 0
      ) {
        menu.addSeparator()
        this.addMenuItems(menu, ['ungroup'], null, evt)
      }

      if (graph.getSelectionCount() === 1) {
        menu.addSeparator()
        this.addMenuItems(
          menu,
          ['edit', '-', 'editData', 'editLink'],
          null,
          evt
        )

        // Shows edit image action if there is an image in the style
        if (
          graph.getModel().isVertex(cell) &&
          MxUtils.getValue(state.style, MxConstants.STYLE_IMAGE, null) !== null
        ) {
          menu.addSeparator()
          this.addMenuItem(
            menu,
            'image',
            null,
            evt
          ).firstChild.nextSibling.innerHTML =
            MxResources.get('editImage') + '...'
        }
      }
    }
  } else {
    this.addMenuItems(
      menu,
      [
        '-',
        'selectVertices',
        'selectEdges',
        'selectAll',
        '-',
        'clearDefaultStyle'
      ],
      null,
      evt
    )
  }
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createMenubar = function(container) {
  let menubar = new Menubar(this.editorUi, container)
  let menus = this.defaultMenuItems

  for (let i = 0; i < menus.length; i++) {
    MxUtils.bind(this, function(menu) {
      let elt = menubar.addMenu(
        MxResources.get(menus[i]),
        MxUtils.bind(this, function() {
          // Allows extensions of menu.funct
          menu.funct.apply(this, arguments)
        })
      )

      this.menuCreated(menu, elt)
    })(this.get(menus[i]))
  }

  return menubar
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.menuCreated = function(menu, elt) {
  if (elt !== null) {
    menu.addListener('stateChanged', function() {
      elt.enabled = menu.enabled

      if (!menu.enabled) {
        elt.className = 'geItem mxDisabled'

        if (document.documentMode === 8) {
          elt.style.color = '#c3c3c3'
        }
      } else {
        elt.className = 'geItem'

        if (document.documentMode === 8) {
          elt.style.color = ''
        }
      }
    })
  }
}

/**
 * Construcs a new menubar for the given editor.
 */
function Menubar(editorUi, container) {
  this.editorUi = editorUi
  this.container = container
}

/**
 * Adds the menubar elements.
 */
Menubar.prototype.hideMenu = function() {
  this.editorUi.hideCurrentMenu()
}

/**
 * Adds a submenu to this menubar.
 */
Menubar.prototype.addMenu = function(label, funct) {
  let elt = document.createElement('a')
  elt.setAttribute('href', 'javascript:void(0);')
  elt.className = 'geItem'
  MxUtils.write(elt, label)

  this.addMenuHandler(elt, funct)
  this.container.appendChild(elt)

  return elt
}

/**
 * Adds a handler for showing a menu in the given element.
 */
Menubar.prototype.addMenuHandler = function(elt, funct) {
  if (funct !== null) {
    let show = true

    let clickHandler = MxUtils.bind(this, function(evt) {
      if ((show && elt.enabled === null) || elt.enabled) {
        this.editorUi.editor.graph.popupMenuHandler.hideMenu()
        let menu = new MxPopupMenu(funct)
        menu.div.className += ' geMenubarMenu'
        menu.smartSeparators = true
        menu.showDisabled = true
        menu.autoExpand = true

        // Disables autoexpand and destroys menu when hidden
        menu.hideMenu = MxUtils.bind(this, function() {
          MxPopupMenu.prototype.hideMenu.apply(menu, arguments)
          this.editorUi.resetCurrentMenu()
          menu.destroy()
        })

        let offset = MxUtils.getOffset(elt)
        menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt)
        this.editorUi.setCurrentMenu(menu, elt)
      }

      MxEvent.consume(evt)
    })

    // Shows menu automatically while in expanded state
    MxEvent.addListener(
      elt,
      'mousemove',
      MxUtils.bind(this, function(evt) {
        if (
          this.editorUi.currentMenu !== null &&
          this.editorUi.currentMenuElt !== elt
        ) {
          this.editorUi.hideCurrentMenu()
          clickHandler(evt)
        }
      })
    )

    // Hides menu if already showing
    MxEvent.addListener(
      elt,
      'mousedown',
      MxUtils.bind(this, function() {
        show = this.currentElt !== elt
      })
    )

    MxEvent.addListener(
      elt,
      'click',
      MxUtils.bind(this, function(evt) {
        clickHandler(evt)
        show = true
      })
    )
  }
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menubar.prototype.destroy = function() {
  // do nothing
}

/**
 * Constructs a new action for the given parameters.
 */
function Menu(funct, enabled) {
  MxEventSource.call(this)
  this.funct = funct
  this.enabled = enabled !== null ? enabled : true
}

// Menu inherits from MxEventSource
MxUtils.extend(Menu, MxEventSource)

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.setEnabled = function(value) {
  if (this.enabled !== value) {
    this.enabled = value
    this.fireEvent(new MxEventObject('stateChanged'))
  }
}

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.execute = function(menu, parent) {
  this.funct(menu, parent)
}

/**
 * "Installs" menus in EditorUi.
 */
EditorUi.prototype.createMenus = function() {
  return new Menus(this)
}
