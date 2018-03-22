<template>
  <el-input class="link-type" :placeholder='editingKey' v-model='inputTypeValue' clearable></el-input>
</template>
<script>
export default {
  name: 'InputType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      inputTypeValue: this.originValue
    }
  }
}
</script>
<style>
.link-type .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  font-size: 16px;
  padding: 18px 0 0;
  border-radius: 0;
}
.link-type .el-input__suffix{
    top: 10px;
}
</style>
