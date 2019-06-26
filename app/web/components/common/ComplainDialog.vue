<template>
  <div>
    <el-dialog v-loading="isLoading" class="complain-dialog" :title="$t('common.complaintReporting')" v-if="userIsLogined && isComplainDialogVisible" visible width="680px" :before-close="closeDialog">
      <el-form label-position="top" :model="feedbackData">
        <el-form-item :label="$t('common.websitesYouReport')">
          <el-input disabled v-model="feedbackData.url"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.reportType')">
          <el-radio-group v-model="feedbackData.type">
            <el-radio :label="1">{{$t('common.fakeWebsite')}}</el-radio>
            <el-radio :label="2">{{$t('common.transmitVirus')}}</el-radio>
            <el-radio :label="3">{{$t('common.reaction')}}</el-radio>
            <el-radio :label="4">{{$t('common.eroticism')}}</el-radio>
            <el-radio :label="5">{{$t('common.violence')}}</el-radio>
            <el-radio :label="0">{{$t('common.other')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.reportDesc')">
          <el-input :placeholder="$t('common.reportDetail')" type="textarea" resize="none" v-model="feedbackData.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{$t('common.Cancel')}}</el-button>
        <el-button type="primary" :disabled="!isFeedbackDataValid" @click="submitFeedback">{{$t('common.submit')}}</el-button>
      </span>
    </el-dialog>
    <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
  </div>
</template>

<script>
import LoginDialog from './LoginDialog'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ComplainDialog',
  props: {
    isComplainDialogVisible: {
      required: true,
      type: Boolean
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      userUsername: 'user/username',
      userIsLogined: 'user/isLogined'
    }),
    isFeedbackDataValid() {
      return !_.isUndefined(this.feedbackData.type)
    }
  },
  data() {
    return {
      isShowLoginDialog: false,
      isLoading: false,
      feedbackData: {
        url: window.location.href,
        type: undefined,
        description: ''
      }
    }
  },
  methods: {
    ...mapActions({
      userCreateFeedback: 'user/createFeedback'
    }),
    closeDialog() {
      this.$emit('close')
    },
    async submitFeedback() {
      this.isLoading = true
      await this.userCreateFeedback(this.feedbackData)
        .then(res => {
          this.$message({ type: 'success', message: '举报成功' })
          this.closeDialog()
        })
        .catch(err => {
          this.$message({ type: 'error', message: '举报失败' })
        })
      this.isLoading = false
    },
    handleLoginDialogClose() {
      this.isShowLoginDialog = false
      this.closeDialog()
    }
  },
  components: {
    LoginDialog
  },
  watch: {
    isComplainDialogVisible(isVisible) {
      if (isVisible && !this.userIsLogined) {
        this.isShowLoginDialog = true
      }
      if (isVisible && this.userIsLogined) {
        _hmt.push([
          '_setUserTag',
          '7562',
          `username: ${userUsername}, url: ${window.location.href}`
        ])
      }
    },
    $route() {
      this.feedbackData.url = window.location.href
    }
  }
}
</script>
<style lang="scss" scoped>
.complain-dialog {
  /deep/.el-dialog__header {
    padding: 32px 24px 0;
  }
  /deep/.el-dialog__title {
    font-size: 20px;
    font-weight: bold;
    color: #222;
  }
  /deep/.el-dialog__body {
    padding: 30px 24px 0;
  }
  /deep/.el-form-item__label {
    color: #303133;
    line-height: inherit;
    margin-bottom: 4px;
  }
  /deep/.el-form-item__content {
    line-height: inherit;
  }
  /deep/.el-textarea__inner {
    height: 87px;
  }
  /deep/.el-dialog__footer {
    padding: 0 24px 36px;
  }
}
</style>
