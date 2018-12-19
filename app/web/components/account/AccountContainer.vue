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
  padding-top: 20px;
  max-width: 1230px;
  margin: 0 auto;
  .account-tab-left {
    width: 265px;
  }
  .account-main-content {
    flex: 1;
    margin-left: 20px;
  }
}
</style>


