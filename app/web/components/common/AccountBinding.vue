<template>
  <div class="account-binding">
    <email-bind></email-bind>
    <phone-bind></phone-bind>
    <third-party-binding type='qq/0'></third-party-binding>
    <third-party-binding type='weixin/1'></third-party-binding>
    <third-party-binding type='xinlangweibo/3'></third-party-binding>
    <third-party-binding type='github/2'></third-party-binding>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import EmailBind from './accountBind/EmailBind'
import PhoneBind from './accountBind/PhoneBind'
import ThirdPartyBinding from './accountBind/ThirdPartyBinding'
export default {
  name: 'AccountBinding',
  components: {
    EmailBind,
    PhoneBind,
    ThirdPartyBinding
  }
}
</script>
<style lang="scss">
.account-binding {
  padding: 55px 15px 15px 56px;
}
</style>
