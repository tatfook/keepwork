<template>
  <div class="apply-teacher">
    <div class="apply-teacher-container">
      <h1 class="apply-teacher-title">申请成为共享课程讲师/课程联盟会员</h1>
      <div class="apply-teacher-hint">
        <div class="apply-teacher-hint-teacher">
          <div>成为共享课程讲师，请输入激活码</div>
          <div class="apply-teacher-hint-info">(仅需 ￥5000/年/人，即可成为共享课程讲师，创建的班级可同时容纳50个学生。)</div>
          <div class="apply-teacher-hint-contact">如需购买激活码，请联系：程老师 13267059950(电话/微信)、846704851(QQ)</div>
          <el-form class="apply-teacher-hint-form" label-width="78px">
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
        <div class="apply-teacher-hint-alliance">
          <div>成为课程联盟会员</div>
          <div class="apply-teacher-hint-alliance-price">仅需￥100/年/人，即可成为课程联盟会员</div>
          <div class="apply-teacher-hint-alliance-wait">敬请期待</div>
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
      set() { }
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
                callback: action => { }
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
  padding: 50px 20px;
  &-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  &-title {
    margin: 0 0 30px 0;
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
