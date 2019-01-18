<template>
  <div class="webpage" v-loading="loading">
    <div class="webpage-content" v-for="(webpage,index) in webpagesData" :key="index">
      <div class="webpage-content-top">
        <a :href="webpage.url" target="_blank" class="webpage-content-top-title" v-html="webpage.title"></a>
        <a :href="webpage.url" target="_blank" class="webpage-content-top-url" v-html="origin + webpage.url_html"></a>
      </div>
      <p class="webpage-content-text" v-html="webpage.content + '...'"></p>
    </div>
    <div class="all-projects-pages" v-if="webpagesCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="webpagesCount">
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
  name: 'WebpageField',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      webpages: [],
      perPage: 12
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(1)
    this.loading = false
  },
  computed: {
    origin() {
      return window.location.origin + '/'
    },
    webpagesData() {
      let hits = _.get(this.webpages, 'hits', [])
      return _.map(hits, i => {
        return {
          ...i,
          title: this.searchKeyResult(i, 'title'),
          url_html: this.searchKeyResult(i, 'url'),
          content: this.searchKeyResult(i, 'content')
        }
      })
    },
    webpagesCount() {
      return _.get(this.webpages, 'total', 0)
    },
    nothing() {
      return this.webpagesCount === 0 && !this.loading
    }
  },
  methods: {
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.webpages
          .getWebpages({
            page: targetPage,
            per_page: this.perPage,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            this.webpages = res
          })
          .catch(err => console.error(err))
        this.loading = false
        this.$emit('getAmount', this.webpagesCount)
      })
    }
  }
}
</script>
<style lang="scss">
.webpage {
  &-content {
    background: #fff;
    padding: 8px;
    margin-bottom: 16px;
    color: #212224;
    .red {
      color: red;
    }
    &-top {
      cursor: pointer;
      &:hover {
        .webpage-content-top-title {
          text-decoration: underline;
        }
      }
      &-title {
        color: #409efe;
        text-decoration: none;
        font-size: 18px;
        font-weight: bold;
        display: block;
        margin: 10px 0;
      }
      &-url {
        text-decoration: none;
        color: rgb(100, 218, 150);
      }
    }
    &-text {
      color: #909399;
      font-size: 14px;
      word-break: break-word;
    }
  }
}
</style>

