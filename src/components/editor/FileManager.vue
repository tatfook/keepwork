<template>
  <div class="file-manager" v-loading="loading">
    <h2>文件管理</h2>
    <el-tree
      v-show="!loading"
      :data="personalSiteList"
      :props="filesTreeProps"
      accordion
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
      filesTreeProps: {
        children: 'children',
        label: 'name',
        isLeaf(data, node) {
          return !_.has(data, 'children')
        }
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
      node.loading = true
      let {username, name, projectId} = data
      //todo, if it's file, open the file
      this.getRepositoryTree({
        projectId,
        path: `${ username }/${ name }`,
        recursive: true
      }).then(() => {
        node.loading = false
      })
      console.log('handleNodeClick: ', data, node);
    }
  }
}
</script>
