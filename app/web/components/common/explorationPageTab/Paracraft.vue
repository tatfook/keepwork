<template>
  <div class="paracraft">
    <el-row>
      <el-col :span="6" v-for="(project,index) in pracraftData" :key="index">
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
  name: 'Paracraft',
  data() {
    return {
      perPage: 4,
      page: 1
    }
  },
  async mounted() {
    await this.getTypeProjects({ page: this.page, perPage: this.perPage, type: 'paracraft' })
  },
  computed: {
    ...mapGetters({
      paracraft: 'pbl/paracraft'
    }),
    paracraftCount(){
      return _.get(this.paracraft, 'total', 0)
    },
    pracraftData() {
      let hits = _.get(this.paracraft, 'hits', [])
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
      await this.getTypeProjects({ page: targetPage, perPage: this.perPage, type: 'paracraft' })      
    }
  },
  components: {
    ProjectCell
  }
}
</script>

