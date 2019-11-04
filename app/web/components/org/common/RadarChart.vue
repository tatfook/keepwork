<template>
  <ve-radar class="radar-chart" :data="chartData" :settings="settings" :height="height" :width="width" :colors="colors" :extend="extend" @ready-once="completed"></ve-radar>
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
        return ['#93b8d8', '#ff7500']
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
  }
}
</script>

<style lang="scss" scoped>
.radar-chart {
  margin: 0 auto;
}
</style>