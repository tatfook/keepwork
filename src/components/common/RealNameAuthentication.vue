<template>
    <el-container class="real-name-setting" v-loading="loading">
        <el-header class="real-name-setting-header">
            <h3>实名认证</h3>
        </el-header>
        <el-row class="real-name-setting-content">
            <el-form label-width="100px">
                <el-form-item label="认证状态:">
                    <span v-if="hasVerified">已认证</span>
                    <span v-else class="auth-status">未认证</span>
                </el-form-item>
                <el-row v-if="hasVerified">
                    <el-form-item label="认证手机:">
                        <span>18665835727</span>
                    </el-form-item>
                </el-row>
                <el-row v-else>
                    <el-form-item label="认证手机:">
                        <el-input size="small" v-model="realNamePhoneNum"></el-input>
                    </el-form-item>
                    <el-form-item label="短信验证码:">
                        <el-col :span="16">
                            <el-input size="small" v-model="authCode"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button type="primary" size="small" class="send-auth-code" @click.stop="sendAuthCode">发送验证码</el-button>
                        </el-col>
                    </el-form-item>
                </el-row>                    
            </el-form>
        </el-row>
    </el-container>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'realNameAuthentication',
  data() {
    return {
      loading: false,
      hasVerified: false,
      realNamePhoneNum: 18665835727,
      authCode: ''
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({
      verifyCellphoneOne: 'user/verifyCellphoneOne'
    }),
    sendAuthCode() {
      let payload = { bind: true, cellphone: this.realNamePhoneNum }
      this.verifyCellphoneOne(payload)
    }
  }
}
</script>
<style lang="scss" scoped>
.real-name-setting {
  &-header {
    border-bottom: 3px solid #cdd4db;
  }
  &-content {
    width: 70%;
    padding: 40px 28px 0 20px;
    .auth-status {
      color: red;
    }
    .send-auth-code {
      margin-left: 8px;
    }
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



