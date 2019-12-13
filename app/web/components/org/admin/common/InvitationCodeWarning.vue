<template>
  <el-dialog custom-class="invitation-code-warning" :visible.sync="isDialogVisible" width="496px" center :before-close="closeDialog">
    <div v-if="type=='disable'" class="disable-type">
      <p>不能生成正式邀请码。</p>
      <p>请将未使用的正式邀请码设为无效，或联系客服提高上限：</p>
      <p><a href="mailto:support@paraengine.com" class="link">support@paraengine.com</a></p>
    </div>
    <div v-if="type=='notEnough'" class="not-enough-type">
      <p>该类型邀请码的生成数量不能超过剩余可生成数（{{remainder}}个）。</p>
      <p>如需生成更多数量，请将未使用的邀请码设为无效，或联系客服提高上限： <a href="mailto:support@paraengine.com" class="link">support@paraengine.com</a></p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'InvitationCodeWarning',
  props: {
    type: {
      validator: function(value) {
        return ['disable', 'notEnough'].indexOf(value) !== -1
      },
    },
    isDialogVisible: Boolean,
    remainder: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.invitation-code-warning {
  .link {
    color: #2397f3;
    text-decoration: none;
  }
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 16px;
    color: #303133;
  }
  .disable-type {
    text-align: center;
  }
  .el-button--primary {
    width: 120px;
    height: 36px;
    line-height: 36px;
    padding: 0;
    margin-bottom: 20px;
  }
}
</style>
