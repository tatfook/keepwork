<template>
  <div class="learn-summary-container">
    <div class="summary-row summary-name">
      {{$t('card.lesson')}}: {{lessonName}}
    </div>
    <div class="summary-row summary-desc">
      {{goals}}
    </div>
    <div class="summary-row summary-time">
      <span class="duration">{{$t('lesson.duration')}}:</span> 45 {{$t('lesson.mins')}}
      <span class="lasttime">{{lastTimeFormat}}</span>
    </div>
    <div class="summary-row summary-title">
      {{$t('lesson.summary')}}:
    </div>
    <student-summary v-if="!isLoading" :summary="summary" :isShowShare="false" :isShowTitle="false" />
  </div>
</template>

<script>
import StudentSummary from './StudentSummary'
import { lesson } from '@/api'
import { locale } from '@/lib/utils/i18n'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment, { months } from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'LearnSummary',
  components: {
    'student-summary': StudentSummary
  },
  data() {
    return {
      isLoading: true,
      summary: {},
      lessonDetail: {},
      learnRecords: []
    }
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    const [learnRecords, lessonDetail] = await Promise.all([
      lesson.lessons.getLastLearnRecordById({ lessonId: Number(lessonId) }),
      lesson.lessons.lessonDetail({ lessonId: Number(lessonId) })
    ]).catch(e => console.error(e))
    this.lessonDetail = lessonDetail || {}
    this.learnRecords = learnRecords.rows || []
    this.summary = {
      name: this.lessonName,
      day: this.day,
      skills: this.skills
    }
    this.isLoading = false
  },
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    day() {
      return _.get(this.lastLearnRecord, 'extra.howManyDays', 1)
    },
    lastLearnRecord() {
      return this.learnRecords[0] || {}
    },
    lessonId() {
      return this.lessonDetail.id || ''
    },
    lessonName() {
      return this.lessonDetail.lessonName
    },
    goals() {
      return this.lessonDetail.goals
    },
    skills() {
      return this.lessonDetail.skills
    },
    lastTime() {
      let arr = this.learnRecords.filter(({ extra: { quiz = [] } }) =>
        quiz.every(item => item.result !== null)
      )
      if (arr.length === 0) {
        return ''
      }
      return arr.pop().createdAt
    },
    lastTimeFormat() {
      if (!this.lastTime) return ''
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return (
        moment(this.lastTime).format('dddd') +
        '  ' +
        moment(this.lastTime).format('LL')
      )
    }
  }
}
</script>

<style lang="scss">
.learn-summary-container {
  max-width: 1080px;
  margin: 20px auto;
  overflow: hidden;
  .summary {
    &-row {
      margin-top: 20px;
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      &.summary-desc {
        margin-top: 5px;
      }
    }
    &-name {
      font-weight: bold;
      font-size: 20px;
      color: #303133;
    }
    &-desc {
      color: #909399;
    }
    &-time {
      .duration {
        font-weight: bold;
        color: #303133;
      }
      .lasttime {
        margin-left: 50px;
      }
    }
    &-title {
      color: #303133;
      font-weight: bold;
    }
  }
}
@media screen and (max-width: 768px){
.learn-summary-container {
  margin: 10px;
}
}
</style>


