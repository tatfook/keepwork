<template>
  <div class="el-tree-node__label" v-loading="removePending || addFilePending || addFolderPending">
    <span class="rename-wrapper" v-if="isRenameFile" v-loading="isRenamePending">
      <el-input @click.native.stop ref="input" v-if="isRenameFile" @blur="delayCancel" @keyup.enter.native="handleRenameConfirm" v-model="newFileName" class="rename-input" size="mini"></el-input>
      <el-button @click.stop="handleRenameConfirm" class="rename-btn el-icon-check" type="text" size="mini" :title='$t("editor.confirm")'></el-button>
      <el-button @click.stop="handleRenameCancel" class="rename-btn el-icon-close" type="text" size="mini" :title='$t("editor.cancel")'></el-button>
    </span>
    <span v-else>{{data.displayName || node.label | hideMDFileExtension}}</span>
    <span class="node-icon">
      <i class="iconfont icon-file_" v-if="isFile"></i>
      <i class="iconfont icon-folder" v-else-if="isFolder"></i>
      <i class="iconfont icon-private" v-else-if="isWebsite && data.visibility === 'private'"></i>
      <i class="iconfont icon-common_websites" v-else></i>
    </span>
    <span class="file-manager-buttons-container" v-if="!isRenameFile">
      <el-button v-if="isFile" class="iconfont el-icon-edit edit-hover" size="mini" type="text" @click.stop="toggleRenameFile" title="修改文件名">
      </el-button>
      <el-button v-if="isAddable" class="iconfont icon-add_file" size="mini" type="text" @click.stop="addFile" :title='$t("editor.newPage")'>
      </el-button>
      <el-button v-if="isAddable" class="iconfont icon-folder_" size="mini" type="text" @click.stop="addFolder" :title='$t("editor.newFolder")'>
      </el-button>
      <el-button v-if="isRemovable" class="iconfont icon-delete" size="mini" type="text" @click.stop="removeFile" :title='$t("editor.delete")'>
      </el-button>
      <el-button v-if="isSettable" class="iconfont icon-set_up" size="mini" type="text" @click.stop="goSetting" :title='$t("editor.setting")'>
      </el-button>
    </span>
    <div @click.stop v-if='isWebsiteSettingShow'>
      <WebsiteSettingDialog :show='isWebsiteSettingShow' :sitePath='currentPath' @close='closeWebsiteSettingDialog' />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { suffixFileExtension, gitFilenameValidator } from '@/lib/utils/gitlab'
import WebsiteSettingDialog from '@/components/common/WebsiteSettingDialog'

