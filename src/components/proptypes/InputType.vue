<template>
    <el-input class="input-type" :placeholder='editingKey' v-model='inputTypeValue' clearable></el-input>
</template>
<script>
export default {
  name: 'InputType',
  props: {
    editingKey: String
  },
  data() {
    return {
      inputTypeValue: ''
    }
  }
}
</script>
<style>
.input-type .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  font-size: 16px;
  padding: 18px 0 0;
  border-radius: 0;
}
</style>
