<template>
  <el-dialog title="个人信息" :visible.sync="isDialogVisible" width="1018px" :before-close="handleClose">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>

</template>
<script>
export default {
  name: 'EditStudentDialog',
  props: {
    isDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
