<template>
  <div class="package-catalogue">
    <div class="package-catalogue-progress" v-show="isUserSubscribePackage && !isTeacher">
      <div class="package-catalogue-progress-detail">
        <el-progress :show-text='false' :stroke-width="18" :percentage="lessonProgressPercent"></el-progress>
        <el-button type="primary" :disabled="lessonProgressPercent === 100" class="package-catalogue-progress-button" @click="continueToLearn">{{buttonText}}</el-button>
      </div>
      <p>{{lessonProgressInfo}}</p>
    </div>
    <div class="package-catalogue-title">{{$t('lesson.catalogue')}}</div>
    <div class="package-catalogue-box">
      <div class="package-catalogue-item" :class="{'package-catalogue-item-disabled': !isPendingReview && !isUserSubscribePackage}" v-for="(lesson, index) in lessonsList" :key='index' @click='handleUnSubscribe'>
        <div class="package-catalogue-item-cover-box">
          <div class="package-catalogue-item-mark" v-show="lesson.isFinished">
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
            <span>{{$t('lesson.lessonIndexLabel') + (index + 1) + ": " + lesson.lessonName}}</span>
          </div>
          <div class="package-catalogue-item-info">{{$t('lesson.intro')}}:</div>
          <div class="package-catalogue-item-goals">
            <p class="package-catalogue-item-goals-item">{{lesson.goals}}</p>
          </div>
          <div class="package-catalogue-item-duration">{{$t('lesson.duration')}}:
            <span>45{{$t('lesson.minUnit')}}</span>
          </div>
          <el-button v-show="lesson.isFinished && !isTeacher" type="primary" size="small" class="package-catalogue-item-button" @click="toViewSummary(lesson)">{{$t('lesson.viewLearnSummary')}}</el-button>
          <el-button v-show="lesson.isFinished && !isTeacher" plain size="small" class="package-catalogue-item-button learn-again" @click="toLearnAgain(lesson)">{{$t('lesson.learnAgain')}}</el-button>
          <el-button v-show="!lesson.isFinished && !isTeacher" type="primary" size="small" class="package-catalogue-item-button start-button" @click="toLessonDetail(lesson)">{{$t('card.startToLearn')}}</el-button>
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
  name: 'PackageCatalogue',
  props: {
    packageDetail: Object,
    actorType: String
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      enterClassInfo: 'lesson/student/enterClassInfo',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      isLoginUserBeTeacher: 'lesson/isTeacher'
    }),
    loginUserId() {
      return _.get(this.userProfile, 'id')
    },
    packageOwnerId() {
      return _.get(this.packageDetail, 'userId')
    },
    isOwnPackage() {
      return this.loginUserId === this.packageOwnerId
    },
    isPackageFree() {
      return (
        this.isLoginUserBeTeacher ||
        this.packageDetail.rmb === 0 ||
        this.packageDetail.coin === 0
      )
    },
    isUserSubscribePackage() {
      if (this.isPackageFree || this.isLoginUserBeTeacher) {
        return this.isOwnPackage || this.packageDetail.isSubscribe
      }
      return (
        this.isOwnPackage ||
        (this.packageDetail.isSubscribe && this.packageDetail.isBuy)
      )
    },
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
      let lastLessonId = this.learnedLessons[this.learnedLessons.length - 1]
      if (lastLessonId) {
        let lastLessonIndex = _.findIndex(
          this.lessonsList,
          lesson => lesson.id === lastLessonId
        )
        while (++lastLessonIndex < this.lessonsList.length) {
          if (!this.lessonsList[lastLessonIndex].isFinished) {
            return this.lessonsList[lastLessonIndex]
          }
        }
      }
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
    isPendingReview() {
      return this.packageDetail.state === 0 || this.packageDetail.state === 1
    }
  },
  methods: {
    toLessonDetail(lesson) {
      if (!this.isTeacher && this.isPendingReview) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.packagePendingReview')
        })
      }
      if (this.isBeInClassroom) {
        const {
          name,
          params: { id: _packageId }
        } = this.$route
        const { packageId, lessonId } = this.enterClassInfo
        if (
          name === 'StudentPackage' &&
          (_packageId != packageId || lesson.id != lessonId)
        )
          return this.$message.error(this.$t('lesson.beInClass'))
      }
      if (this.isUserSubscribePackage) {
        let targetLessonPath = `/${this.actorType}/package/${
          this.packageDetail.id
        }/lesson/${lesson.id}`
        if (this.$route.name === 'StudentPackage') {
          return this.toLearnConfirm(
            this.packageDetail.id,
            lesson.id,
            targetLessonPath
          )
        }
        this.$router.push({
          path: targetLessonPath
        })
      }
    },
    handleUnSubscribe() {
      if (!this.isPendingReview && !this.isUserSubscribePackage) {
        this.$alert(
          this.$t('lesson.addPackageFirst'),
          this.$t('lesson.infoTitle')
        )
      }
    },
    toViewSummary(lesson) {
      let targetLessonPath = `/${this.actorType}/learnSummary/package/${
        this.packageDetail.id
      }/lesson/${lesson.id}`
      this.$router.push({
        path: targetLessonPath
      })
    },
    continueToLearn() {
      if (!this.isTeacher && this.isPendingReview) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.packagePendingReview')
        })
      }
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      let targetLessonPath = `/${this.actorType}/package/${
        this.packageDetail.id
      }/lesson/${this.continueLearnedLesson.id}`
      this.toLearnConfirm(
        this.packageDetail.id,
        this.continueLearnedLesson.id,
        targetLessonPath
      )
    },
    toLearnAgain(lesson) {
      if (!this.isTeacher && this.isPendingReview) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.packagePendingReview')
        })
      }
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      let targetLessonPath = `/${this.actorType}/package/${
        this.packageDetail.id
      }/lesson/${lesson.id}`
      return this.toLearnConfirm(
        this.packageDetail.id,
        lesson.id,
        targetLessonPath
      )
    },
    async toLearnConfirm(_packageId, _lessonId, path) {
      let res = await lesson.lessons
        .getLastLearnRecords()
        .catch(e => console.error(e))
      let lastLearnRecods = _.get(res, 'rows', [])
      if (lastLearnRecods.length === 0) {
        return this.$router.push({
          path
        })
      }
      if (lastLearnRecods[0].state === 1) {
        return this.$router.push({
          path
        })
      }

      const { packageId, lessonId } = lastLearnRecods[0]
      if (_packageId === packageId && _lessonId === lessonId) {
        return this.$router.push({
          path
        })
      }
      this.$confirm(this.$t('lesson.learnLessonConfirm'), '', {
        confirmButtonText: this.$t('common.Yes'),
        cancelButtonText: this.$t('common.No'),
        type: 'warning',
        customClass: 'leave-current-class'
      })
        .then(() => this.$router.push({ path }))
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
      &.learn-again {
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
