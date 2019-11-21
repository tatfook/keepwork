<template>
  <div class="paracraft-field" v-loading="loading">
    <el-row class="paracraft-field-boxs">
      <el-col :sm="12" :md="6" :xs="12" v-for="(project,index) in pracraftData" :key="index">
        <project-cell :project="project"></project-cell>
      </el-col>
    </el-row>
    <div class="paracraft-field-pages" v-if="paracraftCount > perPage">
      <el-pagination :current-page="page" background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="paracraftCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="paracraft-field-nothing">
        <img class="paracraft-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="paracraft-field-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import TabMixin from './TabMixin'

export default {
  name: 'ParacraftField',
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
          id: i.id,
          _id: this.searchKeyResult(i, 'id'),
          name: this.searchKeyResult(i, 'name'),
          visit: i.total_view,
          star: i.total_like,
          comment: i.total_comment || 0,
          user: i.user,
          updatedAt: i.updated_at,
          createdAt: i.created_at,
          type: i.type === 'site' ? 0 : 1,
          privilege: i.recruiting ? 1 : 0,
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
        this.page = targetPage
        this.loading = false
        this.$emit('getAmount', this.paracraftCount)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.paracraft-field {
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


