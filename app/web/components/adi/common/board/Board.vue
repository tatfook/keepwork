<script>
import _ from 'lodash'
import axios from 'axios'
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
    window.mxResources.getDefaultBundle(window.RESOURCE_BASE, window.mxLanguage) ||
    window.mxResources.getSpecialBundle(window.RESOURCE_BASE, window.mxLanguage)
  
  window.mxUtils.getAll([bundle, window.STYLE_PATH + '/default.xml'], function(
    xhr
  ) {
    window.mxResources.parse(xhr[0].getText())

    let themes = {}
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

    if (typeof callback === 'function') {
      callback(container.innerHTML)
    }
  })
}

export default {
  name: 'AdiBoard',
  bedbclick: true,
  dblclick(context) {
    function IEVersion() {
      let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      let isIE =
        userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      // let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; / /判断是否IE的Edge浏览器
      let isIE11 =
        userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1

      if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        let fIEVersion = parseFloat(RegExp.$1)

        if (fIEVersion === 7) {
          return 7
        } else if (fIEVersion === 8) {
          return 8
        } else if (fIEVersion === 9) {
          return 9
        } else if (fIEVersion === 10) {
          return 10
        } else {
          return 6 // IE版本<=7
        }
      } else if (isIE11) {
        return 11 // IE11
      } else {
        return -1 // 不是ie浏览器
      }
    }

    if (IEVersion() > 0) {
      alert(context.$t('common.canNotUseIE'))
      return false
    }

    context.$store.dispatch('setActivePropertyOptions', { visible: true })
  },
  render(h) {
    let self = this

    return (
      <div class="comp-board">
        {(() => {
          if (!self.isOld()) {
            self.getSvgData()

            if (self.properties.svg) {
              return h(
                'div',
                {
                  domProps: {
                    innerHTML: self.svgData
                  }
                },
                []
              )
            } else {
              if (self.editMode) {
                return (
                  <div class="mx-client-start">{self.$t(self.options.desc)}</div>
                )
              } else {
                return ''
              }
            }
          } else {
            if (self.properties.data) {
              let initPreviewRender = () => {
                if (window.mxClient) {
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
              if (!self.properties.data && self.editMode) {
                return (
                  <div class="mx-client-start">
                    {self.$t(self.options.desc)}
                  </div>
                )
              } else {
                return <div />
              }
            }
          }
        })()}
      </div>
    )
  },
  data() {
    return {
      svg: '',
      svgData: ''
    }
  },
  methods: {
    isOld() {
      if (this.properties.data && !this.properties.svg) {
        return true
      } else {
        return false
      }
    },
    initold() {
      if (!window.mxClient) {
        let boardScript = document.createElement('script')
        boardScript.setAttribute(
          'src',
          '/public/adi/board/keepwork-board.min.js'
        )

        let graphEditorCss = document.createElement('link')
        graphEditorCss.setAttribute('rel', 'stylesheet')
        graphEditorCss.setAttribute('type', 'text/css')
        graphEditorCss.setAttribute(
          'href',
          '/public/adi/board/assets/styles/grapheditor.css'
        )

        let body = document.querySelector('body')
        body.appendChild(boardScript)
        body.appendChild(graphEditorCss)
      }
    },
    async getSvgData() {
      let svg = this.properties.svg || ''
      let response = await axios.get(svg + '?bust' + Date.now())

      if (svg && svg.match('git/v')) {
        this.svgData = (response && response.data.content) || ''
      } else {
        this.svgData = (response && response.data) || ''
      }
    }
  },
  mixins: [compBaseMixin],
  computed: {},
  created() {
    if (this.isOld()) {
      this.initold()
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
