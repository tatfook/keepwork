<template>
  <div class="learning-center-packages">
    <div class="search">
      <div class="search-hint">
        <span class="bell"><img src="@/assets/lessonImg/bell.png" alt=""></span>
        <span class="tip">{{$t('lesson.enterClass')}}</span>
      </div>
      <div class="search-input">
        <el-input id="searchClass" size="medium" v-model.trim="classID" :placeholder="$t('lesson.enterByClassId')" @keyup.enter.native="enterClass"></el-input>
      </div>
      <div class="search-btn">
        <el-button @click="enterClass" :disabled="!classID" size="medium" type="primary">
          <label for="searchClass">{{$t('lesson.enter')}}</label>
        </el-button>
      </div>
    </div>
    <div class="total-packages">{{$t('lesson.include')}}:
      <span>{{sortedSubscribesList.length}}</span> {{$t('lesson.packagesCount')}}
    </div>
    <div class="packages" v-loading='loading'>
      <div class="packages-nothing" v-if="!sortedSubscribesList.length && !loading">
        <div><img src="@/assets/lessonImg/no_packages.png" alt=""></div>
        <p class="packages-nothing-hint">{{$t('lesson.noLessonHint')}}</p>
        <el-button type="primary" @click="gotoLessonsCenter">{{$t('lesson.lessonsCenter')}}</el-button>
      </div>
      <el-row v-else class="bottom-line">
        <el-col class="group-line" :sm="12" :md="8" v-for="packageDetail in sortedSubscribesList" :key="packageDetail.id">
          <student-subscribe-packages :packageDetail="packageDetail"></student-subscribe-packages>
        </el-col>
      </el-row>
    </div>
    <div class="be-in-class" v-show="beInClassDialog">
      <el-dialog title="" center :visible.sync="beInClassDialog" width="30%" :before-close="handleClose">
        <div class="hint">
          <i class="el-icon-warning redIcon"></i>{{$t('lesson.beInClass')}}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="backCurrentClass">{{$t('lesson.resumeOldClass')}}</el-button>
          <el-button type="primary" @click="enterNewClass">{{$t('lesson.enterNewClass')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import StudentSubscribePackages from '@/components/lesson/student/StudentSubscribePackages'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LearningCenterPackages',
  data() {
    return {
      loading: true,
      beInClassDialog: false,
      classID: ''
    }
  },
  async mounted() {
    let payload = { userId: this.userId }
    await this.getUserSubscribes().catch(e => console.error(e))
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      subscribesList: 'lesson/student/subscribesList',
      enterClassInfo: 'lesson/student/enterClassInfo'
    }),
    filterSubscribesList() {
      return this.subscribesList
    },
    continuingStudyPackages() {
      let continuingStudyPackagesList = _.filter(
        this.filterSubscribesList,
        i => {
          return (
            i.learnedLessons.length > 0 &&
            i.learnedLessons.length < i.lessons.length
          )
        }
      )
      return continuingStudyPackagesList.sort(this.sortByUpdateAt)
    },
    startStudyPackages() {
      let startStudyPackagesList = _.filter(this.filterSubscribesList, i => {
        return i.learnedLessons.length == 0 && i.lessons.length != 0
      })
      return startStudyPackagesList.sort(this.sortByUpdateAt)
    },
    finishedStudyPackages() {
      let finishedStudyPackagesList = _.filter(this.filterSubscribesList, i => {
        return i.learnedLessons.length == i.lessons.length
      })
      return finishedStudyPackagesList.sort(this.sortByUpdateAt)
    },
    sortedSubscribesList() {
      if (this.filterSubscribesList.length === 0) {
        return this.filterSubscribesList
      } else {
        return _.concat(
          this.continuingStudyPackages,
          this.startStudyPackages,
          this.finishedStudyPackages
        )
      }
    }
  },
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      enterClassRoom: 'lesson/student/enterClassRoom',
      getUserSubscribes: 'lesson/student/getUserSubscribes',
      switchDevice: 'lesson/student/switchDevice'
    }),
    handleClose() {
      this.beInClassDialog = false
    },
    async enterClass() {
      if(!/^[C]/.test(this.classID)){
        if (/^[0-9]/.test(this.classID)) {
          let include_x = this.classID.includes('x')
          let include_X = this.classID.includes('X')
          let data = include_x ? this.classID.split('x') : include_X ? this.classID.split('X') : 0
          if(data === 0) {
            this.$message.error(this.$t('lesson.wrongKey'))
            return
          }
          window.open(`/l/student/package/${data[0]}/lesson/${data[1]}`)
        }
      }else{
        if (JSON.stringify(this.enterClassInfo) == '{}') {
          this.enterNewClass()
        } else if (this.classID == this.enterClassInfo.key) {
          this.$message.success(this.$t('lesson.haveEnteredClass'))
          this.backCurrentClass()
        } else if (this.classID !== this.enterClassInfo.key) {
          let key = this.classID
          await lesson.classrooms
            .isValidKey(key)
            .then(res => {
              if (res) {
                this.beInClassDialog = true
              } else {
                this.$message({
                  showClose: true,
                  message: this.$t('lesson.wrongKey'),
                  type: 'error'
                })
                this.beInClassDialog = false
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
    },
    async enterNewClass() {
      let key = this.classID
      let _key = key.toString().substring(1)
      await this.enterClassRoom({ key: _key })
        .then(res => {
          this.switchDevice('k')
          this.$router.push({
            path: `/student/package/${this.enterClassInfo.packageId}/lesson/${
              this.enterClassInfo.lessonId
            }?dialog=true`
          })
        })
        .catch(err => {
          if (err.response.data.code === 2) {
            this.$message({
              showClose: true,
              message: this.$t('lesson.classIsFull'),
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: this.$t('lesson.wrongKey'),
              type: 'error'
            })
          }
          this.beInClassDialog = false
        })
    },
    async backCurrentClass() {
      const { packageId, lessonId } = this.enterClassInfo
      this.$router.push(`/student/package/${packageId}/lesson/${lessonId}`)
    },
    gotoLessonsCenter() {
      this.$router.push({
        path: `/student/center`
      })
    }
  },
  components: {
    StudentSubscribePackages
  }
}
</script>
<style lang="scss">
.learning-center-packages {
  .search {
    background: rgba(64, 158, 254, 0.1);
    display: flex;
    &-hint {
      display: flex;
      align-content: center;
      padding: 0 40px 0 50px;
      .bell {
        display: inline-block;
        padding: 20px 20px 0 0;
      }
      .tip {
        padding: 20px 0;
        font-size: 14px;
        text-align: left;
      }
    }
    &-input {
      display: inline-block;
      margin: 12px 0 11px 0;
      width: 384px;
    }
    &-btn {
      display: block;
      margin-top: 12px;
      padding-left: 16px;
    }
  }
  .total-packages {
    padding: 40px 0 15px;
    height: 16px;
    border-bottom: 2px solid #d2d2d2;
    width: 788px;
    margin: 0 auto;
  }
  .packages {
    margin: 44px 0 0;
    padding: 0 12px;
    &-nothing {
      margin-top: 60px;
      width: 100%;
      height: 500px;
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
    .group-line {
      border-bottom: 1px solid #d2d2d2;
      padding: 10px 0;
      margin-bottom: -1px;
    }
  }
  .bottom-line {
    border-bottom: 1px solid #d2d2d2;
  }
}
@media screen and (max-width: 768px) {
  .learning-center-packages {
    .search {
      background: #409efe;
      display: block;
      &-hint {
        height: 40px;
      }
      &-input {
        padding: 0 50px;
        width: 100%;
        box-sizing: border-box;
      }
      &-btn {
        padding: 0 50px 20px;
        .el-button {
          width: 100%;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>


