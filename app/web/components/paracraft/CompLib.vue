<template>
  <div class="comp-lib" v-loading="isLoading">
    <div class="comp-lib-header">
      <el-input size="small" placeholder="请输入搜索内容..." v-model="seachContent" clearable @blur="search" @keyup.enter.native="search" @clear="search">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
    </div>
    <el-row type="flex" class="comp-lib-main">
      <el-col class="comp-lib-sidebar">
        <el-tree :data="compsClassList" node-key="id" :props="defaultProps" :indent="12" @node-click="handleNodeClick">
          <span slot-scope="{ node, data }" class="comp-lib-tree-label" :class="{'comp-lib-tree-active': data.id === activeClassId}">{{ node.label }}</span>
        </el-tree>
      </el-col>
      <el-col class="comp-lib-container">
        <el-row type="flex" class="comp-lib-content">
          <el-col :span="8" class="comp-lib-item" v-for="(comp, index) in systemCompsRows" :key="index">
            <comp-item :compDetail='comp'></comp-item>
          </el-col>
        </el-row>
        <div class="comp-lib-pagination" v-if="totalCount>0">
          <el-pagination background @size-change="handleSizeChange" @current-change="changePage" :current-page="nowPage" :page-size="perPage" :page-sizes="[3,30,60,90,120,180,240,300]" :total="totalCount" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CompItem from './common/CompItem'
import { mapActions, mapGetters } from 'vuex'

const AllClassId = 'all'
const DefaultPageSize = 60
export default {
  name: 'CompLib',
  async created() {
    this.isLoading = true
    await Promise.all([this.getSystemClassifies(), this.getCompList()])
    this.isLoading = false
  },
  data() {
    return {
      perPage: DefaultPageSize,
      nowPage: 1,
      searchWord: '',
      isLoading: false,
      allClassObj: { name: '全部', id: AllClassId },
      activeClassId: AllClassId,
      seachContent: '',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  computed: {
    ...mapGetters({
      systemClassifies: 'paracraft/systemClassifies',
      systemComps: 'paracraft/systemComps',
    }),
    compsClassList() {
      const parents = _.filter(this.systemClassifies, item => item.parentId === 0)
      const children = _.filter(this.systemClassifies, item => item.parentId)
      const translator = (parents, children) => {
        _.forEach(parents, parent => {
          _.forEach(children, (current, index) => {
            if (current.parentId === parent.id) {
              const temp = JSON.parse(JSON.stringify(children))
              temp.splice(index, 1)
              translator([current], temp)
              Array.isArray(parent.children) ? parent.children.push(current) : (parent.children = [current])
            }
          })
        })
      }
      translator(parents, children)
      return _.concat([this.allClassObj], parents || [])
    },
    totalCount() {
      return this.systemComps.count || 0
    },
    systemCompsRows() {
      return this.systemComps.rows || []
    },
    getCompListParams() {
      return _.omit(
        {
          'x-per-page': this.perPage,
          'x-page': this.nowPage,
          keyword: this.searchWord ? this.searchWord : null,
          pClassifyId: this.activeClassId == AllClassId ? null : this.activeClassId,
        },
        _.isNull,
      )
    },
  },
  methods: {
    ...mapActions({
      getSystemClassifies: 'paracraft/getSystemClassifies',
      getSystemComps: 'paracraft/getSystemComps',
    }),
    handleSizeChange(val) {
      this.perPage = val
      this.resetNowPage()
      this.getCompList()
    },
    changePage(nowPage) {
      this.nowPage = nowPage
      this.getCompList()
    },
    handleNodeClick(data) {
      if (!data.children) {
        this.activeClassId = data.id
        this.resetNowPage()
        this.getCompList()
      }
    },
    search() {
      this.resetNowPage()
      this.activeClassId = AllClassId
      this.searchWord = this.seachContent
      this.getCompList()
    },
    async getCompList() {
      this.isLoading = true
      try {
        await this.getSystemComps(this.getCompListParams)
      } catch (error) {}
      this.isLoading = false
    },
    resetNowPage() {
      this.nowPage = 1
    },
  },
  components: {
    CompItem,
  },
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
    padding: 14px 36px;
    font-weight: bold;
    .el-icon-search {
      cursor: pointer;
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
  &-container {
    padding-bottom: 48px;
    position: relative;
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
  &-pagination {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
