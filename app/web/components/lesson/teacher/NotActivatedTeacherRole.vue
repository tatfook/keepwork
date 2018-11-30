<template>
  <div class="teacher-wrap">
    <div class="teacher">
      <div class="teacher-top-hint">
        <p>{{$t('lesson.notActivatedText.hint')}}</p>
        <p class="red-hint">{{$t('lesson.notActivatedText.getActivationCode')}}</p>
        <el-form class="teacher-top-hint-input" label-width="120px">
          <el-form-item :label="$t('lesson.notActivatedText.activeCode')" prop=''>
            <el-input v-model.trim="activeCode" size="small" :placeholder="$t('lesson.notActivatedText.inputPlaceholder')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lesson.notActivatedText.belong')" prop=''>
            <el-input v-model.trim="organization" size="small" :placeholder="$t('lesson.notActivatedText.inputBelong')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="active-code-button" :disabled="!validCode" type="primary" size="mini" @click="activateTeacherIdentity">{{$t('lesson.notActivatedText.buttonText')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="teacher-acquire">
      <h4 class="teacher-acquire-title">{{$t('lesson.whatYouWillGet')}}</h4>
      <div class="teacher-acquire-box">
        <div class="acquire-item" v-for="n in 2" :key="n">
          <div :class="['role',n === 2 ? 'role-teacher':'']">
            <div class="role-text">{{n === 1 ? $t('lesson.learners') : $t('lesson.instructors')}}</div>
            <span class="role-cost">{{n === 1 ?  $t('lesson.free') : `￥5000${$t('lesson.perYearPerPerson')}`}}</span>
          </div>
          <div class="access">
            <p>
              <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.selfLearning')}}</p>
            <div class="teaching-function">
              <p>
                <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.learnAmazingLessons')}}<span class="lihgt">({{n == 1 ? $t('lesson.partiallyFree'):$t('lesson.allFree')}})</span></p>
              <p>
                <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.realTimeFeedback')}}</p>
            </div>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.lessonDevelopment')}}</p>
            <div class="teaching-function">
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.createLesson')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.submitLessons')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t("lesson.getBenefit")}}</p>
            </div>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.classroomTeaching')}}</p>
            <div class="teaching-function">
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.freeForClassroomTeaching')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.freeForClassroomLearning')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.trackStudentsPerformance')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.beShownReport')}}</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.trackTeachingProgress')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { lesson } from '@/api'
import LoginDialog from '@/components/common/LoginDialog'

export default {
  name: 'NotActivatedTeacherRole',
  data() {
    return {
      isLoginDialogShow: false,
      activeCode: '',
      organization: ''
    }
  },
  mounted() {
    if (!this.userIsLogined) {
      this.getProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined',
      userId: 'user/userId',
      userinfo: 'lesson/userinfo'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    validCode() {
      return this.activeCode && this.organization
    }
  },
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      getUserDetail: 'lesson/getUserDetail'
    }),
    async activateTeacherIdentity() {
      if (this.isLogin) {
        let payload = {
          userId: this.userId,
          key: this.activeCode,
          school: this.organization
        }
        await lesson.users
          .toBeTeacher(payload)
          .then(res => {
            this.getUserDetail()
            this.$message({
              message: this.$t('lesson.activatedTeaching'),
              type: 'success',
              showClose: true
            })
          })
          .catch(err => {
            this.$alert(
              `<span style="color:#f75858;">` +
                this.$t('lesson.notActivatedText.wrongCodeHint') +
                `</span>`,
              '',
              {
                confirmButtonText: this.$t('common.Sure'),
                center: true,
                dangerouslyUseHTMLString: true,
                callback: action => {}
              }
            )
          })
      } else {
        this.isLoginDialogShow = true
      }
    },
    closeLoginDialog() {
      this.isLoginDialogShow = false
    }
  },
  components: {
    LoginDialog
  }
}
</script>

<style lang="scss">
.teacher-wrap {
  background: #fff;
  margin-top: 20px;
  .lihgt{
    color: #ff742e;
  }
  .teacher {
    max-width: 1200px;
    margin: 0 auto;
    &-top-hint {
      font-size: 14px;
      background: rgba(64, 158, 254, 0.1);
      padding: 25px;
      .red-hint {
        color: #f75858;
      }
      &-input {
        .el-form-item {
          margin-bottom: 14px;
          .el-input {
            width: 60%;
          }
        }
        .active-code-button {
          width: 207px;
          height: 27px;
        }
      }
    }
    &-acquire {
      margin: 60px 0;
      &-title {
        text-align: center;
        font-size: 24px;
      }
      &-box {
        display: flex;
        justify-content: space-between;
        .acquire-item {
          width: 570px;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 30px;
          box-shadow: 1px 1px 5px #ddd9d9, -1px -1px 5px #ddd9d9;
          .role {
            height: 100px;
            text-align: center;
            font-size: 24px;
            color: #333333;
            background: #f7f7f7;
            &-text {
              font-weight: bold;
              color: #333;
              padding-top: 20px;
            }
            &-cost {
              font-size: 18px;
              color: #10c55b;
            }
          }
          .access {
            padding: 44px 25px;
            background: #fff;
            p {
              display: flex;
              align-items: center;
              .img-wrap {
                margin-right: 8px;
                display: inline-block;
                width: 20px;
                height: 20px;
                .not-student-privilege {
                  visibility: hidden;
                }
              }
            }
            .not-student-privilege-text {
              color: rgb(179, 177, 177);
            }
            .teaching-function {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .teacher-wrap {
    .teacher {
      &-top-hint {
        padding: 4px;
        &-input {
          .el-form-item {
            margin-bottom: 14px;
            .el-input {
              width: 100%;
            }
          }
          .active-code-button {
            width: 100px;
            height: 27px;
          }
        }
      }
      &-acquire {
        &-box {
          display: block;
          .acquire-item {
            margin-bottom: 20px;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>