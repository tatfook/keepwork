<template>
  <div class="file-manager" v-loading="loading">
    <h2>文件管理</h2>
    <el-tree
      v-show="!loading"
      :data="personalSiteList"
      :props="filesTreeProps"
      node-key="name"
      :default-expanded-keys="defaultExpandedKeys"
      @node-click="handleNodeClick">
    </el-tree>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex';

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
    ... mapGetters({
      personalSiteList: 'user/personalSiteList'
    })
  },
  methods: {
    ... mapActions({
      getAllPersonalSite: 'user/getAllPersonalSite',
      getRepositoryTree: 'gitlab/getRepositoryTree'
    }),
    handleNodeClick(data, node, component) {
      //try open files list in site level
      if (node.level === 1 && _.isEmpty(data.children)) {
        let {username, name, projectId} = data
        node.loading = true
        this.defaultExpandedKeys[0] !== name && (this.defaultExpandedKeys = [])
        this.getRepositoryTree({
          projectId,
          path: `${ username }/${ name }`,
          recursive: true
        }).then(() => {
          this.defaultExpandedKeys[0] !== name && (this.defaultExpandedKeys = [name])
        })
      }
      //try open file
      if (data.type === 'blob') {
        this.$router.push('/' + data.path)
      }
    }
  }
}
</script>

<style lang="scss">
.file-manager {
  &>.el-tree {
    &>.el-tree-node {
      &>.el-tree-node__content {
        &>.el-tree-node__expand-icon {
          color: #c0c4cc;
          cursor: pointer;
        }
      }
    }
  } 
}
</style>
