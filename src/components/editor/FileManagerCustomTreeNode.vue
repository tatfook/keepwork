<template>
  <div class="el-tree-node__label">
    {{node.label | hideMDFileExtension}}
    <span class="node-icon">
      <i class="iconfont icon-wenjian" v-if="node.isLeaf"></i>
      <i class="iconfont icon-siyouwangzhan" v-else-if="data.visibility === 'private'"></i>
      <i class="iconfont icon-gongyouwangzhan" v-else></i>
    </span>
    <span class="file-manager-buttons-container">
      <el-button v-if="isAddable" class="iconfont icon-tianjiawenjian" size="mini" type="text" @click.stop="addFile" :title='$t("editor.newPage")'>
      </el-button>
      <el-button v-if="isAddable" class="iconfont icon-xinjianwenjianjia" size="mini" type="text" @click.stop="addFolder" :title='$t("editor.newFolder")'>
      </el-button>
      <el-button v-if="isRemovable" class="iconfont icon-shanchu" size="mini" type="text" @click.stop="removeFile" :title='$t("editor.delete")'>
      </el-button>
      <el-button v-if="isSettable" class="iconfont icon-shezhi" size="mini" type="text" @click.stop="goSetting" :title='$t("editor.setting")'>
      </el-button>
    </span>
    <div @click.stop v-if='isWebsiteSettingShow'>
      <WebsiteSettingDialog :show='isWebsiteSettingShow' :sitePath='currentPath' @close='closeWebsiteSettingDialog'/>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { suffixFileExtension } from '@/lib/utils/gitlab'
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
      isWebsiteSettingShow: false
    }
  },
  methods: {
    ...mapActions({
      setActiveManagePaneComponent: 'setActiveManagePaneComponent',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      gitlabCreateFile: 'gitlab/createFile',
      gitlabAddFolder: 'gitlab/addFolder',
      gitlabRemoveFile: 'gitlab/removeFile'
    }),
    async addFile() {
      let newFileName = await this.newFileNamePrompt()
      newFileName = suffixFileExtension(newFileName, 'md')
      let newFilePath = `${this.currentPath}/${newFileName}`
      this.addFilePending = true
      await this.gitlabCreateFile({ path: newFilePath })
      this.addFilePending = false
    },
    async addFolder() {
      let self = this

      let newFolderName = await this.newFileNamePrompt({what: self.$t('editor.folder')})
      if (!newFolderName) return
      let newFolderPath = `${this.currentPath}/${newFolderName}`
      this.addFolderPending = true
      await this.gitlabAddFolder({ path: newFolderPath })
      this.addFolderPending = false
    },
    async newFileNamePrompt({what = this.$t('editor.website')} = {}) {
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
            if (!value) return `${what}${self.$t('editor.emptyName')}`
            if (!/^[A-Za-z0-9_]+$/.test(value)) return `${what}${self.$t('nameRule')}`
            if (/^[_]/.test(value)) return `${what}${self.$t('editor.nameUnderline')}`
            if (childNames.indexOf(value) > -1) return self.$t('nameExist')
            return true
          }
        }
      )

      return newFileName && newFileName.trim()
    },
    removeFile() {
      let self = this

      let pathArr = this.data.path.split('/')
      let pageName = pathArr[pathArr.length - 1].replace(/.md$/, '')
      this.$confirm(`${self.$t('editor.delConfirm')} ${pageName} ${self.$t('editor.page')}？`, self.$t('editor.delete'), {
        confirmButtonText: self.$t('el.messagebox.confirm'),
        cancelButtonText: self.$t('el.messagebox.cancel'),
        type: 'error'
      })
        .then(async () => {
          this.removePending = true
          await this.gitlabRemoveFile({ path: this.currentPath })
          this.removePending = false
        })
        .catch(e => console.error(e))
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
      gitlabChildNamesByPath: 'gitlab/childNamesByPath'
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
      return this.isFile
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