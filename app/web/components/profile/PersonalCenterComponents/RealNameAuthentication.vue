<template>
  <div class="real-name-auth">
    <div class="real-name-auth-title">{{$t('common.realNameAuthentication')}}</div>
    <div class="real-name-auth-content">
      <el-row class="real-name-setting-wrap">
      <el-col :class="['real-name-setting-content',hasVerified?'hasVerified':'']">
        <el-row v-loading='isLoading' class="real-name-setting-form">
          <el-form :rules="phoneNumberRules" :model="ruleFormDatas" :label-width="localeLableWidth">
            <el-form-item :label='$t("user.certificationStatus")' :class="{'real-name-status':hasVerified}">
              <span v-if="hasVerified">{{$t('user.certified')}}<i class="iconfont icon-yanzhengma"></i></span>
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
                    <el-button :loading="sendCodeLoading" :disabled="sendCodeDisabled || !cellphoneValidate" type="primary" class="send-code-button" size="small" @click.stop="sendAuthCode">
                      <span v-if="sendCodeDisabled">{{$t('user.resend')}}({{count}}s)</span>
                      <span v-else>{{$t('user.sendCodes')}}</span>
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-row>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
    <div class="auth-button" v-if="!hasVerified"><el-button :disabled="!ruleFormDatas.cellphoneNumber || !authCode" type="primary" size="medium" @click="realNamePhoneNumber">{{$t("common.identification")}}</el-button></div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { locale } from '@/lib/utils/i18n'

export default {
  name: 'realNameAuthentication',
  data() {
    let validatePhoneNumber = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error(this.$t('user.wrongNumberFormat')))
        this.cellphoneValidate = false
      } else {
        this.cellphoneValidate = true
      }
    }
    return {
      sendCodeLoading: false,
      sendCodeDisabled: false,
      cellphoneValidate: false,
      count: 60,
      timer: null,
      authCode: '',
      ruleFormDatas: {
        cellphoneNumber: ''
      },
      phoneNumberRules: {
        cellphoneNumber: [{ validator: validatePhoneNumber, trigger: 'change' }]
      },
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      sendCodeInfo: 'user/sendCodeInfo',
      authCodeInfo: 'user/authCodeInfo',
      userRealname: 'user/realname'
    }),
    hasVerified() {
      return Boolean(this.userRealname)
    },
    verifiedPhoneNumber() {
      return this.userRealname
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
      this.sendCodeLoading = true
      let payload = {
        setRealNameInfo: true,
        cellphone: this.ruleFormDatas.cellphoneNumber
      }
      await this.verifyCellphoneOne(payload).catch(e =>
        this.$message.error(this.$t('user.sendingFrequent'))
      )
      this.sendCodeLoading = false
      if (this.sendCodeInfo === 'OK') {
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
    },
    async realNamePhoneNumber() {
      let payload = {
        cellphone: this.ruleFormDatas.cellphoneNumber,
        captcha: this.authCode,
        realname: true
      }
      this.isLoading = true
      await this.verifyCellphoneTwo(payload).catch()
      let authResultInfo = this.authCodeInfo
      if (authResultInfo === 'OK') {
        this.showMessage('success', this.$t('common.saveSuccess'))
      } else {
        this.showMessage('error', this.$t('user.verificationCodeError'))
      }
      this.isLoading = false
    },
    handleClose() {
      this.$emit('close')
    }
  },
}
</script>

<style lang="scss">
.real-name-auth{
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title{
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content{
    padding-top: 30px;
    max-width: 440px;
    .auth-status {
      color: red;
    }
    .icon-yanzhengma{
      color: rgb(255, 195, 0)
    }
    .send-auth {
      display: flex;
      .send-auth-code {
        flex: 1;
      }
      .send-auth-send-code {
        width: 116px;
        margin-left: 8px;
        .send-code-button {
          width: 100%;
        }
      }
    }
  }
  .real-name-status{
    margin-bottom: 0;
  }
  .auth-button{
    padding: 10px 0 50px 110px;
  }
}
</style>

