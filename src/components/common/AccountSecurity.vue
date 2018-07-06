<template>
  <el-tabs v-model="activeName" class="account-security">
    <el-tab-pane label="修改密码" name="changePwd" class="account-security-pwd-pane">
      <ChangePwd></ChangePwd>
    </el-tab-pane>
    <el-tab-pane label="账号绑定" name="accountBinding">账号绑定</el-tab-pane>
  </el-tabs>
</template>

<script>
import ChangePwd from './ChangePwd'
export default {
  name: 'AccountSecurity',
  data() {
    return {
      activeName: 'changePwd'
    }
  },
  components: {
    ChangePwd
  }
}
</script>
<style lang="scss">
.account-security {
  .el-tabs__nav {
    margin-left: 75px;
  }
  &-pwd-pane {
    padding: 50px 180px 15px 60px;
  }
}
</style>
