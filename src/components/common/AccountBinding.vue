<template>
  <div class="account-binding">
    <el-form class="account-binding-form" label-width="140px">
      <el-form-item label="邮箱绑定:">
        <el-input class="account-binding-form-item-content" size='small'></el-input>
        <el-button size="small" class="account-binding-form-item-button">绑定</el-button>
      </el-form-item>
      <el-form-item label="手机绑定:">
        <el-input class="account-binding-form-item-content" size='small'></el-input>
        <el-button size="small" class="account-binding-form-item-button">绑定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'AccountBinding'
}
</script>
<style lang="scss">
.account-binding {
  padding: 55px 15px 15px 56px;
  &-form {
    &-item-content {
      width: 180px;
      padding-right: 56px;
    }
    &-item-button {
      color: #1989fa;
      border-color: #1989fa;
    }
    .el-form-item__label {
      padding-right: 56px;
      color: #333;
    }
  }
}
</style>
