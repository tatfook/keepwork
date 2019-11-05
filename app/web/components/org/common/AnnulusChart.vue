<template>
  <div class="annulus-chart">
    <ve-ring :width="`${width}px`" height="170px" :data="ringData" :settings="ringChartSettings" :label="labelOptions" :extend="ringChartExtend"></ve-ring>
  </div>
</template>
<script>
import VeRing from 'v-charts/lib/ring.common'
import 'echarts/lib/component/title'
export default {
  name: 'AnnulusChart',
  props: {
    annulusData: {
      type: Array,
      required: true
    },
    chartColumn: {
      type: Array
    },
    width: {
      type: Number,
      default: 400
    },
    isTooltipFormater: {
      type: Boolean,
      default: false
    },
    isTitleShow: {
      type: Boolean,
      default: false
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
        title: this.isTitleShow
          ? {
              show: true,
              text: '班级数',
              subtext: '单位：个',
              textAlign: 'center',
              x: this.width - 85,
              y: 65,
              textStyle: {
                color: '#ababab',
                fontSize: 14,
                fontWeight: 'normal'
              },
              subTextStyle: {
                color: '#ababab',
                fontSize: 14
              }
            }
          : {},
        tooltip: this.isTooltipFormater
          ? {
              formatter: (params, ticket, callback) => {
                let content = this.getTooltipContent(params)
                return content
              },
              confine: true,
              extraCssText:
                'box-shadow: 0px 0px 4px 0px rgba(182, 182, 182, 0.4);',
              backgroundColor: '#fff',
              padding: [18, 18, 24, 18],
              textStyle: {
                color: '#000',
                fontSize: 14
              }
            }
          : {},
        legend: {
          show: true,
          type: 'plain',
          left: 42,
          top: 'middle',
          orient: 'vertical',
          align: 'right',
          itemGap: 6,
          itemWidth: 16,
          itemHeight: 18,
          selectedMode: false,
          formatter: '{name}',
          textStyle: {
            color: '#555',
            fontSize: 14
          }
        },
        color: ['#8158fc', '#67eec6', '#ffc15e'],
        series: {
          hoverAnimation: false,
          startAngle: 180,
          stillShowZeroSum: false,
          label: {
            show: true,
            position: 'inner',
            formatter: '{c}',
            color: '#000',
            fontSize: 14,
            align: 'center',
            verticalAlign: 'middle'
          },
          center: [this.width - 80, '50%'],
          radius: [56, 80]
        }
      },
      ringData: {
        columns: this.chartColumn || ['status', 'count'],
        rows: this.annulusData
      }
    }
  },
  methods: {
    getTooltipContent(params) {
      let tableContent = _.map(
        this.annulusData[params.dataIndex].classes,
        classDetail => {
          return `<tr><td>${classDetail.name}</td><td>${classDetail.teacherNames || ''}</td></tr>`
        }
      ).join('')
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
