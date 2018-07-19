<template>
    <el-container class="real-name-setting" v-loading="loading">
      <el-row class="real-name-setting-wrap">
        <el-col :class="['real-name-setting-content',hasVerified?'hasVerified':'']">
          <el-header class="real-name-setting-header">
              <h3>{{$t('common.realNameAuthentication')}}</h3>
          </el-header>
          <el-row class="real-name-setting-form">
              <el-form :rules="phoneNumberRules" :model="ruleFormDatas" :label-width="localeLableWidth">
                <el-form-item :label='$t("user.certificationStatus")' :class="{'real-name-status':hasVerified}">
                    <span v-if="hasVerified">{{$t('user.certified')}}</span>
                    <span v-else class="auth-status">{{$t('user.unverified')}}</span>
                </el-form-item>
                <el-row v-if="hasVerified">
                    <el-form-item :label='$t("user.certifiedPhoneNumber")'>
                        <span>{{verifiedPhoneNumber}}</span>
                    </el-form-item>
                </el-row>
                <el-row v-else>
                    <el-form-item :label='$t("user.certifiedPhoneNumber")' prop="cellphoneNumber">
                        <el-input size="small" v-model="ruleFormDatas.cellphoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item :label='$t("user.verificationCode")'>
                      <el-row class="send-auth">
                        <el-col class="send-auth-code">
                            <el-input size="small" v-model="authCode"></el-input>
                        </el-col>
                        <el-col class="send-auth-send-code">
                            <el-button :disabled="sendCodeDisabled || !ruleFormDatas.cellphoneNumber" type="primary" class="send-code-button" size="small" @click.stop="sendAuthCode">
                              <span v-if="sendCodeDisabled">{{$t('user.resend')}}({{count}}s)</span>
                              <span v-else>{{$t('user.sendVerificationCode')}}</span>
                            </el-button>
                        </el-col>
                      </el-row>                      
                    </el-form-item>
                </el-row>                    
              </el-form>
          </el-row>
        </el-col>
        <el-col v-if="!hasVerified" class="real-name-setting-operations-col">
          <DialogOperations @save="realNamePhoneNumber" @close="handleClose"></DialogOperations>
        </el-col>        
      </el-row>      
    </el-container>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import DialogOperations from './DialogOperations'
import { locale } from '@/lib/utils/i18n'

export default {
  name: 'realNameAuthentication',
  data() {
    let validatePhoneNumber = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error(this.$t('user.wrongNumberFormat')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      sendCodeDisabled: false,
      count: 60,
      timer: null,
      authCode: '',
      ruleFormDatas: {
        cellphoneNumber: ''
      },
      phoneNumberRules: {
        cellphoneNumber: [
          {
            required: true,
            message: this.$t('user.inputPhoneNumber'),
            trigger: 'blur'
          },
          { validator: validatePhoneNumber, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      sendCodeInfo: 'user/sendCodeInfo',
      authCodeInfo: 'user/authCodeInfo',
      realNameInfo: 'user/realNameInfo'
    }),
    hasVerified() {
      return this.realNameInfo && this.realNameInfo.verified
    },
    verifiedPhoneNumber() {
      return this.realNameInfo && this.realNameInfo.cellphone
    },
    localeLableWidth() {
      return locale === 'en-US' ? '190px' : '110px'
    }
  },
  methods: {
    ...mapActions({
      verifyCellphoneOne: 'user/verifyCellphoneOne',
      verifyCellphoneTwo: 'user/verifyCellphoneTwo'
    }),
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async sendAuthCode() {
      let payload = {
        setRealNameInfo: true,
        cellphone: this.ruleFormDatas.cellphoneNumber
      }
      await this.verifyCellphoneOne(payload)
      let message = this.sendCodeInfo.error && this.sendCodeInfo.error.message
      if (message === 'success') {
        this.showMessage('success', this.$t('user.smsCodeSentSuccess'))
        this.sendCodeDisabled = true
        this.timer = setInterval(() => {
          if (this.count > 0) {
            this.count--
          } else {
            this.sendCodeDisabled = false
            clearInterval(this.timer)
            this.timer = null
            this.count = 60
          }
        }, 1000)
        return
      }
      if (message === '号码格式有误') {
        // this.showMessage('error', this.$t('user.wrongNumberFormat'))
        return
      }
      if (message === '短信验证码发送过频繁') {
        this.showMessage('error', this.$t('user.sendingFrequent'))
        return
      }
      if (message === '验证码超出同模板同号码天发送上限') {
        this.showMessage('error', this.$t('user.codeExceedsTheSendingLimit'))
        return
      }
      let message2 =
        this.sendCodeInfo.message && this.sendCodeInfo.message.slice(0, 6)
      if (message2 === '手机号已绑定') {
        this.showMessage('error', this.$t('user.hasBeenBoundToOtherAccounts'))
        return
      }
    },
    async realNamePhoneNumber() {
      let payload = {
        setRealNameInfo: true,
        cellphone: this.ruleFormDatas.cellphoneNumber,
        smsCode: this.authCode
      }
      await this.verifyCellphoneTwo(payload)
      let messageId = this.authCodeInfo.error.id
      if (messageId === -1) {
        this.showMessage('error', this.$t('user.verificationCodeError'))
      } else if (messageId === 0) {
        this.showMessage('success', this.$t('common.saveSuccess'))
      }
    },
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    DialogOperations
  }
}
</script>
<style lang="scss" scoped>
.real-name-setting {
  height: 100%;
  &-wrap {
    width: 100%;
    display: flex;
  }
  &-content {
    flex: 1;
    border-right: 15px solid #cdd4db;
    .auth-status {
      color: red;
    }
    .send-auth {
      display: flex;
      .send-auth-code {
        flex: 1;
      }
      .send-auth-send-code {
        width: 136px;
        margin-left: 8px;
        .send-code-button {
          width: 100%;
        }
      }
    }
  }
  .hasVerified {
    border-right: none;
  }
  &-header {
    border-bottom: 3px solid #cdd4db;
    line-height: 60px;
    margin-bottom: 20px;
    h3 {
      margin: 0;
    }
  }
  &-form {
    width: 80%;
    .real-name-status {
      margin-bottom: 0;
    }
  }
  &-operations-col {
    width: 185px;
    text-align: center;
    align-self: flex-end;
  }
}
</style>
<style lang="scss">
.real-name-setting {
  .el-form-item__label {
    padding-right: 20px;
  }
}
</style>
<style lang="scss">
.real-name-setting-form {
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
}
</style>



