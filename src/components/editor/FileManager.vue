<template>
  <div class="file-manager" v-loading="loading">
    <div v-show="hasOpenedFiles" class="joined-tree tree-item" :class="{'is-active': trees.isOpenedShow}" v-loading="savePending">
      <div class="opened-files-container">
        <h1 class="toggle-bar" @click='toggleContent("isOpenedShow")'>
          <i class="el-icon-arrow-right"></i> {{ $t('editor.openedFiles') }}
        </h1>
        <span class="opened-files-buttons" v-show="trees.isOpenedShow && hasOpenedFiles">
          <el-button class="iconfont icon-save" size="mini" type="text" :title='$t("editor.saveAll")' @click.stop='saveAllOpenedFiles'>
          </el-button>
          <el-button class="iconfont icon-delete____" size="mini" type="text" :title='$t("editor.closeAll")' @click.stop='closeAllOpenedFilesConfirm'>
          </el-button>
        </span>
      </div>
      <el-dialog center :visible.sync="dialogCloseAllVisible" width="300px" closed="handleCloseAllDialog">
        <center>{{`"${toBeCloseFileName}" ${this.$t("editor.fileUnSaved")}`}}</center>
        <span slot="footer" class="dialog-footer">
          <el-button type="warning" @click="handleCloseOpenedFileAndNext" :disabled="savePending">{{this.$t("editor.unSaveClose")}}</el-button>
          <el-button type="primary" @click="saveAndCloseOpenedFileAndNext" :loading="savePending">{{this.$t("editor.saveClose")}}</el-button>
        </span>
      </el-dialog>
      <el-collapse-transition>
        <el-tree v-show="trees.isOpenedShow && openedTreeData.length > 0" ref='openedTree' node-key='path' :data="openedTreeData" :props="openedTreesProps" :render-content="renderOpenedFile" highlight-current @node-click="handleOpenedClick">
        </el-tree>
      </el-collapse-transition>
    </div>

    <div class="my-tree tree-item" :class="{'is-active': trees.isMyShow}">
      <h1 class="toggle-bar" @click='togglePersonalSiteList'>
        <i class="el-icon-arrow-right"></i> {{ $t('editor.myPersonalWebsites') }}
      </h1>
      <el-collapse-transition>
        <el-tree v-show="personalSiteList.length > 0 && trees.isMyShow && !loading" ref='fileManagerTree' node-key="path" :data="personalSiteList | sortBy('domain')" :props="filesTreeProps" :render-content="renderContent" highlight-current @node-click="handleNodeClick">
        </el-tree>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="empty" v-if="personalSiteList.length <= 0">
          <p class="info">{{ $t('editor.noPersonalWebsite') }}</p>
          <el-button type="text" @click="openNewWebsiteDialog">{{ $t('editor.createWebsiteNow') }}</el-button>
          <NewWebsiteDialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' />
        </div>
      </el-collapse-transition>
    </div>

    <div class="joined-tree tree-item" :class="{'is-active': trees.isContributedShow}">
      <h1 class="toggle-bar" @click='toggleContributedSiteList'>
        <i class="el-icon-arrow-right"></i> {{ $t('editor.myContributedWebsites') }}
      </h1>
      <el-collapse-transition>
        <el-tree v-show="contributedSiteList.length > 0 && trees.isContributedShow && !loading" ref='fileManagerTree' node-key="path" :data="contributedSiteList | sortBy('username')" :props="filesTreeProps" :render-content="renderContent" highlight-current @node-click="handleNodeClick">
        </el-tree>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="empty" v-show="trees.isContributedShow">
          <p class="info">{{ $t('editor.myContributedWebsitesTip') }}</p>
        </div>
      </el-collapse-transition>
    </div>

  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import FileManagerCustomTreeNode from './FileManagerCustomTreeNode'
import FileManagerOpenedFileNode from './FileManagerOpenedFileNode'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'

