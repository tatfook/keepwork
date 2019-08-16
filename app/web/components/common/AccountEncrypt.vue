<template>
  <el-dialog class="account-encrypt" :visible="isShowAccountEncrypt" width="352px" :before-close="handleClose" append-to-body>
    <div class="account-encrypt-title">账号安全</div>
    <div class="account-encrypt-title">您的账号尚未设定安全信息，建议至少设定其中一项</div>
    <div class="account-encrypt-tabs">
      <div v-for="(bindItem, index) in bindTypes" :key="index" class="account-encrypt-tabs-item" :class="{'is-active':activeTypeId == bindItem.id}" @click="setActiveType(bindItem)">{{bindItem.text}}</div>
    </div>
    <el-form v-if="isFormShow" ref="bindFormRef" :rules="bindRules" :model="bindData">
      <el-form-item key="cellphone" prop="cellphone" v-show="activeTypeId == 0">
        <el-input :placeholder="activeTypeItem.placeholder" v-model="bindData.cellphone"></el-input>
      </el-form-item>
      <el-form-item key="email" v-show="activeTypeId == 1" prop="email">
        <el-input :placeholder="activeTypeItem.placeholder" v-model="bindData.email"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input :placeholder="activeTypeItem.codePlaceholder" v-model="bindData.captcha">
          <template slot="append">
            <get-captcha :type="activeTypeItem.type" :bindValue="bindValue" :isBindDataValid="isBindDataValid" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="account-encrypt-operate">
        <el-button size="medium" @click="handleClose">取消</el-button>
        <verify-captcha :type="activeTypeItem.type" :bindData="bindData" :bindFormRef="bindFormRef" @close="handleClose" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import GetCaptcha from '../common/GetCaptcha'
import VerifyCaptcha from '../common/VerifyCaptcha'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'AccountEncrypt',
  props: {
    refreshAfterFinish: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.activeTypeItem = this.bindTypes[0]
    this.isFormShow = true
    let self = this
    this.$nextTick(() => {
      this.bindFormRef = self.$refs['bindFormRef']
      console.log(this.bindFormRef)
    })
  },
  data() {
    let validatePhoneNumber = async (rule, value, callback) => {
      if (this.activeTypeId != 0) {
        return callback()
      }
      if (!/^1\d{10}$/.test(value)) {
        this.isPhoneValid = false
        callback(new Error(this.$t('user.wrongNumberFormat')))
      } else {
        let result = await this.userGetByCellphone({ cellphone: value })
        if (result) {
          this.isPhoneValid = false
          return callback(
            new Error(this.$t('user.cellphoneHasBeenBoundToOtherAccounts'))
          )
        }
        this.isPhoneValid = true
        callback()
      }
    }
    let validateEmail = async (rule, value, callback) => {
      if (this.activeTypeId != 1) {
        return callback()
      }
      if (
        !value ||
        !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
          value
        )
      ) {
        this.isEmailValid = false
        callback(new Error(this.$t('user.wrongEmailFormat')))
      } else {
        let result = await this.userGetByEmail({ email: value })
        if (result) {
          this.isEmailValid = false
          return callback(
            new Error(this.$t('user.emailHasBeenBoundToOtherAccounts'))
          )
        }
        this.isEmailValid = true
        callback()
      }
    }
    return {
      isFormShow: false,
      bindTypes: [
        {
          id: 0,
          type: 'phone',
          text: '手机号码',
          placeholder: '请输入手机号码',
          codePlaceholder: '请输入手机验证码'
        },
        {
          id: 1,
          type: 'email',
          text: 'email',
          placeholder: '请输入email',
          codePlaceholder: '请输入email验证码'
        }
      ],
      isPhoneValid: false,
      isEmailValid: false,
      activeTypeItem: {},
      bindData: {
        cellphone: '',
        email: '',
        captcha: ''
      },
      bindRules: {
        cellphone: [{ validator: validatePhoneNumber, trigger: 'change' }],
        email: [{ validator: validateEmail, trigger: 'change' }],
        captcha: [
          {
            required: true,
            message: this.$t('user.inputVerificationCode'),
            trigger: 'blur'
          }
        ]
      },
      bindFormRef: undefined
    }
  },
  computed: {
    ...mapGetters({
      isShowAccountEncrypt: 'user/isShowAccountEncrypt'
    }),
    activeTypeId() {
      return this.activeTypeItem.id
    },
    bindValue() {
      let { cellphone, email } = this.bindData
      return this.activeTypeId == 0 ? cellphone : email
    },
    isBindDataValid() {
      return this.activeTypeId == 0 ? this.isPhoneValid : this.isEmailValid
    }
  },
  methods: {
    ...mapActions({
      userGetByEmail: 'user/getByEmail',
      userGetByCellphone: 'user/getByCellphone',
      toggleAccountEncrypt: 'user/toggleAccountEncrypt'
    }),
    setActiveType(item) {
      this.bindFormRef && this.bindFormRef.resetFields()
      this.isPhoneValid = false
      this.isEmailValid = false
      this.isFormShow = false
      this.activeTypeItem = item
      this.isFormShow = true
    },
    handleClose() {
      this.toggleAccountEncrypt(false)
      this.refreshAfterFinish && window.location.reload()
    }
  },
  components: {
    GetCaptcha,
    VerifyCaptcha
  }
}
</script>
<style lang="scss" scoped>
.account-encrypt {
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
  &-tabs {
    margin-bottom: 16px;
    &-item {
      font-size: 16px;
      display: inline-block;
      padding: 4px 8px;
      cursor: pointer;
      &.is-active {
        box-shadow: 0px 2px 0px 0px #2397f3;
        color: #2397f3;
      }
    }
  }
  &-operate {
    text-align: right;
    margin: 28px 0 0;
    padding-bottom: 40px;
    .el-button {
      width: 100px;
      height: 40px;
      padding: 0;
      line-height: 40px;
      font-size: 16px;
    }
  }
  /deep/ .el-input-group__append {
    padding: 0;
    width: 104px;
  }
}
</style>
