<template>
  <el-dialog :visible.sync="show" class="login-dialog" :class="{'force-login': forceLogin}" :before-close="handleClose">
    <login @close='handleClose'/>
  </el-dialog>
</template>
<script>
import Login from '@/components/common/LoginComp'

export default {
  name: 'LoginDialog',
  props: {
    show: Boolean,
    forceLogin: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  methods: {   
    handleClose() {
      !this.forceLogin && this.$emit('close')
    },
  },
  components: {
    Login
  }
}
</script>

<style lang="scss">
.login-dialog {
  .login-page{
    box-shadow: none;
    margin: 0;
    .login-title {
      padding: 0 32px;
      margin: 0 auto 30px;
      font-size: 18px;
      color: #303133;
    }
    .register-dialog-form{
      .register-title{
        padding-top: 0;
      }
    } 
    .password-reset-form-title{
      padding-top: 0;
    }
  }
  &.force-login {
    .el-dialog__header {
      .el-dialog__headerbtn {
        display: none;
      }
    }
  }
  .el-dialog {
    max-width: 100%;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    max-width: 352px;
    padding: 40px 0 20px;
  }
}
@media screen and (max-width: 768px) {
  .login-dialog {
    .el-dialog {
      width: 90%;
    }
  }
}
</style>
