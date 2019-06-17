<template>
  <div class="picked-projects" v-loading="loading">
    <el-row class="picked-projects-boxs">
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in pickedProjectsData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="picked-projects-pages" v-if="pickedProjectsCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="pickedProjectsCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="picked-projects-nothing">
        <img class="picked-projects-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="picked-projects-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import _ from 'lodash'
import { EsAPI } from '@/api'
import TabMixin from './TabMixin'

export default {
  name: 'PickedProjects',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      loading: true,
      pickedProjects: []
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
  },
  computed: {
    nothing() {
      return this.pickedProjectsData.length === 0 && !this.loading
    },
    pickedProjectsCount() {
      return _.get(this.pickedProjects, 'total', 0)
    },
    pickedProjectsData() {
      let hits = _.get(this.pickedProjects, 'hits', [])
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
          privilege: i.recruiting ? 1 : 2,
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
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.projects
          .getProjects({
            page: targetPage,
            per_page: this.perPage,
            recommended: true,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            this.pickedProjects = res
          })
          .catch(err => console.error(err))
        this.loading = false
        this.$emit('getAmount', this.pickedProjectsCount)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.picked-projects {
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


