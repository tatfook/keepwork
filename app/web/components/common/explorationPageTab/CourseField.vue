<template>
  <div class="course-field" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(lessonPackage,index) in lessonPackagesData" :key="index">
        <lesson-package-cell :lessonPackage="lessonPackage"></lesson-package-cell>
      </el-col>
    </el-row>
    <div class="course-field-pages" v-if="lessonPackagesCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="lessonPackagesCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-show="nothing" class="course-field-nothing">
        <img class="course-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="course-field-nothing-tip">{{$t('explore.noResults')}}</p>
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
      loading: true,
      lessonPackages: []
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
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
        i.title = this.searchKeyResult(i, 'title')
        i.description = this.searchKeyResult(i, 'description')
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
<style lang="scss" scoped>
.course-field {
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


