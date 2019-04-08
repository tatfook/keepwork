<template>
  <div class="package-catalogue">
    <div class="package-catalogue-progress" v-show="isStudent">
      <div class="package-catalogue-progress-detail">
        <el-progress :show-text='false' :stroke-width="18" :percentage="lessonProgressPercent"></el-progress>
        <el-button type="primary" :disabled="lessonProgressPercent === 100" class="package-catalogue-progress-button" @click="continueToLearn">{{buttonText}}</el-button>
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
          <div class="package-catalogue-item-cover" @click="toLessonDetail(lesson)">
            <div class="package-catalogue-item-cover-wrap">
              <img class="package-catalogue-item-cover-inner" :src="lesson.extra.coverUrl" alt="">
            </div>
          </div>
        </div>
        <div class="package-catalogue-item-detail">
          <div class="package-catalogue-item-title" @click="toLessonDetail(lesson)">
            <span>{{$t('lesson.lessonIndexLabel') + (index + 1) + ": " + lesson.lessonName}} <span>({{$t('lesson.lessonId')}} {{packageId}}x{{lesson.id}} )</span></span>
          </div>
          <div class="package-catalogue-item-info">{{$t('lesson.intro')}}:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>45{{$t('lesson.minUnit')}}</span>
          </div>
          <el-button v-show="lesson.isLearned && isStudent" type="primary" size="small" class="package-catalogue-item-button" @click="toViewSummary(lesson)">{{$t('lesson.viewLearnSummary')}}</el-button>
          <el-button v-show="lesson.isLearned && isStudent" plain size="small" class="package-catalogue-item-button learn-again" @click="toLearnAgain(lesson)">{{$t('lesson.learnAgain')}}</el-button>
          <el-button v-show="!lesson.isLearned && isStudent" type="primary" size="small" class="package-catalogue-item-button start-button" @click="toLessonDetail(lesson)">{{$t('card.startToLearn')}}</el-button>
          <span class="package-catalogue-item-status" v-show="isTeacher && lesson.isTeached"> <i class="el-icon-circle-check"></i> {{$t('org.chapterIsFinished')}}</span>
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
      return _.get(this.packageDetail, 'packageId', '')
    }
  },
  methods: {
    toLessonDetail(lesson) {
      if (this.isAdmin) {
        return this.$router.push({
          name: 'OrgAdminPackageLesson',
          params: { lessonId: lesson.lessonId }
        })
      }

      if (this.isTeacher) {
        return this.$router.push({
          name: 'OrgTeacherClassPackageLesson',
          params: { lessonId: lesson.lessonId }
        })
      }
      const {
        name,
        params: { packageId: _packageId }
      } = this.$route
      if (this.isBeInClassroom) {
        const { packageId, lessonId } = this.classroom
        if (_packageId == packageId && lesson.id == lessonId) {
          this.$router.push({
            name: 'OrgStudentPackageLesson',
            params: { lessonId: lesson.lessonId }
          })
        } else {
          this.$message.error(this.$t('lesson.beInClass'))
        }
      } else {
        this.toLearnConfirm(_packageId, lesson.id, {
          name: 'OrgStudentPackageLesson',
          params: { packageId: _packageId, lessonId: lesson.id }
        })
      }
    },
    toViewSummary(lesson) {
      this.$router.push({
        name: 'OrgStudentLearnSummary',
        params: { packageId: this.packageDetail.id, lessonId: lesson.lessonId }
      })
    },
    continueToLearn() {
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      const rotuerObject = {
        name: `OrgStudentPackageLesson`,
        params: {
          packageId: this.packageDetail.id,
          lessonId: this.continueLearnedLesson.id
        }
      }
      this.toLearnConfirm(
        this.packageDetail.id,
        this.continueLearnedLesson.id,
        rotuerObject
      )
    },
    toLearnAgain(lesson) {
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      const routerObject = {
        name: 'OrgStudentPackageLesson',
        params: { packageId: this.packageDetail.id, lessonId: lesson.id }
      }
      return this.toLearnConfirm(this.packageDetail.id, lesson.id, routerObject)
    },
    async toLearnConfirm(_packageId, _lessonId, routerObject) {
      let res = await lesson.lessons
        .getLastLearnRecords()
        .catch(e => console.error(e))
      let lastLearnRecods = _.get(res, 'rows', [])
      if (lastLearnRecods.length === 0) {
        return this.$router.push(routerObject)
      }
      if (lastLearnRecods[0].state === 1) {
        return this.$router.push(routerObject)
      }

      const { packageId, lessonId } = lastLearnRecods[0]
      if (_packageId === packageId && _lessonId === lessonId) {
        return this.$router.push(routerObject)
      }
      this.$confirm(this.$t('lesson.learnLessonConfirm'), '', {
        confirmButtonText: this.$t('common.Yes'),
        cancelButtonText: this.$t('common.No'),
        type: 'warning',
        customClass: 'leave-current-class'
      })
        .then(() => this.$router.push(routerObject))
        .catch(e => console.error(e))
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
      cursor: pointer;
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
