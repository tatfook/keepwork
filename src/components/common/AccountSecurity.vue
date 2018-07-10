<template>
  <el-tabs v-model="activeName" class="account-security">
    <el-tab-pane :label="$t('user.modifyPwd')" name="changePwd" class="account-security-pwd-pane">
      <ChangePwd :isChangePwdPaneActive='isChangePwdPaneActive'></ChangePwd>
    </el-tab-pane>
    <el-tab-pane :label="$t('user.accountBinding')" name="accountBinding">{{$t('user.accountBinding')}}</el-tab-pane>
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
  computed: {
    isChangePwdPaneActive() {
      return this.activeName === 'changePwd'
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