export default {
  name: 'FileManagerCustomTreeNode',
  props: {
    data: Object,
    node: Object
  },
  data() {
    return {
      addFolderPending: false,
      addFilePending: false,
      removePending: false,
      isWebsiteSettingShow: false,
      isRenameFile: false,
      isValidator: false,
      isRenamePending: false,
      newFileName: ''
    }
  },
  methods: {
    ...mapActions({
      setActiveManagePaneComponent: 'setActiveManagePaneComponent',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      gitlabCreateFile: 'gitlab/createFile',
      gitlabAddFolder: 'gitlab/addFolder',
      gitlabRemoveFile: 'gitlab/removeFile',
      gitlabRenameFile: 'gitlab/renameFile',
      gitlabRemoveFolder: 'gitlab/removeFolder',
      updateFilemanagerTreeNodeExpandMapByPath:
        'updateFilemanagerTreeNodeExpandMapByPath',
      userGetSiteLayoutConfig: 'user/getSiteLayoutConfig',
      userDeletePagesConfig: 'user/deletePagesConfig',
      savePageByPath: 'savePageByPath'
    }),
    async addFile() {
      let newFileName = await this.newFileNamePrompt()
      newFileName = suffixFileExtension(newFileName, 'md')
      let newFilePath = `${this.currentPath}/${newFileName}`
      this.addFilePending = true
      await this.gitlabCreateFile({ path: newFilePath })
      this.expandFolder(newFilePath)
      this.addFilePending = false
    },
    async addFolder() {
      let self = this

      let newFolderName = await this.newFileNamePrompt({
        what: self.$t('editor.folder')
      })
      if (!newFolderName) return
      let newFolderPath = `${this.currentPath}/${newFolderName}`
      this.addFolderPending = true
      await this.gitlabAddFolder({ path: newFolderPath })
      this.expandFolder(newFolderPath)
      this.addFolderPending = false
    },
    async newFileNamePrompt({ what = this.$t('editor.website') } = {}) {
      let self = this

      await this.gitlabGetRepositoryTree({ path: this.sitePath })
      let childNames = this.gitlabChildNamesByPath(this.currentPath)

      let { value: newFileName } = await this.$prompt(
        `${what}${self.$t('editor.nameSingle')}`,
        `${self.$t('editor.create')}${what}`,
        {
          cancelButtonText: self.$t('el.messagebox.cancel'),
          confirmButtonText: self.$t('el.messagebox.confirm'),
          inputValidator: str => {
            let value = (str || '').trim()
            if (!value) return `${what} ${self.$t('editor.emptyName')}`
            if (!gitFilenameValidator(value))
              return `${what} ${self.$t('editor.nameRule')}`
            if (childNames.indexOf(value) > -1)
              return self.$t('editor.nameExist')
            return true
          }
        }
      )

      return newFileName && newFileName.trim()
    },
    expandFolder(path) {
      let parentPath = path.split('/')
      parentPath.pop()
      this.updateFilemanagerTreeNodeExpandMapByPath({
        path: parentPath.join('/'),
        expanded: true
      })
    },
    removeFolder(data) {
      const self = this
      let pathArr = this.data.path.split('/')
      let folderName = pathArr[pathArr.length - 1]
      const toRemoveFiles = []
      const recursionFile = data => {
        if (!/.md$/.test(data.path)) {
          toRemoveFiles.push(`${data.path}/.gitignore.md`)
        } else {
          toRemoveFiles.push(data.path)
        }
        data.children && data.children.forEach(item => recursionFile(item))
      }
      recursionFile(data)

      this.$confirm(self.$t('editor.deleteFolder'), self.$t('editor.delete'), {
        confirmButtonText: self.$t('el.messagebox.confirm'),
        cancelButtonText: self.$t('el.messagebox.cancel'),
        type: 'error'
      })
        .then(async () => {
          this.removePending = true
          await this.gitlabRemoveFolder({ paths: toRemoveFiles }),
            await this.deletePagesFromLayout({ paths: toRemoveFiles })
          this.resetPage({ toRemoveFiles })
          this.removePending = false
        })
        .catch(e => console.error(e))
    },
    async toggleRenameFile() {
      let { saved } = this.getOpenedFileByPath(this.filePath)
      if (!saved) {
        await this.$confirm('该文件尚未保存，是否保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await this.savePageByPath(this.filePath)
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.toggleInputFocus()
          })
          .catch(() => {})
        return
      }
      this.toggleInputFocus()
    },
    toggleInputFocus() {
      this.isRenameFile = true
      this.newFileName = this.data.name.replace(/.md$/, '')
      this.$nextTick(() => this.$refs.input.focus())
    },
    async handleRenameConfirm() {
      if (
        !this.newFileName.trim() ||
        this.newFileName.trim() === this.data.name.replace(/.md$/, '')
      ) {
        return (this.isRenameFile = false)
      }
      await this.gitlabGetRepositoryTree({ path: this.sitePath })
      let childNames = await this.gitlabChildNamesByPath(
        this.currentPath
          .split('/')
          .slice(0, -1)
          .join('/')
      )
      if (childNames.indexOf(this.newFileName) > -1) {
        return this.$message.error(this.$t('editor.nameExist'))
      }
      if (!gitFilenameValidator(this.newFileName)) {
        this.isValidator = true
        return this.$message.error(
          `${this.newFileName} ${this.$t('editor.nameRule')}`
        )
      }
      this.isRenamePending = true
      let parentPath = this.data.path
        .split('/')
        .slice(0, -1)
        .join('/')
      let newFilePath = `${parentPath}/${this.newFileName}.md`
      await this.gitlabRenameFile({
        currentFilePath: this.data.path,
        newFilePath: newFilePath
      })
      this.isRenameFile = false
      this.isRenamePending = false
      this.isValidator = false
      this.resetPage({ currentPath: this.currentPath })
      this.updateFilemanagerTreeNodeExpandMapByPath(newFilePath)
    },
    handleRenameCancel() {
      this.isRenameFile = false
      this.isValidator = false
      this.newFileName = ''
    },
    delayCancel() {
      setTimeout(
        () =>
          !this.isValidator &&
          !this.isRenamePending &&
          this.handleRenameCancel(),
        250
      )
    },
    removeFile() {
      if (this.data.type === 'tree') {
        this.removeFolder(this.data)
        return
      }

      let self = this

      let pathArr = this.data.path.split('/')
      let pageName = pathArr[pathArr.length - 1].replace(/.md$/, '')
      this.$confirm(
        `${self.$t('editor.delConfirm')} ${pageName} ${self.$t(
          'editor.page'
        )}？`,
        self.$t('editor.delete'),
        {
          confirmButtonText: self.$t('el.messagebox.confirm'),
          cancelButtonText: self.$t('el.messagebox.cancel'),
          type: 'error'
        }
      )
        .then(async () => {
          this.removePending = true
          await this.gitlabRemoveFile({ path: this.currentPath }),
            await this.deletePagesFromLayout({ paths: [this.currentPath] })
          this.resetPage({ currentPath: this.currentPath })
          this.removePending = false
        })
        .catch(e => console.error(e))
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
    resetPage({ currentPath = null, toRemoveFiles = null }) {
      if (toRemoveFiles && toRemoveFiles.length > 0) {
        let currentRoutePath = this.$route.path.substring(1)
        let isRestPage = toRemoveFiles.some(item => {
          return item.split('.')[0] === currentRoutePath
        })
        if (isRestPage) {
          return this.$router.push('/')
        }
      }
      if (
        currentPath &&
        currentPath.split('.')[0] === this.$route.path.substring(1)
      ) {
        return this.$router.push('/')
      }
    },
    goSetting() {
      if (this.isWebsite) {
        this.openWebsiteSettingDialog()
      }
      if (this.isFile) {
        this.setActiveManagePaneComponent({
          name: 'PageSetting',
          props: {
            pagePath: this.currentPath
          }
        })
      }
    },
    openWebsiteSettingDialog() {
      this.isWebsiteSettingShow = true
    },
    closeWebsiteSettingDialog() {
      this.isWebsiteSettingShow = false
    }
  },
  computed: {
    ...mapGetters({
      gitlabChildNamesByPath: 'gitlab/childNamesByPath',
      getSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      getOpenedFileByPath: 'getOpenedFileByPath'
    }),
    pending() {
      return this.addFolderPending || this.addFilePending || this.removePending
    },
    isFile() {
      return this.data.type === 'blob'
    },
    isFolder() {
      return this.data.type === 'tree'
    },
    isWebsite() {
      return this.node.level === 1
    },
    isAddable() {
      return !this.isFile
    },
    isRemovable() {
      return this.node.level !== 1
    },
    isSettable() {
      return this.isWebsite || this.isFile
    },
    currentPath() {
      return this.isWebsite
        ? `${this.data.username}/${this.data.name}`
        : this.data.path
    },
    sitePath() {
      if (this.isWebsite) return `${this.data.username}/${this.data.name}`

      let [username, name] = this.data.path.split('/')
      return `${username}/${name}`
    },
    filePath() {
      return this.data.path.replace(/.md$/, '')
    }
  },
  filters: {
    hideMDFileExtension(str) {
      return str.replace(/\.md$/, '')
    }
  },
  components: {
    WebsiteSettingDialog
  }
}
</script>

<style lang="scss">
.el-tree-node__label::before {
  content: ' ';
  display: inline-block;
  position: absolute;
  margin-left: -50px;
  height: 30px;
  width: 30px;
}
.icon-folder::before {
  font-size: 0.8em;
  color: #ffac33;
}
.edit-hover:hover {
  color: #1780dc !important;
}

.rename-wrapper {
  display: flex;
  .rename-input {
  }
  .rename-btn {
    width: 20px;
    margin: 0 10px;
    color: #8a8a8a;
    font-weight: bold;
    font-size: 1.2em;
  }
}
</style>
