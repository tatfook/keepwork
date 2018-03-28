<template>
  <span class="file-manager-custom-tree-node">
    <span class="el-tree-node__label">{{node.label | hideMDFileExtension}}</span>
    <span class="file-manager-buttons-container">
      <span v-if="isAddable">
        <el-button size="mini" type="text" @click.stop="addFile">AddFile</el-button>
        <el-button size="mini" type="text" @click.stop="addFolder">AddFolder</el-button>
      </span>
      <el-button v-if="isRemovable" size="mini" type="text" @click.stop="removeFile">Remove</el-button>
      <a v-if="isSettable" class="el-button el-button--text el-button--mini" href="/wiki/user_center" target="_blank">Setting</a>
    </span>
  </span>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { suffixFileExtension } from '@/lib/utils'

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
<style lang="scss">
.file-manager {
  .el-tree-node__label {
    line-height: 40px;
  }
  &-buttons-container {
    float: right;
    height: 40px;
    line-height: 40px;
  }
  &-custom-tree-node {
    flex: 1;
  }
}
</style>