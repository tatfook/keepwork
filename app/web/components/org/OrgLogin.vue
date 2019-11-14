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
        <register-dialog :isDialogShow="isRegisterForm" @close="handleClose"></register-dialog>
      </el-dialog>
      <el-dialog class="org-login-dialog" :visible.sync="isShowPasswordResetForm" width="352px">
        <i class="el-icon-close org-login-dialog-close" @click="isShowPasswordResetForm = false"></i>
        <password-reset-form v-show="isShowPasswordResetForm"></password-reset-form>
      </el-dialog>
    </div>
    <div class="org-login-forms" v-if="publishedForms.length > 0">
      <div class="org-login-forms-title">相关文档查看：</div>
      <div class="org-login-forms-container">
        <div class="org-login-forms-item" v-for="(form, index) in publishedForms" :key="index">
          <div class="org-login-forms-item-title" @click="toFormDetail(form)">{{form.name}}</div>
          <el-button type="text" @click="toFormDetail(form)">详情</el-button>
        </div>
      </div>
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
    await this.orgGetForms({ organizationId: this.orgId })
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
      orgFormsList: 'org/formsList',
      orgGetOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      isFirstView: 'org/isFirstView'
    }),
    formsList() {
      return this.orgFormsList({ id: this.orgId })
    },
    publishedForms() {
      return _.filter(this.formsList, ({ state }) => state == 1) || []
    },
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
    },
    orgId() {
      return _.get(this.orgDetail, 'id')
    }
  },
  methods: {
    ...mapActions({
      orgGetForms: 'org/getForms',
      getOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      orgLogin: 'org/login',
      userLogin: 'user/login',
      setCurrentOrg: 'org/setCurrentOrg'
    }),
    toFormDetail(form) {
      let { id } = form
      this.$router.push({
        path: `form/${id}`
      })
    },
    handleClose() {
      this.isRegisterForm = false
    },
    toRolePage({ roleId }) {
      let roleName = ''
      if ((roleId & 64) > 0) {
        return this.$router.push({
          name: 'OrgFirstView'
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
        const userinfo = await this.orgLogin({
          ...this.loginData,
          username: this.loginData.username.toLowerCase()
        })
        await this.setCurrentOrg({ orgDetail: this.orgDetail })
        this.isLoading = false
        const { roleId } = userinfo
        return this.toRolePage({ roleId })
      } catch (error) {
        switch (error.status) {
          case 400:
            if (_.includes(error.data.message, '班级成员不存在')) {
              await this.userLogin(this.loginData)
              await this.setCurrentOrg({ orgDetail: this.orgDetail })
              this.$router.push({
                name: 'OrgStudent'
              })
              this.isLoading = false
              return
            }
            this.$message({
              message: this.$t('org.accountNotFound'),
              type: 'error'
            })
            break
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
  &-forms {
    width: 912px;
    margin: 0 auto;
    background-color: #fff;
    padding: 32px 24px;
    box-sizing: border-box;
    font-size: 14px;
    margin-top: 96px;
    border-radius: 8px;
    &-container {
      margin-top: 20px;
      overflow-x: auto;
      white-space: nowrap;
    }
    &-item {
      display: inline-block;
      margin-right: 16px;
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
      &-title {
        width: 160px;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        border-radius: 8px;
        white-space: normal;
        padding: 0 8px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          border: 2px solid #4facf5;
        }
      }
    }
  }
}
</style>
