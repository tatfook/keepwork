<template>
  <ve-line :data="chartData" :settings="settings" :extend="extend"></ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
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
    settings() {
      return {
        yAxisName: ['星星数'],
        padding: [0, 20]
      }
    },
    extend() {
      return {
        legend: {
          right: 0,
          orient: 'vertical'
        },
        title: {
          text: '对数轴示例',
          left: 'center'
        },
        xAxis: {
          name: '第*次点评',
          splitLine: { show: false }
        }
      }
    }
  },
  created() {
    console.log(this.data)
  }
}
</script>