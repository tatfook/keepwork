<template>
  <el-tabs v-model="activeName" class="account-security">
    <el-tab-pane :label="$t('user.modifyPwd')" name="changePwd" class="account-security-pwd-pane">
      <change-pwd :isChangePwdPaneActive='isChangePwdPaneActive'></change-pwd>
    </el-tab-pane>
    <el-tab-pane :label="$t('user.accountBinding')" name="accountBinding">
      <account-binding></account-binding>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ChangePwd from './ChangePwd'
import AccountBinding from './AccountBinding'
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
    ChangePwd,
    AccountBinding
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
