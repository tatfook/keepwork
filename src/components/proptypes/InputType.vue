<template>
  <el-input class="input-type" :placeholder='placeholder' v-model='inputTypeValue' clearable></el-input>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'InputType',
  mixins: [protypesBaseMixin]
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
