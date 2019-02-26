<template>
  <div class="mentor-service">
    <h1 class="mentor-service-title" :class="{'mentor-service-title-bordered': !isPurchasedTutor}">{{$t('lesson.mentorService')}}</h1>
    <div class="mentor-service-purchased" v-if="isPurchasedTutor">
      <div class="mentor-service-purchased-info">
        <span><i class="el-icon-check"></i>{{$t('lesson.paid')}}</span>
        <span>{{$t('lesson.validPeriod')}} {{tutorPeriodText}}</span>
      </div>
      <a class="mentor-service-purchased-operate" :href="purchaseMentorServicePath" target="_blank">{{$t('lesson.clickToRenew')}}</a>
    </div>
    <p class="mentor-service-price">
      <span v-html="$t('lesson.tutorPriceInfo', {tutorPriceHtml, tutorPriceHtmlEn, tutorTargetHtml, tutorTargetHtmlEn})"></span>
      <a v-if="!isPurchasedTutor" :href="purchaseMentorServicePath" target="_blank" class="mentor-service-price-link">{{$t('lesson.clickToBuy')}}</a>
    </p>
    <div class="mentor-service-info">
      <p>{{$t('lesson.buyTutorInfo')}}</p>
      <p>{{$t('lesson.consultTutorInfo')}}</p>
    </div>
    <div class="mentor-service-detail">
      <div class="mentor-service-detail-title">{{$t('lesson.detailServiceTitle')}}</div>
      <ul class="mentor-service-detail-list">
        <li class="mentor-service-detail-item">{{$t('lesson.oneToOneMentoring')}}
          <ul class="mentor-service-detail-list-sub">
            <li class="mentor-service-detail-item-sub">{{$t('lesson.flipClassInfo')}}</li>
            <li class="mentor-service-detail-item-sub">{{$t('lesson.learningAndGuiding')}}</li>
            <li class="mentor-service-detail-item-sub">{{$t('lesson.askAnyQuestion')}}</li>
            <li class="mentor-service-detail-item-sub">{{$t('lesson.reviewedByMentor')}}</li>
            <li class="mentor-service-detail-item-sub">{{$t('lesson.watchAndLearnDevelopment')}}</li>
          </ul>
        </li>
        <li class="mentor-service-detail-item">{{$t('lesson.participateInGroup')}}</li>
        <li class="mentor-service-detail-item">{{$t('lesson.solvePuzzleOnline')}}</li>
        <li class="mentor-service-detail-item">{{$t('lesson.guidedOnImportantExperience')}}</li>
        <li class="mentor-service-detail-item">{{$t('lesson.priorityLearnOfflineLessons')}}</li>
      </ul>
    </div>
    <div class="mentor-service-operate">
      <router-link class="mentor-service-operate-button" :to="{path: 'moreResources/mentor'}" target="_blank">{{$t('lesson.viewMore')}}</router-link>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'MentorService',
  data() {
    return {
      purchaseMentorServicePath: '/a/orderConfirm?id=4&type=1&payment=rmb',
      tutorPriceHtml:
        '<span class="mentor-service-price-count">￥3000/年</span>',
      tutorPriceHtmlEn:
        '<span class="mentor-service-price-count">￥3000/year</span>',
      tutorTargetHtml:
        '<span class="mentor-service-price-target">1位家长+1个孩子</span>',
      tutorTargetHtmlEn:
        '<span class="mentor-service-price-target">one parent and one kid</span>'
    }
  },
  computed: {
    ...mapGetters({
      tutorServiceInfo: 'lesson/tutorService',
      isPurchasedTutor: 'lesson/isPurchasedTutor'
    }),
    tutorPeriodText() {
      if (!this.isPurchasedTutor) {
        return ''
      }
      let { startTime, endTime } = this.tutorServiceInfo
      return (
        moment(startTime).format('YYYY.MM.DD') +
        ' - ' +
        moment(endTime).format('YYYY.MM.DD')
      )
    }
  }
}
</script>
<style lang="scss">
.mentor-service {
  padding: 30px 40px;
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  &-title {
    font-weight: bold;
    color: #333;
    margin: 0;
    font-size: 20px;
    text-align: center;
    padding-bottom: 8px;
    &-bordered {
      border-bottom: 1px solid #dcdcdc;
    }
  }
  &-purchased {
    background-color: #ff9661;
    color: #fff;
    font-size: 14px;
    border: 1px solid #ff9661;
    display: flex;
    height: 46px;
    line-height: 46px;
    border-radius: 46px;
    overflow: hidden;
    margin: 16px 0;
    &-info {
      text-align: center;
      flex: 1;
      span + span {
        margin-left: 30px;
      }
    }
    &-operate {
      width: 185px;
      background-color: #f5f5f5;
      color: #333;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
    }
    .el-icon-check {
      margin-right: 4px;
    }
  }
  &-price {
    font-size: 14px;
    color: #818181;
    margin: 16px 0 12px;
    &-count {
      color: #ff742e;
      font-weight: bold;
      margin: 0 2px;
    }
    &-target {
      color: #333;
      font-weight: bold;
      margin: 0 2px;
    }
    &-link {
      color: #ff742e;
      text-decoration: none;
      font-weight: bold;
      margin-left: 8px;
    }
  }
  &-info {
    background-color: #eef7ff;
    color: #3ba4ff;
    font-size: 14px;
    padding: 16px 20px;
    p {
      margin: 0 0 2px 0;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  &-detail {
    &-title {
      font-size: 18px;
      color: #333;
      margin: 28px 0 16px;
    }
    &-list {
      & ul {
        padding: 6px 0 0 12px;
      }
    }
    &-item {
      font-size: 14px;
      color: #777;
    }
    li {
      position: relative;
      padding: 3px 0 8px 32px;
      &::before {
        font-family: element-icons !important;
        content: '\E639';
        position: absolute;
        left: 0;
        top: 3px;
        color: #10c55b;
        line-height: 1;
        font-size: 20px;
      }
    }
  }
  &-operate {
    text-align: center;
    padding: 42px 0 100px;
    &-button {
      border: 1px solid #bcbcbc;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      color: #818181;
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0 34px;
    }
  }
}
</style>
