<template>
  <div class="report-echart">
    <div class="report-echart-container">
      <!-- <div class="report-echart-radar">
        <report-chart-radar :reportData="reportData" radarType="thisTime"></report-chart-radar>
      </div>
      <div v-if="isHistory" class="report-echart-radar">
        <report-chart-radar :reportData="reportData" radarType="history"></report-chart-radar>
      </div> -->
      <div v-if="isHistory" class="report-echart-line">
        <div v-for="item in growthTrackList" :key="item.key">
          <report-chart-line :data="item"></report-chart-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportChartRadar from './ReportChartRadar'
import ReportChartLine from './ReportChartLine'
export default {
  name: 'ReportChart',
  components: {
    ReportChartRadar,
    ReportChartLine
  },
  props: {
    reportData: {
      type: Object,
      default() {
        return {}
      }
    },
    reportType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    userRepo() {
      return _.get(this.reportData, 'userRepo', {})
    },
    userRealname() {
      return _.get(this.userRepo, 'realname', '')
    },
    isHistory() {
      return _.toNumber(this.reportType) === 2
    },
    growthTrack() {
      return _.get(this.reportData, 'growthTrack', {})
    },
    growthTrackKey() {
      return [
        {
          key: 'spatial',
          name: '空间思维能力'
        },
        {
          key: 'creative',
          name: '创新思维能力'
        },
        {
          key: 'compute',
          name: '计算思维能力'
        },
        {
          key: 'collaborative',
          name: '协作沟通能力'
        },
        {
          key: 'logical',
          name: '逻辑思考能力'
        },
        {
          key: 'coordinate',
          name: '统筹思维能力'
        }
      ]
    },
    classmatesHistory() {
      return _.get(this.growthTrack, 'classmatesHistoryAvgStar2', [])
    },
    userHistory() {
      return _.get(this.growthTrack, 'userHistoryStar', [])
    },
    starGroupArray() {
      return _.map(this.userHistory, (item, index) => {
        return {
          userStar: item,
          classmateStar: this.classmatesHistory[index]
        }
      })
    },
    growthTrackList() {
      return _.map(this.growthTrackKey, growthTrack => {
        const columns = ['次数', this.userRealname, '本班同学平均值']
        const rows = _.map(this.starGroupArray, (item, index) => {
          return {
            次数: `${index + 1}`,
            [this.userRealname]: item['userStar'][growthTrack.key],
            本班同学平均值: item['classmateStar'][`${growthTrack.key}Avg`]
          }
        })
        return {
          ...growthTrack,
          chartData: {
            columns,
            rows
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report-echart {
  background: #fff;
  padding: 50px 80px;
  &-container {
    background: #b1dcff;
    padding: 29px;
  }
  &-radar {
    border-radius: 20px;
    margin-bottom: 29px;
    background: #fff;
  }
  &-line {
    border-radius: 20px;
    margin-bottom: 29px;
    background: #fff;
  }
}
</style>