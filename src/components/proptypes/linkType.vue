<template>
    <el-input placeholder='请输入内容' v-model='inputTypeValue' clearable></el-input>
</template>
<script>
export default {
  name: 'InputType',
  data() {
    return {
      inputTypeValue: ''
    }
  }
}
</script>

