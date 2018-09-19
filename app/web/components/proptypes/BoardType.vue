<script>
import protypesBaseMixin from './protypes.base.mixin'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'BoardType',
  mixins: [protypesBaseMixin],
  prop: {
    originValue: String
  },
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
        <el-dialog class="board-dialog" {...this.getDialogProps}>
          <iframe class="board-iframe" src={this.getBoardSrc} />
          <div
            class="mx-client-close"
            on-click={() => {
              this.closeEditor()
            }}
          >
            {this.$t('editor.close')}
          </div>
        </el-dialog>
      </div>
    )
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    }),
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    },
    getDialogProps() {
      let props = {
        visible: this.visible,
        fullscreen: true,
        showClose: false
      }

      let on = {
        'update:visible': v => {
          this.visible = v
        },
        open: () => {}
      }

      return { props, on }
    },
    visible: {
      get() {
        return this.activePropertyOptions
          ? this.activePropertyOptions.visible
          : false
      },
      set(state) {
        this.setActivePropertyOptions({ visible: state })
      }
    },
    getBoardSrc() {
      return process.env.BOARD || ''
    }
  },
  watch: {
    visible(state) {
      if (state) {
        this.setContentWindowData()
      } else {
        let board = this.getBoard()

        if (!board) {
          return
        }

        let boardWindow = board.contentWindow
        let keepworkSaveUrl = boardWindow.keepworkSaveUrl

        if (
          keepworkSaveUrl &&
          keepworkSaveUrl.xmlUrl &&
          keepworkSaveUrl.svgUrl
        ) {
          this.updateValue(keepworkSaveUrl.xmlUrl, 'xml')
          this.updateValue(keepworkSaveUrl.svgUrl, 'svg')
        }

        boardWindow.keepworkSaveUrl = {}
        boardWindow.boardOldData = ''
        boardWindow.pagePath = ''
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
    changeProptyData(changedData) {
      this.setActivePropertyData({
        data: changedData
      })
    },
    openEditor() {
      if (this.IEVersion() > 0) {
        console.error(this.$t('common.canNotUseIE'))
        return false
      }

      this.visible = true
    },
    IEVersion() {
      let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      let isIE =
        userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      // let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
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
    },
    closeEditor() {
      let board = this.getBoard()

      if (!board) {
        return false
      }

      let boardWindow = board.contentWindow

      if (!boardWindow.board || !boardWindow.board.currentFile) {
        return false
      }

      if (
        boardWindow.board.currentFile.modified ||
        boardWindow.board.currentFile.savingFile
      ) {
        console.error(this.$t('adi.board.saving'))
        return false
      }

      boardWindow.board.currentFile.close(true)

      this.visible = false
    },
    updateValue(newVal, editingKey) {
      let tempChangedDataObj = {}

      tempChangedDataObj[editingKey || this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
    },
    getBoard() {
      return window.document.querySelector('.board-iframe')
    },
    setContentWindowData() {
      let self = this
      // pick file
      function pickFile(boardWindow) {
        if (
          boardWindow &&
          boardWindow.board &&
          boardWindow.board.pickFile
        ) {
          boardWindow.board.pickFile(boardWindow.App.MODE_KEEPWORK)
        } else {
          setTimeout(pickFile(boardWindow), 500)
        }
      }

      function setdata() {
        let board = self.getBoard()

        if (board) {
          let boardWindow = board.contentWindow

          // set save url
          if (!boardWindow.keepworkSaveUrl) {
            boardWindow.keepworkSaveUrl = {}
          }

          if (self.cardValue && self.cardValue.xml) {
            boardWindow.keepworkSaveUrl.xmlUrl = self.cardValue.xml
          }

          if (self.cardValue && self.cardValue.svg) {
            boardWindow.keepworkSaveUrl.svgUrl = self.cardValue.svg
          }

          boardWindow.boardType = {}
          boardWindow.boardType.close = () => {
            self.visible = false
          }

          // set site page path
          let activePageInfo = self.activePageInfo
          boardWindow.pagePath =
            activePageInfo.sitename + '/' + activePageInfo.bareRelativePath

          // set old data
          if (self.cardValue.data) {
            boardWindow.boardOldData = self.cardValue.data
          } else {
            boardWindow.boardOldData = ''
          }

          pickFile(boardWindow)
        } else {
          setTimeout(setdata, 500)
        }
      }

      setdata()
    }
  }
}
</script>
<style lang="scss">
.board-dialog {
  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    height: 100%;
    padding: 0px;
    overflow: hidden;
  }
}
</style>

<style scoped>
.el-button {
  font-size: 16px;
}

.board-iframe {
  width: 100%;
  height: 100%;
  border: none;
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
  /* background-image: linear-gradient(top, #4d90fe, #4787ed); */
  border: 1px solid #3079ed;
  color: #fff;
  border-radius: 2px;
  cursor: default;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  margin-right: 55px;
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
