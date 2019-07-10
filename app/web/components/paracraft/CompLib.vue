<template>
  <div class="comp-lib">
    <el-row type="flex" class="comp-lib-header" align="middle">
      <el-col class="comp-lib-header-left">元件库</el-col>
      <el-col class="comp-lib-header-right">
        <el-input size="small" placeholder="请输入搜索内容..." v-model="seachContent">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <i class="el-icon-close" @click="closeCompsLib"></i>
      </el-col>
    </el-row>
    <el-row type="flex" class="comp-lib-main">
      <el-col class="comp-lib-sidebar">
        <el-tree :data="compsClassList" node-key="id" :default-expanded-keys="defaultExpandedKeys" :props="defaultProps" :indent="12" @node-click="handleNodeClick">
          <span slot-scope="{ node, data }" class="comp-lib-tree-label" :class="{'comp-lib-tree-active': data.id === activeClassId}">{{ node.label }}</span>
        </el-tree>
      </el-col>
      <el-col>
        <el-row type="flex" class="comp-lib-content">
          <el-col :span="8" class="comp-lib-item" v-for="(comp, index) in compsList" :key="index">
            <comp-item :compDetail='comp'></comp-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CompItem from './common/CompItem'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CompLib',
  async mounted() {
    await Promise.all([this.getSystemClassifies(), this.getSystemComps()])
    this.initActiveClassifyId()
  },
  data() {
    return {
      activeClassId: undefined,
      defaultExpandedKeys: [],
      seachContent: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters({
      systemClassifies: 'paracraft/systemClassifies',
      systemComps: 'paracraft/systemComps'
    }),
    compsClassList() {
      const parents = _.filter(
        this.systemClassifies,
        item => item.parentId === 0
      )
      const children = _.filter(this.systemClassifies, item => item.parentId)
      const translator = (parents, children) => {
        _.forEach(parents, parent => {
          _.forEach(children, (current, index) => {
            if (current.parentId === parent.id) {
              const temp = JSON.parse(JSON.stringify(children))
              temp.splice(index, 1)
              translator([current], temp)
              Array.isArray(parent.children)
                ? parent.children.push(current)
                : (parent.children = [current])
            }
          })
        })
      }
      translator(parents, children)
      return parents || []
    },
    classifiesKeyById() {
      return _.keyBy(this.systemClassifies, 'id')
    },
    activeClassifyComps() {
      return _.get(
        this.classifiesKeyById,
        `${this.activeClassId}.pBlockClassifies`,
        []
      )
    },
    compsKeyById() {
      return _.keyBy(this.systemComps, 'id')
    },
    compsList() {
      return (
        _.map(this.activeClassifyComps, ({ blockId }) => {
          return this.compsKeyById[blockId]
        }) || []
      )
    }
  },
  methods: {
    ...mapActions({
      getSystemClassifies: 'paracraft/getSystemClassifies',
      getSystemComps: 'paracraft/getSystemComps'
    }),
    closeCompsLib() {
      alert('closeCompsLib')
    },
    handleNodeClick(data) {
      if (!data.children) {
        this.activeClassId = data.id
      }
    },
    initActiveClassifyId(classifyItem) {
      classifyItem = classifyItem || this.compsClassList[0]
      let { children } = classifyItem
      if (children) {
        this.initActiveClassifyId(children)
        this.defaultExpandedKeys.push(classifyItem.id)
        return
      }
      this.activeClassId = _.isArray(classifyItem)
        ? classifyItem[0].id
        : classifyItem.id
    }
  },
  components: {
    CompItem
  }
}
</script>
<style lang="scss" scoped>
.comp-lib {
  height: 100vh;
  position: relative;
  &-header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    height: 60px;
    padding: 0 16px 0 36px;
    font-weight: bold;
    &-right {
      white-space: nowrap;
      width: auto;
    }
    .el-input {
      width: 240px;
    }
    .el-icon-close {
      font-size: 24px;
      vertical-align: middle;
      margin-left: 72px;
      cursor: pointer;
    }
  }
  &-main {
    background-color: #f5f5f5;
    height: 100%;
    padding-top: 60px;
  }
  &-sidebar {
    width: 162px;
    background-color: #fff;
    flex-shrink: 0;
    padding: 16px 12px;
  }
  &-tree {
    &-label {
      font-size: 14px;
    }
    &-active {
      color: #2397f3;
      font-weight: bold;
    }
  }
  &-content {
    flex-wrap: wrap;
    padding: 16px 8px;
    overflow: auto;
    max-height: 100%;
  }
  &-item {
    margin-bottom: 16px;
    padding: 0 8px;
  }
}
</style>
