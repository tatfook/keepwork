<template>
  <span class='joined-tree-node el-tree-node__label' v-loading="deletePending">
    <span class="node-icon">
      <i class="iconfont icon-edited_file" :class="{'is-modified': data.isModified}"></i>
    </span>
    <span class=''>{{ node.label }}</span>
    <span class="file-manager-buttons-container">
      <el-tooltip :content="$t('editor.save')">
        <el-button v-loading='data.savePending' class="iconfont icon-save edit-hover" size="mini" type="text"></el-button>
      </el-tooltip>
      <el-tooltip :content="$t('editor.reload')">
        <el-button class="iconfont icon-refresh edit-hover" size="mini" type="text" @click.stop='confirmRefresh'></el-button>
      </el-tooltip>
      <el-tooltip :content="$t('editor.close')">
        <el-button class="iconfont icon-delete____ edit-hover" size="mini" type="text" @click.stop='handleCloseConfirm(data)'></el-button>
      </el-tooltip>
    </span>
    <div @click.stop class="close-dialog">
      <el-dialog center :visible.sync="dialogVisible" width="360px" closed="handleCloseDialog">
        <div class="dialog-content">{{`"${fileName}" ${$t("editor.fileUnSaved")}`}}</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click.stop="handleCloseOpenedFile(data)" :disabled="savePending">{{$t("editor.unSaveClose")}}</el-button>
          <el-button type="primary" @click.stop="saveAndCloseOpenedFile(data)" :loading="savePending">{{$t("editor.saveClose")}}</el-button>
        </div>
      </el-dialog>
    </div>
  </span>
</template>


<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FileManagerOpenedFileNode',
  data() {
    return {
      dialogVisible: false,
      savePending: false,
      deletePending: false
    }
  },
  props: {
    data: Object,
    node: Object
  },
  computed: {
    ...mapGetters({
      getOpenedFileByPath: 'getOpenedFileByPath',
      openedFiles: 'openedFiles',
      getSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      username: 'user/username',
      updateRecentUrlList: 'updateRecentUrlList'
    }),
    fileName() {
      let siteName = this.data.path.split('/').slice(1, 2)
      let fileName = this.data.path.split('/').slice(-1)
      return [...siteName, ...fileName].join('/').replace(/\.md$/, '')
    }
  },
  methods: {
    ...mapActions({
      savePageByPath: 'savePageByPath',
      refreshOpenedFile: 'refreshOpenedFile',
      closeOpenedFile: 'closeOpenedFile',
      gitlabRemoveFile: 'gitlab/removeFile',
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userDeletePagesConfig: 'user/deletePagesConfig',
      addRecentOpenedSiteUrl: 'addRecentOpenedSiteUrl'
    }),
    async handleCloseConfirm({ path }) {
      let file = this.getOpenedFileByPath(path)
      let { saved = true } = file
      if (saved) {
        this.closeAndReset(path)
      } else {
        this.dialogVisible = true
      }
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },
    handleCloseOpenedFile({ path }) {
      this.closeAndReset(path)
      this.handleCloseDialog()
    },
    async saveAndCloseOpenedFile({ path }) {
      this.savePending = true
      await this.savePageByPath(path)
        .then(() => {
          this.closeAndReset(path)
          this.handleCloseDialog()
          this.savePending = false
        })
        .catch(e => {
          this.$message.error(this.$t('editor.saveFail'))
          this.handleCloseDialog()
          this.savePending = false
        })
    },
    confirmRefresh(){
      this.$confirm(this.$t('editor.pullServerData'), this.$t('editor.hint'), {
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel'),
        type: 'warning'
      }).then(() => {
        this.refreshOpenedFile(this.data)
      }).catch((err) => { console.warn(err) });
    },
    closeAndReset(path) {
      let _path = Object.keys(this.openedFiles).filter(name => name !== path)
      this.closeOpenedFile({ path })
      if (this.$route.path.slice(1) !== path.replace(/\.md$/, '')) return
      _path.length === 0
        ? this.$router.push('/')
        : this.$nextTick(() => this.$router.push({ path: `/${_path[0].replace(/\.md$/, '')}` }))
    },
    async save(data) {
      if (data.savePending === undefined) {
        this.$set(data, 'savePending', false)
      }
      let path = data.path
      data.savePending = true
      await this.savePageByPath(path)
      data.savePending = false
    },
    removeRecentOpenFile(path) {
      let delPath = `/${path.replace(/\.md$/, '')}`
      let updateRecentUrlList = this.updateRecentUrlList.filter(item => item.path !== delPath)
      this.addRecentOpenedSiteUrl({ updateRecentUrlList })
    },
    async deletePagesFromLayout({ paths = [] }) {
      const re = /^\w+\/\w+\//
      let sitePath = paths[0].match(re)
      if (sitePath) sitePath = sitePath[0].replace(/\/$/, '')
      let pages = _.map(paths, page => page.replace(re, ''))
      await this.userGetSiteLayoutConfig({ path: sitePath })
      let config = this.getSiteLayoutConfigBySitePath(sitePath)
      await this.userDeletePagesConfig({ sitePath, pages })
    },
    resetPage(currentPath = null) {
      if (
        currentPath &&
        currentPath.replace(/\.md$/, '') === this.$route.path.substring(1)
      ) {
        return this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="scss">
.close-dialog{
  .el-dialog__header{
    height: 0;
  }
  .el-dialog__body .dialog-content{
    text-align: center;
    word-wrap: break-word;
    white-space: normal;
  }
  .edit-hover:hover {
    color: #409eff !important;
  }
}
</style>
