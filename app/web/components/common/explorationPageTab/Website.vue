<template>
  <div class="website">
    <div class="search-result-total">搜索到：<span>{{websiteCount}}</span>个结果</div>
    <el-row>
      <el-col :sm="12" :md="6" v-for="(project,index) in websiteData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="websiteCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="websiteCount">
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
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      perPage: 2,
      page: 1
    }
  },
  async mounted() {
    await this.targetPage(this.page)
  },
  computed: {
    ...mapGetters({
      website: 'pbl/website'
    }),
    websiteCount() {
      return _.get(this.website, 'total', 0)
    },
    websiteData() {
      let hits = _.get(this.website, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          extra: { coverUrl: i.cover },
          name: this.searchKeyResult(i),
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
      this.$nextTick(async () => {
        await this.getTypeProjects({
          page: targetPage,
          per_age: this.perPage,
          type: 'website',
          q: this.searchKey,
          sort: this.sortProjects
        })
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

