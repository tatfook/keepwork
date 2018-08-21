<template>
  <div class="teach" v-loading="loading">
    <div class="teach-nothing" v-if="noPackages">
      <div><img src="@/assets/lessonImg/no_packages.png" alt=""></div>
      <p class="teach-nothing-hint">{{$t('lesson.noLessonHint')}}</p>
      <el-button type="primary">{{$t('lesson.lessonsCenter')}}</el-button>
    </div>
    <div class="teach-packages" v-else>
      <div class="teach-packages-total">{{$t('lesson.include')}}: <span>3</span> {{$t('lesson.packagesCount')}}</div>
      <div class="teach-packages-list">
        <el-row>
          <el-col :sm="12" :xs="22" v-for="lessonPackage in sortedTeachList" :key="lessonPackage.id">
            <div class="package">
              <p class="time">{{$t('lesson.teachingTime')}}:
                <span class="red-text">{{lessonPackage.updatedAt}}</span>
              </p>
              <div class="package-cover"><img :src="lessonPackage.extra.cover" alt=""></div>
              <h4 class="title">{{lessonPackage.extra.packageName}}</h4>
              <p>{{$t('lesson.include')}}: {{sortedTeachList.length}}  {{$t('lesson.lessonsCount')}}</p>
              <p>{{$t('lesson.ages')}}: 5~100</p>
              <p title="title">{{$t('lesson.intro')}} : ******************22222222***</p>
            </div>
          </el-col>
          <!-- <el-col :sm="12" :xs="22">
            <div class="package">
              <p class="time">Latest teaching time:
                <span class="red-text">11:20 20/8/2018</span>
              </p>
              <div class="package-cover"><img src="@/assets/lessonImg/cover1.png" alt=""></div>
              <h4>Blocks</h4>
              <p>{{$t('lesson.include')}}: 5 {{$t('lesson.lessonsCount')}}</p>
              <p>{{$t('lesson.ages')}}: 5~100</p>
              <p>{{$t('lesson.intro')}} : ******************22222222***</p>
            </div>
          </el-col> -->
          
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import { lesson } from '@/api'
import _ from 'lodash'

export default {
  name: "TeacherColumnTeach",
  data() {
    return {
      loading: false,
      noPackages: false,
      teachList: []
    }
  },
  async mounted(){
    let resData = await lesson.users.getTeachingRecords()
    // this.teachList = _.get(resData, `rows`, [])
    console.log('resData',resData)
  },
  computed: {
    sortedTeachList(){
      return this.teachList.sort(this.sortByUpdateAt)
    }
  },
  methods:{
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
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
          margin: 10px auto 30px;
          p {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .time {
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
          .title{
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

