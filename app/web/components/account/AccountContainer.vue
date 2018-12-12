<template>
  <div class="account-container">
    <div class="account-tab-left">
      <account-tab></account-tab>
    </div>
    <div class="account-main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AccountTab from './common/AccountTab'
export default {
  name: 'AccountContainer',
  components: {
    AccountTab
  }
}
</script>


<style lang="scss">
.account-container {
  display: flex;
  .account-tab-left {
  }
  .account-main-content {
    flex: 1;
  }
}
</style>


