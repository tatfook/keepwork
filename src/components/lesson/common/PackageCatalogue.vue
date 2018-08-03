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
      <div class="package-catalogue-item" v-for="(lesson, index) in lessonsList" :key='index'>
        <img class="package-catalogue-item-cover" :src="lesson.extra.coverUrl" alt="" @click="toPackageDetail(lesson)">
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title" @click="toPackageDetail(lesson)">
            <span>{{lesson.lessonName}}</span>
          </div>
          <div class="package-catalogue-item-info">{{$t('lesson.intro')}}:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>45min</span>
          </div>
          <el-button v-show="lesson.isFinished && !isTeacher" type="primary" size="small" class="package-catalogue-item-button" @click="toViewSummary(lesson)">View Summary</el-button>
          <div class="package-catalogue-item-mark" v-show="lesson.isFinished">Finished
            <i class="el-icon-check"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PackageCatalogue',
  props: {
    packageDetail: Object,
    actorType: String
  },
  computed: {
    lessonsList() {
      let lessons = _.get(this.packageDetail, 'lessons', [])
      _.map(this.lessonProgressList, finishedLessonId => {
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
    lessonProgressList() {
      return this.actorType === 'teacher'
        ? this.teachedLessons
        : this.learnedLessons
    },
    lessonProgressPercent() {
      return this.lessonProgressList.length / this.lessonsList.length * 100 || 0
    },
    lessonProgressInfo() {
      return this.$t('lesson.haveLearn') + this.lessonProgressList.length + this.$t('lesson.lessonsCount')
    },
    buttonText() {
      return this.lessonProgressPercent === 100 ? this.$t('lesson.continue') : this.$t('lesson.finished')
    },
    isTeacher(){
      return this.actorType === 'teacher'
    }
  },
  methods: {
    toPackageDetail(lesson) {
      if (this.packageDetail.isSubscribe) {
        console.log(
          `go to /student/packages/${this.packageDetail.id}/lessons/${
            lesson.id
          }`
        )
      } else {
        this.$alert(
          this.$t('lesson.addPackageFirst'),
          this.$t('lesson.infoTitle')
        )
      }
    },
    toViewSummary(lesson) {
      console.log(
        `summary /student/packages/${this.packageDetail.id}/lessons/${lesson.id}`
      )
    },
    continueToLearn() {
      console.log('继续学习', this.continueLearnedLesson)
    }
  }
}
</script>
<style lang="scss" scoped>
.package-catalogue {
  border: 1px solid #e5e5e5;
  padding-bottom: 30px;
  &-progress {
    padding: 13px 40px;
    border-bottom: 1px solid #e5e5e5;
    color: #00e200;
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
    height: 55px;
    line-height: 55px;
    padding: 0 11px;
    font-weight: bold;
  }
  &-item {
    border: 1px solid #e5e5e5;
    border-width: 1px 0;
    padding: 3px 10px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: lighter;
    &-cover {
      width: 250px;
      height: 146px;
      object-fit: cover;
      margin-right: 22px;
      cursor: pointer;
    }
    &-detail {
      flex: 1;
      min-width: 0;
      position: relative;
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
    &-info {
      color: #999;
    }
    &-duration {
      margin: 25px 0 15px;
    }
    &-mark {
      position: absolute;
      top: 12px;
      right: 15px;
      font-size: 14px;
      color: #67c23a;
      .el-icon-check {
        font-weight: bold;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #67c23a;
        color: #fff;
        text-align: center;
        line-height: 24px;
        font-size: 18px;
        margin-left: 4px;
        vertical-align: middle;
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
