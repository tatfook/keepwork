<template>
  <div class="el-tree-node__label">
    {{node.label | hideMDFileExtension}}
    <span class="node-icon">
      <i class="iconfont icon-wenjian" v-if="node.isLeaf"></i>
      <i class="iconfont icon-siyouwangzhan" v-else-if="data.visibility === 'private'"></i>
      <i class="iconfont icon-gongyouwangzhan" v-else></i>
    </span>
    <span class="file-manager-buttons-container">
      <el-button v-if="isAddable" class="iconfont icon-tianjiawenjian" size="mini" type="text" @click.stop="addFile" title='新建页面'>
      </el-button>
      <el-button v-if="isAddable" class="iconfont icon-xinjianwenjianjia" size="mini" type="text" @click.stop="addFolder" title='新建文件夹'>
      </el-button>
      <el-button v-if="isRemovable" class="iconfont icon-shanchu" size="mini" type="text" @click.stop="removeFile">
      </el-button>
      <el-button v-if="isSettable" size="mini" type="text" @click.stop="addFolder" title='设置'>
        <a class="iconfont icon-shezhi" href="/wiki/user_center" target="_blank"></a>
      </el-button>
    </span>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { suffixFileExtension } from '@/lib/utils/gitlab'

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
      removePending: false
    }
  },
  methods: {
    ...mapActions({
      gitlabCreateFile: 'gitlab/createFile',
      gitlabAddFolder: 'gitlab/addFolder',
      gitlabRemoveFile: 'gitlab/removeFile'
    }),
    async addFile() {
      let newFileName = (prompt("What's the file name?") || '').trim()
      if (!newFileName) return
      newFileName = suffixFileExtension(newFileName, 'md')

      let newFilePath = `${this.currentPath}/${newFileName}`
      this.addFilePending = true
      await this.gitlabCreateFile({ path: newFilePath })
      this.addFilePending = false
    },
    async addFolder() {
      let newFolderName = (prompt("What's the folder name?") || '').trim()
      if (!newFolderName) return

      let newFolderPath = `${this.currentPath}/${newFolderName}`
      this.addFolderPending = true
      await this.gitlabAddFolder({ path: newFolderPath })
      this.addFolderPending = false
    },
    async removeFile() {
      this.removePending = true
      await this.gitlabRemoveFile({ path: this.currentPath })
      this.removePending = false
    }
  },
  computed: {
    pending() {
      return this.addFolderPending || this.addFilePending || this.removePending
    },
    isFile() {
      return this.data.type === 'blob'
    },
    isFolder() {
      return this.data.type === 'tree'
    },
    isFirstLevel() {
      return this.node.level === 1
    },
    isAddable() {
      return !this.isFile
    },
    isRemovable() {
      return this.isFile
    },
    isSettable() {
      return this.isFirstLevel
    },
    currentPath() {
      return this.isFirstLevel
        ? `${this.data.username}/${this.data.name}`
        : this.data.path
    }
  },
  filters: {
    hideMDFileExtension(str) {
      return str.replace(/\.md$/, '')
    }
  }
}
</script>