<template>
  <ve-histogram :data="chartData" :settings="settings" :extend="extend" @ready-once="completed"></ve-histogram>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
export default {
  name: 'HistogramChart',
  components: {
    VeHistogram
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
      return this.data.chartData
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
        color: this.color,
        series(v) {
          v.forEach(i => {
            i.barWidth = 24
            i.barGap = 0
          })
          return v
        }
      }
    }
  }
}
</script>