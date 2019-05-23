<template>
  <div>
    <el-dialog v-loading="isLoading" class="complain-dialog" title="投诉举报" v-if="userIsLogined && isComplainDialogVisible" visible width="680" :before-close="closeDialog">
      <el-form label-position="top" :model="feedbackData">
        <el-form-item label="您举报的网站是：">
          <el-input disabled v-model="feedbackData.url"></el-input>
        </el-form-item>
        <el-form-item label="举报类型">
          <el-radio-group v-model="feedbackData.type">
            <el-radio :label="1">假冒网站</el-radio>
            <el-radio :label="2">传播病毒</el-radio>
            <el-radio :label="3">反动</el-radio>
            <el-radio :label="4">色情</el-radio>
            <el-radio :label="5">暴力</el-radio>
            <el-radio :label="0">其它</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="举报说明（可选）：">
          <el-input type="textarea" resize="none" v-model="feedbackData.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :disabled="!isFeedbackDataValid" @click="submitFeedback">确定</el-button>
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
      console.log(this.feedbackData)
      this.isLoading = true
      await this.userCreateFeedback(this.feedbackData)
        .then(res => {
          console.log(res)
          this.$message({ type: 'success', message: '举报成功' })
          this.closeDialog()
        })
        .catch(err => {
          console.log(err)
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
    isComplainDialogVisible() {
      if (this.isComplainDialogVisible && !this.userIsLogined) {
        this.isShowLoginDialog = true
      }
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
  /deep/.el-dialog__footer {
    padding: 0 24px 36px;
  }
}
</style>
