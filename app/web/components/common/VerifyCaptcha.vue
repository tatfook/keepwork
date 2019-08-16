<template>
  <el-button v-loading="isLoading" type="primary" size="medium" @click="verifyCaptcha">确定</el-button>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'VerifyCaptcha',
  props: {
    type: {
      validator: function(value) {
        return ['phone', 'email'].indexOf(value) !== -1
      }
    },
    bindData: {
      type: Object,
      required: true
    },
    bindFormRef: Object
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    ...mapActions({
      userVerifyEmailTwo: 'user/verifyEmailTwo',
      userVerifyCellphoneTwo: 'user/verifyCellphoneTwo'
    }),
    async sendVerifyCaptcha() {
      let { cellphone, email, captcha } = this.bindData
      this.isLoading = true
      let isFailed = false
      switch (this.type) {
        case 'phone':
          await this.userVerifyCellphoneTwo({
            captcha,
            cellphone,
            isBind: true
          }).catch(error => {
            isFailed = true
          })
          break
        case 'email':
          await this.userVerifyEmailTwo({
            captcha,
            email,
            isBind: true
          }).catch(error => {
            isFailed = true
          })
          break
        default:
          break
      }
      this.isLoading = false
      if (isFailed) return this.$message({ type: 'error', message: '绑定失败' })
      this.$message({ type: 'success', message: '绑定成功' })
      this.$emit('close')
    },
    verifyCaptcha() {
      let formValidMethod = _.get(this.bindFormRef, 'validate')
      if (formValidMethod) {
        formValidMethod(async valid => {
          if (valid) {
            this.sendVerifyCaptcha()
          }
        })
      } else {
        this.sendVerifyCaptcha()
      }
    }
  }
}
</script>
