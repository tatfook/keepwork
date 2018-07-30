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
      let board = window.document.querySelector('.board-iframe')

      if (!board) {
        let url = process.env.BOARD

        if (this.cardValue && this.cardValue.xml) {
          url = url + '&initxml=' + this.cardValue.xml
        }

        this.boardSrc = url

        return url
      } else {
        return this.boardSrc
      }
    }
  },
  watch: {
    visible(state) {
      let board = window.document.querySelector('.board-iframe')

      if (state) {
        if (!board) {
          return
        }

        if (!board.contentWindow.keepworkSaveUrl) {
          board.contentWindow.keepworkSaveUrl = {}
        }

        let keepworkSaveUrl = board.contentWindow.keepworkSaveUrl

        if (this.cardValue && this.cardValue.xml) {
          keepworkSaveUrl.xmlUrl = this.cardValue.xml
        }

        if (this.cardValue && this.cardValue.svg) {
          keepworkSaveUrl.svgUrl = this.cardValue.svg
        }

        board.contentWindow.board.keepwork.read()
      } else {
        if (!board) {
          return
        }

        let keepworkSaveUrl = board.contentWindow.keepworkSaveUrl

        if (
          keepworkSaveUrl &&
          keepworkSaveUrl.xmlUrl &&
          keepworkSaveUrl.svgUrl
        ) {
          this.updateValue(keepworkSaveUrl.xmlUrl, 'xml')
          this.updateValue(keepworkSaveUrl.svgUrl, 'svg')
        }

        board.contentWindow.keepworkSaveUrl = {}
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
      this.visible = true
    },
    closeEditor() {
      this.visible = false
    },
    updateValue(newVal, editingKey) {
      var tempChangedDataObj = {}

      tempChangedDataObj[editingKey || this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
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
  background-image: linear-gradient(top, #4d90fe, #4787ed);
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
