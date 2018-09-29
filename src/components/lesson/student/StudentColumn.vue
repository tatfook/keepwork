<template>
  <div class="student-wrap">
    <el-container class="student">
      <el-aside width="274px">
        <div class="profile">
          <img :src='userProfile.portrait' alt="portrait">
        </div>
        <div class="nickname">{{username}}</div>
        <div class="beans"><span>{{beansCount}}{{$t('lesson.beans')}}</span><span class="detail" @click="goBeanDetail">{{$t('lesson.packageManage.detailLabel')}} →</span></div>
        <div class="skillpoints">{{skillpointsCount}} {{$t('lesson.skillPoints')}} :</div>
        <div class="skills" :loading="loadingSkillsPoint">
          <ul class="skills-list">
            <li v-for="(skill,index) in skillsList" :key="index"><span class="skill-name">{{skillName(skill)}}：</span>
              <span>{{skill.score}}</span>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-main>
        <div class="search">
          <el-row>
            <el-col :md="2">
              <span class="bell"><img src="@/assets/lessonImg/bell.png" alt=""></span>
            </el-col>
            <el-col :md="5">
              <span class="tip">{{$t('lesson.enterClass')}}</span>
            </el-col>
            <el-col :md="11">
              <span class="search-input">
                <el-input id="searchClass" size="medium" v-model="classID" :placeholder="$t('lesson.enterByClassId')" @keyup.enter.native="enterClass"></el-input>
              </span>
            </el-col>
            <el-col :md="6">
              <span class="search-btn">
                <el-button @click="enterClass" :disabled="!classID" size="medium" type="primary">
                  <label for="searchClass">{{$t('lesson.enter')}}</label>
                </el-button>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="total-packages">{{$t('lesson.include')}}:
          <span>{{subscribesList.length}}</span> {{$t('lesson.packagesCount')}}
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
      </el-main>
    </el-container>
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
import { mapGetters, mapActions } from 'vuex'
import { lesson } from '@/api'
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
import StudentSubscribePackages from './StudentSubscribePackages'

export default {
  name: 'StudentColumn',
  data() {
    return {
      loading: true,
      classID: '',
      skillsList: [],
      loadingSkillsPoint: true,
      beInClassDialog: false
    }
  },
  async mounted() {
    await this.getProfile()
    let payload = { userId: this.userId }
    await this.getUserSubscribes({packageState:2})
    await lesson.users
      .userSkills(payload)
      .then(res => {
        this.skillsList = res
        this.loadingSkillsPoint = false
      })
      .catch(error => console.log(error))
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userId: 'user/userId',
      username: 'user/username',
      enterClassInfo: 'lesson/student/enterClassInfo',
      subscribesList: 'lesson/student/subscribesList',
      userinfo: 'lesson/userinfo'
    }),
    beansCount(){
      return _.get(this.userinfo,'bean',0)
    },
    skillpointsCount() {
      let sum = 0
      if (this.skillsList.length === 0) {
        sum = 0
      } else {
        this.skillsList.every(skill => (sum += skill.score * 1))
      }
      return sum
    },
    continuingStudyPackages() {
      let continuingStudyPackagesList = _.filter(this.subscribesList, i => {
        return (
          i.learnedLessons.length > 0 &&
          i.learnedLessons.length < i.lessons.length
        )
      })
      return continuingStudyPackagesList.sort(this.sortByUpdateAt)
    },
    startStudyPackages() {
      let startStudyPackagesList = _.filter(this.subscribesList, i => {
        return i.learnedLessons.length == 0 && i.lessons.length != 0
      })
      return startStudyPackagesList.sort(this.sortByUpdateAt)
    },
    finishedStudyPackages() {
      let finishedStudyPackagesList = _.filter(this.subscribesList, i => {
        return i.learnedLessons.length == i.lessons.length
      })
      return finishedStudyPackagesList.sort(this.sortByUpdateAt)
    },
    sortedSubscribesList() {
      if (this.subscribesList.length === 0) {
        return this.subscribesList
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
      getUserSubscribes: 'lesson/student/getUserSubscribes'
    }),
    goBeanDetail(){
      this.$router.push('/student/bean')
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    async enterClass() {
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
            console.log(err)
          })
      }
    },
    async enterNewClass() {
      let key = this.classID
      await this.enterClassRoom({ key })
        .then(res => {
          this.$router.push({
            path: `/student/package/${this.enterClassInfo.packageId}/lesson/${
              this.enterClassInfo.lessonId
            }?dialog=true`
          })
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: this.$t('lesson.wrongKey'),
            type: 'error'
          })
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
    },
    handleClose() {
      this.beInClassDialog = false
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    }
  },
  components: {
    StudentSubscribePackages
  }
}
</script>

<style lang="scss">
.student-wrap {
  .student {
    margin: 0 auto;
    max-width: 1150px;
    .el-aside {
      background: #ffffff;
      margin-right: 29px;
      overflow: hidden;
      text-align: center;
      .profile {
        width: 99px;
        height: 99px;
        margin: 0 auto;
        border-radius: 50%;
        border: solid 1px #ced0d2;
        margin-top: 37px;
        margin-bottom: 20px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .nickname {
        font-size: 24px;
        line-height: 34px;
        color: #333333;
        font-family: 'ArialMT';
      }
      .beans{
        border-bottom: 1px solid #909399;
        margin: 5px 20px 15px;
        padding-bottom: 20px;
        color: #181818;
        font-size: 14px;
        .detail{
          color: #409eff;
          padding-left: 20px;
          cursor: pointer;
        }
      }
      .skillpoints {
        width: 233px;
        font-size: 14px;
        margin: 10px auto;
        text-align: left;
        color:#333;
      }
      .skills {
        margin: 0 auto;
        width: 233px;
        text-align: left;
        &-list {
          margin:0;
          list-style: none;
          padding: 0;
          li {
            height: 34px;
            background: #f5f7f9;
            margin: 2px 0;
            line-height: 34px;
            padding: 0 4px;
            font-size: 14px;
            color: #333333;
            .skill-name{
              color: #707174;
            }
          }
        }
      }
    }
    .el-main {
      padding: 0;
      background: #fff;
      overflow: hidden;
      .search {
        background: rgba(64, 158, 254, 0.1);
        .bell {
          display: inline-block;
          padding: 18px 0 9px 39px;
        }
        .tip {
          display: block;
          padding-top: 20px;
          font-size: 14px;
          text-align: center;
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
  }
  .be-in-class {
    .el-dialog__body {
      .hint {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: rgb(229, 65, 4);
        .redIcon {
          margin-right: 10px;
          font-size: 30px;
        }
      }
    }
  }
}
</style>
