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
      <el-button v-if="isRemovable" class="iconfont icon-shanchu" size="mini" type="text" @click.stop="removeFile" title='删除'>
      </el-button>
      <el-button v-if="isSettable" size="mini" type="text" title='设置'>
        <a class="iconfont icon-shezhi" href="/wiki/user_center" target="_blank"></a>
      </el-button>
    </span>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
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
      removePending: false,
      isAddFileDialogShow: false
    }
  },
  methods: {
    ...mapActions({
      getRepositoryTree: 'gitlab/getRepositoryTree',
      gitlabCreateFile: 'gitlab/createFile',
      gitlabAddFolder: 'gitlab/addFolder',
      gitlabRemoveFile: 'gitlab/removeFile'
    }),
    async addFile() {
      await this.getRepositoryTree({ path: this.sitePath })
      let childNames = this.gitlabChildNamesByPath(this.currentPath)
      console.log(childNames)
      let { value: newFileName } = await this.$prompt(
        '网页名',
        '创建网页',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          inputValidator: str => {
            let value = str.trim()
            if (!value) return
            if (!/^[A-Za-z0-9_]+$/.test(value)) return '文件名只能由字母，数字和下划线组成'
            if (childNames.indexOf(value) > -1) return '同名文件已经存在'
            return true
          }
        }
      )

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
    removeFile() {
      let pathArr = this.data.path.split('/')
      let pageName = pathArr[pathArr.length - 1].replace(/.md$/, '')
      this.$confirm(`确定删除 ${pageName} 页面？`, '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(async () => {
          this.removePending = true
          await this.gitlabRemoveFile({ path: this.currentPath })
          this.removePending = false
        })
        .catch(() => {})
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
    },
    sitePath() {
      if (this.isFirstLevel) return `${this.data.username}/${this.data.name}`

      let [username, name] = this.data.path.split('/')
      return `${username}/${name}`
    }
  },
  filters: {
    hideMDFileExtension(str) {
      return str.replace(/\.md$/, '')
    }
  }
}
</script>