export default {
  name: 'FileManager',
  data() {
    return {
      loading: true,
      savePending: false,
      dialogVisible: false,
      dialogCloseAllVisible: false,
      toBeCloseFilePath: '',
      toBeCloseFileName: '',
      filesTreeProps: {
        children: 'children',
        label: 'name'
      },
      trees: {
        isOpenedShow: true,
        isMyShow: true,
        isContributedShow: false
      },
      openedTreesProps: {
        children: 'children',
        label: 'label'
      },
      isNewWebsiteDialogShow: false,
      previousOpenSiteUrl: {}
    }
  },
  async mounted() {
    await this.getAllPersonalAndContributedSite().catch(err => {
      console.error(err)
    })
    this.loading = false
    this.$route.path !== '/' && await this.checkSitePath()
    await this.initUrlExpandSelect()
    this.$nextTick(() => {
      let ele = document.querySelector('.is-current')
      ele && ele.scrollIntoView()
    })
  },
  computed: {
    ...mapGetters({
      personalSiteList: 'user/personalSiteList',
      personalSitePaths: 'user/personalSitePathMap',
      contributedSiteList: 'user/contributedSiteList',
      openedFiles: 'openedFiles',
      activePageUrl: 'activePageUrl',
      activePageInfo: 'activePageInfo',
      filemanagerTreeNodeExpandMapByPath: 'filemanagerTreeNodeExpandMapByPath',
      getOpenedFileByPath: 'getOpenedFileByPath',
      username: 'user/username',
      hasOpenedFiles: 'hasOpenedFiles'
    }),
    openedTreeData() {
      let clonedopenedFiles = _.clone(this.openedFiles)
      let treeDatas = []
      let that = this
      _.forOwn(clonedopenedFiles, function(value, key) {
        let pathArr = key.split('/')
        let pathLen = pathArr.length
        let pageName = pathArr[pathLen - 1].replace(/.md$/, '')
        let userName = pathArr[0]
        let siteName = pathArr[1]
        let nodeData = {
          label: `${pageName}(${userName}/${siteName})`,
          path: key,
          isModified: value && value.timestamp
        }
        treeDatas.push(nodeData)
      })
      return treeDatas
    },
    openedFilesPaths() {
      return _.keys(this.openedFiles)
    },
    hasUnSaveOpenedFiles() {
      return this.unSavedOpenedFiles.length > 0
    },
    unSavedOpenedFiles() {
      return _.filter(_.values(this.openedFiles), ({ saved }) => !saved)
    },
    unSavedOpenedFilesPaths() {
      return _.map(this.unSavedOpenedFiles, ({ path }) => `${path}.md`.slice(1))
    }
  },
  watch:{
    openedFiles(newVal,oldVal){
      this.previousOpenSiteUrl = _.merge(JSON.parse(localStorage.getItem('recentUrl')),newVal)
      let recentUrl = _.map(_.values(this.previousOpenSiteUrl), ({path, timestamp}) => ({path, timestamp})).sort((obj1, obj2) => obj1.timestamp < obj2.timestamp)
      localStorage.setItem('recentUrl',JSON.stringify(recentUrl.slice(0,5)))
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalWebsite: 'user/getAllPersonalWebsite',
      getAllContributedWebsite: 'user/getAllContributedWebsite',
      getAllPersonalAndContributedSite: 'user/getAllPersonalAndContributedSite',
      getRepositoryTree: 'gitlab/getRepositoryTree',
      updateFilemanagerTreeNodeExpandMapByPath:
        'updateFilemanagerTreeNodeExpandMapByPath',
      savePageByPath: 'savePageByPath',
      refreshOpenedFile: 'refreshOpenedFile',
      closeOpenedFile: 'closeOpenedFile',
      gitlabRemoveFile: 'gitlab/removeFile',
      closeAllOpenedFile: 'closeAllOpenedFile'
    }),
    async checkSitePath(checkTimes = 10, waitTime = 500) {
      const sleep = async () =>
        new Promise(resolve => setTimeout(resolve, waitTime))
      let { sitepath } = this.activePageInfo
      if (sitepath) return Promise.resolve()
      while (checkTimes--) {
        await sleep()
        let { sitepath } = this.activePageInfo
        if (sitepath) {
          return Promise.resolve()
        }
      }
      return Promise.resolve()
    },
    async initUrlExpandSelect() {
      let { username, isLegal, sitepath, fullPath, paths = [] } = this.activePageInfo
      if (this.username !== username && sitepath) {
        this.$set(this.trees, 'isMyShow', false)
        this.$set(this.trees, 'isContributedShow', true)
      }
      if (!isLegal) {
        let closeAllFolder = this.personalSitePaths
          ? Object.keys(this.personalSitePaths).map(path => ({
              path,
              expanded: false
            }))
          : []
        return this.updateFilemanagerTreeNodeExpandMapByPath(closeAllFolder)
      }
      await this.getRepositoryTree({ path: sitepath })

      let folderPaths = paths.slice(0, -1)
      let expandedFolderPaths = folderPaths.reduce(
        (prev, current) => {
          let exapndedPath = prev.slice(-1) + '/' + current
          return prev.concat(exapndedPath)
        },
        [sitepath]
      )
      let expandedFolderPathsList = expandedFolderPaths.map(path => ({
        path,
        expanded: true
      }))
      let appendCloseFolderPathsList = this.personalSitePaths
        ? Object.keys(this.personalSitePaths)
            .filter(i => i !== sitepath)
            .map(path => ({ path, expanded: false }))
        : []
      this.updateFilemanagerTreeNodeExpandMapByPath([
        ...expandedFolderPathsList,
        ...appendCloseFolderPathsList
      ])
    },
    renderOpenedFile(h, { node, data, store }) {
      let { fullPath: activePageFullPath } = this.activePageInfo
      activePageFullPath === data.path && store.setCurrentNode(node)
      return <FileManagerOpenedFileNode data={data} node={node} />
    },
    renderContent(h, { node, data, store }) {
      // trick codes below
      // manipulated the node in <el-tree/>
      node.isLeaf = data.type === 'blob'
      // restore node expand status
      let path = data.path || `${data.username}/${data.name}`
      node.expanded = this.filemanagerTreeNodeExpandMapByPath[path]

      // modify store info
      let { fullPath: activePageFullPath } = this.activePageInfo
      activePageFullPath === data.path && store.setCurrentNode(node)

      return <FileManagerCustomTreeNode data={data} node={node} />
    },
    async handleNodeClick(data, node, component) {
      // save node expand status
      let path = data.path || `${data.username}/${data.name}`
      this.updateFilemanagerTreeNodeExpandMapByPath({
        path,
        expanded: node.expanded
      })

      // try open files list in site level
      let repositoryIsClickedAndFileListIsEmpty =
        node.level === 1 && _.isEmpty(data.children)
      if (repositoryIsClickedAndFileListIsEmpty) {
        let { username, name } = data
        let path = `${username}/${name}`
        let recursive = true
        node.loading = true
        await this.getRepositoryTree({ path })
      }
      // try open file
      let isFileClicked = data.type === 'blob'
      isFileClicked && this.$router.push('/' + data.path.replace(/\.md$/, ''))
    },
    closeAndResetFile(path) {
      let _path = Object.keys(this.openedFiles).filter(name => name !== path)
      this.closeOpenedFile({ path })
      if (this.$route.path.slice(1) !== path.replace(/\.md$/, '')) return
      if (_path.length === 0) {
        this.$router.push('/')
      } else {
        this.$router.push('/' + _path[0].replace(/\.md$/, ''))
      }
    },
    handleCloseDialog() {
      this.toBeCloseFilePath = ''
      this.toBeCloseFileName = ''
      this.dialogVisible = false
    },
    handleCloseAllDialog() {
      this.toBeCloseFilePath = ''
      this.toBeCloseFileName = ''
      this.dialogCloseAllVisible = false
    },
    handleCloseOpenedFile() {
      let path = this.toBeCloseFilePath
      path && this.closeAndResetFile(path)
      this.handleCloseDialog()
    },
    async saveAndCloseOpenedFile() {
      let path = this.toBeCloseFilePath
      this.savePending = true
      await this.savePageByPath(path)
      .then(() => {
        this.closeAndResetFile(path)
        this.handleCloseDialog()
        this.savePending = false
      })
      .catch(e => {
        this.$message.error(this.$t("editor.saveFail"));
        this.handleCloseDialog()
        this.savePending = false
      })
    },
    handleOpenedClick({ path }, node) {
      this.$router.push('/' + path.replace(/\.md$/, ''))
    },
    toggleContent(type) {
      this.trees[type] = !this.trees[type]
    },
    togglePersonalSiteList() {
      let type = 'isMyShow'
      this.toggleContent(type)
      this.trees[type] && this.getAllPersonalWebsite()
    },
    toggleContributedSiteList() {
      let type = 'isContributedShow'
      this.toggleContent(type)
      this.trees[type] && this.getAllContributedWebsite()
    },
    isSaveble(nodeData) {
      let path = nodeData.path
      return path && this.openedFiles[path] && this.openedFiles[path].timestamp
    },
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    async closeAllOpenedFilesConfirm() {
      if (this.unSavedOpenedFilesPaths.length > 0) {
        this.dialogCloseAllVisible = true
        let path = this.unSavedOpenedFilesPaths[0]
        let siteName = path.split('/').slice(1, 2).join()
        let fileName = path.split('/').slice(-1).join().replace(/\.md$/, '')
        this.toBeCloseFileName = `${siteName}/${fileName}`
        this.toBeCloseFilePath = path
      } else {
        this.$router.push('/')
        this.closeAllOpenedFile()
      }
    },
    checkHasNext() {
      if (this.unSavedOpenedFilesPaths.length > 0) {
        this.closeAllOpenedFilesConfirm()
      } else {
        this.closeAllOpenedFile()
        this.$router.push('/')
        this.dialogCloseAllVisible = false
      }
    },
    handleCloseOpenedFileAndNext() {
      let path = this.toBeCloseFilePath
      path && this.closeAndResetFile(path)
      this.checkHasNext()
    },
    async saveAndCloseOpenedFileAndNext() {
      this.savePending = true
      let path = this.toBeCloseFilePath
      await this.savePageByPath(path)
      .then(() => {
        this.closeAndResetFile(path)
        this.savePending = false
        this.checkHasNext()
      })
      .catch(e => {
        this.$message.error(this.$t("editor.saveFail"));
        this.handleCloseAllDialog()
        this.savePending = false
      })
    },
    async saveAllOpenedFiles() {
      if (!this.hasUnSaveOpenedFiles) return
      let num = this.unSavedOpenedFilesPaths.length
      let paths = this.unSavedOpenedFilesPaths
      let isSuccess = true
      this.savePending = true
      while(num--) {
        await this.savePageByPath(paths[num]).catch(e => {
          this.$message.error(this.$t("editor.saveFail"));
          isSuccess = false
        })
      }
      isSuccess && this.$message({
          message: this.$t("editor.saveSuccess"),
          type: 'success'
        });
      this.savePending = false
    }
  },
  components: {
    NewWebsiteDialog
  },
  filters: {
    sortBy: (list, key) => list.sort((obj1,obj2) =>{
      let val1 = obj1[key]
      let val2 = obj2[key]
      if(val1 < val2){
        return -1
      }else if(val1 > val2){
        return 1
      }else{
        return 0
      }
    })
  }
}
</script>

