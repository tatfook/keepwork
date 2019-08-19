<template>
  <el-button class="get-captcha" type="text" :loading="isCodeLoading" :disabled="isWaiting || !isBindDataValid" @click.stop="sendAuthCode">
    <span v-if="isWaiting">{{$t('user.resend')}}({{count}}s)</span>
    <span v-else>{{$t('user.sendCodes')}}</span>
  </el-button>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'GetCaptcha',
  props: {
    type: {
      validator: function(value) {
        return ['phone', 'email'].indexOf(value) !== -1
      }
    },
    bindValue: String,
    isBindDataValid: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isCodeLoading: false,
      count: 60,
      timer: null
    }
  },
  computed: {
    isWaiting() {
      return this.count > 0 && this.count < 60
    }
  },
  methods: {
    ...mapActions({
      userVerifyEmailOne: 'user/verifyEmailOne',
      verifyCellphoneOne: 'user/verifyCellphoneOne'
    }),
    startWaitingTimer() {
      this.timer = setInterval(() => {
        if (this.count > 0) {
          this.count--
        } else {
          clearInterval(this.timer)
          this.timer = null
          this.count = 60
        }
      }, 1000)
    },
    async sendAuthCode() {
      this.isCodeLoading = true
      let result
      switch (this.type) {
        case 'phone':
          result = await this.verifyCellphoneOne({
            isBind: true,
            cellphone: this.bindValue
          }).catch(e => this.$message.error(this.$t('user.sendingFrequent')))
          break
        case 'email':
          result = await this.userVerifyEmailOne({
            isBind: true,
            email: this.bindValue
          })
          break
        default:
          break
      }
      this.isCodeLoading = false
      this.$message({ type: 'success', message: '验证码发送成功' })
      this.startWaitingTimer()
    }
  },
  watch: {
    type() {
      this.isCodeLoading = false
      this.count = 60
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="scss" scoped>
.get-captcha {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>
