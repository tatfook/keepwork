<template>
  <div class="teacher-report-empty">
    <img class="teacher-report-empty-logo" :src="noReportLogo" alt="没有点评">
    <div class="teacher-report-empty-tips">你还没有发起点评哦，点击下方按钮去发起你的第一次点评吧！</div>
    <el-button @click="handleCreateEvaluationReport" class="teacher-report-empty-button" type="primary">发起点评</el-button>
  </div>
</template>

<script>
export default {
  name: 'OrgTeacherReportEmpty',
  data() {
    return {
      noReportLogo: require('@/assets/org/teacher/report_grey.png')
    }
  },
  methods: {
    handleCreateEvaluationReport() {
      this.$router.push({
        name: 'OrgTeacherReportEvaluation',
        query: this.$route.query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-report-empty {
  min-height: 488px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  &-tips {
    font-size: 14px;
    color: #909399;
    margin-top: 41px;
  }
  &-button {
    margin-top: 21px;
    padding: 10px 20px;
  }
}
</style>