<template>
  <div class="report-echart">
    <radar-chart :chartData="chartData" :settings="chartSettings" :extend="extend"></radar-chart>
  </div>
</template>

<script>
import RadarChart from '@/components/org/common/RadarChart'
export default {
  name: 'ReportChart',
  components: {
    RadarChart
  },
  props: {
    reportData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      starIcon: require('@/assets/org/star.png')
    }
  },
  computed: {
    extend() {
      return {
        radar: {
          shape: 'polygon',
          center: ['50%', '50%'],
          padding: [20, 20],
          name: {
            formatter: (value, indicator) => {
              const { userStar, avgStar, name } = this.starGroup[value]
              const str = [
                `{a|${userStar}}`,
                '{b|}',
                `{c|(平均值: ${avgStar})}`,
                `\n{d|${name}}`
              ].join('')
              return str
            },
            rich: {
              a: {
                color: '#333',
                fontSize: 14
              },
              b: {
                backgroundColor: {
                  image: this.starIcon
                },
                fontSize: 18
              },
              c: {
                color: '#999',
                fontSize: 14,
                padding: [0, 4],
                height: 28
              },
              d: {
                align: 'center',
                padding: [7, 14],
                fontSize: 14,
                color: '#333',
                backgroundColor: '#ededed',
                borderRadius: 4
              }
            }
          },
          splitArea: {
            show: false
          }
        },
        legend: {
          right: 0,
          orient: 'vertical'
        }
      }
    },
    chartData() {
      return {
        columns: this.columns,
        rows: [this.userStartByName, this.classmateStarByName]
      }
    },
    columns() {
      return [
        'name',
        'spatial',
        'collaborative',
        'creative',
        'logical',
        'compute',
        'coordinate'
      ]
    },
    chartSettings() {
      return {
        labelMap: this.labelMap,
        areaStyle: {
          opacity: 0.3
        }
      }
    },
    userRepo() {
      return _.get(this.reportData, 'userRepo', {})
    },
    userRealname() {
      return _.get(this.userRepo, 'realname', '')
    },
    userPortrait() {
      return _.get(this.userRepo, 'portrait', this.defaultPortrait)
    },
    classmatesAvgStar() {
      return _.get(this.reportData, 'classmatesAvgStar', {})
    },
    mediaUrl() {
      return _.get(this.userRepo, 'mediaUrl', [])
    },
    comment() {
      return _.defaultTo(this.userRepo, 'comment', '')
    },
    star() {
      return _.defaultTo(this.userRepo, 'star', 0)
    },
    starGroup() {
      const starGroup = _.reduce(
        this.labelKeyMap,
        (temp, key) => {
          temp[key] = {
            key,
            name: this.labelName[key],
            userStar: this.userRepo[key],
            avgStar: this.classmateStar[key]
          }
          return temp
        },
        {}
      )
      return starGroup
    },
    labelName() {
      return {
        spatial: '空间思维能力',
        collaborative: '协作沟通能力',
        creative: '创新思维能力',
        logical: '逻辑思考能力',
        compute: '计算思维能力',
        coordinate: '统筹思维能力'
      }
    },
    labelKeyMap() {
      return [
        'spatial',
        'collaborative',
        'creative',
        'logical',
        'compute',
        'coordinate'
      ]
    },
    userStar() {
      const userStar = _.reduce(
        this.labelKeyMap,
        (temp, key) => {
          temp[key] = this.userRepo[key]
          return temp
        },
        {}
      )
      return userStar
    },
    classmateStar() {
      const classmateStar = _.reduce(
        this.labelKeyMap,
        (temp, key) => {
          const avgKey = `${key}Avg`
          temp[key] = this.classmatesAvgStar[`${key}Avg`]
          return temp
        },
        {}
      )
      return classmateStar
    },
    userStartByName() {
      return {
        name: this.userRealname,
        ...this.userStar
      }
    },
    classmateStarByName() {
      return {
        name: '本班同学平均值',
        ...this.classmateStar
      }
    }
  },
  created() {
    console.warn(this.classmateStar)
  }
}
</script>

<style lang="scss" scoped>
.report-echart {
}
</style>