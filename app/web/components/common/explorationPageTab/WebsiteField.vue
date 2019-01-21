<template>
  <div class="website-field" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in websiteData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="website-field-pages" v-if="websiteCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="websiteCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-if="nothing" class="website-field-nothing">
        <img class="website-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="website-field-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import TabMixin from './TabMixin'

export default {
  name: 'WebsiteField',
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
          _id: this.searchKeyResult(i, 'id'),
          name: this.searchKeyResult(i, 'name'),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: { username: i.username, portrait: i.user_portrait || '' },
          updatedAt: i.updated_at,
          createdAt: i.created_at,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 0,
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
    }
  }
}
</script>
<style lang="scss" scoped>
.website-field {
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
  &-pages {
    margin-top: 40px;
    text-align: center;
  }
  &-nothing {
    min-height: 500px;
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

