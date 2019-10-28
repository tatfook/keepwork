<template>
  <ve-histogram :data="chartData" :height="height" :settings="settings" :extend="extend" @ready-once="completed"></ve-histogram>
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
      completedTimer: null,
      timer: null,
      height: '400px',
      cellpphoneMod: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setZoom()
      window.addEventListener('resize', this.monitorResize)
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.monitorResize)
  },
  methods: {
    completed(instance) {
      clearTimeout(this.completedTimer)
      this.completedTimer = setTimeout(
        () => this.$emit('completed', instance),
        300
      )
    },
    monitorResize(evt) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setZoom()
      }, 800)
    },
    setZoom() {
      const clientWidth = document.body.clientWidth
      if (clientWidth < 768) {
        this.cellpphoneMod = true
        this.height = '200px'
      } else {
        this.cellpphoneMod = false
        this.height = '400px'
      }
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
          orient: 'vertical',
          itemHeight: this.cellpphoneMod ? 8 : 14,
          itemWidth: this.cellpphoneMod ? 12 : 25,
          textStyle: {
            fontSize: this.cellpphoneMod ? 12 : 'normal'
          }
        },
        title: {
          text: this.data.name,
          left: this.cellpphoneMod ? 10 : 38,
          textStyle: {
            fontSize: this.cellpphoneMod ? 14 : 18
          }
        },
        grid: {
          height: this.cellpphoneMod ? '60%' : 'auto',
          right: 80,
          left: this.cellpphoneMod ? 20 : 40
        },
        xAxis: {
          name: '第*次点评',
          nameLocation: 'end'
        },
        color: this.color,
        series: v => {
          v.forEach(i => {
            i.barWidth = this.cellpphoneMod ? 14 : 24
            i.barGap = 0
          })
          return v
        }
      }
    }
  }
}
</script>