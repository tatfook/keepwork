<template>
  <div class="change-password">
    <div class="change-password-title">{{$t('profile.changePassword')}}</div>
    <div class="change-password-content">
      <el-form class="change-pwd-form" :rules='pwdRules' ref="resetPwdForm" :model="pwdFormDatas" label-width="130px">
        <el-form-item :label="$t('user.oldPwd')" prop='oldpassword'>
          <el-input type="password" v-model="pwdFormDatas.oldpassword" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.newPwd')" prop='newpassword'>
          <el-input :type='visibleNewPwd ? "text": "password"' v-model="pwdFormDatas.newpassword" size="small">
            <i slot="suffix" :class="['iconfont',visibleNewPwd ? 'icon-browse_fill' : 'icon-Close_eyes' ]" @click="visibleNewPwd = !visibleNewPwd"></i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('user.reNewPwd')" prop='reNewpassword'>
          <el-input :type='visibleConfirmNewPwd ? "text": "password"'  v-model="pwdFormDatas.reNewpassword" size="small">
            <i slot="suffix" :class="['iconfont',visibleConfirmNewPwd ? 'icon-browse_fill' : 'icon-Close_eyes' ]" @click="visibleConfirmNewPwd = !visibleConfirmNewPwd"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePassword" class="change-pwd-form-confirm-button">{{$t('common.Sure')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ChangePassword',
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.pwdFormDatas.newpassword) {
        callback(new Error(`${this.$t('user.twoPwdInconsistent')}`))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      visibleNewPwd: false,
      visibleConfirmNewPwd: false,
      pwdFormDatas: {
        oldpassword: '',
        newpassword: '',
        reNewpassword: ''
      },
      pwdRules: {
        oldpassword: [
          {
            required: true,
            message: this.$t('user.oldPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          }
        ],
        newpassword: [
          {
            required: true,
            message: this.$t('user.newPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          }
        ],
        reNewpassword: [
          {
            required: true,
            message: this.$t('user.reNewPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      userChangePwd: 'user/changePwd'
    }),
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async sendPwdToBack() {
      this.loading = true
      let result = await this.userChangePwd({
        newpassword: this.pwdFormDatas.newpassword,
        oldpassword: this.pwdFormDatas.oldpassword
      })
      if (result === true) {
        this.showMessage('success', this.$t('common.saveSuccess'))
      } else {
        this.showMessage('error', this.$t('user.pwdIncorrect'))
      }
      this.pwdFormDatas = {}
      this.loading = false
    },
    async savePassword() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          this.sendPwdToBack()
        }
      })
    },
    resetDatas() {
      this.$refs.resetPwdForm.resetFields()
    },
  },
}
</script>
<style lang="scss">
.change-password{
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title{
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content{
    padding-top: 20px;
    max-width: 490px;
    .change-pwd-form{
      .icon-browse_fill{
        cursor: pointer;
      }
    }
  }
}
</style>


