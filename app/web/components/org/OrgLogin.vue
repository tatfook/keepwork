<template>
  <div class="org-login">
    <div class="org-login-container" v-if="isOrgExist">
      <img v-loading='isLoading' :src="orgLogo" alt="" class="org-login-logo">
      <el-form ref='loginForm' :model='loginData' class="org-login-form" :rules='loginDataRules'>
        <div class="org-login-form-label">{{$t('org.loginToOrg')}}</div>
        <el-form-item class="org-login-form-item" prop='username'>
          <el-input v-model="loginData.username" :placeholder="$t('org.kpUsername')" @keyup.enter.native='loginToOrg'></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item" prop='password'>
          <el-input type="password" v-model="loginData.password" :placeholder="$t('org.kpPassword')" @keyup.enter.native='loginToOrg'></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item">
          <el-button v-loading='isLoading' class="org-login-submit" type="primary" @click="loginToOrg">{{$t("common.login")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
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
      isLoading: false,
      isOrgExist: true,
      defaultLogo: require('@/assets/img/logo_old.svg'),
      loginData: {
        username: undefined,
        password: undefined,
        organizationName: undefined
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
    orgName(){
      return _.get(this.orgDetail, 'name')
    },
    orgLogo() {
      let logo = _.get(this.orgDetail, 'logo', this.defaultLogo)
      return _.isNull(logo) ? this.defaultLogo : logo
    }
  },
  methods: {
    ...mapActions({
      getOrgDetailByLoginUrl: 'org/getOrgDetailByLoginUrl',
      orgLogin: 'org/login',
      setCurrentOrg: 'org/setCurrentOrg'
    }),
    toRolePage({ roleId }) {
      let roleName = ''
      switch (roleId) {
        case 1:
          roleName = 'student'
          this.$router.push({
            name: 'OrgStudent'
          })
          break
        case 2:
          this.$router.push({
            name: 'OrgTeacherTeach'
          })
          break
        case 64:
          this.$router.push({
            name: 'OrgPackages'
          })
          break
        default:
          roleName = 'notMember'
          break
      }
    },
    async toLogin() {
      this.isLoading = true
      let userinfo = await this.orgLogin(this.loginData).catch(error => {
        let errorMsg = ''
        switch (error.status) {
          case 400:
            errorMsg = this.$t('org.accountNotFound')
            break
          default:
            errorMsg = this.$t('common.logonFailed')
            break
        }
        this.$message({
          message: errorMsg,
          type: 'error'
        })
        this.isLoading = false
      })
      await this.setCurrentOrg({ orgDetail: this.orgDetail })
      this.isLoading = false
      let { roleId } = userinfo
      this.toRolePage({ roleId })
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
  watch: {
    $route() {
      this.setOrganizationName()
    }
  }
}
</script>
<style lang="scss" scoped>
.org-login {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  &-container {
    width: 350px;
    text-align: center;
  }
  &-logo {
    width: auto;
    max-width: 100%;
    margin-bottom: 40px;
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
  }
  &-submit {
    width: 100%;
    margin-top: 32px;
  }
}
</style>
