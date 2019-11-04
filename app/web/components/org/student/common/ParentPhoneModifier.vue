<template>
  <div class="parent-phone-modifier" v-loading="isLoading">
    <div class="parent-phone-modifier-header">
      <template v-if="step === 1">第一步：验证身份</template>
      <template v-if="step === 2">第二步：输入新手机号</template>
    </div>
    <div class="parent-phone-modifier-main">
      <parent-phone-binder key="parentPhoneBinderRef1" ref="parentPhoneBinderRef1" class="parent-phone-modifier-binder" v-if="step==1" :oldPhone="oldPhone" phoneLabel="原手机号" :isInfoInTopShow="false"></parent-phone-binder>
      <parent-phone-binder key="parentPhoneBinderRef2" ref="parentPhoneBinderRef2" class="parent-phone-modifier-binder" v-if="step==2" phoneLabel="新手机号" :isInfoAfterInputShow="true" :isInfoInTopShow="false"></parent-phone-binder>
    </div>
    <div class="parent-phone-modifier-footer">
      <el-button size="medium" @click="cancle">取消</el-button>
      <el-button v-if="step == 1" size="medium" type="primary" @click="toNext">下一步</el-button>
      <el-button v-else size="medium" type="primary" @click="modifyPhone">确定</el-button>
    </div>
  </div>
</template>
<script>
import ParentPhoneBinder from './ParentPhoneBinder'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ParentPhoneModifier',
  async mounted() {
    this.isLoading = true
    try {
      await this.orgGetStudentInfo()
    } catch (error) {
      console.log(error)
    }
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
      step: 1,
      parentPhoneBinderRef1: null,
      parentPhoneBinderRef2: null,
      firstStepPhoneCode: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'org/student/userinfo'
    }),
    oldPhone() {
      return _.get(this.userInfo, 'parentPhoneNum')
    }
  },
  methods: {
    ...mapActions({
      orgGetStudentInfo: 'org/student/getStudentInfo',
      orgVerifyCode: 'org/student/verifyCode',
      orgUpdateParentPhoneNum: 'org/student/updateParentPhoneNum'
    }),
    async toNext() {
      this.isLoading = true
      try {
        if (!this.parentPhoneBinderRef1) {
          this.parentPhoneBinderRef1 = this.$refs['parentPhoneBinderRef1']
        }
        let { phone, verifCode } = this.parentPhoneBinderRef1.parentPhone
        let isPhoneDataValid = this.parentPhoneBinderRef1.isPhoneDataValid
        if (isPhoneDataValid) {
          await this.orgVerifyCode({ cellphone: phone, verifCode })
          this.firstStepPhoneCode = {
            phone,
            verifCode
          }
          this.$message({ type: 'success', message: '原手机号验证成功' })
          this.step = 2
        }
      } catch (error) {
        console.log(error)
        this.$message({ type: 'error', message: '原手机号验证失败' })
      }
      this.isLoading = false
    },
    async modifyPhone() {
      this.isLoading = true
      try {
        if (!this.parentPhoneBinderRef2) {
          this.parentPhoneBinderRef2 = this.$refs['parentPhoneBinderRef2']
        }
        let { phone, verifCode } = this.parentPhoneBinderRef2.parentPhone
        let isPhoneDataValid = this.parentPhoneBinderRef2.isPhoneDataValid
        if (isPhoneDataValid) {
          await this.orgUpdateParentPhoneNum({
            parentPhoneNum: this.firstStepPhoneCode.phone,
            verifCode: this.firstStepPhoneCode.verifCode,
            newParentPhoneNum: phone,
            newVerifCode: verifCode
          })
          this.$message({ type: 'success', message: '手机号修改成功' })
        }
      } catch (error) {
        this.$message({ type: 'error', message: '手机号修改失败' })
        console.log(error)
      }
      this.isLoading = false
    },
    cancle() {
      this.$emit('close')
    }
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
    .el-button {
      width: 100px;
    }
  }
}
</style>
