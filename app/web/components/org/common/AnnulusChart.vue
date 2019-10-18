<template>
  <div class="annulus-chart">
    <ve-ring width="700px" height="170px" :data="ringData" :settings="ringChartSettings" :label="labelOptions" :extend="ringChartExtend"></ve-ring>
  </div>
</template>
<script>
import VeRing from 'v-charts/lib/ring.common'
export default {
  name: 'AnnulusChart',
  props: {
    annulusData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      ringChartSettings: {},
      labelOptions: {
        show: true,
        position: 'inner'
      },
      ringChartExtend: {
        tooltip: {
          formatter: (params, ticket, callback) => {
            let content = this.getTooltipContent(params)
            return content
          },
          backgroundColor: '#fff',
          padding: [18, 18, 24, 18],
          textStyle: {
            color: '#000',
            fontSize: 14
          }
        },
        legend: {
          type: 'plain',
          left: 42,
          top: 'middle',
          orient: 'vertical',
          align: 'right',
          itemGap: 6,
          itemWidth: 16,
          itemHeight: 18,
          formatter: 'Legend {name}',
          textStyle: {
            color: '#555',
            fontSize: 14
          }
        },
        color: ['#8158fc', '#67eec6', '#ffc15e'],
        series: {
          hoverAnimation: false,
          startAngle: 180,
          label: {
            show: true,
            position: 'inner',
            formatter: '{c}',
            color: '#000',
            fontSize: 14,
            align: 'center',
            verticalAlign: 'middle'
          },
          center: ['50%', '50%'],
          radius: [56, 85]
        }
      },
      ringData: {
        columns: ['status', 'count'],
        rows: this.annulusData
      }
    }
  },
  methods: {
    getTooltipContent(params) {
      let tableContent = _.map(
        this.annulusData[params.dataIndex].classes,
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
    annulusData(value) {
      this.ringData.rows = value
    }
  },
  components: {
    VeRing
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
