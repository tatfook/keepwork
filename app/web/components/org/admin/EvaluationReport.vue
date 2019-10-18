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
      <annulus-chart class="evaluation-report-annulus" />
    </div>
    <div class="evaluation-report-item">
      <line-chart class="evaluation-report-line" />
    </div>
    <div class="evaluation-report-item">
      <div class="evaluation-report-item-header">
        班级点评详情
        <div class="evaluation-report-item-search">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText">
          </el-input>
        </div>
      </div>
      <el-table size="medium" :data="classesCommentDetail" border class="evaluation-report-item-table">
        <el-table-column prop="name" label="班级名称"></el-table-column>
        <el-table-column prop="teacherNames" label="老师姓名" width="132"></el-table-column>
        <el-table-column prop="commentCount" label="点评（次）" width="126"></el-table-column>
        <el-table-column prop="sendCount" label="发送给家长（次）" width="134"></el-table-column>
        <el-table-column width="110">
          <template slot-scope="scope">
            <span @click="goCommentDetail(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import AnnulusChart from '@/components/org/common/AnnulusChart'
import LineChart from '@/components/org/common/LineChart'
export default {
  name: 'EvaluationReport',
  mounted() {
    this.selectDayOption = this.dayOptions[0]
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
      selectDayOption: {},
      classesCommentDetail: [
        {
          classId: 112,
          name: '开发班级',
          teacherNames: '赵敏',
          sendCount: 1,
          commentCount: 2,
          status: '发送给家长'
        },
        {
          classId: 112,
          name: '逻辑班级',
          teacherNames: 'waky',
          sendCount: 1,
          commentCount: 5,
          status: '发送给家长'
        },
        {
          classId: 112,
          name: '建模班级',
          teacherNames: 'wivi',
          sendCount: 1,
          commentCount: 3,
          status: '发送给家长'
        }
      ]
    }
  },
  methods: {
    goCommentDetail(detail) {
      console.log(detail)
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
