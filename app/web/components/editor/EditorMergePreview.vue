<template>
  <div class="merge-preview-container">
    <div class="merge-preview-header">
      <div class="merge-operation">
        <el-button @click="goPrevDiff">上一个</el-button>
        <el-button @click="goNextDiff">下一个</el-button>
      </div>
      <div class="merge-info">
        {{ updateUsername}}
        {{ updateAt}}
      </div>
    </div>
    <code-mirror v-if="initSuccess" :merge="true" ref="mergePreview" :options="cmOption"></code-mirror>
  </div>
</template>

<script>
import { codemirror as CodeMirror } from 'vue-codemirror'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import DiffMatchPatch from 'diff-match-patch'
import _ from 'lodash'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/3024-night.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/fold/foldgutter.css'
// import 'codemirror/addon/fold/foldcode.js'
// import 'codemirror/addon/fold/foldgutter.js'
// import 'codemirror/addon/fold/xml-fold'
// import 'codemirror/addon/fold/markdown-fold'
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
      initSuccess: false
    }
  },
  mounted() {
    this.initMergePreview()
  },
  computed: {
    ...mapGetters({
      activePageLatestVersion: 'activePageLatestVersion',
      code: 'code'
    }),
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
      return moment(updateAt).format('YYYY H:mm')
    },
    mergePreview() {
      return this.$refs.mergePreview
    }
  },
  methods: {
    initMergePreview() {
      this.cmOption.value = this.latestContent
      this.cmOption.orig = this.code
      this.initSuccess = true
    },
    goNextDiff() {
      console.dir(this.mergePreview)
      console.log(this.mergePreview.execCommand)
      this.mergePreview.commands.goNextDiff()
    },
    goPrevDiff() {
      this.mergePreview.commands.goNextDiff()
    }
  }
}
</script>

<style lang="scss" >
.merge-preview-container {
  $height: 750px;
  $max-height: 60vh;
  height: 950px;
  max-height: 65vh;
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


