<template>
  <div class="lesson-center">
    <div class="lesson-center-container" v-if="!loading" v-loading='loading'>
      <div class="lesson-center-info">{{$t('lesson.include')}}:
        <span>{{sortedPackagesList.length}}</span> {{$t('lesson.packagesCount')}}
      </div>
      <div class="lesson-center-list">
        <div class="lesson-center-item" v-for="coursePackage in sortedPackagesList" :key="coursePackage.id">
          <img class="lesson-center-item-cover" :src="coursePackage.extra && coursePackage.extra.coverUrl" alt="" @click="enterPackageDetailPage(coursePackage.id)">
          <h4 :title="coursePackage.packageName" class="lesson-center-item-title" @click="enterPackageDetailPage(coursePackage.id)">{{coursePackage.packageName}}</h4>
          <span class="lesson-center-item-info">{{$t('lesson.include')}}: {{coursePackage.lessons.length}} {{$t('lesson.lessonsCount')}}</span>
          <span class="lesson-center-item-info">{{$t('lesson.ages')}}: {{getCoursePackageSuitableAge(coursePackage)}}</span>
          <span class="lesson-center-item-info" :title="coursePackage.intro">{{$t('lesson.intro')}}: {{coursePackage.intro}}</span>
          <div class="lesson-center-item-purchase">
            <div class="lesson-center-item-tip" :class="{'lesson-center-item-hidden': isTeacher || coursePackage.rmb == 0 }" v-html="$t('lesson.backInfo', { backCoinCount: `<span class='lesson-center-item-warning'>${coursePackage.rmb}</span>` })"></div>
            <div class="lesson-center-item-money" :class="{'lesson-center-item-hidden': isTeacher || coursePackage.rmb == 0 }">
              <span class="lesson-center-item-money-item">
                {{$t('lesson.rmbPrice')}}:
                <span class="lesson-center-item-warning">￥{{coursePackage.rmb}}</span>
              </span>
            </div>
            <div class="lesson-center-item-money">
              <span class="lesson-center-item-money-item lesson-center-item-free" v-if="isTeacher || coursePackage.rmb == 0">{{$t('lesson.free')}}</span>
              <span class="lesson-center-item-money-item" v-else>
                {{$t('lesson.coinsPrice')}}:
                <span class="lesson-center-item-warning">{{coursePackage.coin}}</span> {{$t('lesson.coins')}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="lesson-center-pages" v-if="packagesCount > perPage">
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="packagesCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LessonCenter',
  data() {
    return {
      loading: true,
      perPage: 15,
      page: 1
    }
  },
  created() {
    this.fromTopToShow()
  },
  computed: {
    ...mapGetters({
      packages: 'lesson/center/packagesList',
      isTeacher: 'lesson/isTeacher'
    }),
    packagesList() {
      return _.get(this.packages, 'rows', [])
    },
    packagesCount() {
      return _.get(this.packages, 'count', 0)
    },
    sortedPackagesList() {
      let approvedPackages = _.filter(this.packagesList, i => i.state == 2)
      return approvedPackages.sort(this.sortByUpdateAt)
    }
  },
  async mounted() {
    let payload = { perPage: this.perPage, page: this.page }
    await this.getPackagesList(payload)
    this.loading = false
  },
  methods: {
    ...mapActions({
      getPackagesList: 'lesson/center/getPackagesList'
    }),
    fromTopToShow() {
      window.scrollTo(0, 0)
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    enterPackageDetailPage(packageId) {
      if (this.$route.name === 'Lesson') {
        this.$router.push({
          path: `/student/package/${packageId}`
        })
      } else {
        this.$router.push({
          path: `package/${packageId}`
        })
      }
    },
    async targetPage(targetPage) {
      this.loading = true
      this.page = targetPage
      let payload = { perPage: this.perPage, page: this.page }
      await this.getPackagesList(payload)
      this.loading = false
    },
    getCoursePackageSuitableAge(packageDetail) {
      let { minAge, maxAge } = packageDetail
      if (minAge == 0 && maxAge == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${minAge}-${maxAge}`
    }
  }
}
</script>

<style lang="scss">
.lesson-center {
  background: #fff;
  &-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  &-info {
    padding: 60px 0 5px;
    font-size: 17px;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
  }
  &-item {
    width: 360px;
    height: 461px;
    padding: 34px 36px 6px;
    margin: 20px 60px 20px 0;
    border: solid 2px #d2d2d2;
    border-radius: 1px;
    background: #fff;
    box-sizing: border-box;
    &:nth-child(3n) {
      margin-right: 0;
    }
    &-cover {
      display: inline-block;
      width: 287px;
      height: 160px;
      border-radius: 6px;
      margin: 0 auto;
      object-fit: cover;
      cursor: pointer;
    }
    &-title {
      font-size: 18px;
      margin-bottom: 10px;
      height: 24px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;
    }
    &-info {
      display: block;
      font-size: 14px;
      line-height: 22px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #777;
    }
    &-purchase {
      margin: 10px 0;
      border-top: 1px solid #e3e3e3;
    }
    &-tip {
      color: #3491f0;
      margin: 14px 0 5px 0;
      font-size: 14px;
    }
    &-money {
      margin: 2px 0;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &-item {
        font-size: 14px;
        display: inline-block;
        padding: 0 12px;
        height: 27px;
        border: solid 2px #f3f3f3;
        text-align: left;
        line-height: 27px;
        border-radius: 15px;
        max-width: 255px;
        min-width: 132px;
        text-align: center;
      }
    }
    &-hidden {
      visibility: hidden;
    }
    &-free {
      color: #67c23a;
    }
    &-warning {
      color: #e4461f;
      display: inline;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &-pages {
    text-align: center;
    padding: 40px 0;
  }
}
@media (max-width: 768px) {
  .lesson-center {
    &-desc {
      max-width: 287px;
      box-sizing: border-box;
      padding: 4px 4px 6px;
      border: none;
      margin: 20px auto;
      border-bottom: solid 2px #d2d2d2;
    }
    &-cover {
      width: 100%;
    }
  }
}
</style>
