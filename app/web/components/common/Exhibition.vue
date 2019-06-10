<template>
  <div class="exhibition-hall">
    <div class="exhibition-hall-breadcrumd">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>在线展厅</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="exhibition-hall-filter">
      <el-cascader class="exhibition-hall-filter-options" v-model="selectedGameType" :options="gameTypeOptions" @change="handleChange"></el-cascader>
      <el-cascader class="exhibition-hall-filter-options" v-model="selectedGamePeriodical" :options="gamePeriodicalOptions" @change="handleChange"></el-cascader>
      <el-cascader class="exhibition-hall-filter-options" v-model="selectedGameTheme" :options="gameThemeOptions" @change="handleChange"></el-cascader>
    </div>
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in allProjectsDataOptimize" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="projectsCount > perPage">
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
      gameTypeOptions: [
        {
          value: '1',
          label: '全国青少年科技创新大赛',
          children: [
            {
              value: '1-1',
              label: '参赛作品'
            },
            {
              value: '1-2',
              label: '获奖作品'
            }
          ]
        }
      ],
      gamePeriodicalOptions: [
        {
          value: '1',
          label: '第一期'
        },
        {
          value: '2',
          label: '第2期'
        }
      ],
      gameThemeOptions: [
        {
          value: '1',
          label: '春天'
        },
        {
          value: '2',
          label: '夏天'
        }
      ],
      allProjectsDataOptimize: []
    }
  },
  async mounted() {
    await this.getGamesList()
    console.log('1', this.gamesList)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      gamesList: 'pbl/gamesList',
      gameWorks: 'pbl/gameWorks'
    }),
    projectsCount() {
      return 0
    }
  },
  methods: {
    ...mapActions({
      getGamesList: 'pbl/getGamesList'
    }),
    handleChange(value) {
      console.log(value)
    },
    targetPage(targetPage) {
      console.log(targetPage)
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
}
</style>

