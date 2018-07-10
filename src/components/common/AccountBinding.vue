<template>
  <div class="account-binding">
    <EmailBind></EmailBind>
    <PhoneBind></PhoneBind>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import EmailBind from './accountBind/EmailBind'
import PhoneBind from './accountBind/PhoneBind'
export default {
  name: 'AccountBinding',
  components: {
    EmailBind,
    PhoneBind
  }
}
</script>
<style lang="scss">
.account-binding {
  padding: 55px 15px 15px 56px;
}
</style>
