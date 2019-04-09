<template>
  <div class="website-delete">
    <p class="website-delete-alert">{{$t('project.deleteProjectHint')}}</p>
    <p class="website-delete-hint" @click="agreeDelete"><span :class="['website-delete-hint-check',{'website-delete-hint-agree':checked}]"></span>{{$t('project.deleteProjectNotice')}}</p>
    <p class="website-delete-btn">
      <el-button type="primary" :disabled="!checked" @click="confirmDeleteProject" :loading="deleteSuccessLoading">{{$t('common.Sure')}}</el-button>
    </p>
  </div>
</template>
<script>
import _ from 'lodash'
import { keepwork } from '@/api'

export default {
  name: 'DeleteProject',
  
  data() {
    return {
      checked: false,
      deleteSuccessLoading: false
    }
  },
  computed: {
    projectId() {
      return _.get(this.$route, 'params.id')
    }
  },
  methods: {
    agreeDelete(){
      this.checked = !this.checked
    },
    async confirmDeleteProject(){
      this.deleteSuccessLoading = true
      await keepwork.projects.deleteProject(this.projectId).then(res => {
        this.deleteSuccessLoading = false
        this.$router.push('/')
      }).catch(err => {
        console.error(err)
        this.$message.error($t('editor.deleteFail'))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.website-delete {
  padding: 70px;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 24px auto 120px;
  border: 1px solid #e8e8e8;
  background: #fff;
  &-alert {
    font-size: 20px;
    color: #303133;
  }
  &-hint {
    color: #666;
    max-width: 480px;
    word-break:break-all;
    line-height: 30px;
    padding-left: 26px;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    &-agree {
      background: #409eff;
    }
    &-check {
      position: absolute;
      display: inline-block;
      width: 15px;
      height: 15px;
      top: 5px;
      left: 4px;
      border: 1px solid #409eff;
      border-radius: 2px;
      &::after{
        content: '';
        width: 10px;
        height: 5px;
        display: inline-block;
        border: 1px solid #fff;
        transform: rotate(-45deg);
        border-top-color: transparent;
        border-right-color: transparent;
        position: absolute;
        top: 1px;
        left: 1px;
      }
    }
  }
  &-btn {
    margin-top: 80px;
  }
}
</style>

