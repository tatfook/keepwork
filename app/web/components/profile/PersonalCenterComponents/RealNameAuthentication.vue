<template>
  <div class="real-name-auth">
    <div class="real-name-auth-title">{{$t('common.realNameAuthentication')}}</div>
    <div class="real-name-auth-content">
      <el-form v-if="isRealNamed" :label-width="localeLableWidth">
        <el-form-item :label='$t("user.certificationStatus")' class="real-name-status">
          <span>{{$t('user.certified')}}<i class="iconfont icon-yanzhengma"></i></span>
        </el-form-item>
        <el-row>
          <el-form-item :label='$t("user.certifiedPhoneNumber")'>
            <span>{{userRealname}}</span>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button class="real-name-auth-button" v-else type="primary" @click="showRealName">马上认证</el-button>
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
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
      userRealname: 'user/realname'
    }),
    localeLableWidth() {
      return locale === 'en-US' ? '190px' : '110px'
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName'
    }),
    showRealName() {
      this.toggleRealName(true)
    },
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.real-name-auth {
  background: #fff;
  border: 1px solid #e8e8e8;
  &-title {
    font-size: 16px;
    color: #303133;
    padding: 23px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-content {
    padding-top: 30px;
    max-width: 440px;
    .icon-yanzhengma {
      color: rgb(255, 195, 0);
    }
  }
  &-button {
    margin: 0 16px 32px;
  }
  .real-name-status {
    margin-bottom: 0;
  }
}
</style>
