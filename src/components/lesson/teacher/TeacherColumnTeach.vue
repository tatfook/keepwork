<template>
  <div class="teach" v-loading="loading">
    <div class="teach-packages" v-show="sortedTeachList.length && !loading">
      <div class="teach-packages-total">{{$t('lesson.include')}}:
        <span>{{sortedTeachList.length}}</span> {{$t('lesson.packagesCount')}}</div>
      <div class="teach-packages-list">
        <el-row>
          <el-col :sm="12" :xs="22" v-for="(lessonPackage,index) in sortedTeachList" v-if="perPage*(page-1) <= index && index < perPage*page " :key="lessonPackage.id">
            <div class="package">
              <p class="time"><span v-show="lessonPackage.lastTeachDate">{{$t('lesson.teachingTime')}}:
                <span class="red-text">{{lessonPackage.lastTeachDate | formatTime}}</span></span>
              </p>
              <div class="package-cover" @click="enterPackage(lessonPackage.id)"><img :src="lessonPackage.extra.coverUrl" alt=""></div>
              <h4 :title="lessonPackage.packageName" class="title">{{lessonPackage.packageName}}</h4>
              <p>{{$t('lesson.include')}}: {{sortedTeachList.length}} {{$t('lesson.lessonsCount')}}</p>
              <p>{{$t('lesson.ages')}}: {{lessonPackage.minAge}}~{{lessonPackage.maxAge}}</p>
              <p :title="lessonPackage.intro">{{$t('lesson.intro')}} : {{lessonPackage.intro}}</p>
            </div>
          </el-col>
        </el-row>
        <div class="teach-packages-list-pages" v-if="lessonCount > perPage">
          <div class="block">
            <span class="demonstration"></span>
            <el-pagination
              background
              @current-change="targetPage"
              layout="prev, pager, next"
              :page-size="perPage"
              :total="lessonCount">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="teach-nothing" v-show="!sortedTeachList.length && !loading">
      <div><img src="@/assets/lessonImg/no_packages.png" alt=""></div>
      <p class="teach-nothing-hint">{{$t('lesson.noLessonHint')}}</p>
      <el-button type="primary" @click="gotoLessonsCenter">{{$t('lesson.lessonsCenter')}}</el-button>
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
      teachList: [],
      perPage:10,
      page: 1
    }
  },
  async beforeCreate() {
    await lesson.packages
      .getTaughtPackages()
      .then(res => {
        this.teachList = res
        this.loading = false
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
    hasTaughtPackages(){
      return _.filter(this.teachList, i => {return i.lastTeachDate})
    },
    notTaughtPackages(){
      return _.filter(this.teachList, i => {return !i.lastTeachDate})
    },
    sortedTeachList() {
      return _.concat(this.hasTaughtPackages,this.notTaughtPackages)
    },
    lessonCount(){
      return this.sortedTeachList.length
    },
  },
  methods: {
    sortByLastTeachDate(obj1, obj2) {
      return obj1.lastTeachDate >= obj2.lastTeachDate ? -1 : 1
    },
    enterPackage(packageId){
      this.$router.push({
        path: `teacher/package/${packageId}`
      })
    },
    gotoLessonsCenter(){
      this.$router.push({
        path: `/teacher/center`
      })
    },
    targetPage(targetPage){
      this.page = targetPage
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
.teach {
  margin-top: 60px;
  background: #fff;
  &-nothing {
    width: 100%;
    height: 660px;
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
  &-packages {
    &-total {
      border-bottom: 1px solid #d2d2d2;
      height: 60px;
      line-height: 60px;
      padding-left: 12px;
    }
    &-list {
      padding: 30px 56px;
      .el-row {
        .package {
          width: 305px;
          margin: 10px auto 50px;
          p {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .time {
            height: 20px;
            .red-text {
              color: #ff0c0c;
            }
          }
          .package-cover {
            width: 303px;
            height: 188px;
            border-radius: 2px;
            cursor: pointer;
            img {
              width: 303px;
              height: 188px;
              object-fit: cover;
            }
          }
          .title {
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      &-pages{
        text-align: center;
        padding-top: 16px;
      }
    }
  }
}
</style>