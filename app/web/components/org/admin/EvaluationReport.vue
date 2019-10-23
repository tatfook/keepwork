<template>
  <div class="evaluation-report">
    <div class="evaluation-report-item">
      <div class="evaluation-report-header">
        <span class="evaluation-report-header-title">评估报告</span>
        <el-dropdown class="evaluation-report-header-dropdown">
          <span class="el-dropdown-link">
            {{selectDayOption.text}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(dayOption, index) in dayOptions" :key="index">{{dayOptions.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <annulus-chart class="evaluation-report-annulus" :annulusData="annulusData" :isTooltipFormater="true" />
    </div>
    <div class="evaluation-report-item">
      <line-chart class="evaluation-report-line" :lineData="lineData" />
    </div>
    <div class="evaluation-report-item">
      <div class="evaluation-report-item-header">
        班级点评详情
        <div class="evaluation-report-item-search">
          <el-input placeholder="按班级名称搜索" prefix-icon="el-icon-search" v-model="searchText">
          </el-input>
        </div>
      </div>
      <el-table size="medium" :data="tableData" border class="evaluation-report-item-table">
        <el-table-column prop="name" label="班级名称"></el-table-column>
        <el-table-column prop="teacherNames" label="老师姓名" width="132"></el-table-column>
        <el-table-column prop="commentCount" label="点评（次）" width="126"></el-table-column>
        <el-table-column prop="sendCount" label="发送给家长（次）" width="134"></el-table-column>
        <el-table-column width="110">
          <template slot-scope="scope">
            <div class="evaluation-report-item-table-btn" @click="goCommentDetail(scope.row)">查看</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import AnnulusChart from '@/components/org/common/AnnulusChart'
import LineChart from '@/components/org/common/LineChart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'EvaluationReport',
  async mounted() {
    this.selectDayOption = this.dayOptions[0]
    try {
      await this.orgGetOrgClassReport({ days: this.selectDayOption.value })
    } catch (error) {
      console.error(error)
    }
  },
  data() {
    return {
      searchText: '',
      dayOptions: [
        {
          value: 30,
          text: '近30天'
        },
        {
          value: 7,
          text: '近7天'
        },
        {
          value: null,
          text: '全部'
        }
      ],
      selectDayOption: {}
    }
  },
  computed: {
    ...mapGetters({
      getClassReportByDays: 'org/student/getClassReportByDays'
    }),
    classReport() {
      let classReport =
        this.getClassReportByDays({ days: this.selectDayOption.value }) || []
      return _.map(classReport, report => {
        let { commentCount, sendCount } = report
        return {
          ...report,
          commentCount: commentCount || 0,
          sendCount: sendCount || 0
        }
      })
    },
    tableData() {
      return _.filter(this.classReport, report => {
        return new RegExp(this.searchText).test(report.name)
      })
    },
    annulusData() {
      let groupedByStatus = _.groupBy(this.classReport, 'status')
      const self = this
      const totalLength = this.classReport.length
      return _.map(groupedByStatus, groupItem => {
        let status = groupItem[0].status
        let statusClasses = _.filter(self.classReport, { status }) || []
        let length = statusClasses.length
        let statusText =
          status == 1 ? '发送给家长' : status == 2 ? '点评（待发送）' : '未点评'
        let percent = _.round((length / totalLength) * 100, 0)
        return {
          status: `${statusText} ${percent}%`,
          count: length,
          classes: statusClasses
        }
      })
    },
    lineData() {
      return this.classReport
    }
  },
  methods: {
    ...mapActions({
      orgGetOrgClassReport: 'org/student/getOrgClassReport'
    }),
    goCommentDetail(detail) {
      let { classId } = detail
      this.$router.push({
        name: 'ClassEvaluation',
        params: {
          classId
        }
      })
    }
  },
  components: {
    AnnulusChart,
    LineChart
  }
}
</script>
<style lang="scss" scoped>
.evaluation-report {
  &-item {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 15px;
    padding: 0 28px;
    font-size: 14px;
    &:last-child {
      margin-bottom: 0;
    }
    &-header {
      color: #000;
      padding: 28px 0 0 24px;
    }
    &-search {
      display: inline-block;
      margin-left: 46px;
      /deep/.el-input__inner {
        border: none;
      }
    }
    &-table {
      margin: 0 0 40px 24px;
      width: 640px;
      font-size: 14px;
      color: #555;
      &-btn {
        color: #2397f3;
        cursor: pointer;
        text-align: center;
      }
      /deep/th {
        font-weight: normal;
        background-color: #fafafa;
        color: #000;
      }
    }
  }
  &-header {
    padding: 32px 0;
    border-bottom: 1px solid #cacaca;
    font-size: 18px;
    color: #000;
    display: flex;
    justify-content: center;
    &-title {
      flex: 1;
    }
    &-dropdown {
      font-size: 14px;
    }
  }
  &-annulus {
    padding: 35px 0 42px;
  }
  &-line {
    padding: 40px 0 40px 36px;
  }
}
</style>
