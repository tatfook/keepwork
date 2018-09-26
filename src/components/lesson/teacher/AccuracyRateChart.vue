<template>
  <ve-histogram :data="quizChartData" :settings="chartSettings"></ve-histogram>
</template>

<script>
import Vue from 'vue'
  export default {
    name: "AccuracyRateChart",
    props: {
      quizChartData: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    data () {
      this.chartSettings = {
        yAxisName: [`${this.$t('lesson.accuracyRate')}(%)`],
        yAxisType: ['percent'],
        // xAxisTpe: ['category'],
        itemStyle: {
          color: '#3975e2'
        },
      }
      return {
      }
    },
  }
</script>