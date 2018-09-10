<template>
  <div class="package-catalogue">
    <div class="package-catalogue-progress" v-show="packageDetail.isSubscribe && !isTeacher">
      <div class="package-catalogue-progress-detail">
        <el-progress :show-text='false' :stroke-width="18" :percentage="lessonProgressPercent"></el-progress>
        <p>{{lessonProgressInfo}}</p>
      </div>
      <el-button type="primary" :disabled="lessonProgressPercent === 100" class="package-catalogue-progress-button" @click="continueToLearn">{{buttonText}}</el-button>
    </div>
    <div class="package-catalogue-title">{{$t('lesson.catalogue')}}</div>
    <div class="package-catalogue-box">
      <div class="package-catalogue-item" :class="{'package-catalogue-item-disabled': !packageDetail.isSubscribe}" v-for="(lesson, index) in lessonsList" :key='index' @click='handleUnSubscribe'>
        <div class="package-catalogue-item-cover-box">
          <div class="package-catalogue-item-mark" v-show="lesson.isFinished">
            <i class="el-icon-check"></i>
          </div>
          <img class="package-catalogue-item-cover" :src="lesson.extra.coverUrl" alt="" @click="toLessonDetail(lesson)">
        </div>
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title" @click="toLessonDetail(lesson)">
            <span>{{lesson.lessonName}}</span>
          </div>
          <div class="package-catalogue-item-info">{{$t('lesson.intro')}}:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>45{{$t('lesson.minUnit')}}</span>
          </div>
          <el-button v-show="lesson.isFinished && !isTeacher" type="primary" size="small" class="package-catalogue-item-button" @click="toViewSummary(lesson)">{{$t('lesson.viewLearnSummary')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'PackageCatalogue',
  props: {
    packageDetail: Object,
    actorType: String
  },
  computed: {
    ...mapGetters({
      enterClassInfo: 'lesson/student/enterClassInfo',
      isBeInClassroom: 'lesson/student/isBeInClassroom'
    }),
    isInClassroom() {
      const state = this.enterClassInfo.state
      return state == undefined ? false : state != 2
    },
    lessonsList() {
      let lessons = _.get(this.packageDetail, 'lessons', [])
      _.map(this.lessonFinishedList, finishedLessonId => {
        let finishedLessonInLessonListIndex = _.findIndex(lessons, lesson => {
          return lesson.id === finishedLessonId
        })
        lessons[finishedLessonInLessonListIndex].isFinished = true
      })
      return lessons
    },
    continueLearnedLesson() {
      return _.find(this.lessonsList, lesson => !lesson.isFinished)
    },
    learnedLessons() {
      return _.get(this.packageDetail, 'learnedLessons', [])
    },
    teachedLessons() {
      return _.get(this.packageDetail, 'teachedLessons', [])
    },
    lessonFinishedList() {
      return this.actorType === 'teacher'
        ? this.teachedLessons
        : this.learnedLessons
    },
    lessonProgressPercent() {
      return this.lessonFinishedList.length / this.lessonsList.length * 100 || 0
    },
    lessonProgressInfo() {
      return (
        this.$t('lesson.haveLearn') +
        this.lessonFinishedList.length +
        this.$t('lesson.lessonsCount')
      )
    },
    buttonText() {
      return this.lessonProgressPercent === 100
        ? this.$t('lesson.finished')
        : this.$t('lesson.continue')
    },
    isTeacher() {
      return this.actorType === 'teacher'
    }
  },
  methods: {
    toLessonDetail(lesson) {
      if (this.isInClassroom) {
        const { name, params: { id: _packageId } } = this.$route
        const { packageId, lessonId } = this.enterClassInfo
        if (
          name === 'StudentPackage' &&
          (_packageId != packageId || lesson.id != lessonId)
        )
          return this.$message.error('你正在上课中,请返回当前课堂')
      }
      if (this.packageDetail.isSubscribe) {
        let targetLessonPath = `/${this.actorType}/package/${
          this.packageDetail.id
        }/lesson/${lesson.id}`
        this.$router.push({
          path: targetLessonPath
        })
      }
    },
    handleUnSubscribe() {
      if (!this.packageDetail.isSubscribe) {
        this.$alert(
          this.$t('lesson.addPackageFirst'),
          this.$t('lesson.infoTitle')
        )
      }
    },
    toViewSummary(lesson) {
      let targetLessonPath = `/${this.actorType}/package/${
        this.packageDetail.id
      }/lesson/${lesson.id}`
      this.$router.push({
        path: targetLessonPath
      })
    },
    continueToLearn() {
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      let targetLessonPath = `/${this.actorType}/package/${
        this.packageDetail.id
      }/lesson/${this.continueLearnedLesson.id}`
      this.$router.push({
        path: targetLessonPath
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.package-catalogue {
  padding-bottom: 30px;
  &-progress {
    padding: 13px 20px;
    color: #818181;
    font-size: 14px;
    display: flex;
    align-items: center;
    &-detail {
      width: 760px;
      max-width: 86%;
      p {
        margin: 5px 0 0;
      }
    }
    &-button {
      padding: 10px 14px;
      margin-left: 22px;
    }
  }
  &-title {
    font-size: 16px;
    color: #333;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-weight: bold;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-bottom: none;
  }
  &-item {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    padding: 16px 20px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: lighter;
    &-cover-box {
      margin-right: 22px;
      position: relative;
      padding-left: 19px;
    }
    &-cover {
      width: 250px;
      height: 146px;
      object-fit: cover;
      cursor: pointer;
    }
    &-detail {
      flex: 1;
      min-width: 0;
    }
    &-title {
      margin: 12px 0 8px;
      font-size: 18px;
      color: #181818;
      font-weight: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
    }
    &-disabled {
      background-color: #bfbfbf;
      cursor: not-allowed;
    }
    &-disabled &-title,
    &-disabled &-cover {
      cursor: not-allowed;
    }
    &-info {
      color: #999;
    }
    &-duration {
      margin: 25px 0 15px;
    }
    &-mark {
      position: absolute;
      top: -4px;
      left: 0;
      font-size: 14px;
      color: #67c23a;
      .el-icon-check {
        font-weight: bold;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background-color: #67c23a;
        color: #fff;
        text-align: center;
        line-height: 38px;
        font-size: 24px;
        margin-left: 4px;
        vertical-align: middle;
        border: 2px solid #fff;
      }
    }
    &-button {
      margin-bottom: 16px;
    }
    &-goals {
      max-height: 100px;
      overflow: auto;
      &-item {
        padding-left: 12px;
        position: relative;
        margin: 0;
        line-height: 22px;
      }
      &-item::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #666;
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.package-catalogue {
  &-progress {
    .el-progress-bar__outer {
      background-color: #d2d2d2;
    }
    .el-progress-bar__inner {
      background-color: #66cd2e;
    }
  }
}
</style>
