<template>
  <div class="account-binding">
    <EmailBind></EmailBind>
    <PhoneBind></PhoneBind>
    <ThirdPartyBinding type='qq'></ThirdPartyBinding>
    <ThirdPartyBinding type='weixin'></ThirdPartyBinding>
    <ThirdPartyBinding type='xinlangweibo'></ThirdPartyBinding>
    <ThirdPartyBinding type='github'></ThirdPartyBinding>
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
