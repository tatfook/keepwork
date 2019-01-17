<template>
  <div class="recruiting" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in recruitmentData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="recruitingCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="recruitingCount">
      </el-pagination>
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
import _ from 'lodash'
import { EsAPI } from '@/api'
import TabMixin from './TabMixin'

export default {
  name: 'Recruiting',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      recruitongProjects: [],
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
    this.loading = false
  },
  computed: {
    nothing() {
      return this.recruitmentData.length === 0 && !this.loading
    },
    recruitingCount() {
      return _.get(this.recruitongProjects, 'total', 0)
    },
    recruitmentData() {
      let hits = _.get(this.recruitongProjects, 'hits', [])
      return _.map(hits, i => {
        return {
          id: this.searchKeyResult(i, 'id'),
          extra: { imageUrl: i.cover, videoUrl: i.video },
          name: this.searchKeyResult(i, 'name'),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_at,
          createdAt: i.created_at,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 2,
          choicenessNo: i.recommended ? 1 : 0,
          rate: i.point || 0
        }
      })
    }
  },
  methods: {
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.projects
          .getProjects({
            page: targetPage,
            per_page: this.perPage,
            recruiting: true,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            this.recruitongProjects = res
          })
          .catch(err => console.error(err))
        this.loading = false
        this.$emit('getAmount', this.recruitingCount)
      })
    }
  }
}
</script>

