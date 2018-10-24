<template>
  <div class="course-tab">
    <div class="search-result-total">搜索到：<span>{{lessonPackagesCount}}</span>个结果</div>
    <el-row>
      <el-col :span="6" v-for="(lessonPackage,index) in lessonPackagesData" :key="index">
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
import Vue from 'vue'


export default {
  name: 'Course',
  props: {
    searchKey: String,
    sortProjects: String
  },
  data() {
    return {
      perPage: 2,
      page: 1,
      lessonPackages: []
    }
  },
  async mounted() {
    await this.targetPage(this.page)
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
          Vue.set(i, 'title', name)
        }
      })
      return Arr
    }
  },
  methods: {
    async targetPage(targetPage) {
      this.$nextTick(async () => {
        await EsAPI.packages
          .getPackages({
            page: targetPage,
            per_page: this.perPage,
            q: this.searchKey,
            sort: this.sortProjects
          })
          .then(res => {
            console.log('res', res)
            this.lessonPackages = res
          })
          .catch(err => console.error(err))
      })
    }
  },
  components: {
    LessonPackageCell
  }
}
</script>

