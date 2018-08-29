<template>
  <div class="lesson-packages-wrap">
    <div class="lesson-packages" v-loading='loading'>
      <div class="packages-sum">{{$t('lesson.include')}}:
        <span>{{sortedPackagesList.length}}</span> {{$t('lesson.packagesCount')}}</div>
      <el-row :gutter="20" class="lesson-packages-subject">
        <el-col v-for="coursePackage in sortedPackagesList" :key="coursePackage.id" :sm="12" :md="8">
          <div class="subject-desc">
            <div class="img-wrap" @click="enterPackageDetailPage(coursePackage.id)"><img class="subject-cover" :src="coursePackage.extra.coverUrl" alt=""></div>
            <h4 :class="['subject-title']" @click="enterPackageDetailPage(coursePackage.id)">{{coursePackage.packageName}}</h4>
            <span>{{$t('lesson.include')}}: {{coursePackage.lessons.length}} {{$t('lesson.lessonsCount')}}</span>
            <span>{{$t('lesson.ages')}}: {{coursePackage.minAge}}~{{coursePackage.maxAge}}</span>
            <span :title="coursePackage.intro">{{$t('lesson.intro')}}: {{coursePackage.intro}}</span>
            <div class="purchase-lesson-package">
              <div class="purchase-tip" v-html="$t('lesson.backInfo', { backCoinCount: `<span class='red'>${coursePackage.rmb}</span>` })"></div>
              <div class="purchase-money" plain>{{$t('lesson.rmbPrice')}}:
                <span class="red">￥{{coursePackage.rmb}}</span>
              </div>
              <div class="purchase-money">{{$t('lesson.coinsPrice')}}:
                <span class="red">{{coursePackage.coin}}</span> {{$t('lesson.coins')}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Center',
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      packages: 'lesson/center/packagesList'
    }),
    packagesList() {
      return _.get(this.packages, 'rows', [])
    },
    sortedPackagesList() {
      return this.packagesList.sort(
        (obj1, obj2) => obj1.updatedAt < obj2.updatedAt
      )
    }
  },
  async mounted() {
    await this.getPackagesList()
    console.log('packages', this.packages)
    this.loading = false
  },
  methods: {
    ...mapActions({
      getPackagesList: 'lesson/center/getPackagesList'
    }),
    enterPackageDetailPage(packageId) {
      this.$router.push({
        path: `package/${packageId}`
      })
    }
  }
}
</script>

<style lang="scss">
.lesson-packages-wrap {
  .lesson-packages {
    max-width: 1200px;
    margin: 0 auto;
    .packages-sum {
      padding: 60px 0 5px 20px;
      font-size: 17px;
    }
    .lesson-packages-subject .subject-desc {
      width: 287px;
      padding: 34px 34px 6px;
      margin: 20px auto;
      border: solid 2px #d2d2d2;
      border-radius: 1px;
      background: #fff;
      .img-wrap {
        width: 287px;
        height: 160px;
        border-radius: 6px;
        margin: 0 auto;
        cursor: pointer;
        .subject-cover {
          width: 287px;
          height: 160px;
          object-fit: cover;
          border-radius: 6px;
        }
      }
      .subject-title {
        font-size: 18px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      span {
        display: block;
        font-size: 14px;
        line-height: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .purchase-lesson-package {
        margin: 10px 0;
        border-top: 1px solid #e3e3e3;
        .red {
          color: #e4461f;
          display: inline;
        }
        .purchase-tip {
          color: #3491f0;
          margin: 14px 0 5px 0;
          font-size: 14px;
        }
        .purchase-money {
          font-size: 14px;
          width: 165px;
          height: 27px;
          border: solid 2px #f3f3f3;
          text-align: left;
          padding: 0;
          line-height: 30px;
          border-radius: 15px;
          margin: 5px 0;
          padding-left: 5px;
          cursor: default;
        }
      }
    }
  }
}
</style>
