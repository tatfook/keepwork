<template>
  <div class="course-tab" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(lessonPackage,index) in lessonPackagesData" :key="index">
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
    <transition name="fade">
      <div v-if="nothing" class="all-projects-nothing">
        <img class="all-projects-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="all-projects-nothing-tip">没有找到符合条件的结果</p>
      </div>
    </transition>
  </div>
</template>
<script>
import LessonPackageCell from '../LessonPackageCell'
import _ from 'lodash'
import { EsAPI } from '@/api'
import TabMixin from './TabMixin'

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
    nothing() {
      return this.lessonPackagesData.length === 0 && !this.loading
    },
    lessonPackagesCount() {
      return _.get(this.lessonPackages, 'total', 0)
    },
    lessonPackagesData() {
      let tempArr = _.get(this.lessonPackages, 'hits', [])
      let Arr = _.forEach(tempArr, i => {
        if (i.highlight) {
          if (i.highlight.title) {
            let name = _.get(i.highlight, 'title', i.title)
            name = name.join().replace(/<span>/g, `<span class="red">`)
            i.title = name
          }
          if (i.highlight.description) {
            let desc = _.get(i.highlight, 'description', i.description)
            desc = desc.join().replace(/<span>/g, `<span class="red">`)
            i.description = desc
          }
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
        this.$emit('getAmount', this.lessonPackagesCount)
      })
    }
  },
  components: {
    LessonPackageCell
  }
}
</script>

