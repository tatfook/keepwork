<template>
  <div class="packages-intro">
    <div class="cover-wrap" @click="enterPackageDetail"><img class="cover" :src="packageCover" alt=""></div>
    <h3 :class="['name']" @click="enterPackageDetail" :title="packageName">{{packageName}}</h3>
    <p>{{$t('lesson.include')}}:
      <span>{{lessonsLength}}</span> {{$t('lesson.lessonsCount')}}</p>
    <p>{{$t('lesson.ages')}}: {{getCoursePackageSuitableAge(packageDetail)}}</p>
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
import { mapGetters } from 'vuex'
import { lesson } from '@/api'

export default {
  name: 'StudentSubscribePackages',
  props: {
    packageDetail: {}
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      isBeInClassroom: 'lesson/student/isBeInClassroom'
    }),
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
        (this.packageDetail.learnedLessons.length /
          this.packageDetail.lessons.length) *
          100
      )
    },
    startToLearn() {
      return this.packageDetail.learnedLessons.length === 0
    },
    learnedLessons() {
      return this.packageDetail.learnedLessons || []
    },
    lessonsList() {
      let lessons = _.get(this.packageDetail, 'lessons', [])
      _.map(this.learnedLessons, finishedLessonId => {
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
    }
  },
  methods: {
    enterPackageDetail() {
      let packageId = this.packageDetail.id
      this.$router.push({
        path: `student/package/${packageId}`
      })
    },
    attendClass() {
      if (this.packageDetail.state !== 2) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.packagePendingReview')
        })
      }
      if (this.isBeInClassroom) {
        return this.$message.error(this.$t('lesson.beInClass'))
      }
      if (this.packageDetail.subscribeState == 0) {
        return this.$router.push(`student/package/${this.packageDetail.id}`)
      }
      const path = `student/package/${this.packageDetail.id}/lesson/${
        this.continueLearnedLesson.id
      }`
      if (this.$route.name === 'StudentColumn') {
        return this.toLearnConfirm(
          this.packageDetail,
          this.continueLearnedLesson.id,
          path
        )
      }
      this.$router.push({
        path: `student/package/${this.packageDetail.id}/lesson/${
          this.continueLearnedLesson.id
        }`
      })
    },
    getCoursePackageSuitableAge(packageDetail) {
      let { minAge, maxAge } = packageDetail
      if (minAge == 0 && maxAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${minAge}-${maxAge}`
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
<style lang="scss">
.packages-intro {
  width: 230px;
  margin: 0 auto 10px;
  border: 1px solid transparent;
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
    height: 25px;
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
@media screen and (max-width: 768px) {
  .leave-current-class {
    width: 90% !important;
  }
}
</style>