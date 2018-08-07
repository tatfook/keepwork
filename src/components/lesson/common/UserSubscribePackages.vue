<template>
  <div class="packages-intro">
    <img @click="enterPackageDetail" class="cover" :src="packageCover" alt="">
    <h3 class="name">{{packageName}}</h3>
    <p>Include:
      <span>{{lessonsLength}}</span> lessons
    </p>
    <p>Ages: {{item.minAge}}-{{item.maxAge}}</p>
    <p>Intro: {{item.intro}}</p>
    <div class="progress">
      <div v-if="showProgress">
        <el-progress :stroke-width="10" :percentage="learnedRatio" status="success" color="#66cd2e"></el-progress>
        <p>Have learned {{item.learnedLessons.length}} lessons</p>
      </div>
    </div>
    <div v-if="item.learnedLessons.length !==item.lessons.length">
      <el-button @click="enterPackageDetail" class="learn-button" type="primary">{{startToLearn ? 'Start to learn':'Continue'}}</el-button>
    </div>
    <div v-else class="finished"><img src="@/assets/lessonImg/finished.png" alt="">
      <span class="finished-tip">Finished</span>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'UserSubscribesPackages',
  props: {
    item: {}
  },
  computed:{
    packageCover(){
      return _.get(this.item,'extra.coverUrl')
    },
    packageName(){
      return this.item.packageName
    },
    lessonsLength(){
      return this.item.lessons.length;
    },
    showProgress(){
      return !(this.item.learnedLessons.length === 0 || this.item.learnedLessons.length === this.item.lessons.length)
    },
    learnedRatio(){
      return Math.ceil((this.item.learnedLessons.length / this.item.lessons.length) * 100)
    },
    startToLearn(){
      return this.item.learnedLessons.length === 0
    }
  },
  methods:{
    enterPackageDetail(){
      let packageId = this.item.id
      console.log(packageId)
      this.$router.push({
        path: `package/${packageId}`,
      })
    }
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
    cursor: pointer;
  }
  .name{
    cursor: pointer;
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
  .learn-button{
    height: 28px;
    padding: 0 6px;
    margin-bottom: 16px;
  }
  .finished {
    margin-bottom: 16px;
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

