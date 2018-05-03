<template>
  <div>
    <el-collapse-transition>
      <el-tree :data="data" :props="defaultProps" :render-content="renderContent"></el-tree>
    </el-collapse-transition>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';
import { gitTree2NestedArray } from '@/lib/utils/gitlab'

export default {
  name: 'AdiPageList',
  mixins: [compBaseMixin],
  async created() {
    await this.getRepositoryTree({ path: this.activePageInfo.sitepath })

    let allFiles = this.repositoryTreesAllFiles;
    let filterFiles = [];

    _.forEach(allFiles, (item, key) => {
      let beAdd = true

      if(item.path.split('/')[2] == '_config') {
        beAdd = false
      }

      if(item.path.match('.gitignore.md')) {
        beAdd = false
      }

      if(beAdd) {
        filterFiles.push(item)
      }
    })

    this.data = gitTree2NestedArray(filterFiles, this.activePageInfo.sitepath)
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      repositoryTreesAllFiles: 'gitlab/repositoryTreesAllFiles'
    })
  },
  methods: {
    ...mapActions({
      getRepositoryTree: 'gitlab/getRepositoryTree',
    }),
    handleNodeClick(data) {
      console.log(data)
    },
    renderContent(h, { data, note, store }) {
      return <div>{data.name}</div>
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
