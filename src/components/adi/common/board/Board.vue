<script>
import compBaseMixin from '../comp.base.mixin'
import boardProptypes from './board.proptypes'

let isInitEditor = false

const initEditor = (data, callback) => {
  isInitEditor = true

  let mxClientEle = document.querySelector('#mx-client')

  if (!mxClient.isBrowserSupported()) {
    mxClientEle.innerHTML('Browser is not supported!')
  }

  var mxClientHeight = window.innerHeight
  var mxClientWidth = window.innerWidth

  mxClientEle.style.width = mxClientWidth + 'px'
  mxClientEle.style.height = mxClientHeight + 'px'

  mxResources.loadDefaultBundle = false

  var bundle =
    mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
    mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage)

  mxUtils.getAll(
    [bundle, STYLE_PATH + '/default.xml'],
    function(xhr) {
      mxResources.parse(xhr[0].getText())

      let themes = new Object()
      themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement()

      let ui = new Board(
        new Editor(urlParams['chrome'] == '0', themes),
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
  name: 'AdiBoard',
  render(h) {
    return (
      <div id="">
        <div on-click={() => this.showDialog()}>点击此处开始编辑</div>
        <el-dialog {...this.getDialogProps}>
          <div id="mx-client">
            <div
              class="mx-client-close"
              on-click={() => {
                this.closeDialog()
              }}
            >
              关闭
            </div>
          </div>
        </el-dialog>
      </div>
    )
  },
  data() {
    return {
      visible: false,
      data: `<diagram version="0.0.1">1ZbBboMwDIafhjskLWXXsXa77MRh5wwMiRYICmHAnn6hCdCorbTDqAQX7N9OYn+OBB6Oy/5Vkpq+iwy4h/ys9/CLh1CAUKhfozIYJcS+EQrJMpu0CAn7AStOaS3LoHESlRBcsdoVU1FVkCpHI1KKzk3LBXdPrUkBV0KSEn6tfrBMUaNG6LDob8AKOp0chE8m8knSr0KKtrLneQjn52e08dHDsRRCGavsY+AjtwmJaf50JzrXJKFSf1mAzIJvwluYqhmFRg1Tn3qBRqqd544yBUlN0jHS6alqjaqSay/Qpt0KpIL+bjnB3KS+GCBKUHLQKb0728F1u4VvYBvy6QXbyGrEjrSYN15a14bt/jYJ/I8kSFObG5ezHrJ10NxgE62EZrctNLeuzVpo9ttCgx+IJtwWmt0D0Ry2hWa/HhrtLh+7c+zibwEffwE=</diagram>`
    }
  },
  mixins: [compBaseMixin],
  methods: {
    showDialog() {
      this.visible = true
    },
    closeDialog() {
      this.visible = false

      // $('.mxWindow').remove()
    },
    loadBoardEditor() {
      if (!isInitEditor) {
        initEditor(this.data, ui => {
          console.log(ui)
        })
      }
    }
  },
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
            1000
          )
        }
      }

      return { props, on }
    }
  },
  created() {
    let boardScript = document.createElement('script')
    boardScript.setAttribute('src', './static/adi/board/keepwork-board.min.js')

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

    boardProptypes.click = this.showDialog
  }
}
</script>

<style>
.mxWindow {
  z-index: 3000 !important;
}
</style>


<style lang="scss" scoped>
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
