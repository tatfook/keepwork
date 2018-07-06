<template>
  <el-form class="change-pwd-form" :rules='pwdRules' ref="resetPwdForm" :model="pwdFormDatas" label-width="96px">
    <el-form-item label="旧密码:" prop='oldpassword'>
      <el-input v-model="pwdFormDatas.oldpassword" size="small"></el-input>
    </el-form-item>
    <el-form-item label="新密码:" prop='newpassword'>
      <el-input v-model="pwdFormDatas.newpassword" size="small"></el-input>
    </el-form-item>
    <el-form-item label="确定新密码:" prop='reNewpassword'>
      <el-input v-model="pwdFormDatas.reNewpassword" size="small"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'ChangePwd',
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.pwdFormDatas.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pwdFormDatas: {
        oldpassword: '',
        newpassword: '',
        reNewpassword: ''
      },
      pwdRules: {
        oldpassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码最少6位',
            trigger: 'blur'
          }
        ],
        newpassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码最少6位',
            trigger: 'blur'
          }
        ],
        reNewpassword: [
          {
            required: true,
            message: '请再次输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码最少6位',
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
<style lang="scss">
.change-pwd-form {
  .el-form-item {
    margin-bottom: 30px;
  }
  .el-form-item__label {
    padding-right: 22px;
  }
  .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
}
</style>
