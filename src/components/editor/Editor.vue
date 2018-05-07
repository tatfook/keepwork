<template>
  <el-row :gutter="0" type='flex' class="full-height" @mousemove.native="dragMouseMove" @mouseup.native="dragMouseUp">
    <el-col id="managerWin" class="manager-win">
      <el-row class="toolbar">
        <el-button-group>
          <el-button class="iconfont icon-mulu" :class='{"el-button--primary": activeComponent=="FileManager"}' @click="changeView('FileManager')"></el-button>
          <!-- <el-button class="btn-bigfile" :class='{"el-button--primary": activeComponent=="ModPropertyManager"}' @click="changeView('ModPropertyManager')"></el-button> -->
          <el-button v-if='activePage' class="iconfont icon-tianjiamokuai" :class='{"el-button--primary": activeComponent=="ModsList"}' @click="changeView('ModsList')"></el-button>
          <!-- <el-button class="btn-search" :class='{"el-button--primary": activeComponent=="Search"}' @click="changeView('Search')"></el-button> -->
        </el-button-group>
      </el-row>
      <el-row class="manager-content-box">
        <component :is='activeComponent'></component>
      </el-row>
    </el-col>
    <div class="col-between"></div>
    <el-col id="previewWin" v-show="showingCol.isPreviewShow == true && !isWelcomeShow" :style='{ width: previewWinWidth + "%" }' class="preview-win">
      <el-row class="toolbar">
        <!-- <el-button-group>
          <el-button class="iconfont icon-diannaomoshi" title="电脑"></el-button>
          <el-button class="iconfont icon-shoujimoshi" title="手机"></el-button>
        </el-button-group> -->
        <!-- <el-button-group>
          <el-button class="btn-scale" title="缩小"></el-button>
          <el-button class="btn-enlarge" title="放大"></el-button>
        </el-button-group> -->
        <el-button-group>
          <!-- <el-button class="btn-adaptive" title="自适应"></el-button> -->
          <!-- <el-button class="iconfont icon-xinchuangkouyulan" title="新窗口打开" @click='showPreview'></el-button> -->
          <el-button class="iconfont icon-xinchuangkouyulan" :title="$t('editor.newWindowOpen')" @click='showPage'></el-button>
        </el-button-group>
        <div class="code-win-swich">
          <span>{{$t('editor.showCode')}}</span>
          <el-switch v-model="isCodeWinShow" @change='toggleCodeWin'>
          </el-switch>
        </div>
      </el-row>
      <iframe id="frameViewport" src="viewport.html" style="height: 100%; width: 100%; background: #fff" />
      <div class='mouse-event-backup' v-show="resizeWinParams.isResizing"></div>
      <!-- <editor-viewport></editor-viewport> -->
    </el-col>
    <div class="col-between editor-resizer" v-if="!isWelcomeShow && showingCol.isPreviewShow == true && showingCol.isCodeShow == true" @mousedown="resizeCol($event, 'previewWinWidth', 'codeWinWidth')"></div>
    <el-col id="codeWin" v-if="!isWelcomeShow && showingCol.isCodeShow == true" :style='{ width: codeWinWidth + "%" }' class="code-win">
      <el-row class="toolbar">
        <el-button-group>
          <el-button :title='isFullscreen ? $t("editor.exitFullScreen") : $t("editor.fullScreen")' :icon="fullscreenIcon" circle @click="toggleFullscreen"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="iconfont icon-H" :title="$t('editor.title') + '1'" @click="insertHeadline(1)"></el-button>
          <el-button class="iconfont icon-h1" :title="$t('editor.title') + '2'" @click="insertHeadline(2)"></el-button>
          <el-button class="iconfont icon-zihyuan" :title="$t('editor.title') + '3'" @click="insertHeadline(3)"></el-button>
          <el-button class="iconfont icon-jiacu" :title="$t('editor.bold')" @click="setFontStyle('bold')"></el-button>
          <el-button class="iconfont icon-qingxie" :title="$t('editor.italic')" @click="setFontStyle('italic')"></el-button>
        </el-button-group>
        <el-button-group>
          <!-- <el-button class="iconfont icon-xuliebiao" title="无序列表"></el-button>
          <el-button class="iconfont icon-xulie" title="有序列表"></el-button>
          <el-button class="iconfont icon-yinyong" title="引用内容"></el-button> -->
          <!-- <el-button class="iconfont icon-biaoge" title="表格"></el-button> -->
          <el-button class="iconfont icon-ziyuanfengexian" :title="$t('editor.horizontalDiv')" @click="insertLine"></el-button>
          <el-button class="iconfont icon-daima" :title="$t('editor.code')" @click="insertCode"></el-button>
          <el-button class="iconfont icon-fenxianglianjie" :title="$t('editor.link')" @click="insertLink"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="iconfont icon-tianjiamokuai" title="MOD" @click="addModToMarkdown"></el-button>
        </el-button-group>
      </el-row>
      <editor-markdown ref='codemirror' />
    </el-col>
    <el-col v-if="isWelcomeShow" class="guid-col">
      <editorWelcome />
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import { gConst } from '@/lib/global'
import fullscreen from 'vue-fullscreen'
import EditorMarkdown from './EditorMarkdown'
import EditorWelcome from './EditorWelcome'
import ModPropertyManager from './ModPropertyManager'
import FileManager from './FileManager'
import ModsList from './ModsList'
import Search from './Search'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Editor',
  data() {
    return {
      bodyWidth: document.body.clientWidth,
      managerWinWidth: 0,
      previewWinWidth: 50,
      codeWinWidth: 50,
      resizeWinParams: {
        mouseStartX: 0,
        isResizing: false,
        leftColWidthParam: '',
        rightColWidthParam: ''
      },
      isCodeWinShow: true,
      isFullscreen: false,
      gConst
    }
  },
  created() {
    this.changeView('FileManager')
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', function(e) {
        _.throttle(function() {
          this.bodyWidth = document.body.clientWidth
        }, 1000)
      })
    })
  },
  components: {
    EditorMarkdown,
    EditorWelcome,
    ModPropertyManager,
    Search,
    ModsList,
    FileManager
  },
  computed: {
    ...mapGetters({
      activePage: 'activePage',
      activePageUrl: 'activePageUrl',
      personalSiteList: 'user/personalSiteList',
      activeComponent: 'activeComponentType',
      showingCol: 'showingCol',
      activePageInfo: 'activePageInfo'
    }),
    isWelcomeShow() {
      return this.personalSiteList.length <= 0 || !this.activePageInfo.sitename
    },
    fullscreenIcon() {
      return this.isFullscreen
        ? 'iconfont icon-tuichuquanping'
        : 'iconfont icon-quanping1'
    }
  },
  watch: {
    'showingCol.isPreviewShow': {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        if (newVal === false) {
          this.previewWinWidth = 0
          this.codeWinWidth = 100 - this.managerWinWidth
        } else if (this.showingCol.isCodeShow === false) {
          this.previewWinWidth = 100 - this.managerWinWidth
        } else {
          var halfWidth = (100 - this.managerWinWidth) / 2
          this.previewWinWidth = halfWidth
          this.codeWinWidth = halfWidth
        }
      },
      deep: true
    },
    'showingCol.isCodeShow': {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        if (newVal === false) {
          this.codeWinWidth = 0
          this.previewWinWidth = 100 - this.managerWinWidth
        } else if (this.showingCol.isPreviewShow === false) {
          this.codeWinWidth = 100 - this.managerWinWidth
        } else {
          var halfWidth = (100 - this.managerWinWidth) / 2
          this.previewWinWidth = halfWidth
          this.codeWinWidth = halfWidth
        }
      },
      deep: true
    },
    'showingCol.isManagerShow': {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        if (newVal === false) {
          this.managerWinWidth = 0
          this.previewWinWidth = 100 - this.codeWinWidth
        } else {
          var halfWidth = (100 - this.codeWinWidth) / 2
          var minusWidth = halfWidth > 25 ? 25 : halfWidth
          this.managerWinWidth = minusWidth
          this.previewWinWidth = halfWidth - minusWidth
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      resetShowingCol: 'resetShowingCol'
    }),
    changeView(type) {
      this.$store.dispatch('setActiveWinType', type)
    },
    toggleCodeWin(isCodeWinShow) {
      if (isCodeWinShow) {
        this.resetShowingCol({
          isCodeShow: true,
          isPreviewShow: true
        })
        this.$store.dispatch('setAddingArea', {
          area: this.gConst.ADDING_AREA_ADI
        })
      } else {
        this.resetShowingCol({
          isCodeShow: false,
          isPreviewShow: true
        })
      }
    },
    toggleFullscreen() {
      this.$fullscreen.toggle(this.$el.querySelector('#codeWin'), {
        wrap: false,
        fullscreenClass: 'code-win-fullscreen',
        callback: this.fullscreenChange
      })
    },
    fullscreenChange(fullscreen) {
      this.isFullscreen = fullscreen
    },
    resizeCol(event, leftColWidthParam, rightColWidthParam) {
      if (!(event && event.clientX)) {
        return
      }
      this.resizeWinParams.isResizing = true
      this.resizeWinParams.mouseStartX = event.clientX
      this.resizeWinParams.leftColWidthParam = leftColWidthParam
      this.resizeWinParams.rightColWidthParam = rightColWidthParam
    },
    dragMouseMove(event) {
      if (!(this.resizeWinParams.isResizing && event && event.clientX)) {
        return
      }
      var mouseNowX = event.clientX
      var diffClientX = mouseNowX - this.resizeWinParams.mouseStartX
      var diffPercent = diffClientX / this.bodyWidth * 100
      this.resizeWinParams.mouseStartX = mouseNowX
      var leftColName = this.resizeWinParams.leftColWidthParam
      var rightColName = this.resizeWinParams.rightColWidthParam
      this[leftColName] = this[leftColName] + diffPercent
      this[rightColName] -= diffPercent
    },
    // showPreview() {
    //   this.$emit('showPreview')
    // },
    showPage() {
      window.open(this.activePageUrl)
    },
    dragMouseUp() {
      this.resizeWinParams.isResizing = false
      this.resizeWinParams.leftColWidthParam = ''
      this.resizeWinParams.rightColWidthParam = ''
    },
    setFontStyle(style) {
      this.$refs.codemirror.setFontStyle(style)
    },
    insertHeadline(level) {
      this.$refs.codemirror.insertHeadline(level)
    },
    insertCode() {
      this.$refs.codemirror.insertCode()
    },
    insertLine() {
      this.$refs.codemirror.insertLine()
    },
    insertLink() {
      this.$refs.codemirror.insertLink()
    },
    insertImage() {
      this.$refs.codemirror.insertFile()
    },
    addModToMarkdown() {
      this.$refs.codemirror.addMod()
    }
  }
}
</script>