<style lang='scss'>
.file-manager {
  height: 100%;
  background-color: #ccd3da;
  overflow-y: auto;
  .opened-files-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 20px;
    .opened-files-buttons {
      .iconfont {
        color: #535353;
        font-size: 22px;
        &:hover {
          color: #3ba4ff;
        }
      }
    }
  }
  h1 {
    font-size: 16px;
    color: #333;
    margin: 0;
    padding-left: 18px;
    position: relative;
  }
  .toggle-bar {
    cursor: pointer;
  }
  .toggle-bar .el-icon-arrow-right {
    position: absolute;
    left: 4px;
    top: 6px;
    font-weight: bold;
    font-size: 12px;
  }
  .is-active h1 {
    margin: 0 0 12px 0;
  }
  .is-active .el-icon-arrow-right {
    transform: rotate(90deg);
  }
  a {
    text-decoration: none;
  }
  .el-tree {
    color: #535353;
  }

  .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .file-manager-buttons-container {
      display: none;
    }
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #ccfffc;
  }
  .el-tree-node__content:hover {
    background-color: #ccfffc;
    .file-manager-buttons-container {
      display: inline-block !important;
      line-height: 38px !important;
    }
  }
  .el-tree-node__content {
    height: 32px;
    line-height: 32px;
    padding-left: 15px;
  }
  .el-tree-node__expand-icon {
    font-weight: bold;
    color: #535353;
  }
  .el-tree-node__expand-icon.is-leaf {
    color: transparent;
  }
  .el-icon-caret-right:before {
    content: '\E604';
  }
  .el-tree-node__label {
    width: 100%;
    position: relative;
    padding-left: 20px;
  }
  .node-icon {
    position: absolute;
    left: 0;
  }
  .file-manager-buttons-container {
    position: absolute;
    right: 20px;
  }
  .file-manager-buttons-container .iconfont {
    font-size: 20px;
    color: #777;
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
  .icon-file__ {
    font-weight: bold;
    color: #000;
  }
  .icon-private {
    color: #f48622;
  }
  .icon-common_websites {
    color: #4c97d1;
  }

  .tree-item {
    background-color: #fff;
    padding: 8px 0 9px 20px;
    margin-bottom: 8px;
  }
  .tree-item.is-active {
    padding: 6px 0 6px 20px;
  }
  .info {
    font-size: 14px;
    color: #c0c4cc;
    margin: 0 0 10px 0;
  }
  .el-button--text {
    padding: 0;
  }
  .empty {
    padding-left: 35px;
  }

  .icon-edited_file.is-modified {
    color: #f4b622;
  }
  .el-loading-spinner .circular {
    width: 22px;
  }
}
</style>
