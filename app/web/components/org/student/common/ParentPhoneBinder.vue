<template>
  <div class="parent-phone-binder">
    <p v-if="isInfoInTopShow" class="parent-phone-binder-info"><span>(选填)</span>({{staticInfo}})</p>
    <div class="parent-phone-binder-item">
      <label :style="{width: labelWidth}" for="parentPhone">{{phoneLabel}}</label>
      <div v-if="isEditable" class="parent-phone-binder-item-content">
        <el-input id="parentPhone" size="medium" placeholder="请输入" v-model.trim="parentPhone.phone"></el-input>
        <p v-if="isInfoAfterInputShow" class="parent-phone-binder-item-info">{{staticInfo}}</p>
        <div class="el-form-item__error">{{phoneErrorMsg}}</div>
      </div>
      <span class="parent-phone-binder-item-phone" v-else>{{oldPhone}}</span>
    </div>
    <div class="parent-phone-binder-item">
      <label :style="{width: labelWidth}" for="parentPhone">验证码</label>
      <div class="parent-phone-binder-item-content">
        <el-input id="parentPhone" size="medium" placeholder="请输入" v-model.trim="parentPhone.verifCode">
          <span v-loading="isLoading" slot="suffix" :class="{'disabled': !isPhoneValid || isLoading}" @click="sendCode">发送验证码</span>
        </el-input>
        <div class="el-form-item__error">{{codeErrorMsg}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ParentPhoneBinder',
  props: {
    oldPhone: String,
    phoneLabel: {
      type: String,
      default: '家长手机号'
    },
    isInfoInTopShow: {
      type: Boolean,
      default: true
    },
    isInfoAfterInputShow: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.oldPhone) {
      this.parentPhone.phone = this.oldPhone
      this.isEditable = false
    }
  },
  data() {
    return {
      isLoading: false,
      staticInfo:
        '家长手机号用于接收老师发送的评价报告等信息，请确保手机号畅通',
      isEditable: true,
      parentPhone: {
        phone: '',
        verifCode: ''
      }
    }
  },
  computed: {
    labelWidth() {
      return this.phoneLabel.length + 'em'
    },
    isPhoneValid() {
      return /^1\d{10}$/.test(this.parentPhone.phone)
    },
    phoneErrorMsg() {
      return this.parentPhone.phone
        ? this.isPhoneValid
          ? ''
          : '请输入正确的手机号'
        : ''
    },
    codeErrorMsg() {
      return this.isPhoneValid
        ? this.parentPhone.verifCode
          ? ''
          : '请输入验证码'
        : ''
    },
    isPhoneDataValid() {
      return Boolean(!this.phoneErrorMsg && !this.codeErrorMsg)
    }
  },
  methods: {
    ...mapActions({
      orgSendSms: 'org/sendSms'
    }),
    async sendCode() {
      this.isLoading = true
      try {
        await this.orgSendSms({ cellphone: this.parentPhone.phone })
        this.$message({ type: 'success', message: '短信发送成功。' })
      } catch (error) {
        this.$message({
          type: 'error',
          message: _.get(error, 'response.data.message', '短信发送失败')
        })
      }
      this.isLoading = false
    }
  },
  watch: {
    oldPhone(val) {
      if (this.oldPhone) this.isEditable = false
      else this.isEditable = true
    }
  }
}
</script>
<style lang="scss" scoped>
.parent-phone-binder {
  font-size: 14px;
  &-info {
    color: #2397f3;
    margin: 0 0 20px;
    span {
      color: #909399;
      margin-right: 16px;
    }
  }
  &-item {
    margin-bottom: 20px;
    label {
      display: inline-block;
      vertical-align: top;
      position: relative;
      top: 8px;
      text-align: right;
    }
    &-phone {
      margin-left: 24px;
      line-height: 36px;
    }
    &-content {
      margin-left: 16px;
      display: inline-block;
      position: relative;
    }
    &-info {
      font-size: 12px;
      color: #999;
      margin: 16px 0 4px;
    }
  }
  /deep/.el-input {
    width: 280px;
  }
  /deep/.el-input__suffix {
    line-height: 36px;
    right: 20px;
    font-size: 12px;
    color: #74a6c9;
    cursor: pointer;
    &:hover {
      color: #2397f3;
    }
    & .disabled {
      cursor: not-allowed;
      color: #dadada;
    }
  }
}
</style>
