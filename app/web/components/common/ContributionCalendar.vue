<template>
  <el-card class="contribution-calendar" shadow="never">
    <div slot="header">
      <span>活跃度</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          2018<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div id="contributeCalendar" class="contribution-calendar-container"></div>
    <div class="clearfix calendar-footer" id="calendarSibling">
      <div class="contribution-calendar-legend">
        <span>少</span>
        <ul class="contribution-calendar-legend-color clearfix">
          <li :style="{'background-color': defaultColor}"></li>
          <li v-for="(colorBlock, index) in stepColor" :key="index" :style="{'background-color': colorBlock}"></li>
        </ul>
        <span>多</span>
      </div>
    </div>
  </el-card>
</template>
<script>
import '@/lib/contribution-calendar/css/contribution-calendar.css'
import contributionCalendarCreator from '@/lib/contribution-calendar/js/contribution-calendar'
export default {
  name: 'ContributionCalendar',
  mounted() {
    contributionCalendarCreator('contributeCalendar', {
      year: '2018',
      active: true,
      stepColor: this.stepColor,
      defaultColor: this.defaultColor,
      defaultTextFillColor: '#909399',
      dateCount: {
        '2018-01-01': 0,
        '2018-02-01': 1,
        '2018-03-01': 5,
        '2018-04-01': 6,
        '2018-05-01': 7,
        '2018-06-01': 14,
        '2018-06-06': 17,
        '2018-06-11': 19,
        '2018-06-21': 21,
        '2018-07-01': 24,
        '2018-07-11': 28,
        '2018-08-01': 35,
        '2018-10-01': 40
      }
    })
  },
  data() {
    return {
      defaultColor: '#ebecee',
      stepColor: ['#cceaf9', '#82c6f1', '#3794de', '#175496', '#0d3a73']
    }
  }
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
      content: '';
      display: inline-block;
      width: 1px;
      height: 50px;
      background-color: #eee;
      position: absolute;
      left: 80px;
      top: 45px;
      z-index: 2;
    }
    &::after {
      content: '';
      display: inline-block;
      width: 45px;
      height: 50px;
      left: 56px;
      top: 50px;
      background-color: #fff;
      position: absolute;
      z-index: 1;
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
