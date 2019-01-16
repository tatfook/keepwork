<template>
  <div class="ranking-list">
    <div class="ranking-list-banner"><img src="@/assets/pblImg/ranking_banner.png" alt="banner"></div>
    <div class="ranking-list-cabinet">
      <div class="ranking-list-cabinet-center">
        <el-row>
          <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in rankingList" :key="index">
            <project-cell :project="project" :ranking='true' :level="index"></project-cell>
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

export default {
  name: 'Ranking',
  data() {
    return {
      loading: true,
      ranking: {}
    }
  },
  computed: {
    rankingList() {
      return _.get(this.ranking, 'rows', [])
    }
  },
  async mounted() {
    await this.getRankingProjects()
    this.loading = false
  },
  methods: {
    getRankingProjects() {
      keepwork.projects
        .getProjects({
          'x-order': 'rate-desc',
          'x-per-page': 100
        })
        .then(res => {
          this.ranking = res
        })
        .catch(e => {
          console.error(e)
        })
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
    margin-bottom: 40px;
    img {
      width: 100%;
      max-width: 1920px;
      object-fit: cover;
    }
  }
  &-cabinet {
    &-center {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
}
</style>


