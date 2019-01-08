<template>
  <div class="paracraft" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in pracraftData" :key="index">
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
    <transition name="fade">
      <div v-if="nothing" class="all-projects-nothing">
        <img class="all-projects-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="all-projects-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import ProjectCell from '../ProjectCell'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import TabMixin from './TabMixin'

export default {
  name: 'Paracraft',
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
      pblParacraft: 'pbl/diffTypeProject'
    }),
    nothing() {
      return this.pracraftData.length === 0 && !this.loading
    },
    paracraft() {
      return this.pblParacraft({ type: 'paracraft' })
    },
    paracraftCount() {
      return _.get(this.paracraft, 'total', 0)
    },
    pracraftData() {
      let hits = _.get(this.paracraft, 'hits', [])
      return _.map(hits, i => {
        return {
          id: this.searchKeyResult(i, 'id'),
          extra: { imageUrl: i.cover, videoUrl: i.video },
          name: this.searchKeyResult(i, 'name'),
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
          type: 'paracraft',
          q: this.searchKey,
          sort: this.sortProjects
        })
        this.loading = false
        this.$emit('getAmount', this.paracraftCount)
      })
    },
    searchKeyResult(i, key) {
      if (i.highlight) {
        if (i.highlight[key]) {
          let name = _.get(i.highlight, key, i[key])
          return name.join().replace(/<span>/g, `<span class="red">`)
        }
      }
      return i[key]
    }
  },
  components: {
    ProjectCell
  }
}
</script>

