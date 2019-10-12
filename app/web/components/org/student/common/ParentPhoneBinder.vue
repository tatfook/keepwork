<template>
  <div class="parent-phone-binder">
    <p class="parent-phone-binder-info"><span>(选填)</span>(家长手机号用于接收老师发送的评价报告等信息，请确保手机号畅通)</p>
    <div class="parent-phone-binder-item">
      <label for="parentPhone">家长手机号</label>
      <el-input id="parentPhone" size="medium" placeholder="请输入" v-model="parentPhone.phone"></el-input>
    </div>
    <div class="parent-phone-binder-item">
      <label for="parentPhone">验证码</label>
      <el-input id="parentPhone" size="medium" placeholder="请输入" v-model="parentPhone.verifCode">
        <span slot="suffix">发送验证码</span>
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParentPhoneBinder',
  data() {
    return {
      parentPhone: {
        phone: '',
        verifCode: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.parent-phone-binder {
  font-size: 14px;
  &-info {
    color: #2397f3;
    margin: 0 0 20px;
    span {
      color: #909399;
      margin-right: 16px;
    }
  }
  &-item {
    margin-top: 20px;
    label {
      display: inline-block;
      width: 70px;
      text-align: right;
    }
  }
  /deep/.el-input {
    display: inline-block;
    width: 280px;
    margin-left: 16px;
  }
  /deep/.el-input__suffix {
    line-height: 36px;
    right: 20px;
    font-size: 12px;
    color: #74a6c9;
    cursor: pointer;
  }
}
</style>
