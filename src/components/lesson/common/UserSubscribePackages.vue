<template>
  <div class="packages-intro">
    <img class="cover" src="@/assets/lessonImg/cover1.png" alt="">
    <h3>{{item.packageName}}</h3>
    <p>Include:
      <span>{{item.lessons.length}}</span> lessons</p>
    <p>Ages: {{item.minAge}}-{{item.maxAge}}</p>
    <p>Intro: {{item.intro}}</p>
    <div class="progress">
      <div v-if="!(item.learnedLessons.length === 0 || item.learnedLessons.length ===item.lessons.length)">
        <el-progress :stroke-width="10" :percentage="Math.ceil((item.learnedLessons.length / item.lessons.length) * 100)" status="success" color="#66cd2e"></el-progress>
        <p>Have learned {{item.learnedLessons.length}} lessons</p>
      </div>
    </div>
    <div v-if="item.learnedLessons.length !==item.lessons.length">
      <el-button size="medium" type="primary">{{item.learnedLessons.length === 0 ? 'Start to learn':'Continue'}}</el-button>
    </div>
    <div v-else class="finished"><img src="@/assets/lessonImg/finished.png" alt="">
      <span class="finished-tip">Finished</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserSubscribesPackages',
  props: {
    item: {}
  }
}
</script>
<style lang="scss">
.packages-intro {
  width: 230px;
  margin: 0 auto;
  .cover {
    width: 230px;
    height: 128px;
    margin: 0 auto;
    object-fit: cover;
  }
  p {
    margin: 0;
    line-height: 30px;
    font-size: 14px;
  }
  .progress {
    height: 45px;
    .el-progress {
      .el-icon-circle-check {
        display: none;
      }
    }
  }
  .finished {
    margin: 10px 0;
    color: #66cd2e;
    position: relative;
    &-tip {
      position: absolute;
      left: 30px;
      top: 2px;
    }
  }
}
</style>

