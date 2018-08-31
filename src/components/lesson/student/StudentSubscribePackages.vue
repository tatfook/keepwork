<template>
  <div class="packages-intro">
    <div class="cover-wrap" @click="enterPackageDetail"><img class="cover" :src="packageCover" alt=""></div>
    <h3 :class="['name']" @click="enterPackageDetail" :title="packageName">{{packageName}}</h3>
    <p>{{$t('lesson.include')}}:
      <span>{{lessonsLength}}</span> {{$t('lesson.lessonsCount')}}</p>
    <p>{{$t('lesson.ages')}}: {{packageDetail.minAge}}-{{packageDetail.maxAge}}</p>
    <p class="intro" :title="packageDetail.intro">{{$t('lesson.intro')}}: {{packageDetail.intro}}</p>
    <div class="progress">
      <div v-if="showProgress">
        <el-progress :stroke-width="10" :percentage="learnedRatio" status="success" color="#66cd2e"></el-progress>
        <p>{{$t('lesson.haveLearn')}} {{packageDetail.learnedLessons.length}} {{$t('lesson.lessonsCount')}}</p>
      </div>
    </div>
    <div v-if="packageDetail.learnedLessons.length !==packageDetail.lessons.length">
      <el-button @click="attendClass" class="learn-button" type="primary">{{startToLearn ? $t('card.startToLearn') : $t('card.continue')}}</el-button>
    </div>
    <div v-else class="finished"><img src="@/assets/lessonImg/finished.png" alt="">
      <span class="finished-tip">{{$t('lesson.finished')}}</span>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'UserSubscribesPackages',
  props: {
    packageDetail: {}
  },
  data() {
    return {}
  },
  computed: {
    packageCover() {
      return _.get(this.packageDetail, 'extra.coverUrl')
    },
    packageName() {
      return this.packageDetail.packageName
    },
    lessonsLength() {
      return this.packageDetail.lessons.length
    },
    showProgress() {
      return !(
        this.packageDetail.learnedLessons.length === 0 ||
        this.packageDetail.learnedLessons.length ===
          this.packageDetail.lessons.length
      )
    },
    learnedRatio() {
      return Math.ceil(
        this.packageDetail.learnedLessons.length /
          this.packageDetail.lessons.length *
          100
      )
    },
    startToLearn() {
      return this.packageDetail.learnedLessons.length === 0
    }
  },
  methods: {
    enterPackageDetail() {
      let packageId = this.packageDetail.id
      this.$router.push({
        path: `student/package/${packageId}`
      })
    },
    attendClass(){
      if(this.startToLearn){
        let packageId = this.packageDetail.id
        let lessonId = this.packageDetail.lessons[0].id
        this.$router.push({
          path: `student/package/${packageId}/lesson/${lessonId}`
        })
      }else{
        let packageId = this.packageDetail.id
        let lessonId = this.packageDetail.lessons.length
        this.$router.push({
          path: `student/package/${packageId}/lesson/${lessonId}`
        })
      }
    }
  }
}
</script>
<style lang="scss">
.packages-intro {
  width: 230px;
  margin: 0 auto 10px;
  .cover-wrap {
    width: 230px;
    height: 128px;
    border-radius: 4px;
    margin: 0 auto;
      cursor: pointer;
    .cover {
      width: 230px;
      height: 128px;
      border-radius: 4px;
      object-fit: cover;
    }
  }

  .name {
    cursor: pointer;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    margin: 0;
    line-height: 30px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .progress {
    margin-top: 12px;
    height: 45px;
    font-size: 14px;
    .el-progress {
      .el-icon-circle-check {
        display: none;
      }
    }
  }
  .learn-button {
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