<template>
  <div class="student-evaluations">
    <div class="student-evaluations-header">
      我的评估报告
      <div class="student-evaluations-header-back" @click="goBack">
        返回 &gt;
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudentEvaluations',
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.student-evaluations {
  &-header {
    height: 60px;
    padding: 0 24px;
    font-size: 16px;
    &-back {
      float: right;
      color: #999;
      cursor: pointer;
    }
  }
}
</style>
