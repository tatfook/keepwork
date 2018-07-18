<template>
      <el-dialog title="" v-if='show' :visible.sync="show" class="login-dialog" :before-close="handleClose">
        <el-form class="login-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
           <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <div class="login-dialog-form-operate"><a href="/wiki/find_pwd">{{$t('common.forgetPassword')}}?</a></div>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="login('ruleForm')">{{$t('common.login')}}</el-button>
          </el-form-item>
          <div class="login-dialog-form-operate_signIn">{{$t('common.noAccount')}}?<a href="/wiki/join">{{$t('common.signIn')}}</a></div>
          <div class="login-dialog-form-three-login">
            <div class="title">{{$t('common.usingFollowingAccount')}}</div>
            <a>
              <img src="@/assets/img/wiki_qq.png" alt="">
            </a>
            <a>
              <img src="@/assets/img/wiki_wechat.png" alt="">
            </a>
            <a>
              <img src="@/assets/img/wiki_sina_weibo.png" alt="">
            </a>
            <a>
              <img src="@/assets/img/wiki_github_logo.png" alt="">
            </a>
          </div>
        </el-form>
      </el-dialog>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginDialog',
  props: {
    show: Boolean
  },
  data(){
    return{
       ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('common.inputUsername'), trigger: 'blur' }
        ],
        password: [{ required: true, message: this.$t('common.inputPassword'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions({
      userLogin: 'user/login',
    }),
    handleClose(){
      this.$emit('close')
    },
    async login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }
          let info = await this.userLogin(payload)
          if (info.error.id === 0) {
            this.$emit('close')
          } else if (info.error.message === '用户不存在') {
            this.$message({
              message: this.$t('common.usernameNotExist'),
              type:'error',
              showClose: true
            })
          }else if (info.error.message === '密码错误'){
            this.$message({
              message:  this.$t('common.wrongPassword'),
              type:'error',
              showClose: true
            })
          }
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss">
.login-dialog {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog {
    width: 478px;
    height: 580px;
    padding: 40px 0 60px 0;
  }
  &-form {
    width: 68%;
    margin: 0 auto;
    .el-form-item__content {
      .el-input__inner {
        &:focus {
          box-shadow: 1px 1px 3px #daeaf6, -1px -1px 3px #daeaf6;
        }
      }
    }
    &-operate {
      text-align: right;
      cursor: pointer;
      a{
        text-decoration: none;
        color: inherit;
      }
    }
    &-operate_signIn {
      text-align: right;
      a {
        display: inline-block;
        text-decoration: none;
        height: 20px;
        border-bottom: 1px solid #3977ad;
        color: #286090;
        cursor: pointer;
      }
    }
    &-three-login {
      a {
        display: inline-block;
        width: 24%;
        text-align: center;
        img {
          cursor: pointer;
        }
      }
      .title {
        margin: 40px 0;
        padding: 20px 0 35px;
        text-align: center;
        position: relative;
        &::before {
          content: '';
          height: 2px;
          width: 16%;
          position: absolute;
          right: 0;
          top: 40%;
          background-color: #d6e6f4;
        }
        &::after {
          content: '';
          height: 2px;
          width: 16%;
          position: absolute;
          left: 0;
          top: 40%;
          background-color: #d6e6f4;
        }
      }
    }
    .login-btn {
      width: 100%;
      margin: 20px 0;
      height: 44px;
      padding: 10px 16px;
      font-size: 18px;
      border-radius: 6px;
    }
  }
}
</style>

