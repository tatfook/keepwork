<template>
  <div class="new-project container">
    <h1 class="new-project-title">新建项目</h1>
    <p class="new-project-info">在项目里去创造你的作品吧</p>
    <div class="new-project-name">
      <label for="projectName" class="new-project-label">项目名称</label>
      <el-input id="projectName" v-model="newProjectData.name"></el-input>
    </div>
    <div class="new-project-type">
      <label for="projectName" class="new-project-label">项目类型</label>
      <div class="new-project-type-box">
        <div class="new-project-type-item">
          <img src="@/assets/pblImg/project_paracraft.png" alt="">
          <p class="new-project-type-item-label">Paracraft</p>
        </div>
        <div class="new-project-type-item">
          <img src="@/assets/pblImg/project_web.png" alt="">
          <p class="new-project-type-item-label">网站</p>
        </div>

      </div>
    </div>
    <el-button type="primary" :disabled="isNameEmpty" @click="createNewProject">完成创建</el-button>
  </div>
</template>
<script>
export default {
  name: 'NewProject',
  data() {
    return {
      newProjectData: {
        name: '',
        privilege: 165,
        visibility: 0,
        type: 1,
        description: ''
      }
    }
  },
  computed: {
    isNameEmpty() {
      let { name } = this.newProjectData
      return !name || name.length == 0
    }
  }
}
</script>
<style lang="scss">
.new-project {
  &-title {
    font-size: 24px;
    color: #303133;
    margin-bottom: 10px;
  }
  &-info {
    font-size: 14px;
    color: #909399;
    margin: 10px 0 30px;
  }
  &-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 15px;
    display: block;
  }
  &-type {
    &-item {
      width: 168px;
      height: 168px;
      border: 1px solid #e8e8e8;
      text-align: center;
      margin-bottom: 25px;
    }
    &-item:last-child {
      margin-bottom: 0;
    }
    &-item.active {
      border-color: #2397f3;
    }
  }
  .el-input {
    width: 600px;
  }
}
</style>
