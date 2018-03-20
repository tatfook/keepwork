<template>
  <el-row :gutter="0" type='flex' class="full-height" @mousemove.native="dragMouseMove" @mouseup.native="dragMouseUp()">
    <el-col id="managerWin" :style='{ width: managerWinWidth + "%" }' class="manager-win">
      <el-row class="toolbar">
        <el-button-group>
          <el-button class="btn-file" :class='{"el-button--primary": activeComponent=="FileManager"}' @click="changeView('FileManager')"></el-button>
          <el-button class="btn-bigfile" :class='{"el-button--primary": activeComponent=="ModPropertyManager"}' @click="changeView('ModPropertyManager')"></el-button>
          <el-button class="btn-mods" :class='{"el-button--primary": activeComponent=="ModsList"}' @click="changeView('ModsList')"></el-button>
          <el-button class="btn-search" :class='{"el-button--primary": activeComponent=="Search"}' @click="changeView('Search')"></el-button>
        </el-button-group>
      </el-row>
      <el-row class="manager-content-box">
        <component :is='activeComponent'></component>
      </el-row>
    </el-col>
    <div class="editor-resizer" v-if="showingCol.isManagerShow == true && showingCol.isPreviewShow == true" @mousedown="resizeCol($event, 'managerWinWidth', 'previewWinWidth')"></div>
    <el-col id="previewWin" v-if="showingCol.isPreviewShow == true" :style='{ width: previewWinWidth + "%" }' class="preview-win">
      <el-row class="toolbar">
        <el-button-group>
          <el-button class="btn-computer" title="电脑"></el-button>
          <el-button class="btn-phone" title="手机"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="btn-scale" title="缩小"></el-button>
          <el-button class="btn-enlarge" title="放大"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="btn-adaptive" title="自适应"></el-button>
          <el-button class="btn-newWin" title="新窗口打开"></el-button>
        </el-button-group>
      </el-row>
      <editor-viewport></editor-viewport>
    </el-col>
    <div class="editor-resizer" v-if="showingCol.isPreviewShow == true && showingCol.isCodeShow == true" @mousedown="resizeCol($event, 'previewWinWidth', 'codeWinWidth')"></div>
    <div class="editor-resizer" v-if="showingCol.isManagerShow == true && showingCol.isPreviewShow == false && showingCol.isCodeShow == true" @mousedown="resizeCol($event, 'managerWinWidth', 'codeWinWidth')"></div>
    <el-col id="codeWin" v-if="showingCol.isCodeShow == true" :style='{ width: codeWinWidth + "%" }' class="code-win">
      <el-row class="toolbar">
        <el-button-group>
          <el-button class="btn-H1" title="标题1"></el-button>
          <el-button class="btn-H2" title="标题2"></el-button>
          <el-button class="btn-H3" title="标题3"></el-button>
          <el-button class="btn-bold" title="加粗"></el-button>
          <el-button class="btn-italic" title="斜体"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="btn-listul" title="无序列表"></el-button>
          <el-button class="btn-listol" title="有序列表"></el-button>
          <el-button class="btn-blockqote" title="引用内容"></el-button>
          <el-button class="btn-table" title="表格"></el-button>
          <el-button class="btn-horizontal-line" title="水平分割线"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button class="btn-code" title="代码"></el-button>
          <el-button class="btn-link" title="链接"></el-button>
        </el-button-group>
      </el-row>
      <editor-markdown/>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import EditorMarkdown from './EditorMarkdown'
import EditorViewport from './EditorViewport'
import ModPropertyManager from './ModPropertyManager'
import FileManager from './FileManager'
import ModsList from './ModsList'
import Search from './Search'
import { mapGetters } from 'vuex'

