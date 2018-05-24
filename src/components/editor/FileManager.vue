<template>
  <div class="file-manager" v-loading="loading">

    <div class="joined-tree tree-item" :class="{'is-active': trees.isOpenedShow}">
      <h1 class="toggle-bar" @click='toggleContent("isOpenedShow")'>
        <i class="el-icon-arrow-right"></i> {{ $t('editor.openedFiles') }}
      </h1>
      <el-collapse-transition>
        <el-tree v-show="trees.isOpenedShow && openedTreeData.length > 0" ref='openedTree' node-key='path' :data="openedTreeData" :props="openedTreesProps" highlight-current @node-click="handleOpenedClick">
          <span class='joined-tree-node el-tree-node__label' slot-scope="{ node, data }">
            <span class="node-icon">
              <i class="iconfont icon-edited_file" :class="{'is-modified': data.isModified}"></i>
            </span>
            <span class=''>{{ node.label }}</span>
            <span class="file-manager-buttons-container">
              <el-button v-if='isSaveble(data)' v-loading='data.savePending' class="iconfont icon-save" size="mini" type="text" :title='$t("editor.save")' @click.stop='save(data)'>
              </el-button>
              <el-button class="iconfont icon-refresh" size="mini" type="text" :title='$t("editor.refresh")' @click.stop='refreshOpenedFile(data)'>
              </el-button>
              <el-button class="iconfont icon-delete____" size="mini" type="text" :title='$t("editor.close")' @click.stop='closeOpenedFile(data)'>
              </el-button>
              <el-button class="iconfont icon-delete" size="mini" type="text" :title='$t("editor.delete")' @click.stop="removeFile(data)">
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-collapse-transition>
    </div>

    <div class="my-tree tree-item" :class="{'is-active': trees.isMyShow}">
      <h1 class="toggle-bar" @click='toggleContent("isMyShow")'>
        <i class="el-icon-arrow-right"></i> {{ $t('editor.myPersonalWebsites') }}
      </h1>
      <el-collapse-transition>
        <el-tree v-show="personalSiteList.length > 0 && trees.isMyShow && !loading" ref='fileManagerTree' node-key="path" :data="personalSiteList" :props="filesTreeProps" :render-content="renderContent" highlight-current @node-click="handleNodeClick">
        </el-tree>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="empty" v-if="personalSiteList.length <= 0">
          <p class="info">{{ $t('editor.noPersonalWebsite') }}</p>
          <el-button type='text'>{{ $t('editor.createWebsiteNow') }}</el-button>
        </div>
      </el-collapse-transition>
    </div>

    <div class="joined-tree tree-item" :class="{'is-active': trees.isContributedShow}">
      <h1 class="toggle-bar" @click='toggleContent("isContributedShow")'>
        <i class="el-icon-arrow-right"></i> {{ $t('editor.myContributedWebsites') }}
      </h1>
      <el-collapse-transition>
        <el-tree v-show="contributedSiteList.length > 0 && trees.isContributedShow && !loading" ref='fileManagerTree' node-key="path" :data="contributedSiteList" :props="filesTreeProps" :render-content="renderContent" highlight-current @node-click="handleNodeClick">
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
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

export default {
  name: 'FileManager',
  data() {
    return {
      loading: true,
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
      }
    }
  },
  async mounted() {
    await this.getAllPersonalAndContributedSite().catch(err => {
      console.error(err)
    })
    this.loading = false
    this.initUrlExpandSelect()
  },
  computed: {
    ...mapGetters({
      personalSiteList: 'user/personalSiteList',
      personalSitePaths: 'user/personalSitePathMap',
      contributedSiteList: 'user/contributedSiteList',
      openedFiles: 'openedFiles',
      activePageUrl: 'activePageUrl',
      activePageInfo: 'activePageInfo',
      filemanagerTreeNodeExpandMapByPath: 'filemanagerTreeNodeExpandMapByPath'
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
    }
  },
  methods: {
    ...mapActions({
      getAllPersonalAndContributedSite: 'user/getAllPersonalAndContributedSite',
      getRepositoryTree: 'gitlab/getRepositoryTree',
      updateFilemanagerTreeNodeExpandMapByPath:
        'updateFilemanagerTreeNodeExpandMapByPath',
      savePageByPath: 'savePageByPath',
      refreshOpenedFile: 'refreshOpenedFile',
      closeOpenedFile: 'closeOpenedFile',
      gitlabRemoveFile: 'gitlab/removeFile'
    }),
    async initUrlExpandSelect() {
      let { isLegal, sitepath, fullPath, paths = [] } = this.activePageInfo
      if (!isLegal) {
        let closeAllFolder = this.personalSitePaths ? Object.keys(this.personalSitePaths).map(path => ({path, expanded: false})) : []
        return this.updateFilemanagerTreeNodeExpandMapByPath(closeAllFolder)
      }
      await this.getRepositoryTree({ path: sitepath })

      let folderPaths = paths.slice(0, paths.length - 1)
      let expandedFolderPaths = folderPaths.reduce((prev, current) => {
        let expanededPath = sitepath + '/' + (prev[prev.length-1] ? prev[prev.length-1] + '/' : '') + current
        return prev.concat(expanededPath)
      }, [])
      expandedFolderPaths.unshift(sitepath)
      let expandedFolderPathsList = expandedFolderPaths.map(path => ({path, expanded: true}))
      let appendCloseFolderPathsList = this.personalSitePaths ? Object.keys(this.personalSitePaths).filter(i => i !== sitepath).map(path => ({path, expanded: false})) : []
      this.updateFilemanagerTreeNodeExpandMapByPath([...expandedFolderPathsList, ...appendCloseFolderPathsList])
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
    handleOpenedClick(data, node) {
      let path = data.path
      let openedTree = this.$refs.openedTree
      this.$router.push('/' + path.replace(/\.md$/, ''))
      openedTree.setCurrentKey(path)
    },
    toggleContent(type) {
      this.trees[type] = !this.trees[type]
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
    isSaveble(nodeData) {
      let path = nodeData.path
      return path && this.openedFiles[path] && this.openedFiles[path].timestamp
    },
    removeFile(data) {
      let path = data.path
      let pathArr = path.split('/')
      let pageName = pathArr[pathArr.length - 1].replace(/.md$/, '')
      this.$confirm(`${this.$t('editor.delConfirm')} ${pageName} ${this.$t('editor.page')}?`, this.$t('editor.delNotice'), {
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel'),
        type: 'error'
      })
        .then(async () => {
          await this.gitlabRemoveFile({ path })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss'>
.file-manager {
  height: 100%;
  background-color: #ccd3da;

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

  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #ccfffc;
  }
  .el-tree-node__content:hover {
    background-color: #ccfffc;
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
