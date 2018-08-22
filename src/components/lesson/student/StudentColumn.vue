<template>
  <div class="student-wrap">
    <el-container class="student">
      <el-aside width="274px">
        <div class="profile">
          <img :src='userProfile.portrait' alt="portrait">
        </div>
        <div class="nickname">{{username}}</div>
        <div class="skillpoints">{{skillpointsCount}} skillpoints</div>
        <div class="skills">
          <ul class="skills-list">
            <li v-for="(skill,index) in skillsList" :key="index">{{skill.skillName}}：
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
                <el-input id="searchClass" size="medium" v-model="classID" :placeholder="$t('lesson.enterByClassId')"></el-input>
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
          <span>{{subscribesList.length}}</span> {{$t('lesson.packagesCount')}}</div>
        <div class="packages" v-loading='loading'>
          <el-row>
            <el-col :sm="12" :md="8" v-for="packageDetail in sortedSubscribesList" :key="packageDetail.id">
              <student-subscribe-packages :packageDetail="packageDetail"></student-subscribe-packages>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import StudentSubscribePackages from './StudentSubscribePackages'

export default {
  name: 'StudentColumn',
  data() {
    return {
      loading: true,
      classID: ''
    }
  },
  async mounted() {
    await this.getProfile()
    console.log('userId', this.userId)
    console.log('username', this.username)
    let payload = { userId: this.userId }
    await this.getUserSubscribes(payload)
    console.log('subscribes', this.subscribesList)
    await this.getUserSkills(payload)
    console.log('skillsList', this.skillsList)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userId: 'user/userId',
      username: 'user/username',
      subscribesList: 'lesson/student/userSubscribeList',
      skillsList: 'lesson/student/userSkillsList',
      enterClassInfo: 'lesson/student/enterClassInfo'
    }),
    skillpointsCount() {
      let sum = 0
      this.skillsList.every(skill => (sum += skill.score * 1))
      return sum
    },
    sortedSubscribesList() {
      return this.subscribesList.sort(
        (obj1, obj2) => obj1.updatedAt < obj2.updatedAt
      )
    }
  },
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      getUserSubscribes: 'lesson/student/getUserSubscribes',
      getUserSkills: 'lesson/student/getUserSkills',
      enterClassRoom: 'lesson/student/enterClassRoom',
      setEnterClassID: 'lesson/student/setEnterClassID'
    }),
    async enterClass() {
      //进入课堂
      let key = this.classID
      await this.enterClassRoom({ key })
      if (this.enterClassInfo.packageId && this.enterClassInfo.lessonId) {
        this.setEnterClassID({ key })
        this.$router.push({
          path: `student/package/${this.enterClassInfo.packageId}/lesson/${
            this.enterClassInfo.lessonId
          }`
        })
      } else {
        this.$message({
          showClose: true,
          message: "Class with this ID does't exist.",
          type: 'error'
        })
      }
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
      .skillpoints {
        height: 40px;
        color: #818181;
        margin: 0 auto;
        width: 233px;
        border-bottom: 2px solid #cfd8dc;
        font-size: 14px;
      }
      .skills {
        margin: 17px auto;
        width: 233px;
        text-align: left;
        &-list {
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
      }
    }
  }
}
</style>
