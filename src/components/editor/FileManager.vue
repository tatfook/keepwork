<template>
  <div class="file-manager" v-loading="loading">
    <h2>文件管理</h2>
    <el-tree v-show="!loading" node-key="name" :data="personalSiteList" :props="filesTreeProps" :default-expanded-keys="defaultExpandedKeys" :render-content="renderContent" @node-click="handleNodeClick">
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
      defaultExpandedKeys: [],
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
    ...mapGetters({
      personalSiteList: 'user/personalSiteList'
    })
  },
  methods: {
    ...mapActions({
      getAllPersonalSite: 'user/getAllPersonalSite',
      getRepositoryTree: 'gitlab/getRepositoryTree'
    }),
    renderContent(h, { node, data, store }) {
      // trick codes, manipulated the node in <el-tree/>
      node.isLeaf = data.type === 'blob'
      return <FileManagerCustomTreeNode data={data} node={node} />
    },
    async handleNodeClick(data, node, component) {
      //try open files list in site level
      let repositoryIsClickedAndFileListIsEmpty =
        node.level === 1 && _.isEmpty(data.children)
      if (repositoryIsClickedAndFileListIsEmpty) {
        let { username, name } = data
        let path = `${username}/${name}`
        let recursive = true

        node.loading = true
        this.defaultExpandedKeys[0] !== name && (this.defaultExpandedKeys = [])
        await this.getRepositoryTree({ path })
        this.defaultExpandedKeys[0] !== name &&
          (this.defaultExpandedKeys = [name])
      }

      //try open file
      let isFileClicked = data.type === 'blob'
      isFileClicked && this.$router.push('/' + data.path)
    }
  }
}
</script>

<style lang="scss">
// .file-manager {
// }
</style>