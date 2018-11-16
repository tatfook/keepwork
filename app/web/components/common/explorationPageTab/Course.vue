<template>
  <div class="course-tab" v-loading="loading">
    <div class="search-result-total">包含：<span>{{lessonPackagesCount}}</span>个结果</div>
    <el-row>
      <el-col :sm="12" :md="6" v-for="(lessonPackage,index) in lessonPackagesData" :key="index">
        <lesson-package-cell :lessonPackage="lessonPackage"></lesson-package-cell>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="lessonPackagesCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="lessonPackagesCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import LessonPackageCell from '../LessonPackageCell'
import _ from 'lodash'
import { EsAPI } from '@/api'
import TabMixin from './TabMixin'
import Vue from 'vue'


export default {
  name: 'Course',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      lessonPackages: [],
      loading: true
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
    this.loading = false
  },
  computed: {
    lessonPackagesCount() {
      return _.get(this.lessonPackages, 'total', 0)
    },
    lessonPackagesData() {
      let tempArr = _.get(this.lessonPackages, 'hits', [])
      let Arr = _.forEach(tempArr, i => {
        if (i.highlight) {
          let name = _.get(i.highlight, 'title', i.title)
          name = name.join().replace(/<span>/g, `<span class="red">`)
          Vue.set(i, 'name_title', name)
        }else{
          Vue.set(i, 'name_title', i.title)
        }
      })
      return Arr
    }
  },
  methods: {
    async targetPage(targetPage) {
      this.loading = true
      this.$nextTick(async () => {
        await EsAPI.packages
          .getPackages({
            page: targetPage,
            per_page: this.perPage,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            this.lessonPackages = res
          })
          .catch(err => console.error(err))
          this.loading = false
      })
    }
  },
  components: {
    LessonPackageCell
  }
}
</script>