<style scoped>
.full-height {
  height: 100%;
}
.manager-win,
.preview-win,
.code-win {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.manager-win {
  flex-basis: 460px;
  flex-shrink: 0;
}
.manager-content-box {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
}
.col-between {
  flex-basis: 17px;
  flex-shrink: 0;
  background-color: #cdd4db;
}
.editor-resizer {
  cursor: col-resize;
}
.editor-resizer:hover {
  background-color: #d9eafb;
}
#frameViewport {
  border: none;
}
.previewWin {
  position: relative;
}
.mouse-event-backup {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 122;
}

.manager-win .el-button,
.code-win .el-button {
  width: 50px;
  height: 40px;
}
.code-win .el-button.is-circle {
  width: 40px;
  border-radius: 50%;
  padding: 0;
}
.code-win .is-circle .iconfont {
  font-size: 18px;
}
.manager-win .el-button-group .el-button--primary {
  border-color: #409eff;
}
.toolbar {
  background-color: #fff;
  padding: 9px 20px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  flex-shrink: 0;
}
.toolbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #f5f5f5;
}
.toolbar::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: #f5f5f5;
}
.toolbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.iconfont {
  padding: 0;
  width: 50px;
  height: 40px;
  font-size: 27px;
}
.code-win .iconfont {
  font-size: 16px;
}
.guid-col {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #48a3ff;
}
.guid-col h1 {
  margin: 0 0 36px 0;
  font-size: 46px;
}
.code-win-swich {
  position: absolute;
  right: 15px;
  top: 18px;
  font-size: 12px;
}
.code-win-swich > span {
  vertical-align: middle;
}
.code-win-fullscreen {
  width: 100% !important;
  height: 100%;
  background-color: #cdd4dc;
  max-width: 1080px;
}
</style>
