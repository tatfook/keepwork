<template>
  <div class="project-editing">
    <div class='project-editing-item'>
      <label class="project-editing-item-label">项目状态</label>
      <el-radio-group v-model="projectVisibility">
        <el-radio :label="0">公开项目</el-radio>
        <el-radio :label="1">私有项目</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">评论权限</label>
      <el-radio-group v-model="projectPrivileges.comment">
        <el-radio :label="4">任何人</el-radio>
        <el-radio :label="8">仅限成员</el-radio>
        <el-radio :label="16">关闭评论</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">白板查看</label>
      <el-radio-group v-model="projectPrivileges.boardView">
        <el-radio :label="32">任何人</el-radio>
        <el-radio :label="64">仅限成员</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">白板编辑</label>
      <el-radio-group v-model="projectPrivileges.boardEdit">
        <el-radio :label="128">任何人</el-radio>
        <el-radio :label="256">仅限成员</el-radio>
      </el-radio-group>
    </div>
    <div class='project-editing-item'>
      <label class="project-editing-item-label">招募状态</label>
      <el-radio-group v-model="projectPrivileges.recruit">
        <el-radio :label="1">开启招募</el-radio>
        <el-radio :label="2">停止招募</el-radio>
      </el-radio-group>
    </div>
    <div class="project-editing-operate">
      <el-button type="primary" size="medium">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectEditing',
  data() {
    return {
      projectVisibility: 0,
      projectPrivileges: {
        recruit: 1,
        comment: 4,
        boardView: 32,
        boardEdit: 128
      }
    }
  }
}
</script>
<style lang="scss">
.project-editing {
  font-size: 14px;
  color: #909399;
  padding: 10px 50px;
  &-item {
    margin-bottom: 20px;
    &-label {
      margin-right: 20px;
    }
  }
  &-operate {
    padding-left: 80px;
    .el-button--medium {
      padding: 10px 28px;
    }
  }
  .el-radio + .el-radio {
    margin-left: 24px;
  }
  .el-radio__label {
    padding-left: 6px;
  }
  .el-radio__inner {
    width: 16px;
    height: 16px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
    background-color: #2296f3;
  }
  .el-radio__label,
  .el-radio__input.is-checked + .el-radio__label {
    color: #303133;
  }
  .el-radio__input.is-checked {
    .el-radio__inner {
      background-color: transparent;
    }
  }
}
</style>
