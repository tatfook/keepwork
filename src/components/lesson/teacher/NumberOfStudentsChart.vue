<template>
  <ve-histogram :data="studentChartData" :settings="chartSettings"></ve-histogram>
</template>

<script>
  export default {
    name: "NumberOfStudentsChart",
    props: {
      studentChartData: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    data () {
      this.chartSettings = {
        yAxisName: ['Number of Students (total: 50)'],
        xAxisName: ['Accuracy Rate (%)'],
        itemStyle: {
          color: '#ff7d7d'
        },
      }
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
</script>