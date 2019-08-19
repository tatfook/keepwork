<template>
  <div v-if="show">
    <account-encrypt :refreshAfterFinish="true" />
    <el-dialog :visible="isLoginShow" class="login-dialog" :class="{'force-login': forceLogin}" :before-close="handleLoginClose" append-to-body>
      <login @close='handleLoginClose' />
    </el-dialog>
  </div>
</template>
<script>
import AccountEncrypt from '@/components/common/AccountEncrypt'
import Login from '@/components/common/LoginComp'
import { mapActions, mapGetters } from 'vuex'

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
  mounted() {
    this.isLoginShow = this.show
  },
  data() {
    return {
      // show: true,
      isLoginShow: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined'
    })
  },
  methods: {
    ...mapActions({
      toggleAccountEncrypt: 'user/toggleAccountEncrypt'
    }),
    handleClose() {
      !this.forceLogin && this.$emit('close')
    },
    handleLoginClose() {
      let { cellphone, email } = this.userProfile
      if (!this.userIsLogined) return this.handleClose()
      if (!cellphone && !email) {
        this.isLoginShow = false
        this.toggleAccountEncrypt(true)
      } else {
        this.handleClose()
      }
    }
  },
  components: {
    AccountEncrypt,
    Login
  },
  watch: {
    show(isShow) {
      if (isShow) this.isLoginShow = true
    }
  }
}
</script>

<style lang="scss">
.login-dialog {
  .login-page {
    box-shadow: none;
    margin: 0;
    .login-title {
      padding: 0 32px;
      margin: 0 auto 30px;
      font-size: 18px;
      color: #303133;
    }
    .register-dialog-form {
      .register-title {
        padding-top: 0;
      }
    }
    .password-reset-form-title {
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
