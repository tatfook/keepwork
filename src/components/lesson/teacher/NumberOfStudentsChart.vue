<template>
  <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
</template>

<script>
  export default {
    name: "NumberOfStudentsChart",
    data () {
      this.chartSettings = {
        yAxisName: ['Number of Students (total: 50)'],
        xAxisName: ['Accuracy Rate (%)'],
        itemStyle: {
          color: '#ff7d7d'
        },
      }
      return {
        chartData: {
          columns: ['正确率', '学生数'],
          rows: [
            { '正确率': '<60%', '学生数': 20},
            { '正确率': '60%-80%', '学生数': 30},
            { '正确率': '>80%', '学生数': 20},
          ]
        }
      }
    }
  }
</script>