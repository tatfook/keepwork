<template>
  <el-dialog class="real-name" :visible.sync="isShowRealName" width="352px" :before-close="handleClose">
    <div class="real-name-title">实名认证</div>
    <div class="real-name-title">您的账号尚未进行实名认证，部分功能将会受限：</div>
    <el-form ref="realnameForm" :rules="phoneNumberRules" :model="realNameData" v-loading="isLoading">
      <el-form-item prop="cellphone">
        <el-input placeholder="请输入手机号码" v-model="realNameData.cellphone"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input placeholder="请输入手机验证码" v-model="realNameData.captcha">
          <template slot="append">
            <el-button type="text" :loading="isCodeLoading" :disabled="isWaiting || !isCellphoneValid" @click.stop="sendAuthCode">
              <span v-if="isWaiting">{{$t('user.resend')}}({{count}}s)</span>
              <span v-else>{{$t('user.sendCodes')}}</span>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="real-name-operate">
        <el-button size="medium" @click="handleClose">取消</el-button>
        <el-button type="primary" size="medium" @click="realNamePhoneNumber">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'RealName',
  data() {
    let validatePhoneNumber = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        this.isCellphoneValid = false
        callback(new Error(this.$t('user.wrongNumberFormat')))
      } else {
        this.isCellphoneValid = true
        callback()
      }
    }
    return {
      isLoading: false,
      isCodeLoading: false,
      isCellphoneValid: false,
      count: 60,
      timer: null,
      realNameData: {
        cellphone: '',
        captcha: ''
      },
      authCode: '',
      phoneNumberRules: {
        cellphone: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('user.inputPhoneNumber')
          },
          { validator: validatePhoneNumber, trigger: 'change' }
        ],
        captcha: [
          {
            required: true,
            message: this.$t('user.inputVerificationCode'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      isShowRealName: 'user/isShowRealName',
      authCodeInfo: 'user/authCodeInfo',
      sendCodeInfo: 'user/sendCodeInfo'
    }),
    isWaiting() {
      return this.count > 0 && this.count < 60
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      verifyCellphoneOne: 'user/verifyCellphoneOne',
      verifyCellphoneTwo: 'user/verifyCellphoneTwo'
    }),
    handleClose() {
      this.toggleRealName(false)
    },
    showMessage(type, message) {
      this.$message({ message, type })
    },
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
      await this.verifyCellphoneOne({
        setRealNameInfo: true,
        cellphone: this.realNameData.cellphone
      }).catch(e => this.$message.error(this.$t('user.sendingFrequent')))
      this.isCodeLoading = false
      if (this.sendCodeInfo === 'OK') {
        this.showMessage('success', this.$t('user.smsCodeSentSuccess'))
        this.startWaitingTimer()
      }
    },
    async realNamePhoneNumber() {
      this.$refs['realnameForm'].validate(async valid => {
        if (valid) {
          let { cellphone, captcha } = this.realNameData
          this.isLoading = true
          await this.verifyCellphoneTwo({
            cellphone,
            captcha,
            realname: true
          }).catch(() => {
            this.isLoading = false
          })
          let authResultInfo = this.authCodeInfo
          if (authResultInfo === 'OK') {
            this.showMessage('success', this.$t('common.saveSuccess'))
          } else {
            this.showMessage('error', this.$t('user.verificationCodeError'))
          }
          this.isLoading = false
          this.handleClose()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.real-name {
  /deep/ .el-dialog__body {
    padding: 0 32px;
  }
  &-title {
    font-size: 18px;
    color: #3d3332;
    font-weight: bold;
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-operate {
    text-align: right;
    margin: 0;
    padding-bottom: 32px;
    .el-button {
      width: 100px;
      height: 40px;
      padding: 0;
      line-height: 40px;
      font-size: 16px;
    }
  }
  .el-button--text {
    padding: 0 17px;
    height: 40px;
  }
}
</style>
