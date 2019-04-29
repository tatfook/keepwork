<template>
  <div class="org-login">
    <div class="org-login-container" v-if="isOrgExist" v-loading='isLoading'>
      <img v-if="orgLogo" :src="orgLogo" alt="" class="org-login-logo">
      <div class="org-login-name">{{orgName}}</div>
      <el-form ref='loginForm' :model='loginData' class="org-login-form" :rules='loginDataRules'>
        <div class="org-login-form-label">欢迎登录</div>
        <el-form-item class="org-login-form-item" prop='username'>
          <el-input v-model="loginData.username" :placeholder="$t('org.kpUsername')" @keyup.enter.native='loginToOrg'></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item" prop='password'>
          <el-input type="password" v-model="loginData.password" :placeholder="$t('org.kpPassword')" @keyup.enter.native='loginToOrg'></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item">
          <el-button v-loading='isLoading' class="org-login-submit" type="primary" @click="loginToOrg">{{$t("common.login")}}</el-button>
        </el-form-item>
        <el-form-item class="org-login-form-operations">
          <div class="org-login-form-operations-left org-login-form-operations-cursor" @click="isShowPasswordResetForm = true">{{$t('common.forgetPassword')}}?</div>
          <div>{{$t('common.noAccount')}}<span class="org-login-form-operations-cursor" @click="isRegisterForm = true">{{$t('common.clickRegister')}}</span></div>
        </el-form-item>
      </el-form>
      <el-dialog class="org-login-dialog" :visible.sync="isRegisterForm" width="352px">
        <i class="el-icon-close org-login-dialog-close" @click="handleClose"></i>
        <register-dialog @close="handleClose"></register-dialog>
      </el-dialog>
      <el-dialog class="org-login-dialog" :visible.sync="isShowPasswordResetForm" width="352px">
        <i class="el-icon-close org-login-dialog-close" @click="isShowPasswordResetForm = false"></i>
        <password-reset-form v-show="isShowPasswordResetForm"></password-reset-form>
      </el-dialog>

    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import RegisterDialog from '@/components/common/RegisterComp'
import PasswordResetForm from '@/components/common/PasswordResetForm'
export default {
  name: 'OrgLogin',
  async mounted() {
    this.isLoading = true
    let orgLoginUrl = _.get(this.$route, 'params.orgLoginUrl')
    await this.getOrgDetailByLoginUrl({ orgLoginUrl }).catch(() => {
      this.isOrgExist = false
      this.isLoading = false
    })
    this.isLoading = false
    this.setOrganizationName()
  },
  data() {
    return {
      isRegisterForm: false,
      isShowPasswordResetForm: false,
      isLoading: false,
      isOrgExist: true,
      loginData: {
        username: '',
        password: '',
        organizationName: ''
      },
      loginDataRules: {
        username: {
          required: true,
          message: this.$t('common.inputUsername'),
          trigger: 'blur'
        },
        password: {
          required: true,
          message: this.$t('common.inputPassword'),
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      orgGetOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl'
    }),
    orgLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl')
    },
    orgDetail() {
      return this.orgGetOrgDetailByLoginUrl({ loginUrl: this.orgLoginUrl })
    },
    orgName() {
      return _.get(this.orgDetail, 'name')
    },
    orgLogo() {
      let logo = _.get(this.orgDetail, 'logo')
      return logo
    }
  },
  methods: {
    ...mapActions({
      getOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      orgLogin: 'org/login',
      userLogin: 'user/login',
      setCurrentOrg: 'org/setCurrentOrg'
    }),
    handleClose() {
      this.isRegisterForm = false
    },
    toRolePage({ roleId }) {
      let roleName = ''
      if ((roleId & 64) > 0) {
        return this.$router.push({
          name: 'OrgPackages'
        })
      }
      if ((roleId & 2) > 0) {
        return this.$router.push({
          name: 'OrgTeacherTeach'
        })
      }
      roleName = 'student'
      this.$router.push({
        name: 'OrgStudent'
      })
    },
    async toLogin() {
      this.isLoading = true
      try {
        const userinfo = await this.orgLogin(this.loginData)
        await this.setCurrentOrg({ orgDetail: this.orgDetail })
        this.isLoading = false
        const { roleId } = userinfo
        return this.toRolePage({ roleId })
      } catch (error) {
        switch (error.status) {
          case 400:
            await this.userLogin(this.loginData)
            await this.setCurrentOrg({ orgDetail: this.orgDetail })
            this.$router.push({
              name: 'OrgStudent'
            })
            this.isLoading = false
            return
          default:
            this.$message({
              message: this.$t('common.logonFailed'),
              type: 'error'
            })
        }
      }
      this.isLoading = false
    },
    loginToOrg() {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.toLogin()
        } else {
          return false
        }
      })
    },
    setOrganizationName() {
      this.loginData.organizationName = this.orgName
    }
  },
  components: {
    RegisterDialog,
    PasswordResetForm
  },
  watch: {
    $route() {
      this.setOrganizationName()
    }
  }
}
</script>
<style lang="scss">
.org-login {
  width: 100%;
  background-color: #f5f5f5;
  display: table-cell;
  vertical-align: middle;
  padding: 40px 0;
  box-sizing: border-box;
  height: auto;
  min-height: 100%;
  &-container {
    width: 352px;
    margin: 0 auto;
    text-align: center;
  }
  &-logo {
    width: auto;
    max-width: 100%;
    margin-bottom: 24px;
  }
  &-name {
    margin: 0 0 40px 0;
    font-size: 24px;
    color: #333;
  }
  &-form {
    background-color: #fff;
    padding: 32px;
    &-label {
      font-size: 18px;
      color: #333;
      margin-bottom: 40px;
      font-weight: bold;
      text-align: left;
    }
    &-operations {
      margin-top: -8px;
      color: #909399;
      &-left {
        flex: 1;
        text-align: left;
      }
      &-cursor {
        color: #1272cc;
        cursor: pointer;
      }
      .el-form-item__content {
        display: flex;
        line-height: unset;
      }
    }
  }
  &-submit {
    width: 100%;
    margin-top: 32px;
  }
  &-dialog {
    &-close {
      position: absolute;
      right: 24px;
      top: 16px;
      z-index: 1;
      cursor: pointer;
      font-size: 18px;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      position: relative;
    }
    .register-dialog-form {
      box-shadow: none;
    }
    .password-reset-form {
      padding-bottom: 20px;
    }
  }
}
</style>
