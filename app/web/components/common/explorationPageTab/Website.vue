<template>
  <div class="website" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in websiteData" :key="index">
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
    <div v-if="nothing" class="all-projects-nothing">
      <img class="all-projects-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
      <p class="all-projects-nothing-tip">没有找到符合条件的结果</p>
    </div>
  </div>
</template>
<script>
import ProjectCell from '../ProjectCell'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import TabMixin from './TabMixin'

export default {
  name: 'Website',
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
      pblWebsite: 'pbl/diffTypeProject'
    }),
    nothing() {
      return this.websiteData.length === 0 && !this.loading
    },
    website() {
      return this.pblWebsite({ type: 'site' })
    },
    websiteCount() {
      return _.get(this.website, 'total', 0)
    },
    websiteData() {
      let hits = _.get(this.website, 'hits', [])
      return _.map(hits, i => {
        return {
          id: i.id,
          extra: { imageUrl: i.cover, videoUrl: i.video },
          name: this.searchKeyResult(i),
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
      getTypeProjects: 'pbl/getTypeProjects'
    }),
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await this.getTypeProjects({
          page: targetPage,
          per_page: this.perPage,
          type: 'site',
          q: this.searchKey,
          sort: this.sortProjects
        })
        this.loading = false
        this.$emit('getAmount', this.websiteCount)
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

