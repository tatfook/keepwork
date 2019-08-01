<template>
  <div class="new-form">
    <div class="new-form-header">表单管理</div>
    <div class="new-form-content">
      <div class="new-form-info">请选择表单模板</div>
      <form-templates class="new-form-templates" />
    </div>
  </div>
</template>
<script>
import FormTemplates from './common/FormTemplates'
export default {
  name: 'NewForm',
  components: {
    FormTemplates
  }
}
</script>
<style lang="scss" scoped>
.new-form {
  background-color: #fff;
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
  }
  &-content {
    padding: 16px 24px;
  }
  &-info {
    font-size: 14px;
    color: #909399;
    margin-bottom: 16px;
  }
}
</style>
