<template>
  <div class="teacher-evaluation-report">
    <div class="teacher-evaluation-report-header">
      <span>发起点评</span>
      <span>
        <el-button size="mini" @click="handleBack">取消</el-button>
        <el-button size="mini" @click="hanldeToComment" type="primary">去点评</el-button>
      </span>
    </div>
    <div class="teacher-evaluation-report-title">
      <div class="report-name">
        报告名称：
      </div>
      <el-form class="report-name-form" @submit.native.prevent ref="form" :model="form" :rules="rules">
        <el-form-item class="report-name-form-item" prop="reportName">
          <el-input class="report-name-input" placeholder="请输入" v-model="form.reportName"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <report-type v-model="selectedType"></report-type>
  </div>
</template>

<script>
import ReportType from './ReportType'
import { mapActions } from 'vuex'
export default {
  name: 'OrgTeacherReportEvaluation',
  components: {
    ReportType
  },
  data() {
    return {
      smallEvaluationLogo: require('@/assets/org/teacher/small_evaluation.png'),
      stageSummaryLogo: require('@/assets/org/teacher/stage_summary.png'),
      selectedType: 1,
      form: {
        reportName: ''
      },
      rules: {
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    selectedType(value) {
      console.log(value)
    }
  },
  computed: {
    classId() {
      return _.toNumber(this.$route.query.classId)
    }
  },
  methods: {
    ...mapActions({
      createClassEvaluationReport: 'org/teacher/createClassEvaluationReport'
    }),
    handleBack() {
      this.$router.back(-1)
    },
    hanldeToComment() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await this.createClassEvaluationReport({
              type: this.selectedType,
              name: this.form.reportName,
              classId: this.classId
            })
            this.$message.success('创建成功')
            this.$router.push({
              name: 'OrgTeacherReportList',
              query: this.$route.query
            })
          } catch (error) {
            console.error(error)
            this.$message.error('创建失败')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-evaluation-report {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 57px;
    padding: 0 24px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
  &-title {
    background: #fff;
    padding: 29px 24px 0;
    .report-name {
      color: #303133;
      font-size: 14px;
    }
    .report-name-form {
      margin-top: 13px;
      &-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>