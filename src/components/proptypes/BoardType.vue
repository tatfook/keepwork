<template>
  <el-button plain type='primary' size='mini' @click.native='openBoard'>打开绘图板</el-button>
</template>
<script>
export default {
  name: 'MenuType',
  data() {
    return {
      inputTypeValue: ''
    }
  },
  methods: {
    openBoard() {
      console.log('openBoard')
    }
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
