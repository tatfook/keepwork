<template>
  <div class="all-projects" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in allProjectsDataOptimize" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="projectsCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="projectsCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCell from '../ProjectCell'
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
    this.loading = false
  },
  computed: {
    ...mapGetters({
      allProjects: 'pbl/allProjects'
    }),
    projectsCount() {
      return _.get(this.allProjects, 'total', 0)
    },
    allProjectsDataOptimize() {
      let hits = _.get(this.allProjects, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          extra: { imageUrl: i.cover, videoUrl: i.video },
          name: i.name,
          name_title: this.searchKeyResult(i),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_time,
          createdAt: i.created_time,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 0
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
        this.loading = false
        this.$emit('getAmount', this.projectsCount)
      })
    },
    searchKeyResult(i) {
      if (i.highlight) {
        let name = _.get(i.highlight, 'name', i.name)
        return name.join().replace(/<span>/g, `<span class="red">`)
      }
      return i.name
    }
  },
  components: {
    ProjectCell
  }
}
</script>
<style lang="scss">
</style>


