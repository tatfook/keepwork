<template>
  <radar-chart :chartData="chartData" :settings="chartSettings" :extend="extend"></radar-chart>
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
    },
    radarType: {
      type: String,
      validator(value) {
        return ['thisTime', 'history'].includes(value)
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
          radius: 146,
          nameGap: 46,
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
                padding: [5, 12],
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
          right: 30,
          orient: 'vertical'
        },
        grid: {
          bottom: 30,
          left: 100,
          right: '10%'
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
      return _.concat('name', _.map(this.labelKeyMap, item => item.name))
    },
    chartSettings() {
      return {
        areaStyle: {
          opacity: 0.3
        }
      }
    },
    userRepo() {
      return _.get(this.reportData, 'userRepo', {})
    },
    userSumStar() {
      return _.get(this.reportData, 'historyStarStatistics.userSumStar', {})
    },
    classmatesHistoryAvgStar() {
      return _.get(
        this.reportData,
        'historyStarStatistics.classmatesHistoryAvgStar',
        {}
      )
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
        (temp, item) => {
          temp[item.name] = {
            key: item.key,
            name: item.name,
            userStar: this.userStar[item.name],
            avgStar: this.classmateStar[item.name]
          }
          return temp
        },
        {}
      )
      return starGroup
    },
    labelKeyMap() {
      return [
        { key: 'spatial', name: '空间思维能力' },
        { key: 'collaborative', name: '协作沟通能力' },
        { key: 'creative', name: '创新思维能力' },
        { key: 'logical', name: '逻辑思考能力' },
        { key: 'compute', name: '计算思维能力' },
        { key: 'coordinate', name: '统筹思维能力' }
      ]
    },
    userStarFormKey() {
      return this.radarType === 'history' ? 'userSumStar' : 'userRepo'
    },
    isHistory() {
      return this.radarType === 'history'
    },
    userStar() {
      const userStar = _.reduce(
        this.labelKeyMap,
        (temp, item) => {
          const key = this.isHistory ? `${item.key}Count` : item.key
          temp[item.name] = this[this.userStarFormKey][key]
          return temp
        },
        {}
      )
      return userStar
    },
    classmateStarFromKey() {
      return this.radarType === 'history'
        ? 'classmatesHistoryAvgStar'
        : 'classmatesAvgStar'
    },
    classmateStar() {
      const classmateStar = _.reduce(
        this.labelKeyMap,
        (temp, item) => {
          temp[item.name] = this[this.classmateStarFromKey][`${item.key}Avg`]
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
  }
}
</script>