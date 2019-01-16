<template>
  <div class="webpage" v-loading="loading">
    <div class="webpage-content" v-for="(webpage,index) in webpagesData" :key="index">
      <h4 v-html="webpage.title"></h4>
      <p v-html="webpage.url"></p>
      <p v-html="webpage.content"></p>
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

export default {
  name: 'Webpage',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      webpages: [],
      loading: true
    }
  },
  async mounted() {
    await this.targetPage()
    this.loading = false
  },
  computed: {
    webpagesData() {
      if (!this.searchKey) {
        return []
      }
      let hits = _.get(this.webpages, 'hits', [])
      return _.map(hits, i => {
        return {
          ...i,
          title: this.searchKeyResult(i, 'title'),
          url: this.searchKeyResult(i, 'url'),
          content: this.searchKeyResult(i, 'content')
        }
      })
    },
    webpagesCount() {
      return this.searchKey ? _.get(this.webpages, 'total', 0) : 0
    },
    nothing() {
      return this.webpagesCount === 0
    }
  },
  methods: {
    async targetPage() {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.webpages
          .getWebpages({
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
  }
}
</script>
<style lang="scss">
.webpage {
  &-content {
    background: #fff;
    padding: 8px;
    margin-bottom: 5px;
  }
}
</style>

