<template>
  <div class="recruiting-field" v-loading="loading">
    <el-row class="recruiting-field-boxs">
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in recruitmentData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="recruiting-field-pages" v-if="recruitingCount > perPage">
      <el-pagination :current-page="page" background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="recruitingCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="recruiting-field-nothing">
        <img class="recruiting-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="recruiting-field-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import _ from 'lodash'
import { EsAPI, injectUserInfo } from '@/api'
import TabMixin from './TabMixin'

export default {
  name: 'RecruitingField',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      loading: true,
      recruitongProjects: []
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
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
          id: i.id,
          _id: this.searchKeyResult(i, 'id'),
          name: this.searchKeyResult(i, 'name'),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: i.user,
          highlight: i.highlight,
          updatedAt: i.updated_at,
          createdAt: i.created_at,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 2,
          choicenessNo: i.recommended ? 1 : 0,
          rate: i.point || 0,
          extra: {
            worldTagName: i['world_tag_name'],
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
            recruiting: true,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(async res => {
            res.hits = await injectUserInfo({ data: res.hits})
            this.recruitongProjects = res
          })
          .catch(err => console.error(err))
        this.page = targetPage
        this.loading = false
        this.$emit('getAmount', this.recruitingCount)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.recruiting-field {
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


