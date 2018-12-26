<template>
  <el-dialog class="submitable-info" :visible.sync="isInfoDialogVisible" :before-close="handleClose">
    <div>{{$t('lesson.accessToSubmit')}}</div>
    <div class="submitable-info-showy">{{$t('lesson.getBenefits')}}</div>
    <div class="submitable-info-footer">
      <router-link :to="{name: 'TeacherColumnApply'}" class="submitable-info-more">
        {{$t('lesson.viewMore')}}
      </router-link>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SubmitableInfo',
  props: {
    isInfoDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.submitable-info {
  text-align: center;
  .el-dialog__body {
    color: #414141;
  }
  &-showy {
    color: #409efe;
    margin-top: 12px;
  }
  &-more {
    text-decoration: none;
    border: 1px solid #bcbcbc;
    display: inline-block;
    width: 126px;
    height: 40px;
    line-height: 40px;
    color: #666;
    border-radius: 4px;
    margin-top: 36px;
  }
}
</style>
