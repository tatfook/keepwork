<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapActions, mapGetters } from 'vuex'

let isInitEditor = false

const initEditor = (data, callback) => {
  isInitEditor = true

  let mxClientEle = document.querySelector('#mx-client')

  if (!window.mxClient.isBrowserSupported()) {
    mxClientEle.innerHTML('Browser is not supported!')
  }

  let mxClientHeight = window.innerHeight
  let mxClientWidth = window.innerWidth

  mxClientEle.style.width = mxClientWidth + 'px'
  mxClientEle.style.height = mxClientHeight + 'px'

  window.mxResources.loadDefaultBundle = false

  let bundle =
    window.mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
    window.mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage)

  window.mxUtils.getAll(
    [bundle, window.STYLE_PATH + '/default.xml'],
    function(xhr) {
      window.mxResources.parse(xhr[0].getText())

      let themes = new Object()
      themes[
        window.Graph.prototype.defaultThemeName
      ] = xhr[1].getDocumentElement()

      let ui = new window.Board(
        new window.Editor(urlParams['chrome'] == '0', themes),
        mxClientEle
      )

      if (
        data &&
        data.replace(/[\ \r\n]+/g, '').length > 0 &&
        data.replace(/[\ \r\n]+/g, '') != 'blank'
      ) {
        let doc = ui.editor.graph.getDecompressData(data)

        ui.editor.setGraphXml(doc.documentElement)
      }

      if (typeof callback == 'function') {
        callback(ui)
      }
    },
    function() {
      mxClientEle.innerHTML =
        '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>'
    }
  )
}

export default {
  name: 'BoardType',
  mixins: [protypesBaseMixin],
  render(h) {
    return (
      <div>
        <el-button
          plain
          type="primary"
          size="mini"
          on-click={() => {
            this.openEditor()
          }}
        >
          {this.$t('card.openBoard')}
        </el-button>
        <el-dialog {...this.getDialogProps}>
          <div id="mx-client" />
          <div
            class="mx-client-close"
            on-click={() => {
              this.closeEditor()
            }}
          >
            关闭
          </div>
        </el-dialog>
      </div>
    )
  },
  data() {
    return {}
  },
  computed: {
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    },
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
    },
    visible: {
      get() {
        return this.activePropertyOptions ? this.activePropertyOptions.visible : false
      },
      set(state) {
        this.setActivePropertyOptions({visible: state})
      }
    }
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyOptions: 'setActivePropertyOptions',
      setActivePropertyData: 'setActivePropertyData'
    }),
    ...mapGetters({
      activeProperty: 'activeProperty'
    }),
    loadBoardEditor() {
      if (window.mxClient && !isInitEditor) {
        initEditor(this.inputTypeValue, ui => {
          this.ui = ui
        })
      } else {
        setTimeout(this.loadBoardEditor, 500)
      }
    },
    changeProptyData(changedData) {
      this.setActivePropertyData({
        data: changedData
      })
    },
    openEditor() {
      if (Boolean(window.mxClient)) {
        this.$emit('onChangeValue')
        this.visible = true
      } else {
        setTimeout(this.openEditor, 500)
      }
    },
    closeEditor() {
      if(!this.ui || !this.ui.getCurrentCompressData) {
        return
      }

      this.visible = false
      isInitEditor = false

      let data = this.ui.getCurrentCompressData()

      if (this.activeProperty()) {
        this.changeProptyData({ data })
      }

      let mxWindow = document.querySelectorAll('.mxWindow')

      if (mxWindow) {
        mxWindow.forEach(element => {
          element.parentNode.removeChild(element)
        })
      }

      let mxClientEle = document.querySelector('#mx-client')

      while (mxClientEle.hasChildNodes()) {
        mxClientEle.removeChild(mxClientEle.firstChild)
      }
    },
    updateValue(newVal) {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
    }
  },
  created() {
    //TODO: Rewrite mxGraph to es6 code

    if (!window.mxClient) {
      let boardScript = document.createElement('script')
      boardScript.setAttribute(
        'src',
        './static/adi/board/keepwork-board.min.js'
      )

      let graphEditorCss = document.createElement('link')
      graphEditorCss.setAttribute('rel', 'stylesheet')
      graphEditorCss.setAttribute('type', 'text/css')
      graphEditorCss.setAttribute(
        'href',
        './static/adi/board/assets/styles/grapheditor.css'
      )

      let body = document.querySelector('body')
      body.appendChild(boardScript)
      body.appendChild(graphEditorCss)
    }
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}

.mx-client-close {
  position: absolute;
  right: 0;
  top: 0px;
  z-index: 9999;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  background-color: #4d90fe;
  background-image: linear-gradient(top, #4d90fe, #4787ed);
  border: 1px solid #3079ed;
  color: #fff;
  border-radius: 2px;
  cursor: default;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  margin-right: 16px;
  height: 27px;
  line-height: 27px;
  min-width: 54px;
  outline: 0px;
  width: 90px;
  padding: 0 8px;
  padding: 0 8px;
  cursor: pointer;
}
</style>
