<template>
  <div class="file-manager" v-loading="loading">
    <div class="my-tree tree-item">
      <h1>我创建的网站</h1>
      <el-tree v-if="personalSiteList.length > 0" ref='fileManagerTree' v-show="!loading" node-key="path" :data="personalSiteList" :props="filesTreeProps" :render-content="renderContent" highlight-current @node-click="handleNodeClick">
      </el-tree>
      <div class="empty" v-if="personalSiteList.length <= 0">
        <p class="info">还没有创建网站</p>
        <el-button type='text'>现在创建</el-button>
      </div>
    </div>
    <div class="joined-tree tree-item">
      <h1>我参与的网站</h1>
      <div class="empty">
        <p class="info">获得他人网站的编辑权限后，将会在这里显示</p>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import FileManagerCustomTreeNode from './FileManagerCustomTreeNode'

export default {
  name: 'FileManager',
  data() {
    return {
      loading: true,
      filesTreeProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.getAllPersonalSite().then(() => {
      this.loading = false
    })
    this.initUrlExpandSelect()
  },
  computed: {
    ...mapGetters({
      personalSiteList: 'user/personalSiteList',
      filemanagerTreeNodeExpandMapByPath: 'filemanagerTreeNodeExpandMapByPath'
    })
  },
  methods: {
    ...mapActions({
      getAllPersonalSite: 'user/getAllPersonalSite',
      getRepositoryTree: 'gitlab/getRepositoryTree',
      updateFilemanagerTreeNodeExpandMapByPath:
        'updateFilemanagerTreeNodeExpandMapByPath'
    }),
    initUrlExpandSelect() {
      let fileManagerTree = this.$refs.fileManagerTree
      if (!fileManagerTree) {
        return
      }
      let nowPath = this.$route.path.replace(/^\//, '')
      let pathArr = nowPath.split('/')
      let pathArrLen = pathArr.length
      var levelPath = pathArr[0]
      for (let index = 1; index < pathArrLen - 1; index++) {
        levelPath += '/' + pathArr[index]
        this.updateFilemanagerTreeNodeExpandMapByPath({
          path: levelPath,
          expanded: true
        })
      }
      levelPath += '/' + pathArr[pathArrLen - 1]
      fileManagerTree.setCurrentKey(levelPath + '.md')
    },
    renderContent(h, { node, data, store }) {
      // trick codes below
      // manipulated the node in <el-tree/>
      node.isLeaf = data.type === 'blob'
      // restore node expand status
      let path = data.path || `${data.username}/${data.name}`
      node.expanded = this.filemanagerTreeNodeExpandMapByPath[path]

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
    margin: 0 0 12px 0;
    padding-left: 18px;
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
    color: #333;
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
  .icon-ziyuan9 {
    font-weight: bold;
    color: #000;
  }
  .icon-ziyuan17 {
    color: #f48622;
  }
  .icon-gongyouwangzhan {
    color: #4c97d1;
  }

  .tree-item {
    background-color: #fff;
    padding: 16px 0;
    margin-bottom: 8px;
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
}
</style>