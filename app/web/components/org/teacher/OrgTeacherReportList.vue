<template>
  <div class="teacher-report-list" v-loading="fullLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="#fff">
    <div v-show="!fullLoading && reportCount > 0">
      <div class="teacher-report-list-header">
        <span>点评次数: {{reportCount}} </span>
        <el-button type="primary" size="small" @click="handleCreateEvaluationReport">发起点评</el-button>
      </div>
      <div class="teacher-report-list-search">
        报告类型：
        <el-dropdown class="search-dropdown" @command="handleSearchByType">
          <span class="el-dropdown-link">
            {{reportTypeName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">全部</el-dropdown-item>
            <el-dropdown-item command="1">小评</el-dropdown-item>
            <el-dropdown-item command="2">阶段总结</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <span class="search-input">
          <el-input placeholder="按报告名称搜索" v-model="reportName">
            <template slot="append">
              <i class="el-icon-search" @click="handleSearchByName"></i>
            </template>
          </el-input>
        </span>
      </div>
      <div class="teacher-report-list-table">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :data="currentClassReports" border="" style="width: 100%">
          <el-table-column prop="reportName" label="报告名称" width="120">
          </el-table-column>
          <el-table-column prop="type" label="报告类型" width="120">
          </el-table-column>
          <el-table-column label="创建时间" width="140">
            <template slot-scope="scope">
              <span>{{scope.row.createdAt | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已发送" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.sendCount}}人</span>
            </template>
          </el-table-column>
          <el-table-column label="已点评" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.commentCount}}人</span>
            </template>
          </el-table-column>
          <el-table-column label="待点评" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.waitComment}}人</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="toReportDetail(scope.row)" size="small">
                详情
              </el-button>
              <el-button @click.native.prevent="handleDeleteReport(scope.row.id)" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <org-teacher-report-empty v-show="!fullLoading && reportCount == 0"></org-teacher-report-empty>
  </div>
</template>

<script>
import OrgTeacherReportEmpty from './OrgTeacherReportEmpty'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'OrgTeacherReportList',
  components: {
    OrgTeacherReportEmpty
  },
  data() {
    return {
      reportName: '',
      reportType: 0,
      loading: false,
      fullLoading: true
    }
  },
  filters: {
    formatTime(value) {
      return moment(value).format('YYYY/MM/DD HH:mm')
    }
  },
  async created() {
    if (!this.classId) {
      this.$router.push({
        name: 'OrgTeacherReportList',
        query: {
          classId: this.firstClassId
        }
      })
    }
    await this.initPage()
  },
  watch: {
    $route(route) {
      this.resetSearchParams()
      this.initPage()
    }
  },
  methods: {
    ...mapActions({
      getClassEvaluationReportList: 'org/teacher/getClassEvaluationReportList',
      deleteClassEvaluationReport: 'org/teacher/deleteClassEvaluationReport'
    }),
    async initPage() {
      try {
        this.fullLoading = true
        await this.getClassEvaluationReportList({ classId: this.classId })
      } catch (error) {
        console.error(error)
      } finally {
        this.fullLoading = false
      }
    },
    resetSearchParams() {
      this.reportType = 0
      this.reportName = ''
    },
    async handleSearchByType(type) {
      this.reportType = _.toNumber(type)
      this.refreshReports()
    },
    async handleSearchByName() {
      this.refreshReports()
    },
    async refreshReports() {
      const params = { classId: this.classId }
      if (this.reportName) {
        params['name'] = this.reportName
      }
      if (this.reportType) {
        params['type'] = this.reportType
      }
      try {
        this.loading = true
        await this.getClassEvaluationReportList(params)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async toReportDetail({ id, ...rest }) {
      this.$router.push({
        name: 'OrgTeacherReportDetail',
        query: {
          classId: this.classId,
          reportId: id,
          ...rest
        }
      })
    },
    async handleDeleteReport(id) {
      this.$confirm('确定删除该报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            this.loading = true
            await this.deleteClassEvaluationReport({
              classId: this.classId,
              id
            })
            await this.refreshReports()
          } catch (error) {
            this.$message.error('删除失败')
            console.error(error)
          } finally {
            this.loading = false
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    handleCreateEvaluationReport() {
      this.$router.push({
        name: 'OrgTeacherReportEvaluation',
        query: this.$route.query
      })
    }
  },
  computed: {
    ...mapGetters({
      orgClassEvaluationReports: 'org/teacher/orgClassEvaluationReports',
      orgClassEvaluationReportCount:
        'org/teacher/orgClassEvaluationReportCount',
      orgClasses: 'org/teacher/orgClasses'
    }),
    classId() {
      return _.toNumber(this.$route.query.classId)
    },
    firstClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    currentClassReports() {
      return _.get(this.orgClassEvaluationReports, [this.classId], [])
    },
    reportCount() {
      return _.get(this.orgClassEvaluationReportCount, [this.classId], 0)
    },
    reportNameDict() {
      return {
        0: '全部',
        1: '小评',
        2: '阶段总结'
      }
    },
    reportTypeName() {
      return this.reportNameDict[this.reportType]
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-report-list {
  min-height: 489px;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24px;
    height: 57px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
  }

  &-search {
    height: 96px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 24px;
    .search-dropdown {
      border: 1px solid #e8e8e8;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      /deep/.el-dropdown-link {
        width: 110px;
        display: inline-block;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .search-input {
      display: inline-block;
      border-bottom: 1px solid #aaaaaa;
      margin-left: 47px;
      /deep/ .el-input__inner {
        border: none;
        height: 36px;
        line-height: 36px;
      }
      /deep/ .el-input-group__append {
        background: #fff;
        border: none;
        cursor: pointer;
        padding: 0 10px 0 0;
      }
    }
  }

  &-table {
    padding: 0 24px 24px;
    background: #fff;
  }
}
</style>