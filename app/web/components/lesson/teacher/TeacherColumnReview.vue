<template>
  <div class="review" v-loading="loading">
    <div class="review-list" v-show="sortedTeachList.length && !loading">
      <div class="review-list-container">
        <div class="review-list-class-hours">
          <div>{{$t('lesson.attended')}}</div>
          <div class="time">
            <span class="red">{{sortedTeachList.length}}</span> {{$t('lesson.classes')}}</div>
        </div>
        <div class="review-list-class-hours">
          <div>{{$t('lesson.totalTeachingTime')}}</div>
          <div class="time">
            <span class="red" v-cloak>{{hours}}</span> {{$t('lesson.hours')}}
            <span class="red">{{mins}}</span> {{$t('lesson.mins')}}</div>
        </div>
      </div>

      <p class="review-list-sort">
        <span class="text" @click="sequence"><img class="sort-img" src="@/assets/lessonImg/summary/sort.png" alt="">{{$t('lesson.sortByTeachingTime')}}</span>
      </p>

      <div class="review-list-package">
        <div class="package" v-for="(lessonPackage,index) in sortedTeachList" v-if="perPage*(page-1) <= index && index < perPage*page " :key="lessonPackage.id">
          <div class="package-cover">
            <p class="teach-time">{{lessonPackage.createdAt | formatTime}}</p>
            <img :src="lessonPackage.extra.coverUrl" alt="" @click="enterLesson(lessonPackage.packageId,lessonPackage.lessonId)">
          </div>
          <div class="package-brief">
            <h4 class="name package-intro" @click="enterPackage(lessonPackage.packageId)">{{$t('modList.package')}}：{{lessonPackage.extra.packageName}}</h4>
            <p>
              <span class="lesson-name package-intro" @click="enterLesson(lessonPackage.packageId,lessonPackage.lessonId)">
                <span class="brief-title">{{$t('modList.lesson')}} {{lessonPackage.extra.lessonNo || 0}}：</span>{{lessonPackage.extra.lessonName}}</span>
            </p>
            <p class="package-intro">
              <span :title="lessonPackage.extra.lessonGoals">
                <span class="brief-title">{{$t('lesson.intro')}}:</span><br class="package-intro-break-tag">{{lessonPackage.extra.lessonGoals}}</span>
            </p>
            <p>
              <span class="brief-title">{{$t('lesson.duration')}}:</span> 45{{$t('lesson.mins')}}</p>
          </div>
          <div class="package-summary">
            <el-button type="primary" @click="viewSummary(lessonPackage)">{{$t('lesson.viewSummary')}}</el-button>
          </div>
        </div>
        <div class="review-list-package-pages" v-if="lessonCount > perPage">
          <div class="block">
            <span class="demonstration"></span>
            <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="lessonCount">
            </el-pagination>
          </div>
        </div>
      </div>

    </div>
    <div class="review-nothing" v-show="!sortedTeachList.length && !loading">
      <div><img src="@/assets/lessonImg/no_packages.png" alt=""></div>
      <p class="review-nothing-hint">{{$t('lesson.noRecord')}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { lesson } from '@/api'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'TeacherColumnTeach',
  data() {
    return {
      loading: true,
      noPackages: false,
      teachList: [],
      positiveSequence: true,
      perPage: 8,
      page: 1
    }
  },
  async mounted() {
    let resData = await lesson.classrooms.getTeachingListing()
    this.teachList = _.get(resData, `rows`, [])
    this.loading = false
  },
  computed: {
    sortedTeachList() {
      let classIsOver = _.filter(this.teachList, i => {
        return i.state == 2
      })
      return classIsOver.sort(this.sortByUpdateAt)
    },
    lessonCount() {
      return this.sortedTeachList.length
    },
    hours() {
      let longTime = this.sortedTeachList.length * 45
      return parseInt(longTime / 60)
    },
    mins() {
      let longTime = this.sortedTeachList.length * 45
      return (longTime / 60 - parseInt(longTime / 60)) * 60
    }
  },
  methods: {
    sortByUpdateAt(obj1, obj2) {
      return this.positiveSequence
        ? obj1.createdAt >= obj2.createdAt
          ? -1
          : 1
        : obj1.createdAt <= obj2.createdAt
          ? -1
          : 1
    },
    sequence() {
      this.positiveSequence = !this.positiveSequence
    },
    viewSummary(lessonPackage) {
      this.$router.push({
        path: `package/${lessonPackage.packageId}/lesson/${
          lessonPackage.lessonId
        }/class/${lessonPackage.id}/summary`
      })
    },
    enterPackage(packageId) {
      this.$router.push({
        path: `package/${packageId}`
      })
    },
    enterLesson(packageId, lessonId) {
      this.$router.push({
        path: `package/${packageId}/lesson/${lessonId}`
      })
    },
    targetPage(targetPage) {
      this.page = targetPage
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.review {
  height: 100%;
  [v-cloak] {
    display: none;
  }
  &-nothing {
    margin-top: 60px;
    width: 100%;
    height: 660px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-hint {
      font-size: 20px;
      line-height: 30px;
      color: #111111;
    }
  }
  &-list {
    display: flex;
    height: 100%;
    flex-direction: column;
    &-class-hours {
      display: inline-block;
      padding: 0 30px;
      height: 77px;
      background: #ffffff;
      border-radius: 10px;
      border: solid 2px #e9e5e5;
      margin: 0 25px 0 18px;
      text-align: left;
      line-height: 35px;
      .time {
        font-weight: 700;
        font-size: 18px;
        .red {
          color: #ff742e;
          font-size: 26px;
        }
      }
    }
    &-sort {
      margin-top: 50px;
      .text {
        cursor: pointer;
        .sort-img {
          margin: 0 10px 0 18px;
        }
      }
    }
    &-package {
      flex: 1;
      overflow: auto;
      .package {
        padding: 18px;
        height: 200px;
        margin-bottom: 20px;
        background-color: #ffffff;
        border: solid 1px #e5e5e5;
        display: flex;
        &-cover {
          width: 210px;
          .teach-time {
            margin: 0 0 4px;
            font-size: 14px;
          }
          img {
            width: 209px;
            height: 121px;
            object-fit: cover;
            cursor: pointer;
          }
        }
        &-brief {
          flex: 1;
          padding-left: 12px;
          font-size: 14px;
          .name {
            font-size: 18px;
            margin: 15px 0;
            cursor: pointer;
          }
          .lesson-name {
            display: inline-block;
            cursor: pointer;
          }
          .package-intro {
            width: 376px;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .brief-title {
            font-weight: 700;
          }
        }
        &-summary {
          width: 210px;
          text-align: center;
          padding-top: 60px;
        }
      }
      &-pages {
        text-align: center;
        padding-top: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .review {
    &-list {
      &-container {
        display: flex;
        justify-content: space-evenly;
      }
      &-class-hours {
        margin: 0;
        padding: 0 16px;
        &:first-child {
          margin-top: 0;
        }
      }
      &-sort {
        margin-top: 24px;
      }
      &-package {
        .package {
          flex-direction: column;
          height: auto;
          &-summary {
            width: auto;
            padding-top: 16px;
            text-align: left;
          }
          &-brief {
            padding-left: 0;
            .name {
              margin-bottom: 12px;
            }
            p {
              margin: 0;
            }
            p.package-intro {
              margin-bottom: 6px;
            }
            .package-intro {
              &-break-tag {
                display: none;
              }
            }
          }
        }
      }
    }
    &-nothing {
      margin: 0;
      padding: 16px 0;
      height: auto;
    }
  }
}
</style>
