<template>
  <div class="paracraft" v-loading="loading">
    <div class="search-result-total">搜索到：<span>{{paracraftCount}}</span>个结果</div>
    <el-row>
      <el-col :sm="12" :md="6" v-for="(project,index) in pracraftData" :key="index">
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
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      perPage: 4,
      page: 1,
      loading: true
    }
  },
  async mounted() {
    await this.targetPage(this.page)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      paracraft: 'pbl/paracraft'
    }),
    paracraftCount() {
      return _.get(this.paracraft, 'total', 0)
    },
    pracraftData() {
      let hits = _.get(this.paracraft, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          extra: { coverUrl: i.cover },
          name: i.name,
          name_title: this.searchKeyResult(i),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_time,
          type: i.type,
          privilege: i.recruiting ? 1 : 2
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getTypeProjects: 'pbl/getTypeProjects'
    }),
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await this.getTypeProjects({
          page: targetPage,
          per_page: this.perPage,
          type: 'paracraft',
          q: this.searchKey,
          sort: this.sortProjects
        })
        this.loading = false
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

