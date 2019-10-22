<template>
  <ve-histogram :data="chartData"></ve-histogram>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
export default {
  name: 'HistogramChart',
  components: {
    VeHistogram
  },
  props: {
    chartData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>