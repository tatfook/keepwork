<template>
  <div class="webpage-field" v-loading="loading">
    <div class="webpage-field-content" v-for="(webpage,index) in webpagesData" :key="index">
      <div class="webpage-field-content-top">
        <a :href="webpage.url" target="_blank" class="webpage-field-content-top-title" v-html="webpage.title"></a>
        <a :href="webpage.url" target="_blank" class="webpage-field-content-top-url" v-html="origin + webpage.url_html"></a>
      </div>
      <p class="webpage-field-content-text" v-html="webpage.content"></p>
    </div>
    <div class="webpage-field-pages" v-if="webpagesCount > perPage">
      <el-pagination :current-page="page" background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="webpagesCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="webpage-field-nothing">
        <img class="webpage-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="webpage-field-nothing-tip">{{$t('explore.noResults')}}</p>
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
      loading: true,
      webpages: [],
      perPage: 12
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(1)
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
        this.page = targetPage
        this.loading = false
        this.$emit('getAmount', this.webpagesCount)
      })
    }
  }
}
</script>
<style lang="scss">
.webpage-field {
  min-height: 500px;
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
        .webpage-field-content-top-title {
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

