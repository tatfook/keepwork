<template>
  <div class="website">
    <el-row>
      <el-col :span="6" v-for="(project,index) in websiteData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="paracraftCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="paracraftCount">
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
  name: 'Website',
  data() {
    return {
      perPage: 2,
      page: 1
    }
  },
  async mounted() {
    await this.getTypeProjects({ page: this.page, perPage: this.perPage, type: 'website' })
  },
  computed: {
    ...mapGetters({
      website: 'pbl/website'
    }),
    websiteCount(){
      return _.get(this.website, 'total', 0)
    },
    websiteData(){
      let hits = _.get(this.website, 'hits', [])
      return _.map(hits, i => {
        return {
          extra: { coverUrl: i.cover },
          name: i.name,
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { nickname: i.username },
          updatedAt: i.total_comment || '0000:00:00',
          type: i.type,
          recruiting: i.recruiting
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getTypeProjects: 'pbl/getTypeProjects'
    }),
    async targetPage(targetPage){
      await this.getTypeProjects({ page: targetPage, perPage: this.perPage, type: 'website' })      
    }
  },
  components: {
    ProjectCell
  }
}
</script>

