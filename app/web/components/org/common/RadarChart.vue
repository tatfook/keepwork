<template>
  <ve-radar :data="chartData" :settings="settings" :height="height" :colors="colors" :extend="extend"></ve-radar>
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
      default: '570px'
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