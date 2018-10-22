<template>
  <div class="all-projects">
    <el-row>
      <el-col :span="6" v-for="(project,index) in allProjectsDataOptimize" :key="index">
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

export default {
  name: 'AllProjects',
  data() {
    return {
      perPage: 6,
      page: 1
    }
  },
  async mounted() {
    await this.getAllProjects({ page: this.page, perPage: this.perPage, type: '' })
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
          extra: { coverUrl: i.cover },
          name: i.name,
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { nickname: i.username },
          updatedAt: i.updated_time,
          type: i.type,
          recruiting: i.recruiting
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getAllProjects: 'pbl/getAllProjects'
    }),
    async targetPage(targetPage) {
      await this.getAllProjects({ page: targetPage, perPage: this.perPage })
    }
  },
  components: {
    ProjectCell
  }
}
</script>
<style lang="scss">
.all-projects{
  &-pages{
    text-align: center;
  }
}
</style>


