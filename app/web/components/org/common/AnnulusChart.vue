<template>
  <div class="annulus-chart">
    <ve-ring width="700px" height="170px" :data="ringData" :settings="ringChartSettings" :label="labelOptions" :extend="ringChartExtend"></ve-ring>
  </div>
</template>
<script>
import VeRing from 'v-charts/lib/ring.common'
export default {
  name: 'AnnulusChart',
  mounted() {
    this.ringData = {
      columns: ['status', 'count'],
      rows: this.ringOriginData
    }
    this.isDataReady = true
  },
  data() {
    return {
      isDataReady: false,
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
      ringOriginData: [
        {
          status: '发送给家长',
          count: 5,
          classes: [
            {
              name: '开发班级',
              teacherNames: '赵敏'
            },
            {
              name: '逻辑班级',
              teacherNames: 'waky'
            },
            {
              name: '建模班级',
              teacherNames: 'wivi'
            },
            {
              name: '逻辑班级1',
              teacherNames: 'waky1'
            },
            {
              name: '建模班级1',
              teacherNames: 'wivi1'
            }
          ]
        },
        {
          status: '点评（待发送）',
          count: 2,
          classes: [
            {
              name: '逻辑班级111',
              teacherNames: 'waky'
            },
            {
              name: '建模班级111',
              teacherNames: 'wivi'
            }
          ]
        },
        {
          status: '未点评',
          count: 7,
          classes: [
            {
              name: '开发班级',
              teacherNames: '赵敏'
            },
            {
              name: '逻辑班级',
              teacherNames: 'waky'
            },
            {
              name: '建模班级',
              teacherNames: 'wivi'
            },
            {
              name: '逻辑班级1',
              teacherNames: 'waky1'
            },
            {
              name: '建模班级1',
              teacherNames: 'wivi1'
            },
            {
              name: '逻辑班级111',
              teacherNames: 'waky'
            },
            {
              name: '建模班级111',
              teacherNames: 'wivi'
            }
          ]
        }
      ],
      ringData: {}
    }
  },
  methods: {
    getTooltipContent(params) {
      let tableContent = _.map(
        this.ringOriginData[params.dataIndex].classes,
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
