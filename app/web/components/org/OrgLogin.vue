<template>
  <div class="org-login">
    <div class="org-login-container">
      <img :src="defaultLogo" alt="" class="org-login-logo">
      <el-form :model='loginData' class="org-login-form">
        <div class="org-login-form-label">机构登录</div>
        <el-form-item class="org-login-form-item">
          <el-input v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item">
          <el-input type="password" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item class="org-login-form-item">
          <el-button class="org-login-submit" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrgLogin',
  mounted() {
    this.setOrganizationName()
  },
  data() {
    return {
      defaultLogo: require('@/assets/img/logo_old.svg'),
      loginData: {
        username: undefined,
        password: undefined,
        organizationName: undefined
      }
    }
  },
  methods: {
    setOrganizationName() {
      let { orgName } = this.$route.params
      this.loginData.organizationName = orgName
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
    &-item {
      margin-bottom: 16px;
    }
  }
  &-submit {
    width: 100%;
    margin-top: 32px;
  }
}
</style>
