<template>
  <div class="apply-teacher">
    <div class="apply-teacher-container">
      <div class="apply-teacher-identity-info" v-if="!isLearner">
        {{identityInfoText}}
      </div>
      <div class="apply-teacher-consult" v-if="isTeacher">{{$t("lesson.ifYouWantConsult")}}</div>
      <h1 class="apply-teacher-title" v-if="isLearner">{{$t('lesson.applyToBeTeacherOrAlliance')}}</h1>
      <div class="apply-teacher-hint" v-if="!isTeacher">
        <div class="apply-teacher-hint-teacher">
          <div>{{$t('lesson.pleaseInputActiveCode')}}</div>
          <div class="apply-teacher-hint-info"></div>
          <div class="apply-teacher-hint-contact"></div>
          <el-form class="apply-teacher-hint-form" :label-width="labelWidth">
            <el-form-item :label="$t('lesson.notActivatedText.activeCode')" prop=''>
              <el-input v-model.trim="activeCode" size="small" :placeholder="$t('lesson.notActivatedText.inputPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lesson.notActivatedText.belong')" prop=''>
              <el-input v-model.trim="organization" size="small" :placeholder="$t('lesson.notActivatedText.inputBelong')"></el-input>
            </el-form-item>
            <el-form-item class="apply-teacher-hint-form-operate">
              <el-button class="active-code-button" :disabled="!validCode" type="primary" size="mini" @click="activateTeacherIdentity">{{$t('lesson.notActivatedText.buttonText')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="apply-teacher-hint-alliance" v-if="!isAlliance">
          <div>{{$t('lesson.toBeLessonDeveloper')}}</div>
          <div class="apply-teacher-hint-alliance-price">{{$t("lesson.lessonDeveloperPrice")}}</div>
          <div class="apply-teacher-hint-alliance-wait">{{$t("lesson.toBeReleased")}}</div>
        </div>
      </div>
      <learner-and-teacher class="apply-teacher-learner-and-teacher"></learner-and-teacher>
    </div>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog"></login-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { locale } from '@/lib/utils/i18n'
import { mapGetters, mapActions } from 'vuex'
import { lesson } from '@/api'
import LoginDialog from '@/components/common/LoginDialog'
import LearnerAndTeacher from '@/components/lesson/common/LearnerAndTeacher'

export default {
  name: 'ApplyTeacher',
  data() {
    return {
      isLoginDialogShow: false,
      activeCode: '',
      organization: '',
      labelWidth: locale === 'en-US' ? '150px' : '78px'
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
      userinfo: 'lesson/userinfo',
      teacherInfo: 'lesson/teacherInfo',
      isTeacher: 'lesson/isTeacher',
      allianceInfo: 'lesson/allianceInfo',
      isAlliance: 'lesson/isAlliance',
      isLearner: 'lesson/isLearner'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    validCode() {
      return this.activeCode && this.organization
    },
    identityInfoText() {
      if (this.isLearner) {
        return ''
      }
      let startTime = _.get(
        this.isTeacher ? this.teacherInfo : this.allianceInfo,
        'startTime'
      )
      let formatedStartTime = moment(startTime).format('YYYY.MM.DD')
      let endTime = _.get(
        this.isTeacher ? this.teacherInfo : this.allianceInfo,
        'endTime'
      )
      let formatedEndTime = moment(endTime).format('YYYY.MM.DD')
      return this.isTeacher
        ? `${this.$t(
            'lesson.youHaveBecomeAnInstructor'
          )}${formatedStartTime} - ${formatedEndTime}`
        : `${this.$t(
            'lesson.youHaveBecomeLessonDevelop'
          )}${formatedStartTime} - ${formatedEndTime}`
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
    LearnerAndTeacher,
    LoginDialog
  }
}
</script>

<style lang="scss">
.apply-teacher {
  background: #fff;
  padding: 24px 20px;
  &-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  &-identity-info {
    background-color: #ff9661;
    color: #fff;
    font-size: 14px;
    padding: 14px 20px;
  }
  &-consult {
    background-color: #eef7ff;
    color: #3ba4ff;
    font-size: 14px;
    padding: 14px 20px;
    margin-top: 16px;
  }
  &-title {
    margin: 30px 0;
    font-size: 24px;
    color: #333;
    text-align: center;
  }
  &-hint {
    font-size: 16px;
    color: #333;
    display: flex;
    justify-content: space-between;
    &-teacher {
      background-color: #ecf5ff;
      flex: 1;
      padding: 50px 24px 40px 20px;
    }
    &-form {
      margin-top: 24px;
      .el-form-item {
        margin-bottom: 14px;
      }
      .el-form-item__label {
        line-height: 34px;
      }
      .el-form-item__content {
        line-height: 1;
      }
      .el-input {
        width: 400px;
      }
      .el-input--small .el-input__inner {
        height: 34px;
        line-height: 34px;
      }
      .el-button {
        width: 207px;
        height: 27px;
      }
      & &-operate {
        margin-bottom: 0;
        padding-top: 6px;
      }
    }
    &-alliance {
      background-color: #ecf5ff;
      width: 300px;
      margin-left: 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 8px;
      box-sizing: border-box;
      text-align: center;
      &-price {
        border: 1px dashed #409efe;
        margin: 20px 0;
        padding: 18px 10px;
        font-size: 14px;
        color: #409efe;
      }
      &-wait {
        font-size: 14px;
        color: #777;
      }
    }
    &-info {
      font-size: 14px;
      color: #777;
      margin: 10px 0;
    }
    &-contact {
      color: #3ba4ff;
      font-size: 14px;
    }
  }
  &-learner-and-teacher {
    .learner-and-teacher-box {
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .acquire-item {
      width: 420px;
      box-sizing: border-box;
    }
  }
}
</style>
