<template>
  <div class="ranking-list">
    <div class="ranking-list-banner"><img src="@/assets/pblImg/ranking_banner.png" alt="banner"></div>
    <div class="ranking-list-tab">
      <div class="ranking-list-tab-center">
        <el-menu :default-active="defaultActiveIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item index="总榜">总榜</el-menu-item>
          <el-submenu index="NPL">
            <template slot="title">NPL大赛</template>
            <el-menu-item v-for="i in tabGamesList" :key="i.id" :index="i.id+''">{{gameNoState(i)}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="ranking-list-cabinet" v-loading="loading">
      <div class="ranking-list-cabinet-center">
        <div class="ranking-list-cabinet-center-hint">
          <div class="ranking-list-cabinet-center-hint-left">{{currentListName}}</div>
          <div class="ranking-list-cabinet-center-hint-right" v-if="currentListName == '总榜' ? false : true"><a href="/NPL">了解大赛详情</a></div>
        </div>
        <el-row>
          <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in showProjectsByTab" :key="index">
            <project-cell :project="project" :ranking='true' :level="index" :showProjectRate="showProjectRate"></project-cell>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from './ProjectCell'
import _ from 'lodash'
import { keepwork } from '@/api'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'RankingList',
  data() {
    return {
      loading: true,
      ranking: {},
      defaultActiveIndex: '总榜',
      activeIndex: ['总榜']
    }
  },
  computed: {
    ...mapGetters({
      gamesList: 'pbl/gamesList',
      gameWorks: 'pbl/gameWorks'
    }),
    currentListName() {
      if (this.activeIndex[0] === '总榜') {
        return '总榜'
      }
      if (this.activeIndex[0] === 'NPL') {
        for (let i = 0; i < this.tabGamesList.length; i++) {
          if (Number(this.activeIndex[1]) === this.tabGamesList[i].id) {
            return this.gameNoState(this.tabGamesList[i])
          }
        }
      }
      return '总榜'
    },
    tabGamesList() {
      const nowTime = new Date()
      return _.filter(_.get(this.gamesList, 'rows', []), i => {
        return (
          (nowTime > new Date(i.startDate) && nowTime < new Date(i.endDate)) ||
          nowTime > new Date(i.endDate)
        )
      })
    },
    showProjectsByTab() {
      return this.activeIndex[0] === '总榜'
        ? this.rankingList
        : this.gameStagesWorks
    },
    showProjectRate(){
      return  this.showProjectsByTab === this.rankingList ? true : false 
    },
    rankingList() {
      return _.get(this.ranking, 'rows', [])
    },
    gameStagesWorks() {
      let list = _.get(this.gameWorks, 'rows', [])
      let works = []
      _.forEach(list, i => {
        works.push(i.projects)
      })
      return works
    }
  },
  async mounted() {
    await this.getRankingProjects()
    await this.getGamesList()
    this.loading = false
  },
  methods: {
    ...mapActions({
      getGamesList: 'pbl/getGamesList',
      getWorksByGameId: 'pbl/getWorksByGameId'
    }),
    gameNoState(i) {
      const nowTime = new Date()
      let state = nowTime < new Date(i.startDate)
        ? '未开始'
        : nowTime > new Date(i.startDate) && nowTime < new Date(i.endDate)
        ? '进行中'
        : '已结束'
        return `${i.name}第${i.no}期   （${state}）`
    },
    getRankingProjects() {
      keepwork.projects
        .getProjects({
          'x-order': 'rate-desc',
          'x-per-page': 100,
          type: 1,
          visibility: 0
        })
        .then(res => {
          this.ranking = res
        })
        .catch(e => {
          console.error(e)
        })
    },
    async handleSelect(key, keyPath) {
      this.loading = true
      this.activeIndex = keyPath
      if (key === '总榜') {
        await this.getRankingProjects()
        this.loading = false
      }
      await this.getWorksByGameId({ gameId: key })
      this.loading = false
    }
  },
  components: {
    ProjectCell
  }
}
</script>
<style lang="scss">
.ranking-list {
  &-banner {
    background: linear-gradient(to right, #6400d5, #7613d5);
    text-align: center;
    img {
      width: 100%;
      max-width: 1920px;
      object-fit: cover;
    }
  }
  &-tab {
    height: 60px;
    background: #ffffff;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      .el-dropdown-link {
        .right-icon {
          font-size: 12px;
        }
      }
    }
  }
  &-cabinet {
    min-height: 500px;
    &-center {
      max-width: 1200px;
      margin: 0 auto;
      &-hint {
        display: flex;
        margin: 20px 0;
        &-left {
          flex: 1;
          text-align: left;
          font-weight: 700;
        }
        &-right {
          flex: 1;
          text-align: right;
          a {
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>


