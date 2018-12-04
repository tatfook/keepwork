<template>
  <div class="teacher-wrap">
    <div class="teacher">
      <div class="teacher-top-hint">
        <p>{{$t('lesson.notActivatedText.hint')}}</p>
        <p class="red-hint">{{$t('lesson.notActivatedText.getActivationCode')}}</p>
        <el-form class="teacher-top-hint-input" label-width="150px">
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
      <learner-and-teacher class="teacher-wrap-learner-and-teacher"></learner-and-teacher>
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
.teacher-wrap {
  background: #fff;
  margin-top: 20px;
  .lihgt {
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
  }
  &-learner-and-teacher {
    .acquire-item {
      width: 570px;
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
    }
  }
}
</style>
