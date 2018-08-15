<template>
  <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        yAxisName: [' Accuracy Rate (%)'],
        yAxisType: ['percent'],
        itemStyle: {
          color: '#3975e2'
        },
      }
      return {
        chartData: {
          columns: ['题号', '正确率', ],
          rows: [
            { '题号': 'Quiz1', '正确率': 0.20, },
            { '题号': 'Quiz2', '正确率': 0.40, },
            { '题号': 'Quiz3', '正确率': 0.60, },
            { '题号': 'Quiz4', '正确率': 0.80, },
            { '题号': 'Quiz5', '正确率': 0.50, },
            { '题号': 'Quiz6', '正确率': 0.40, },
            { '题号': 'Quiz6', '正确率': 1.00, }
          ]
        }
      }
    }
  }
</script>