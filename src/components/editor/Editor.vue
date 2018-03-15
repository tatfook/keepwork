<template>
  <el-row :gutter="0" class="full-height" type='flex' @mousemove.native="dragMouseMove" @mouseup.native="dragMouseUp()">
    <el-col id="managerWin" :style='{ width: managerWinWidth + "%" }' class="manager-win">
      <el-button :class='{"el-button--primary": activeComponent=="Search"}' @click="changeView('Search')">搜索</el-button>
      <el-button :class='{"el-button--primary": activeComponent=="ModPropertyManager"}' @click="changeView('ModPropertyManager')">ADI属性</el-button>
      <el-button :class='{"el-button--primary": activeComponent=="ModsList"}' @click="changeView('ModsList')">Mod list</el-button>
      <el-button :class='{"el-button--primary": activeComponent=="FileManager"}' @click="changeView('FileManager')">文件管理</el-button>
      <component :is='activeComponent'></component>
      <!-- <mod-property-manager> </mod-property-manager> -->
    </el-col>
    <div class="editor-resizer" @mousedown="resizeCol($event, 'managerWinWidth', 'previewWinWidth')"></div>
    <el-col id="previewWin" :style='{ width: previewWinWidth + "%" }' class="preview-win">
      <editor-viewport></editor-viewport>
    </el-col>
    <div class="editor-resizer" @mousedown="resizeCol($event, 'previewWinWidth', 'codeWinWidth')"></div>
    <el-col id="codeWin" :style='{ width: codeWinWidth + "%" }' class="code-win">
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
      activeComponent: 'activeComponentType'
    })
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
      this[leftColName] += diffPercent
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
.manager-win {
  background-color: #fff;
}
.preview-win {
  background-color: #fff;
}
.code-win {
  background-color: #fff;
}
.full-height {
  height: 100%;
}
.editor-resizer {
  width: 10px;
  background-color: #343436;
  cursor: col-resize;
}
</style>
