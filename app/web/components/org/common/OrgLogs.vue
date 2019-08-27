<template>
  <div class="org-logs" v-loading="isLoading">
    <div class="org-logs-header">机构日志</div>
    <div class="org-logs-container">
      <div class="org-logs-search">
        <el-date-picker size="medium" class="org-logs-search-item" v-model="searchParams.startTime" type="datetime" placeholder="开始时间">
        </el-date-picker>
        <el-select class="org-logs-search-item" clearable size="medium" v-model="searchParams.type" placeholder="事件类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-input class="org-logs-search-item" size="medium" v-model="searchParams.description" placeholder="包含内容"></el-input>
        <el-input class="org-logs-search-item" size="medium" v-model="searchParams.username" placeholder="操作者"></el-input>
        <el-button class="org-logs-search-button" type="primary" icon="el-icon-search" @click="searchLogs">搜索</el-button>
      </div>
      <el-table :default-sort="{ order:'descending', prop: 'logTime'}" size="small" :data="logsList" border class="org-logs-table">
        <el-table-column prop="logTime" label="时间" width="172">
        </el-table-column>
        <el-table-column prop="type" label="事件类型" width="172">
        </el-table-column>
        <el-table-column prop="description" label="内容" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="172">
        </el-table-column>
      </el-table>
      <div class="org-logs-pagination">
        <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.xPage" :page-size="searchParams.xPerPage" layout="prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'OrgLogs',
  mounted() {
    this.searchLogs()
  },
  data() {
    return {
      isLoading: false,
      searchParams: {
        startTime: '',
        type: '',
        description: '',
        username: '',
        xPage: 1,
        xPerPage: 15,
        xOrder: 'createdAt-desc'
      },
      typeOptions: ['系统', '老师', '学生', '班级', '课堂']
    }
  },
  computed: {
    ...mapGetters({
      currentOrgLogs: 'org/currentOrgLogs'
    }),
    totalCount() {
      return _.get(this.currentOrgLogs, 'count')
    },
    logsList() {
      return _.map(this.currentOrgLogs.rows, log => {
        let { createdAt } = log
        return {
          ...log,
          logTime: moment(createdAt).format('YYYY/MM/DD HH:MM')
        }
      })
    }
  },
  methods: {
    ...mapActions({
      orgGetSearchedLogs: 'org/getSearchedLogs'
    }),
    async searchLogs() {
      this.isLoading = true
      await this.orgGetSearchedLogs(this.searchParams).catch(() => {})
      this.isLoading = false
    },
    handleCurrentChange(currentPage) {
      this.searchParams.xPage = currentPage
      this.searchLogs()
    }
  }
}
</script>
<style lang="scss" scoped>
.org-logs {
  background-color: #fff;
  border-radius: 4px;
  &-header {
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    color: #333;
    padding-left: 24px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-container {
    padding: 32px 24px;
  }
  &-search {
    display: flex;
    margin-bottom: 34px;
    &-item {
      flex: 1;
      margin-right: 8px;
    }
    &-button {
      width: 78px;
      padding: 0;
      height: 36px;
      line-height: 36px;
    }
  }
  &-table {
    font-size: 14px;
    width: 100%;
  }
  &-pagination {
    text-align: center;
    margin-top: 32px;
  }
}
</style>
