<template>
  <div class="parent-phone-binder">
    <p v-if="isInfoInTopShow" class="parent-phone-binder-info"><span>(选填)</span>({{staticInfo}})</p>
    <div class="parent-phone-binder-item">
      <label :style="{width: labelWidth}" for="parentPhone">{{phoneLabel}}</label>
      <div v-if="isEditable" class="parent-phone-binder-item-content">
        <el-input id="parentPhone" size="medium" placeholder="请输入" v-model="parentPhone.phone"></el-input>
        <p class="parent-phone-binder-item-info">{{staticInfo}}</p>
      </div>
      <span class="parent-phone-binder-item-phone" v-else>{{oldPhone}}</span>
    </div>
    <div class="parent-phone-binder-item">
      <label :style="{width: labelWidth}" for="parentPhone">验证码</label>
      <div class="parent-phone-binder-item-content">
        <el-input id="parentPhone" size="medium" placeholder="请输入" v-model="parentPhone.verifCode">
          <span slot="suffix">发送验证码</span>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParentPhoneBinder',
  props: {
    oldPhone: String,
    phoneLabel: {
      type: String,
      default: '家长手机号'
    },
    isInfoInTopShow: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.oldPhone) this.isEditable = true
  },
  data() {
    return {
      staticInfo:
        '家长手机号用于接收老师发送的评价报告等信息，请确保手机号畅通',
      isEditable: true,
      parentPhone: {
        phone: '',
        verifCode: ''
      }
    }
  },
  computed: {
    labelWidth() {
      return this.phoneLabel.length + 'em'
    }
  },
  watch: {
    oldPhone(val) {
      console.log(val)
      if (this.oldPhone) this.isEditable = true
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
    margin-bottom: 20px;
    label {
      display: inline-block;
      vertical-align: top;
      position: relative;
      top: 8px;
      text-align: right;
    }
    &-phone {
      margin-left: 24px;
    }
    &-content {
      margin-left: 16px;
      display: inline-block;
    }
    &-info {
      font-size: 12px;
      color: #999;
      margin: 16px 0 4px;
    }
  }
  /deep/.el-input {
    width: 280px;
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
