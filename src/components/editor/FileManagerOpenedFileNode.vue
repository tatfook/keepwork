<template>
  <span class='joined-tree-node el-tree-node__label' v-loading="deletePending">
    <span class="node-icon">
      <i class="iconfont icon-edited_file" :class="{'is-modified': data.isModified}"></i>
    </span>
    <span class=''>{{ node.label }}</span>
    <span class="file-manager-buttons-container">
      <el-button v-loading='data.savePending' class="iconfont icon-save" size="mini" type="text" :title='$t("editor.save")' @click.stop='save(data)'>
      </el-button>
      <el-button class="iconfont icon-refresh" size="mini" type="text" :title='$t("editor.refresh")' @click.stop='refreshOpenedFile(data)'>
      </el-button>
      <el-button class="iconfont icon-delete____" size="mini" type="text" :title='$t("editor.close")' @click.stop='handleCloseConfirm(data)'>
      </el-button>
      <el-button class="iconfont icon-delete" size="mini" type="text" :title='$t("editor.delete")' @click.stop="removeOpenedFile(data)">
      </el-button>
    </span>
    <div @click.stop>
      <el-dialog center :visible.sync="dialogVisible" width="300px" closed="handleCloseDialog">
        <div class="dialog-content">{{`"${fileName}" ${$t("editor.fileUnSaved")}`}}</div>
        <div slot="footer" class="dialog-footer">
          <center><el-button type="warning" @click.stop="handleCloseOpenedFile(data)" :disabled="savePending">{{$t("editor.unSaveClose")}}</el-button></center>
          <center><el-button type="primary" @click.stop="saveAndCloseOpenedFile(data)" :loading="savePending">{{$t("editor.saveClose")}}</el-button></center>
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
    removeOpenedFile(data) {
      let path = data.path
      let pathArr = path.split('/')
      let siteName = pathArr.slice(1, 2)
      let pageName = pathArr
        .slice(-1)
        .join()
        .replace(/\.md$/, '')
      const h = this.$createElement
      this.$msgbox({
        title: this.$t('editor.modDelMsgTitle'),
        message: h('p', null, [
          h('span', null, `${this.$t('editor.delConfirm')}`),
          h('span', { style: 'color: #FF4342' }, ` "${siteName}/${pageName}" `),
          h('span', null, `${this.$t('editor.page')}?`)
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel')
      }).then(async () => {
        this.deletePending = true
        await this.gitlabRemoveFile({ path }).catch(e => {
          this.$message.error(this.$t('editor.deleteFail'))
          this.deletePending = false
        })
        await this.deletePagesFromLayout({ paths: [path] })
        this.removeRecentOpenFile(path)
        this.resetPage(path)
        this.deletePending = false
      })
    },
    removeRecentOpenFile(path) {
      let delPath = `/${path.replace(/\.md$/, '')}`
      let _re = this.updateRecentUrlList.filter(item => item.path !== delPath)
      let payload = { recentOpenedSite: _re }
      this.addRecentOpenedSiteUrl(payload)
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
<style>
.el-dialog__body .dialog-content{
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
}
.dialog-footer center{
  margin-bottom: 10px;
}
</style>
