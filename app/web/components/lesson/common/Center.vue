<template>
  <div class="lesson-packages-wrap">
    <div
      class="lesson-packages"
      v-loading='loading'
    >
      <div class="packages-sum">{{$t('lesson.include')}}:
        <span>{{sortedPackagesList.length}}</span> {{$t('lesson.packagesCount')}}</div>
      <el-row class="lesson-packages-subject">
        <el-col
          v-for="coursePackage in sortedPackagesList"
          :key="coursePackage.id"
          :sm="12"
          :md="8"
          :xs="24"
        >
          <div class="subject-desc">
            <div
              class="img-wrap"
              @click="enterPackageDetailPage(coursePackage.id)"
            ><img
                class="subject-cover"
                :src="coursePackage.extra.coverUrl"
                alt=""
              ></div>
            <h4
              :title="coursePackage.packageName"
              :class="['subject-title']"
              @click="enterPackageDetailPage(coursePackage.id)"
            >{{coursePackage.packageName}}</h4>
            <span>{{$t('lesson.include')}}: {{coursePackage.lessons.length}} {{$t('lesson.lessonsCount')}}</span>
            <span>{{$t('lesson.ages')}}: {{getCoursePackageSuitableAge(coursePackage)}}</span>
            <span :title="coursePackage.intro">{{$t('lesson.intro')}}: {{coursePackage.intro}}</span>
            <div class="purchase-lesson-package">
              <div
                :class="['purchase-tip',{'hidden': coursePackage.rmb == 0}]"
                v-html="$t('lesson.backInfo', { backCoinCount: `<span class='red'>${coursePackage.rmb}</span>` })"
              ></div>
              <div :class="['purchase-money',{'hidden': coursePackage.rmb == 0}]">
                <span class="money">
                  {{$t('lesson.rmbPrice')}}:
                  <span class="red">￥{{coursePackage.rmb}}</span>
                </span>
              </div>
              <div class="purchase-money">
                <span
                  class="money free"
                  v-if="coursePackage.rmb == 0"
                >{{$t('lesson.free')}}</span>
                <span
                  class="money"
                  v-else
                >
                  {{$t('lesson.coinsPrice')}}:
                  <span class="red">{{coursePackage.coin}}</span> {{$t('lesson.coins')}}
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div
        class="lesson-packages-pages"
        v-if="packagesCount > perPage"
      >
        <div class="block">
          <span class="demonstration"></span>
          <el-pagination
            background
            @current-change="targetPage"
            layout="prev, pager, next"
            :page-size="perPage"
            :total="packagesCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Center",
  data() {
    return {
      loading: true,
      perPage: 15,
      page: 1
    };
  },
  created() {
    this.fromTopToShow();
  },
  computed: {
    ...mapGetters({
      packages: "lesson/center/packagesList"
    }),
    packagesList() {
      return _.get(this.packages, "rows", []);
    },
    packagesCount() {
      return _.get(this.packages, "count", 0);
    },
    sortedPackagesList() {
      let approvedPackages = _.filter(this.packagesList, i => i.state == 2);
      return approvedPackages.sort(this.sortByUpdateAt);
    }
  },
  async mounted() {
    let payload = { perPage: this.perPage, page: this.page };
    await this.getPackagesList(payload);
    this.loading = false;
  },
  methods: {
    ...mapActions({
      getPackagesList: "lesson/center/getPackagesList"
    }),
    fromTopToShow() {
      window.scrollTo(0, 0);
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1;
    },
    enterPackageDetailPage(packageId) {
      if (this.$route.name === "Lesson") {
        this.$router.push({
          path: `/student/package/${packageId}`
        });
      } else {
        this.$router.push({
          path: `package/${packageId}`
        });
      }
    },
    async targetPage(targetPage) {
      this.loading = true;
      this.page = targetPage;
      let payload = { perPage: this.perPage, page: this.page };
      await this.getPackagesList(payload);
      this.loading = false;
    },
    getCoursePackageSuitableAge(packageDetail) {
      let { minAge, maxAge } = packageDetail;
      if (minAge == 0 && maxAge == 0) {
        return this.$t("lesson.packageManage.SuitableForAll");
      }
      return `${minAge}-${maxAge}`;
    }
  }
};
</script>

<style lang="scss">
.lesson-packages-wrap {
  background: #fff;
  .lesson-packages {
    max-width: 1200px;
    margin: 0 auto;
    .packages-sum {
      padding: 60px 0 5px 20px;
      font-size: 17px;
    }
    &-subject {
      .subject-desc {
        width: 287px;
        height: 415px;
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
          height: 24px;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
        }
        span {
          display: block;
          font-size: 14px;
          line-height: 22px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #777;
        }
        .purchase-lesson-package {
          margin: 10px 0;
          border-top: 1px solid #e3e3e3;
          .hidden {
            visibility: hidden;
          }
          .red {
            color: #e4461f;
            display: inline;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .purchase-tip {
            color: #3491f0;
            margin: 14px 0 5px 0;
            font-size: 14px;
          }
          .purchase-money {
            margin: 2px 0;
            cursor: default;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .free {
              color: #67c23a;
            }
            .money {
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
        }
      }
    }
    &-pages {
      text-align: center;
      padding: 40px 0;
    }
  }
}
@media (max-width: 768px) {
  .lesson-packages-wrap {
    .lesson-packages {
      &-subject {
        .subject-desc {
          max-width: 287px;
          box-sizing: border-box;
          padding: 4px 4px 6px;
          border: none;
          margin: 20px auto;
          border-bottom: solid 2px #d2d2d2;
          .img-wrap {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
