<template>
  <div class="student-evaluations">
    <div class="student-evaluations-header">
      我的评估报告
      <div class="student-evaluations-header-back" @click="goBack">
        返回 &gt;
      </div>
    </div>
    <div class="student-evaluations-main">
      <el-tabs class="student-evaluations-tabs" v-model="activeName" type="card">
        <el-tab-pane label="数据统计" name="statics">数据统计</el-tab-pane>
        <el-tab-pane label="历次点评详情" name="comments">
          <comment-list></comment-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import CommentList from './common/CommentList'
export default {
  name: 'StudentEvaluations',
  data() {
    return {
      activeName: 'comments'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  },
  components: {
    CommentList
  }
}
</script>
<style lang="scss" scoped>
.student-evaluations {
  background-color: #fff;
  min-height: 420px;
  &-header {
    height: 60px;
    padding: 0 24px;
    font-size: 16px;
    line-height: 60px;
    border-bottom: 1px solid #e8e8e8;
    &-back {
      float: right;
      color: #999;
      cursor: pointer;
    }
  }
  &-main {
    padding: 24px;
  }
}
</style>
