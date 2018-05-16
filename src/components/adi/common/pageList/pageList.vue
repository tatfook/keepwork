<template>
  <div class='comp-pagelist'>
    <el-collapse-transition>
      <el-tree :data="filter(data)" :props="defaultProps" :render-content="renderContent" :filter-node-method="filterNode" ref="tree2" default-expand-all></el-tree>
    </el-collapse-transition>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import { gitTree2NestedArray } from '@/lib/utils/gitlab'

export default {
  name: 'AdiPageList',
  mixins: [compBaseMixin],
  async created() {
    await this.getRepositoryTree({ path: this.activePageInfo.sitepath })

    let allFiles = this.repositoryTreesAllFiles
    let filterFiles = []

    _.forEach(allFiles, (item, key) => {
      let beAdd = true

      if (item.path.split('/')[2] == '_config') {
        beAdd = false
      }

      if (item.path.match('.gitignore.md')) {
        beAdd = false
      }

      if (beAdd) {
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
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    ...mapActions({
      getRepositoryTree: 'gitlab/getRepositoryTree'
    }),
    handleNodeClick(data) {
      console.log(data)
    },
    renderContent(h, { data, note, store }) {
      return <div>{data.name}</div>
    },
    filter(data) {
      let p = this.properties.input

      if (p.indexOf(' ') !== -1) {
        p = p.split(' ').join('.*')
      }
      if (p.indexOf('*') !== -1) {
        p = p.split('*').join('.*')
      }
      if (p.indexOf('?') !== -1) {
        p = p.split('?').join('.')
      }
      if (p.indexOf('||') !== -1) {
        let index = p.indexOf('||')
        let stringA = p.substring(0, index)
        let stringB = p.substring(index + 2)
        p = stringA
        var pB = stringB
      }
      if (p.indexOf('&&') !== -1) {
        let index = p.indexOf('&&')
        let stringA = p.substring(0, index)
        let stringB = p.substring(index + 2)
        p = stringA + stringB
        var pB = stringB + stringA
      }
      if (p.indexOf('!') !== -1) {
        let index = p.indexOf('!')
        let stringA = p.substring(0, index)
        let stringB = p.substring(index + 1)
        p = stringA.split(stringB).join('')
      }

      if (p === '') {
        var temp = null
        var tempB = null
      } else {
        var temp = `^${p}$`
        var tempB = `^${pB}$`
      }

      let reg = new RegExp(temp, 'i')
      let regB = new RegExp(tempB, 'i')

      let arr = []

      let find = data => {
        for (let i in data) {
          if (data[i].type == 'blob') {
            if (data[i].name.match(reg) || data[i].name.match(regB)) {
              arr.push(data[i])
            } else {
              continue
            }
          } else {
            //如果是文件夹就递归
            if (data[i].children) {
              find(data[i].children)
            } else {
              continue
            }
          }
        }
      }
      find(data)
      if (p === '') {
        return data
      } else {
        return arr
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-pagelist {
  width: auto;
}
</style>

<style lang="scss">
.comp-pagelist {
  .el-tree__empty-block {
    min-height: auto;
  }
  .el-tree__empty-text {
    position: relative;
    left: auto;
    top: auto;
  }
}
</style>
