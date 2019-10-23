<template>
  <div class="report-chart-line">
    <ve-line :data="chartData" :settings="settings" :extend="extend"></ve-line>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import 'echarts/lib/component/title'
export default {
  name: 'ReportChartLine',
  components: {
    VeLine
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    chartData() {
      return _.get(this.data, 'chartData', {})
    },
    color() {
      return _.get(this.data, 'color', [])
    },
    settings() {
      return {
        yAxisName: ['星星数']
      }
    },
    extend() {
      return {
        legend: {
          right: 0,
          orient: 'vertical'
        },
        title: {
          text: this.data.name,
          left: 38
        },
        grid: {
          right: 80,
          left: 40
        },
        xAxis: {
          name: '第*次点评',
          nameLocation: 'end'
        },
        color: this.color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-chart-line {
  &-name {
    color: #333;
    font-weight: bold;
    padding-left: 40px;
    text-align: left;
  }
  &-border {
    border-bottom: 1px solid #e5e5e5;
    margin: 0 30px 60px;
  }
}
</style>