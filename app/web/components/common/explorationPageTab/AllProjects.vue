<template>
  <div class="all-projects" v-loading="loading">
    <el-row class="all-projects-boxs" v-show="!nothing">
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in allProjectsDataOptimize" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="projectsCount > perPage">
      <el-pagination :current-page="page" background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="projectsCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="all-projects-nothing">
        <img class="all-projects-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="all-projects-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import TabMixin from './TabMixin'

export default {
  name: 'AllProjects',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      loading: true
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
  },
  computed: {
    ...mapGetters({
      allProjects: 'pbl/allProjects'
    }),
    nothing() {
      return this.allProjectsDataOptimize.length === 0 && !this.loading
    },
    projectsCount() {
      return _.get(this.allProjects, 'total', 0)
    },
    allProjectsDataOptimize() {
      let hits = _.get(this.allProjects, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          _id: this.searchKeyResult(i, 'id'),
          name: this.searchKeyResult(i, 'name'),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_at,
          createdAt: i.created_at,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 0,
          choicenessNo: i.recommended ? 1 : 0,
          rate: i.point || 0,
          extra: {
            imageUrl: i.cover,
            videoUrl: i.video,
            rate: { count: i.point ? 8 : 0 }
          }
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getAllProjects: 'pbl/getAllProjects'
    }),
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await this.getAllProjects({
          page: targetPage,
          per_page: this.perPage,
          q: this.searchKey,
          sort: this.sortProjects
        })
        this.page = targetPage
        this.loading = false
        this.$emit('getAmount', this.projectsCount)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.all-projects {
  min-height: 500px;
  .fade-enter-active {
    transition: opacity 2s;
  }
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  &-boxs {
    min-height: 560px;
  }
  &-pages {
    margin-top: 40px;
    text-align: center;
  }
  &-nothing {
    text-align: center;
    &-img {
      margin: 128px 0 32px;
    }
    &-tip {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>


