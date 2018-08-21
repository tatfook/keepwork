<template>
  <el-dialog v-loading='loading' title="" v-if='show' :visible.sync="show" class="login-dialog" :class="{'force-login': forceLogin}" :before-close="handleClose">
    <div v-show="isLoginForm">
      <el-form class="login-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" :placeholder="$t('common.loginAccount')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" :placeholder="$t('common.password')" @keyup.enter.native="login('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-dialog-form-operate"><a href="/wiki/find_pwd">{{$t('common.forgetPassword')}}?</a></div>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login('ruleForm')">{{$t('common.login')}}</el-button>
        </el-form-item>
        <div class="login-dialog-form-operate_signIn">{{$t('common.noAccount')}}<a href="#" @click.stop.prevent="register">{{$t('common.register')}}</a></div>
        <div class="login-dialog-form-three-login">
          <div class="title">
            <span>{{$t('common.usingFollowingAccount')}}</span>
          </div>
          <a @click="authorizedToLogin('qq')">
            <img src="@/assets/img/wiki_qq.png" alt="">
          </a>
          <a @click="authorizedToLogin('weixin')">
            <img src="@/assets/img/wiki_wechat.png" alt="">
          </a>
          <a @click="authorizedToLogin('xinlangweibo')">
            <img src="@/assets/img/wiki_sina_weibo.png" alt="">
          </a>
          <a @click="authorizedToLogin('github')">
            <img src="@/assets/img/wiki_github_logo.png" alt="">
          </a>
        </div>
      </el-form>
    </div>
    <div v-show="isRegisterForm">
        <register-dialog @close="handleClose"></register-dialog>
        <div><span @click="hasAccountToLogin" class="hasAccount">{{$t('common.alreadyOwnAccount')}}</span></div>
        <div><span @click="backHome" class="hasAccount">{{$t('editor.backHomePage')}}</span></div>
    </div>
    <div v-show="isPerfectRegisterInfo">
      <perfect-register-info @close="handleClose" :userThreeService="userThreeService"></perfect-register-info>
    </div>
  </el-dialog>


</template>
<script>
import { mapActions } from 'vuex'
import PerfectRegisterInfo from '@/components/common/PerfectRegisterInfo'
import RegisterDialog from '@/components/common/RegisterDialog'

export default {
  name: 'LoginDialog',
  props: {
    show: Boolean,
    forceLogin: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      // envIsForDevelopment: process.env.NODE_ENV === 'development',
      loading: false,
      isLoginForm: true,
      isRegisterForm: false,
      isPerfectRegisterInfo: false,
      nowOrigin: document.location.origin,
      userThreeService: {},
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('common.inputUsername'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('common.inputPassword'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      userThirdLogin: 'user/thirdLogin'
    }),
    handleClose() {
      !this.forceLogin && this.$emit('close')
    },
    hasAccountToLogin(){
      this.isLoginForm = true
      this.isRegisterForm = false
      this.isPerfectRegisterInfo = false
    },
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }
          this.loading = true
          let info = await this.userLogin(payload).catch(e => {
            console.error(e)
            this.loading = false
          })
          this.loading = false
          if (info.error.id === 0) {
            this.$emit('close')
            window.location.reload()
          } else if (info.error.message === '用户不存在') {
            this.showMessage('error', this.$t('common.usernameNotExist'))
          } else if (info.error.message === '密码错误') {
            this.showMessage('error', this.$t('common.wrongPassword'))
          }
        } else {
          return false
        }
      })
    },
    register(){
      this.isLoginForm = false
      this.isRegisterForm = true
      this.isPerfectRegisterInfo = false
    },
    authorizedToLogin(provider) {
      this.$auth
        .authenticate(provider)
        .then(async result => {
          console.log('1',result)
          this.handleLoginResult(result)
        })
        .catch(async result => {
          console.log('2',result)
          this.handleLoginResult(result)
        })
    },
    async handleLoginResult(result){
      if (result && result.data && result.data.error == 0) {
        if (result.data.token == "token"){
          // 用户未绑定  跳完善注册信息页
          this.isLoginForm = false
          this.isRegisterForm = false
          this.isPerfectRegisterInfo = true
          this.userThreeService = result.data.data
          // this.handleClose()
        } else {
          // 登录成功  进行页面跳转
          let token = result.data.token
          let userinfo = result.data.data
          this.userThirdLogin({token, userinfo})
          this.handleClose()
          this.showMessage('success', this.$t('common.loginSuccess'))
        }
      } else {
        this.showMessage('error', this.$t('common.logonFailed'))
      }
    },
    backHome(){
      window.location.href=this.nowOrigin
    }
  },
  components: {
    RegisterDialog,
    PerfectRegisterInfo
  }
}
</script>

<style lang="scss">
.login-dialog {
  .hasAccount{
    margin-left: 70px;
    border-bottom: 1px solid #409eff;
    cursor: pointer;
  }
  &.force-login {
    .el-dialog__header {
      .el-dialog__headerbtn {
        display: none;
      }
    }
  }
  .el-dialog {
    .el-dialog__header{
      padding: 0;
    }
    width: 478px;
    padding: 40px 0;
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
      a {
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
        margin: 35px 0;
        padding: 20px 0 35px;
        text-align: center;
        position: relative;
        span {
          background: #fff;
          position: relative;
          z-index: 2;
          padding: 0 4px;
        }
        &::after {
          content: '';
          height: 2px;
          width: 100%;
          position: absolute;
          right: 0;
          top: 40%;
          background: #d6e6f4;
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
