<template>
  <div class='comp-pagelist'>
    <el-collapse-transition>
      <el-tree :data="filter(data)" :props="defaultProps" :render-content="renderContent" :filter-node-method="filterNode" ref="tree" default-expand-all></el-tree>
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
      this.$refs.tree.filter(val)
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
      let regString = this.properties.input
      let regStringB

      if (regString === '') {
        return data
      }

      if (regString.indexOf('*') !== -1) {
        regString = regString.split('*').join('.*')
      }
      if (regString.indexOf('?') !== -1) {
        regString = regString.split('?').join('.')
      }
      if (regString.indexOf('||') !== -1) {
        let index = regString.indexOf('||')
        let stringA = regString.substring(0, index)
        let stringB = regString.substring(index + 2)

        regString = stringA
        regStringB = stringB
      }
      if (regString.indexOf('&&') !== -1) {
        let index = regString.indexOf('&&')
        let stringA = regString.substring(0, index)
        let stringB = regString.substring(index + 2)

        regString = stringA + stringB
        regStringB = stringB + stringA
      }
      if (regString.indexOf('!') !== -1) {
        let index = regString.indexOf('!')
        let stringA = regString.substring(0, index)
        let stringB = regString.substring(index + 1)

        regString = stringA.split(stringB).join('')
      }

      let reg = new RegExp(`^${regString}$`, 'i')
      let regB = new RegExp(`^${regStringB}$`, 'i')

      let newData = []

      let find = (data, isSub) => {
        let insertItems = []
        let tempData
        let hasSub = false

        if(isSub) {
          tempData = data.children
        } else {
          tempData = data
        }

        _.forEach(tempData, (item, key) => {
          if (item.type == 'blob') {
            if (item.name.match(reg) || item.name.match(regB)) {
              if(isSub){
                hasSub = true
                insertItems.push(item)
              } else {
                newData.push(item)
              }
            }
          } else if (item.type == 'tree'){
            if (item.children && item.children.length > 0) {
              find(item, true)
            }
          }
        })

        if(isSub && hasSub){
          let cloneData = _.cloneDeep(data)
          cloneData.children = insertItems
          newData.push(cloneData)
        }
      }

      find(data)

      return newData
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
