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
  &-form {
    &-item-content {
      width: 180px;
      padding-right: 56px;
    }
    &-item-button {
      color: #1989fa;
      border-color: #1989fa;
    }
    .el-form-item__label {
      padding-right: 56px;
      color: #333;
    }
  }
  &-dialog {
    &-code-button {
      font-size: 16px;
      color: #1989fa;
      border-color: #1989fa;
      width: 148px;
      text-align: center;
      padding: 8px 0;
      border-radius: 34px;
    }
    .el-dialog__header {
      font-size: 16px;
      border-bottom: 1px solid #d1d1d1;
      padding: 10px 25px;
    }
    .el-form {
      padding: 25px 0 0 33px;
    }
    .el-input {
      width: 257px;
      margin-right: 8px;
    }
    .el-form-item__label {
      padding-right: 16px;
    }
  }
}
</style>
