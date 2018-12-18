<template>
  <el-card class="contribution-calendar" shadow="never">
    <div slot="header">
      <span>{{$t("profile.contributions")}}</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          2018<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>2018</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="contributeCalendar" class="contribution-calendar-container"></div>
    <div class="clearfix calendar-footer" id="calendarSibling">
      <div class="contribution-calendar-legend">
        <span>{{$t("profile.lessState")}}</span>
        <ul class="contribution-calendar-legend-color clearfix">
          <li :style="{'background-color': defaultColor}"></li>
          <li v-for="(colorBlock, index) in stepColor" :key="index" :style="{'background-color': colorBlock}"></li>
        </ul>
        <span>{{$t("profile.moreState")}}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
import { locale } from '@/lib/utils/i18n'
import '@/lib/contribution-calendar/css/contribution-calendar.css'
import contributionCalendarCreator from '@/lib/contribution-calendar/js/contribution-calendar'
export default {
  name: 'ContributionCalendar',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.setContributionCalendar()
  },
  data() {
    return {
      defaultColor: '#ebecee',
      stepColor: ['#cceaf9', '#82c6f1', '#3794de', '#175496', '#0d3a73']
    }
  },
  computed: {
    contributionData() {
      return _.get(this.nowUserDetail, 'contributions', {})
    }
  },
  methods: {
    setContributionCalendar() {
      contributionCalendarCreator('contributeCalendar', {
        year: '2018',
        active: true,
        stepColor: this.stepColor,
        defaultColor: this.defaultColor,
        defaultTextFillColor: '#909399',
        dateCount: this.contributionData,
        languageLocaleIsForGlobalUser: locale === 'en-US'
      })
    }
  },
  watch: {
    contributionData() {
      this.setContributionCalendar()
    }
  },
}
</script>
<style lang="scss">
.contribution-calendar {
  .el-card__header {
    font-weight: bold;
    padding: 18px 16px;
    .el-dropdown {
      float: right;
      font-size: 12px;
      color: #909399;
      padding-top: 3px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  &-container {
    position: relative;
    &::before {
      content: "";
      display: inline-block;
      width: 1px;
      height: 50px;
      background-color: #eee;
      position: absolute;
      left: 94px;
      top: 60px;
      z-index: 2;
    }
    &::after {
      content: "";
      display: inline-block;
      width: 45px;
      height: 50px;
      left: 70px;
      top: 58px;
      background-color: #fff;
      position: absolute;
      z-index: 1;
    }
    svg {
      margin-left: 78px;
    }
  }
  &-legend {
    text-align: right;
    font-size: 12px;
    color: #909399;
    padding-right: 105px;
    margin-top: 6px;
    & > span {
      margin-right: 4px;
    }
    &-color {
      margin: 0;
      padding: 0;
      display: inline-block;
      & > li {
        float: left;
        width: 10px;
        height: 10px;
        margin-right: 4px;
        list-style: none;
      }
    }
  }
}
</style>
