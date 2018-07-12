<template>
  <div class="account-binding">
    <EmailBind></EmailBind>
    <PhoneBind></PhoneBind>
    <GithubBind></GithubBind>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import EmailBind from './accountBind/EmailBind'
import PhoneBind from './accountBind/PhoneBind'
import GithubBind from './accountBind/GithubBind'
export default {
  name: 'AccountBinding',
  components: {
    EmailBind,
    PhoneBind,
    GithubBind
  }
}
</script>
<style lang="scss">
.account-binding {
  padding: 55px 15px 15px 56px;
}
</style>
