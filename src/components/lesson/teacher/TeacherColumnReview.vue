<template>
  <div class="review" v-loading="loading">
    <div class="review-list" v-show="sortedTeachList.length && !loading">
      <div class="review-list-class-hours">
        <div>Attend</div>
        <div class="time">
          <span class="red">25</span> class</div>
      </div>
      <div class="review-list-class-hours">
        <div>Total Teaching Time</div>
        <div class="time">
          <span class="red">2</span> hours
          <span class="red">35</span> mins</div>
      </div>

      <p class="review-list-sort"><img class="sort-img" src="@/assets/lessonImg/summary/sort.png" alt="">{{$t('lesson.sortByTeachingTime')}}</p>

      <div class="review-list-package">
        <div class="package" v-for="lessonPackage in sortedTeachList" :key="lessonPackage.id">
          <div class="package-cover">
            <p class="teach-time">{{lessonPackage.updatedAt | formatTime}}</p>
            <img src="@/assets/lessonImg/cover1.png" alt="">
          </div>
          <div class="package-brief">
            <h4 class="name">{{$t('modList.package')}}：{{lessonPackage.extra.packageName}}</h4>
            <p>
              <span class="brief-title">{{$t('modList.lesson')}} {{lessonPackage.lessonId}}：</span>{{lessonPackage.extra.lessonGoals}}</p>
            <p>
              <span class="brief-title">{{$t('lesson.intro')}}:</span><br>{{lessonPackage.extra.lessonGoals}}</p>
            <p>
              <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins</p>
          </div>
          <div class="package-summary">
            <el-button type="primary" @click="viewSummary(lessonPackage.packageId,lessonPackage.lessonId,lessonPackage.id)">{{$t('lesson.viewSummary')}}</el-button>
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
import dayjs from 'dayjs'

export default {
  name: 'TeacherColumnTeach',
  data() {
    return {
      loading: true,
      noPackages: false,
      teachList: []
    }
  },
  async mounted() {
    let resData = await lesson.classrooms.getTeachingListing()
    this.teachList = _.get(resData, `rows`, [])
    this.loading = false
    console.log('teachList', this.teachList)
  },
  computed: {
    sortedTeachList() {
      return this.teachList.sort(this.sortByUpdateAt)
    }
  },
  methods: {
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    viewSummary(packageId,lessonId,classId){
     this.$router.push({
        path: `package/${packageId}/lesson/${lessonId}/class/${classId}/summary`
      })
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.review {
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
    padding: 40px 0;
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
          color: #ff414a;
          font-size: 26px;
        }
      }
    }
    &-sort {
      margin-top: 50px;
      .sort-img {
        margin: 0 10px 0 18px;
      }
    }
    &-package {
      .package {
        padding: 18px;
        height: 224px;
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
          }
        }
        &-brief {
          flex: 1;
          padding-left: 12px;
          font-size: 14px;
          .name {
            font-size: 18px;
            margin: 15px 0;
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
    }
  }
}
</style>