<template>
  <el-dialog :visible="isChangeDialogVisible" width="388px" custom-class="change-password-dialog" title="修改密码" :before-close="closeDialog">
    <p class="normal-text">将</p>
    <p class="info-text">姓名：{{changingMember.realname}}</p>
    <p class="info-text">账号：{{changingMember.memberName}}</p>
    <p class="normal-text">的登录密码修改为：</p>
    <el-input v-model.trim="newPwd" placeholder="请输入新密码"></el-input>
    <span slot="footer" class="change-password-dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button :disabled="!isPwdValid" type="primary" @click="changePwd">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ChangePasswordDialog',
  props: {
    isChangeDialogVisible: Boolean,
    changingMember: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newPwd: ''
    }
  },
  computed: {
    isPwdValid() {
      let pwdLen = this.newPwd.length
      return pwdLen >= 6 && pwdLen <= 24
    }
  },
  methods: {
    ...mapActions({
      orgChangePwd: 'org/changePwd'
    }),
    closeDialog() {
      this.$emit('close')
    },
    async changePwd() {
      if (!this.isPwdValid) {
        this.$message({ type: 'error', message: '密码至少6位，至多24位' })
        return
      }
      let { classId, memberId } = this.changingMember
      await this.orgChangePwd({
        classId,
        memberId,
        password: this.newPwd
      })
        .then(() => {
          this.$message({ type: 'success', message: '密码修改成功' })
          this.closeDialog()
        })
        .catch(err => {
          this.$message({ type: 'error', message: '修改失败，请重试' })
          console.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.change-password-dialog {
  /deep/.el-dialog__title {
    font-weight: bold;
  }
  /deep/.el-dialog__body {
    padding: 24px;
  }
  p {
    margin: 8px 0;
    color: #333;
  }
  .info-text {
    color: #777;
  }
  .el-input {
    margin-top: 8px;
  }
  /deep/.el-dialog__footer {
    padding-bottom: 32px;
  }
  .el-button {
    width: 100px;
    padding: 0;
    height: 36px;
    line-height: 36px;
  }
}
</style>
