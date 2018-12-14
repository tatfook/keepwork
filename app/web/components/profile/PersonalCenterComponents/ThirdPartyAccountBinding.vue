<template>
  <div class="third-party-account-binding">
    <div class="third-party-account-binding-title">{{$t('user.accountBinding')}}</div>
    <div class="third-party-account-binding-content">
      <third-party-binding type='weixin/1'></third-party-binding>
      <third-party-binding type='xinlangweibo/3'></third-party-binding>
      <third-party-binding type='qq/0'></third-party-binding>
      <third-party-binding type='github/2'></third-party-binding>
      <email-bind></email-bind>
      <phone-bind></phone-bind>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import EmailBind from '@/components/common/accountBind/EmailBind'
import PhoneBind from '@/components/common/accountBind/PhoneBind'
import ThirdPartyBinding from '@/components/common/accountBind/ThirdPartyBinding'
export default {
  name: 'ThirdPartyAccountBinding',
  components: {
    EmailBind,
    PhoneBind,
    ThirdPartyBinding
  }
}
</script>
<style lang="scss">
.third-party-account-binding {
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title{
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content{
    padding: 20px 30px;
    font-size: 14px;
  }
}
</style>
