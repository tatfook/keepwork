<template>
  <div class="package-catalogue">
    <div class="package-catalogue-progress" v-show="isStudent">
      <div class="package-catalogue-progress-detail">
        <el-progress :show-text='false' :stroke-width="18" :percentage="lessonProgressPercent"></el-progress>
        <el-button type="primary" :disabled="lessonProgressPercent === 100" class="package-catalogue-progress-button">{{buttonText}}</el-button>
      </div>
      <p>{{lessonProgressInfo}}</p>
    </div>
    <div class="package-catalogue-title">{{$t('lesson.catalogue')}}</div>
    <div class="package-catalogue-box">
      <div :class="['package-catalogue-item', { 'package-is-teached': isTeacher && lesson.isTeached }]" v-for="(lesson, index) in lessonsList" :key='index'>
        <div class="package-catalogue-item-cover-box">
          <div class="package-catalogue-item-mark" v-show="lesson.isLearned && !isAdmin">
            <i class="el-icon-check"></i>
          </div>
          <div class="package-catalogue-item-cover">
            <div class="package-catalogue-item-cover-wrap">
              <img class="package-catalogue-item-cover-inner" :src="lesson.coverUrl" alt="">
            </div>
          </div>
        </div>
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title">
            <span>{{$t('lesson.lessonIndexLabel') + (index + 1) + ": " + lesson.lessonName}} <span>({{$t('lesson.lessonId')}} {{packageId}}x{{lesson.id}} )</span></span>
          </div>
          <div class="package-catalogue-item-info" v-if="lesson.goals">{{$t('lesson.intro')}}:</div>
          <div class="package-catalogue-item-goals" v-if="lesson.goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>{{getLessonDuration(lesson)}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { lesson } from '@/api'
import _ from 'lodash'
export default {
  name: 'OrgPackageCatalogue',
  props: {
    packageDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    actorType: String
  },
  computed: {
    ...mapGetters({
      classroom: 'org/student/classroom',
      isBeInClassroom: 'org/student/isBeInClassroom'
    }),
    isInClassroom() {
      const state = this.enterClassInfo.state
      return state == undefined ? false : state != 2
    },
    lessonsList() {
      return _.map(_.get(this.packageDetail, 'lessons', []), item => ({
        ...item,
        ...item.lesson
      }))
    },
    continueLearnedLesson() {
      let lastLessonId = this.learnedLessons[this.learnedLessons.length - 1]
      if (lastLessonId) {
        let lastLessonIndex = _.findIndex(
          this.lessonsList,
          lesson => lesson.id === lastLessonId
        )
        while (++lastLessonIndex < this.lessonsList.length) {
          if (!this.lessonsList[lastLessonIndex].isLearned) {
            return this.lessonsList[lastLessonIndex]
          }
        }
      }
      return _.find(this.lessonsList, lesson => !lesson.isLearned)
    },
    learnedLessons() {
      return _.filter(this.lessonsList, item => item.isLearned)
    },
    teachedLessons() {
      return _.filter(this.lessonsList, item => item.isTeached)
    },
    lessonFinishedList() {
      if (this.isTeacher) {
        return this.teachedLessons
      }
      if (this.isStudent) {
        return this.learnedLessons
      }
      return this.learnedLessons
    },
    lessonProgressPercent() {
      return (
        (this.lessonFinishedList.length / this.lessonsList.length) * 100 || 0
      )
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
    },
    isStudent() {
      return this.actorType === 'student'
    },
    isAdmin() {
      return this.actorType === 'admin'
    },
    isPendingReview() {
      return this.packageDetail.state === 0 || this.packageDetail.state === 1
    },
    packageId() {
      return _.get(this.packageDetail, 'id', '')
    }
  },
  methods: {
    getLessonDuration(lesson) {
      let durationKey = lesson.duration || '45min'
      return this.$t(`lesson.${durationKey}`)
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
    &-detail {
      .el-progress {
        width: 760px;
        max-width: 86%;
        display: inline-block;
        vertical-align: bottom;
      }
    }
    &-button {
      padding: 10px 14px;
      margin-left: 22px;
    }
    p {
      margin: 5px 0 0;
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
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  &-item {
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: lighter;
    &:last-child {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    &.package-is-teached {
      background: #fafafa;
    }
    &-cover-box {
      margin-right: 22px;
      position: relative;
      padding-left: 19px;
    }
    &-cover {
      width: 234px;
      &-wrap {
        padding-bottom: 56.25%;
        position: relative;
      }
      &-inner {
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
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
      z-index: 1;
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
      &.start-button {
        margin-left: 0;
      }
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
    &-status {
      color: #62f78a;
      font-size: 16px;
    }
  }
}
@media screen and (max-width: 768px) {
  .package-catalogue {
    &-item {
      display: block;
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
@media screen and (max-width: 768px) {
  .leave-current-class {
    max-width: 90%;
  }
}
</style>
