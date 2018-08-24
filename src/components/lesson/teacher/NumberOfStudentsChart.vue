<template>
  <ve-histogram :data="studentChartData" :settings="chartSettings"></ve-histogram>
</template>

<script>
export default {
  name: 'NumberOfStudentsChart',
  props: {
    studentChartData: {
      type: Object,
      default() {
        return {}
      }
    },
    totalStudent: {
      type: Number,
      default: 50
    }
  },
  computed: {
    chartSettings() {
      return {
      yAxisName: [`${this.$t('lesson.totalStudent')} ${this.totalStudent} )`],
      xAxisName: [`${this.$t('lesson.accuracyRate')}(%)`],
      itemStyle: {
        color: '#ff7d7d'
      }
    }
  },
  data() {
    // this.chartSettings = {
    //   yAxisName: [`Number of Students (total: ${this.totalStudent})`],
    //   xAxisName: [`${this.$t('lesson.accuracyRate')}(%)`],
    //   itemStyle: {
    //     color: '#ff7d7d'
    //   }
    // }
    return {
      // studentChartData: {
      //   columns: ['accuracyRate', 'students'],
      //   rows: [
      //     { 'accuracyRate': '<60%', 'students': 20},
      //     { 'accuracyRate': '60%-80%', 'students': 30},
      //     { 'accuracyRate': '>80%', 'students': 20},
      //   ]
      // }
    }
  }
}
}
</script>