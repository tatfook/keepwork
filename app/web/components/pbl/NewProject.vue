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
        <div class="new-project-type-item" :class="{'active iconfont': projectType.type === newProjectData.type}" v-for="(projectType, index) in projectTypes" :key="index" @click='selectProjectType(projectType.type)'>
          <img class="new-project-type-item-cover" :src="projectType.type === newProjectData.type ?projectType.activeIconImgSrc:projectType.iconImgSrc" alt="">
          <p class="new-project-type-item-label">{{projectType.label}}</p>
        </div>
      </div>
    </div>
    <el-button type="primary" :disabled="isNameEmpty" @click="createNewProject">完成创建</el-button>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'NewProject',
  data() {
    return {
      projectTypes: [
        {
          type: 1,
          label: 'Paracraft',
          iconImgSrc: require('@/assets/pblImg/project_paracraft.png'),
          activeIconImgSrc: require('@/assets/pblImg/project_paracraft_active.png')
        },
        {
          type: 0,
          label: '网站',
          iconImgSrc: require('@/assets/pblImg/project_web.png'),
          activeIconImgSrc: require('@/assets/pblImg/project_web_active.png')
        }
      ],
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
  },
  methods:{
    ...mapActions({
      pblCreateNewProject: 'pbl/createNewProject'
    }),
    selectProjectType(type){
      this.newProjectData.type = type
    },
    async createNewProject(){
      await this.pblCreateNewProject(this.newProjectData).then(()=>{
        this.$message({
          type: 'success',
          message: '项目创建成功'
        })
      }).catch(error=>{
        console.log(error)
      })
    }
  }
}
</script>
<style lang="scss">
.new-project {
  padding-top: 55px;
  &-title {
    font-size: 24px;
    color: #303133;
    margin: 0 0 10px 0;
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
    &-box {
      display: flex;
    }
    &-item {
      width: 168px;
      height: 168px;
      border: 1px solid #e8e8e8;
      text-align: center;
      margin: 0 20px 25px 0;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      &-cover {
        padding: 40px 36px 0;
      }
      &-label {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 16px;
        color: #909399;
        margin: 0;
        font-size: 14px;
      }
    }
    &-item:last-child {
      margin: 0 0 25px 0;
    }
    &-item.active {
      border: 2px solid #2397f3;
      box-shadow: 0 0 8px 3px rgba(35, 151, 243, 0.2);
    }
    &-item.active::before {
      content: '\E600';
      color: #fff;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #2397f3;
      position: absolute;
      right: -6px;
      top: -8px;
      text-align: left;
      padding-left: 7px;
      line-height: 36px;
      box-sizing: border-box;
      font-size: 14px;
    }
  }
  &-name {
    margin-bottom: 24px;
  }
  .el-input {
    width: 600px;
  }
}
</style>
