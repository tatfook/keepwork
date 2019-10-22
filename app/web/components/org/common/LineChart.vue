<template>
  <div class="line-chart">
    <ve-line width="700px" height="300px" :data="lineChartData" :settings="lineChartSettings" :label="labelOptions" :extend="lineChartExtend"></ve-line>
  </div>
</template>
<script>
import VeLine from 'v-charts/lib/line.common'
export default {
  name: 'LineChart',
  props: {
    lineData: {
      type: Array,
      required: true
    }
  },
  mounted() {},
  data() {
    return {
      lineChartSettings: {
        labelMap: {
          commentCount: '点评（次）',
          sendCount: '发送给家长（次）'
        },
        yAxisName: ['单位：次']
      },
      labelOptions: {
        show: true,
        position: 'inner'
      },
      lineChartExtend: {
        legend: {
          type: 'plain',
          top: 40,
          right: 10,
          orient: 'vertical',
          align: 'right',
          itemGap: 6,
          itemWidth: 16,
          itemHeight: 18,
          formatter: '{name}',
          textStyle: {
            color: '#555',
            fontSize: 14
          }
        },
        grid: {
          width: 450,
          height: 250,
          top: 32,
          bottom: 2
        },
        xAxis: {
          name: '班级名称',
          nameLocation: 'end',
          nameTextStyle: {
            color: '#ababab',
            fontSize: 14
          },
          axisTick: false,
          axisLabel: {
            margin: 10,
            color: '#555',
            fontSize: 14
          }
        },
        series: {
          symbol: 'circle',
          symbolSize: 8,
          smooth: true
        },
        color: ['#8158fc', '#67eec6']
      },
      lineChartData: {
        columns: ['name', 'commentCount', 'sendCount'],
        rows: this.lineData
      }
    }
  },
  methods: {
    getTooltipContent(params) {
      let tableContent = _.map(
        this.lineData[params.dataIndex].classes,
        classDetail =>
          `<tr><td>${classDetail.name}</td><td>${classDetail.teacherNames}</td></tr>`
      )
      let content = `
        <div class="tooltip-header">
          <span class="" style="background:${params.color}"></span>
          ${params.name}(班级数：${params.value}个)
        </div>
        <table class="tooltip-table">
          <tr>
            <th>班级名称</th>
            <th>老师姓名</th>
          </tr>
          ${tableContent}
        </table>
      `
      return content
    }
  },
  watch: {
    lineData(value) {
      this.lineChartData.rows = value
    }
  },
  components: {
    VeLine
  }
}
</script>
<style lang="scss" scoped>
.annulus-chart {
  overflow: visible;
  /deep/ .tooltip-header {
    & > span {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }
  }
  /deep/ table {
    border-collapse: collapse;
    th,
    td {
      border: 1px solid #e4e7ed;
      padding: 8px 12px;
    }
    th {
      background-color: #fafafa;
    }
    td {
      color: #555;
    }
  }
}
</style>
