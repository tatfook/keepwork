<template>
  <div class="file-history">
    <div class="file-history-sidebar">
      <div class="file-history-sidebar-header">
        <i class="iconfont icon-historyrecord"></i>
        <span class="file-history-sidebar-header-title">历史记录</span>
      </div>
      <history-list @selectHistory="getFileContentByCommitId"></history-list>
    </div>
    <div class="file-history-main" v-loading="isLoading">
      <div class="file-history-header">
        <span class="file-history-header-version">{{activeVersion}}</span>
        <div class="file-history-main-operations">
          <el-tooltip content="恢复到此版本">
            <i class="iconfont icon-ziyuan1" @click="recoverVersion"></i>
          </el-tooltip>
          <div class='file-history-header-switch'>
            <el-tooltip :content="$t('tips.ShowPreviewOnly')">
              <span class="iconfont icon-preview1" :class='{"file-history-header-switch-active": isPreviewShow && !isCodeShow}' @click="switchViewShow(true, false)"></span>
            </el-tooltip>
            <el-tooltip :content="$t('tips.ShowBoth')">
              <span class="iconfont icon-both" :class='{"file-history-header-switch-active": isPreviewShow && isCodeShow}' @click="switchViewShow(true, true)"></span>
            </el-tooltip>
            <el-tooltip :content="$t('tips.ShowCodeOnly')">
              <span class="iconfont icon-code1" :class='{"file-history-header-switch-active": !isPreviewShow && isCodeShow}' @click="switchViewShow(false, true)"></span>
            </el-tooltip>
          </div>
          <el-tooltip content="关闭">
            <i class="iconfont icon-ziyuan3" @click="closeHistory"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="file-history-main-col-between" v-if="isPreviewShow"></div>
      <div class="file-history-main-preview" v-if="isPreviewShow">
        <md-viewer :content="activeCommitIdContent"></md-viewer>
      </div>
      <div class="file-history-main-col-between" v-if="isCodeShow"></div>
      <div class="file-history-main-raw" v-if="isCodeShow">
        <codemirror ref='mdEditor' :options='options' :value='activeCommitIdContent' />
      </div>
    </div>
  </div>
</template>
<script>
import MdViewer from '@/components/viewer/MdViewer'
import HistoryList from './HistoryList'
import { codemirror } from 'vue-codemirror'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FileHistory',
  data() {
    return {
      isLoading: false,
      activeCommitId: undefined,
      activeVersion: undefined,
      isPreviewShow: true,
      isCodeShow: true,
      options: {
        mode: 'markdown',
        theme: 'default',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
        styleActiveLine: true,
        foldGutter: true,
        matchBrackets: true
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      getFileCommitContent: 'gitlab/getFileCommitContent'
    }),
    activeBarePath() {
      return _.get(this.activePageInfo, 'barePath')
    },
    activeFullPath() {
      return _.get(this.activePageInfo, 'fullPath')
    },
    activeCommitIdContent() {
      return this.getFileCommitContent({
        path: this.activeBarePath,
        commitId: this.activeCommitId
      })
    }
  },
  methods: {
    ...mapActions({
      closeOpenedFile: 'closeOpenedFile',
      gitlabReadFileForOwnerWithCommitId: 'gitlab/readFileForOwnerWithCommitId',
      gitlabSaveFile: 'gitlab/saveFile',
      toggleFileHistoryVisibility: 'toggleFileHistoryVisibility'
    }),
    switchViewShow(isPreviewShow, isCodeShow) {
      this.isPreviewShow = isPreviewShow
      this.isCodeShow = isCodeShow
    },
    closeHistory() {
      this.toggleFileHistoryVisibility({ isVisible: false })
    },
    async getFileContentByCommitId({ commitId, version }) {
      this.activeCommitId = commitId
      this.activeVersion = version
      this.isLoading = true
      await this.gitlabReadFileForOwnerWithCommitId({
        path: this.activeFullPath,
        barePath: this.activeBarePath,
        commitId
      }).catch()
      this.isLoading = false
    },
    async recoverVersion() {
      this.isLoading = true
      await this.gitlabSaveFile({
        path: this.activeFullPath,
        content: this.activeCommitIdContent,
        source_version: this.activeVersion
      })
        .then(async () => {
          this.closeOpenedFile({ path: this.activeFullPath })
          window.location.reload()
        })
        .catch()
      this.isLoading = false
      this.closeHistory()
    }
  },
  components: {
    HistoryList,
    MdViewer,
    codemirror
  }
}
</script>
<style lang="scss">
.file-history {
  display: flex;
  &-sidebar {
    width: 318px;
    position: relative;
    padding-top: 60px;
    &-header {
      height: 59px;
      line-height: 59px;
      border-bottom: 1px solid #eaecef;
      padding: 0 20px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }
  &-main {
    flex: 1;
    display: flex;
    position: relative;
    padding-top: 72px;
    background-color: #cdd4db;
    &-col-between {
      width: 15px;
      background-color: #cdd4db;
    }
    &-preview,
    &-raw {
      flex: 1;
      background-color: #fff;
    }
    .iconfont {
      cursor: pointer;
    }
    .vue-codemirror,
    .CodeMirror-wrap {
      height: 100%;
    }
  }
  &-header {
    padding: 0 18px;
    background-color: #fff;
    height: 60px;
    line-height: 60px;
    position: absolute;
    top: 0;
    left: 15px;
    right: 0;
    display: flex;
    &-version {
      flex: 1;
    }
    &-switch {
      display: inline-flex;
      align-items: center;
      margin: 0 16px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      border-bottom: none;
      background-color: #efefef;
      .iconfont {
        width: 60px;
        height: 32px;
        line-height: 32px;
        text-align: center;
      }
      &-active {
        background-color: #1278e1;
        color: #fff;
        border-radius: 16px;
      }
    }
    .icon-ziyuan1 {
      font-size: 20px;
      vertical-align: middle;
    }
    .icon-ziyuan1,
    .icon-ziyuan3 {
      &:hover {
        color: #288ce9;
      }
    }
  }
}
</style>