export default {
  name: 'Editor',
  data() {
    return {
      bodyWidth: document.body.clientWidth,
      managerWinWidth: 25,
      previewWinWidth: 37.5,
      codeWinWidth: 37.5,
      resizeWinParams: {
        mouseStartX: 0,
        isResizing: false,
        leftColWidthParam: '',
        rightColWidthParam: ''
      }
    }
  },
  created() {
    this.changeView('Search')
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
    EditorViewport,
    ModPropertyManager,
    Search,
    ModsList,
    FileManager
  },
  computed: {
    ...mapGetters({
      activeComponent: 'activeComponentType',
      showingCol: 'showingCol'
    })
  },
  watch: {
    'showingCol.isPreviewShow': {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }
        if (newVal === false) {
          this.previewWinWidth = 0
          this.codeWinWidth = 100 - this.managerWinWidth
        }else if (this.showingCol.isCodeShow === false) {
          this.previewWinWidth = 100 - this.managerWinWidth
        }else {
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
          return;
        }
        if (newVal === false) {
          this.codeWinWidth = 0
          this.previewWinWidth = 100 - this.managerWinWidth
        }else if (this.showingCol.isPreviewShow === false) {
          this.codeWinWidth = 100 - this.managerWinWidth
        }else{
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
          return;
        }
        if (newVal === false) {
          this.managerWinWidth = 0
          this.previewWinWidth = 100 - this.codeWinWidth
        }else{
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
    changeView(type) {
      this.$store.dispatch('setActiveWinType', type)
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
    dragMouseUp() {
      this.resizeWinParams.isResizing = false
      this.resizeWinParams.leftColWidthParam = ''
      this.resizeWinParams.rightColWidthParam = ''
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
}
.manager-content-box {
  flex: 1;
  background-color: #fff;
}
.editor-resizer {
  width: 17px;
  background-color: #cdd4db;
  cursor: col-resize;
}
.editor-resizer:hover {
  background-color: #d9eafb;
}
.manager-win .el-button,
.code-win .el-button {
  width: 50px;
  height: 40px;
}
.manager-win .el-button-group .el-button--primary {
  border-color: #409eff;
}
.toolbar {
  background-color: #fff;
  padding: 9px 15px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
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
</style>
<style lang="scss" scoped>
$spriteUrl: '../../assets/img/editor_sprites.png';

.btn-file {
  background: url($spriteUrl) 13px 6px no-repeat;
}
.btn-bigfile {
  background: url($spriteUrl) -37px 6px no-repeat;
}
.btn-mods {
  background: url($spriteUrl) -88px 6px no-repeat;
}
.btn-search {
  background: url($spriteUrl) -140px 6px no-repeat;
}
.btn-computer {
  width: 49px;
  height: 40px;
  background: url($spriteUrl) -394px 6px no-repeat;
}
.btn-phone {
  width: 50px;
  height: 40px;
  background: url($spriteUrl) -444px 6px no-repeat;
}
.btn-scale {
  width: 50px;
  height: 40px;
  background: url($spriteUrl) -496px 6px no-repeat;
}
.btn-enlarge {
  width: 50px;
  height: 40px;
  background: url($spriteUrl) -546px 6px no-repeat;
}
.btn-adaptive {
  width: 45px;
  height: 40px;
  background: url($spriteUrl) -600px 6px no-repeat;
}
.btn-newWin {
  width: 45px;
  height: 40px;
  background: url($spriteUrl) -652px 6px no-repeat;
}
.btn-H1 {
  background: url($spriteUrl) -698px 6px no-repeat;
}
.btn-H2 {
  background: url($spriteUrl) -748px 6px no-repeat;
}
.btn-H3 {
  background: url($spriteUrl) -802px 6px no-repeat;
}
.btn-bold {
  background: url($spriteUrl) -851px 6px no-repeat;
}
.btn-italic {
  background: url($spriteUrl) -902px 6px no-repeat;
}
.btn-listul {
  background: url($spriteUrl) -954px 6px no-repeat;
}
.btn-listol {
  background: url($spriteUrl) -1004px 6px no-repeat;
}
.btn-blockqote {
  background: url($spriteUrl) -1054px 6px no-repeat;
}
.btn-table {
  background: url($spriteUrl) -1106px 6px no-repeat;
}
.btn-horizontal-line {
  background: url($spriteUrl) -1158px 6px no-repeat;
}
.btn-code {
  background: url($spriteUrl) -1208px 6px no-repeat;
}
.btn-link {
  background: url($spriteUrl) -1258px 6px no-repeat;
}
</style>
