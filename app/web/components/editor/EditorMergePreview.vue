<template>
  <el-dialog :visible="true" @close="onClose" custom-class="merge-preview-dialog">
    <div class="merge-operation">
      <span v-if="isEn" class="merge-operation-tips">
        {{ updateUsername }} updated the content at {{updateAt}},<span class="tips-highlight"> please <span class="tips-normal">⇜</span> merge and save it first.</span>
      </span>
      <span v-else class="merge-operation-tips">
        {{ updateUsername }}于{{updateAt}}更新了内容， <span class="tips-highlight"> 点击合并<span class="tips-normal"> ⇜ </span> 按钮再保存</span>
      </span>
      <span class="diff-position-icon" @click="onGoPrevDiff">
        <el-tooltip :content="$t('editor.prevDiff')">
          <i class="el-icon-caret-top"></i>
        </el-tooltip>
      </span>
      <span class="diff-position-icon" @click="onGoNextDiff">
        <el-tooltip :content="$t('editor.nextDiff')">
          <i class="el-icon-caret-bottom"></i>
        </el-tooltip>
      </span>
      <span class="need-refresh-code" v-if="isNeedRefresh">
        <el-tooltip :content="$t('editor.needRefresh')">
          <el-button @click="onRefresh" size="mini" type="warning" plain>{{$t('editor.updated')}}</el-button>
        </el-tooltip>
      </span>
      <span class="merge-operation-save">
        <el-tooltip :content="$t('editor.save')">
          <span v-loading='savePending' class='iconfont icon-save' @click='onUpdate'></span>
        </el-tooltip>
      </span>
    </div>
    <div class="merge-pane">
      <span class="merge-pane-left">
        {{$t('editor.yourVersion')}}
      </span>
      <span class="merge-pane-center"></span>
      <span class="merge-pane-right">
        {{$t('editor.userVersion', { username: updateUsername})}}
      </span>
    </div>
    <code-mirror v-if="initSuccess" :merge="true" ref="mergePreview" :options="cmOption"></code-mirror>
  </el-dialog>
</template>

<script>
import { codemirror as CodeMirror } from 'vue-codemirror'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import DiffMatchPatch from 'diff-match-patch'
import { locale } from '@/lib/utils/i18n'
import _ from 'lodash'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/addon/selection/active-line.js'
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0
export default {
  name: 'EditorMergePreview',
  components: {
    CodeMirror
  },
  data() {
    return {
      cmOption: {
        value: '',
        origLeft: null,
        orig: '',
        connect: 'align',
        lineNumbers: true,
        collapseIdentical: false,
        highlightDifferences: true,
        mode: 'markdown',
        theme: 'default',
        line: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
        styleActiveLine: true,
        foldGutter: true
      },
      initSuccess: false,
      savePending: false,
      isNeedRefresh: false
    }
  },
  mounted() {
    this.initMergePreview()
  },
  watch: {
    latestContent(newValue, oldValue) {
      this.checkNeedRefresh(newValue, oldValue)
    }
  },
  computed: {
    ...mapGetters({
      activePageLatestVersion: 'activePageLatestVersion',
      code: 'code'
    }),
    isEn() {
      return locale === 'en-US'
    },
    latestContent() {
      return this.activePageLatestVersion.content
    },
    updateUsername() {
      return _.get(this.activePageLatestVersion, 'commit.author_name')
    },
    updateAt() {
      const updateAt = _.get(
        this.activePageLatestVersion,
        'commit.createdAt',
        ''
      )
      return moment(updateAt).format('YYYY-MM-DD H:mm')
    }
  },
  methods: {
    ...mapActions({
      saveMergedPage: 'saveMergedPage'
    }),
    initMergePreview() {
      this.cmOption.value = this.code
      this.cmOption.orig = this.latestContent
      this.initSuccess = true
    },
    onClose() {
      this.$emit('close')
    },
    async onUpdate() {
      this.savePending = true
      const content = this.$refs.mergePreview.codemirror.edit.getValue()
      await this.saveMergedPage({ content })
      this.savePending = false
      this.onClose()
    },
    onGoNextDiff() {
      this.$refs.mergePreview.codemirror.edit.execCommand('goNextDiff')
    },
    onGoPrevDiff() {
     this.$refs.mergePreview.codemirror.edit.execCommand('goPrevDiff')
    },
    onRefresh() {
      this.initSuccess = false
      this.cmOption = {
        ...this.cmOption,
        value: this.$refs.mergePreview.codemirror.edit.getValue(),
        orig: this.latestContent
      }
      this.isNeedRefresh = false
      this.$nextTick(() => (this.initSuccess = true))
    },
    checkNeedRefresh(newValue, oldValue) {
      if (this.cmOption.orig !== newValue) {
        this.isNeedRefresh = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog.merge-preview-dialog {
  width: 1300px;
  max-width: 80vw;
  .el-dialog__headerbtn {
    font-size: 26px;
  }
  .merge-operation {
    height: 55px;
    line-height: 55px;
    padding:0 50px 0 10px;
    user-select: none;
    &-tips {
      font-size: 16px;
      .tips-highlight {
        color: #409eff;
      }
      .tips-normal {
        color: #606266;
      }
    }
    .diff-position-icon {
      $size: 22px;
      cursor: pointer;
      display: inline-block;
      width: $size;
      height: $size;
      text-align: center;
      line-height: $size;
      border: 1px solid #606266;
      background: #f2f6fc;
      border-radius: 3px;
      color: #606266;
      margin-left: 5px;
    }
    .need-refresh-code {
      margin-left: 20px;
    }
    &-save {
      float: right;
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 50%;
      text-align: center;
      background: #f7bc2a;
      border: 1px solid #f7bc2a;
      color: white;
      cursor: pointer;
      .iconfont {
        font-size: 21px;
      }
    }
  }
  .merge-pane {
    background: #f8f8f8;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #409eff;
    border: 1px solid #ddd;
    border-bottom: none;
    &-left {
      display: inline-block;
      box-sizing: border-box;
      width: 47%;
      border-right: 1px solid #ddd;
      padding-left: 30px;
    }

    &-center {
      display: inline-block;
      width: 5%;
    }
    &-right {
      border-left: 1px solid #ddd;
      display: inline-block;
      padding-left: 30px;
    }
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 10px;
  }
}
/deep/.merge-preview-dialog {
  $height: 750px;
  $max-height: 55vh;
  height: 950px;
  max-height: 70vh;
  .CodeMirror-merge-pane.CodeMirror-merge-editor {
    height: $height;
    max-height: $max-height;
  }
  .CodeMirror-merge,
  .CodeMirror-merge .CodeMirror {
    height: $height;
    max-height: $max-height;
  }
}
</style>


