<template>
  <div class="lesson-package-page">
    <div class="lesson-package-page-teachers">
      <div class="lesson-package-page-teachers-desc">
        <h4 class="lesson-package-page-teachers-desc-title">在线课程</h4>
        <p class="lesson-package-page-teachers-desc-text">每个在线课程附带详细的分布指导和实践项目。<br>我们的在线课程已授权给学校和培训机构，请与我们的合作机构联系，选择适合你的课程，开始学习之旅吧。</p>
        <span class="lesson-package-page-teachers-desc-more" @click="learnMore(teachingGroupLink)">与合作机构联系</span>
      </div>
    </div>
    <div class="lesson-package-page-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LessonPackage',
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.lesson-package-page {
  &-teachers {
    max-width: 1200px;
    margin: 0 auto 24px;
    min-height: 300px;
    background: url(../../assets/study/teacher.png) center top no-repeat;
    &-desc {
      max-width: 532px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
      }
      &-text {
        font-size: 14px;
        line-height: 30px;
      }
      &-more {
        display: inline-block;
        padding: 6px 22px;
        border: 1px solid #fff;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 30px;
        cursor: pointer;
        background: #fff;
        color: #1ab7f7;
      }
    }
  }
  &-tab {
    max-width: 1200px;
    margin: 0 auto 24px;
  }
}
</style>

