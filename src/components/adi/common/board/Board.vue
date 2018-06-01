<script>
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import boardProptypes from './board.proptypes'
import { mapGetters, mapActions } from 'vuex'

const initPreview = (data, callback) => {
  if (!window.mxClient.isBrowserSupported()) {
    return 'Browser is not supported!'
  }

  let container = document.createElement('div')

  window.mxResources.loadDefaultBundle = false

  let bundle =
    window.mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
    window.mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage)

  window.mxUtils.getAll([bundle, window.STYLE_PATH + '/default.xml'], function(
    xhr
  ) {
    window.mxResources.parse(xhr[0].getText())

    let themes = new Object()
    themes[
      window.Graph.prototype.defaultThemeName
    ] = xhr[1].getDocumentElement()

    let graph = new window.Graph(container, null, null, null, themes)

    let mxGraphModelData

    if (data) {
      mxGraphModelData = graph.getDecompressData(data)
    }

    let decoder = new window.mxCodec(mxGraphModelData)
    let node = mxGraphModelData.documentElement

    graph.centerZoom = false
    graph.setTooltips(false)
    graph.setEnabled(false)

    decoder.decode(node, graph.getModel())

    let svg = container.querySelector('svg')
    svg.style.backgroundImage = null

    if (typeof callback == 'function') {
      callback(container.innerHTML)
    }
  })
}

export default {
  name: 'AdiBoard',
  bedbclick: true,
  dblclick(context) {
    if (Boolean(window.mxClient)) {
      context.$store.dispatch('setActivePropertyOptions', {visible: true})
    } else {
      setTimeout(this.dblclick(context), 500)
    }
  },
  render(h) {
    let self = this

    return (
      <div class="comp-board">
        {(() => {
          if (self.properties.data) {
            let initPreviewRender = () => {
              if (Boolean(window.mxClient)) {
                initPreview(self.properties.data, svg => {
                  self.svg = svg
                })
              } else {
                setTimeout(initPreviewRender, 500)
              }
            }

            initPreviewRender()

            return h(
              'div',
              {
                domProps: {
                  innerHTML: self.svg
                }
              },
              []
            )
          } else {
            if(!self.properties.data && self.editMode) {
              return <div class="mx-client-start">{self.$t(self.options.desc)}</div>
            } else {
              return <div></div>
            }
          }
        })()}
      </div>
    )
  },
  data() {
    return {
      visible: false,
      svg: ''
    }
  },
  mixins: [compBaseMixin],
  computed: {
    getDialogProps() {
      let props = { visible: this.visible, fullscreen: true }
      let on = {
        'update:visible': v => {
          this.visible = v
        },
        open: () => {
          setTimeout(
            function() {
              this.loadBoardEditor()
            }.bind(this),
            0
          )
        }
      }

      return { props, on }
    }
  },
  created() {
    //TODO: Rewrite mxGraph to es6 code

    if (!window.mxClient) {
      let boardScript = document.createElement('script')
      boardScript.setAttribute(
        'src',
        '/static/adi/board/keepwork-board.min.js'
      )

      let graphEditorCss = document.createElement('link')
      graphEditorCss.setAttribute('rel', 'stylesheet')
      graphEditorCss.setAttribute('type', 'text/css')
      graphEditorCss.setAttribute(
        'href',
        '/static/adi/board/assets/styles/grapheditor.css'
      )

      let body = document.querySelector('body')
      body.appendChild(boardScript)
      body.appendChild(graphEditorCss)
    }
  }
}
</script>

<style>
.mxWindow {
  z-index: 3000 !important;
}
</style>


<style lang="scss" scoped>
.comp-board {
  .mx-client-start {
    background-color: #dedede;
    color: #333;
    height: 100px;
    font-size: 20px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
}
</style>
