<template>
  <ve-radar class="radar-chart" :data="chartData" :settings="settings" :height="height" :width="width" :colors="colors" :extend="extend"></ve-radar>
  <!-- <ve-radar class="radar-chart" :data="chartData" :settings="settings" :colors="colors" :extend="extend"></ve-radar> -->
</template>

<script>
import VeRadar from 'v-charts/lib/radar.common'
export default {
  name: 'RadarChart',
  components: {
    VeRadar
  },
  props: {
    height: {
      type: String,
      default: '500px'
    },
    width: {
      type: String,
      default: 'auto'
    },
    chartData: {
      type: Object,
      default() {
        return {}
      }
    },
    extend: {
      type: Object,
      default() {
        return {}
      }
    },
    settings: {
      type: Object,
      default() {
        return {}
      }
    },
    colors: {
      type: Array,
      default() {
        return ['#ff7500', '#93b8d8']
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radar-chart {
  margin: 0 auto;
}
</style>