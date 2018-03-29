<template>
  <div class="file-manager" v-loading="loading">
    <h2>文件管理</h2>
    <el-tree
      v-show="!loading"
      node-key="name"
      :data="personalSiteList"
      :props="filesTreeProps"
      :render-content="renderContent"
      @node-click="handleNodeClick">
    </el-tree>
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
  },
  computed: {
    ... mapGetters({
      personalSiteList: 'user/personalSiteList',
      filemanagerTreeNodeExpandMapByPath: 'filemanagerTreeNodeExpandMapByPath'
    })
  },
  methods: {
    ...mapActions({
      getAllPersonalSite: 'user/getAllPersonalSite',
      getRepositoryTree: 'gitlab/getRepositoryTree',
      updateFilemanagerTreeNodeExpandMapByPath: 'updateFilemanagerTreeNodeExpandMapByPath'
    }),
    renderContent(h, { node, data, store }) {
      // trick codes below
      // manipulated the node in <el-tree/>
      node.isLeaf = data.type === 'blob'
      // restore node expand status
      let path = data.path || `${ data.username }/${ data.name }`
      node.expanded = this.filemanagerTreeNodeExpandMapByPath[path]

      return <FileManagerCustomTreeNode data={data} node={node}/>
    },
    async handleNodeClick(data, node, component) {
      // save node expand status
      let path = data.path || `${ data.username }/${ data.name }`
      this.updateFilemanagerTreeNodeExpandMapByPath({path, expanded: node.expanded})

      // try open files list in site level
      let repositoryIsClickedAndFileListIsEmpty = node.level === 1 && _.isEmpty(data.children)
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

<style lang="scss">
// .file-manager {
// }
</style>