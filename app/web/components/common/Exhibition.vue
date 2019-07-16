<template>
  <div class="exhibition-hall">
    <div class="exhibition-hall-breadcrumd">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线展厅</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="exhibition-hall-filter">
      <el-cascader class="exhibition-hall-filter-options" popper-class="exhibition-hall-filter-popper" v-model="selectedGameType" :options="gameTypeOptions" @change="_handleChange"></el-cascader>
      <el-cascader class="exhibition-hall-filter-options" popper-class="exhibition-hall-filter-popper" v-model="selectedGamePeriodical" :options="gamePeriodicalOptions" @change="handleChange"></el-cascader>
      <el-cascader class="exhibition-hall-filter-options" popper-class="exhibition-hall-filter-popper" v-model="selectedGameTheme" :options="gameThemeOptions" @change="handleChange"></el-cascader>
    </div>
    <el-row class="exhibition-hall-cabinet" v-loading="cabinetLoading">
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in allProjectsDataOptimize" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
      <p class="exhibition-hall-cabinet-hint" v-if="allProjectsDataOptimize.length == 0">暂无项目</p>
    </el-row>
    <div class="exhibition-hall-pages" v-if="projectsCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="projectsCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import ProjectCell from '@/components/common/ProjectCell'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ExhibitionHall',
  data() {
    return {
      perPage: 10,
      page: 1,
      selectedGameType: [],
      selectedGamePeriodical: [],
      selectedGameTheme: [],
      gameGroup: [],
      perPage: 12,
      page: 1,
      cabinetLoading: true
    }
  },
  async mounted() {
    await this.getGamesList()
    this.gameGroup = _.groupBy(_.get(this.gamesList, 'rows', []), 'name')
    await this.getWorksByGameId({
      'x-page': this.page,
      'x-per-page': this.perPage
    })
    this.cabinetLoading = false
  },
  computed: {
    ...mapGetters({
      gamesList: 'pbl/gamesList',
      gameWorks: 'pbl/gameWorks'
    }),
    gameTypeOptions() {
      let selectList = _.map(this.gameGroup, item => ({
        value: item[0].name,
        label: item[0].name,
        children: [
          {
            value: '参赛作品',
            label: '参赛作品'
          },
          {
            value: '获奖作品',
            label: '获奖作品'
          }
        ]
      }))
      selectList.unshift({ value: '', label: '全部' })
      return selectList
    },
    gamePeriodicalOptions() {
      if (this.selectedGameType.length !== 0) {
        let selectNoList = _.map(
          this.gameGroup[this.selectedGameType[0]],
          item => ({
            label: `第${item.no}期`,
            value: item.id
          })
        )
        selectNoList.unshift({ value: '', label: '全部' })
        return selectNoList
      }
      return []
    },
    gameThemeOptions() {
      if (this.selectedGameType[0] === 'NPL大赛') {
        // NPL大赛
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '动画',
            label: '动画'
          },
          {
            value: '游戏',
            label: '游戏'
          },
          {
            value: '解谜',
            label: '解谜'
          }
        ]
      }
      if (this.selectedGameType[0] === '全国青少年科技创新大赛') {
        // 全国青少年科技创新大赛
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '计算机科学',
            label: '计算机科学'
          }
        ]
      }
      if (this.selectedGameType[0] === '全国中小学科学影像节') {
        // 全国中小学科学影像节
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '科普动画',
            label: '科普动画'
          }
        ]
      }
      if (this.selectedGameType[0] === '全国中小学信息技术创新与实践大赛') {
        // 全国中小学信息技术创新与实践大赛
        return [
          {
            value: '',
            label: '全部'
          },
          {
            value: '动画创作',
            label: '动画创作'
          },
          {
            value: '微视频创作',
            label: '微视频创作'
          },
          {
            value: '移动端网页创作',
            label: '移动端网页创作'
          },
          {
            value: '3D智能作品创作',
            label: '3D智能作品创作'
          }
        ]
      }
      return [
        {
          value: '',
          label: '全部'
        }
      ]
    },
    allProjectsDataOptimize() {
      let list = _.get(this.gameWorks, 'rows', [])
      return _.filter(_.map(list, item => item.projects), v => v)
    },
    projectsCount() {
      return _.get(this.gameWorks, 'count', 0)
    }
  },
  methods: {
    ...mapActions({
      getGamesList: 'pbl/getGamesList',
      getWorksByGameId: 'pbl/getWorksByGameId'
    }),
    _handleChange(value) {
      this.handleChange(value, true)
    },
    async handleChange(value, clear = false) {
      this.cabinetLoading = true
      if (clear) {
        this.selectedGamePeriodical = []
        this.selectedGameTheme = []
      }
      let params = {
        'x-page': this.page,
        'x-per-page': this.perPage
      }
      let _selectedGameType = _.filter(this.selectedGameType, v => v)
      if (_selectedGameType.length !== 0) {
        params.gameName = this.selectedGameType[0]
        this.selectedGameType[1] == '获奖作品'
          ? (params.win = 1)
          : (params.win = '')
      }
      let _selectedGamePeriodical = _.filter(
        this.selectedGamePeriodical,
        v => v
      )
      if (_selectedGamePeriodical.length !== 0) {
        params.gameId = this.selectedGamePeriodical[0]
      }
      let _selectedGameTheme = _.filter(this.selectedGameTheme, v => v)
      if (_selectedGameTheme.length !== 0) {
        params.worksSubject = this.selectedGameTheme[0]
      }
      await this.getWorksByGameId(params)
      this.cabinetLoading = false
    },
    targetPage(targetPage) {
      this.page = targetPage
      this.handleChange()
    }
  },
  components: {
    ProjectCell
  }
}
</script>

<style lang="scss" scoped>
.exhibition-hall {
  max-width: 1200px;
  margin: 10px auto;
  &-filter {
    height: 64px;
    background-color: #fff;
    padding-left: 20px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    border-radius: 10px;
    &-options {
      margin: 0 6px;
      /deep/ .el-input {
        .el-input__inner {
          background: rgb(242, 242, 242);
          border-radius: 20px;
          border: none;
        }
      }
    }
  }
  &-cabinet {
    min-height: 586px;
    &-hint {
      text-align: center;
    }
  }
  &-pages {
    text-align: center;
    margin: 16px;
  }
}
</style>
<style lang="scss">
.exhibition-hall-filter-popper {
  .el-cascader-panel {
    .el-scrollbar {
      .el-cascader-menu__wrap {
        height: unset;
        min-height: 60px;
        max-height: 220px;
        .el-cascader-menu__list {
          position: static;
        }
      }
    }
  }
}
</style>


