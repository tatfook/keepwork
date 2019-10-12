<template>
  <div class="parent-phone-modifier">
    <div class="parent-phone-modifier-header">
      <template v-if="step === 1">第一步：验证身份</template>
      <template v-if="step === 2">第二步：输入新手机号</template>
    </div>
    <div class="parent-phone-modifier-main">
      <parent-phone-binder class="parent-phone-modifier-binder" v-if="step==1" oldPhone="18012345678" phoneLabel="原手机号" :isInfoInTopShow="false"></parent-phone-binder>
      <parent-phone-binder class="parent-phone-modifier-binder" v-if="step==2" phoneLabel="新手机号" :isInfoAfterInputShow="true" :isInfoInTopShow="false"></parent-phone-binder>
    </div>
    <div class="parent-phone-modifier-footer">
      <el-button size="medium">取消</el-button>
      <el-button v-if="step == 1" size="medium" type="primary" @click="toNext">下一步</el-button>
      <el-button v-else size="medium" type="primary" @click="modifyPhone">确定</el-button>
    </div>
  </div>
</template>
<script>
import ParentPhoneBinder from './ParentPhoneBinder'
export default {
  name: 'ParentPhoneModifier',
  data() {
    return {
      step: 1
    }
  },
  methods: {
    toNext() {
      this.step = 2
    },
    modifyPhone() {}
  },
  components: {
    ParentPhoneBinder
  }
}
</script>
<style lang="scss" scoped>
.parent-phone-modifier {
  color: #666;
  min-height: 510px;
  &-header {
    font-size: 16px;
    padding: 16px 24px 12px;
    border-bottom: 3px solid #cdd4dc;
  }
  &-binder {
    padding: 32px 24px;
  }
  &-footer {
    padding-left: 100px;
    .el-button{
      width: 100px;
    }
  }
}
</style>
