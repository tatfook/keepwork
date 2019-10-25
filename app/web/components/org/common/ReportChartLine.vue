<template>
  <ve-line :data="chartData" :settings="settings" :extend="extend" @ready-once="completed"></ve-line>
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
  data() {
    return {
      timer: null
    }
  },
  methods: {
    completed(instance) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.$emit('completed', instance), 300)
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

