<template>
  <div class="new-project container">
    <div class="new-project-step-0" v-show="nowStep === 0">
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
    </div>
    <div class="new-project-step-1" v-show="nowStep === 1">
      <h1 class="new-project-step-1-title">请设定您项目对应的网站</h1>
      <p class="new-project-step-1-info">
        <span class="new-project-step-1-warning">!</span>注意：设定后不可更改
      </p>
      <div class="new-project-step-1-cards">
        <div class="new-project-step-1-cards-item" @click="openUserSitesDialog">
          <span class="new-project-step-1-cards-item-badge badge">已有</span>将已有网站加入项目
        </div>
        <div class="new-project-step-1-cards-item" @click='openNewSiteDialog'>
          <span class="new-project-step-1-cards-item-badge badge">新建</span>创建新网站
        </div>
      </div>
    </div>
    <el-button v-show="isFinishShow" type="primary" :disabled="isNameEmpty" @click="createNewProject">完成创建</el-button>
    <el-button v-show="isNextShow" type="primary" :disabled="isNameEmpty" @click="goNextStep">下一步</el-button>
    <el-button v-show="isPrevShow" type="primary" @click="goPrevStep">上一步</el-button>
    <new-website-dialog :isContinueAfterCreate='true' :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog' @finish='createNewProjectByNewSite'></new-website-dialog>
    <el-dialog width="760px" title="选择已有网站" :visible.sync="isUserSitesDialogShow">
      <user-sites-selector ref='userSitesRef'></user-sites-selector>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserSitesDialog">取消</el-button>
        <el-button type="primary" @click="createNewProjectByBind">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'
import UserSitesSelector from '@/components/common/UserSitesSelector'
export default {
  name: 'NewProject',
  data() {
    return {
      nowStep: 0,
      webFinishStepCount: 1,
      isNewWebsiteDialogShow: false,
      isUserSitesDialogShow: false,
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
        description: '',
        siteId: null
      }
    }
  },
  computed: {
    ...mapGetters({
      newSiteInfo: 'user/newSiteInfo'
    }),
    isNameEmpty() {
      let { name } = this.newProjectData
      return !name || name.length == 0
    },
    isWebType() {
      return this.newProjectData.type === 0
    },
    isFinishShow() {
      return !this.isWebType
    },
    isNextShow() {
      return this.isWebType && this.nowStep !== this.webFinishStepCount
    },
    isPrevShow() {
      return this.isWebType && this.nowStep === this.webFinishStepCount
    }
  },
  methods: {
    ...mapActions({
      pblCreateNewProject: 'pbl/createNewProject'
    }),
    selectProjectType(type) {
      this.newProjectData.type = type
    },
    createNewProjectByNewSite() {
      let siteId = _.get(this.newSiteInfo, 'id')
      this.isWebType && siteId && (this.newProjectData.siteId = siteId)
      this.createNewProject()
    },
    createNewProjectByBind() {
      let siteId = _.get(this.$refs.userSitesRef, 'selectSiteId')
      this.isWebType && siteId && (this.newProjectData.siteId = siteId)
      this.createNewProject()
    },
    async createNewProject() {
      await this.pblCreateNewProject(this.newProjectData)
        .then(projectDetail => {
          this.$message({
            type: 'success',
            message: '项目创建成功'
          })
          let projectId = projectDetail.id
          this.$router.push(`pbl/project/${projectId}`)
        })
        .catch(error => {
          console.log(error)
        })
    },
    goPrevStep() {
      this.nowStep--
    },
    goNextStep() {
      this.nowStep++
    },
    openNewSiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    },
    openUserSitesDialog() {
      this.isUserSitesDialogShow = true
    },
    closeUserSitesDialog() {
      this.isUserSitesDialogShow = false
    }
  },
  components: {
    NewWebsiteDialog,
    UserSitesSelector
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
  &-step-1 {
    &-title {
      font-size: 24px;
      color: #303133;
      font-weight: normal;
      margin: 0;
    }
    &-info {
      font-size: 14px;
      color: #de992d;
    }
    &-warnging {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #de992d;
      margin: 8px 0 0;
    }
    &-cards {
      display: flex;
      margin: 38px 0 80px;
      &-item {
        cursor: pointer;
        width: 254px;
        height: 136px;
        line-height: 136px;
        text-align: center;
        border-radius: 4px;
        font-size: 14px;
        color: #f5f5f5;
        margin-right: 45px;
        &:nth-child(1) {
          background: linear-gradient(to bottom, #b141f7, #a02bea);
          .badge {
            color: #a02bea;
            background: linear-gradient(to bottom, #fefdfe, #ddbaf3);
          }
        }
        &:nth-child(2) {
          background: linear-gradient(to bottom, #23b6f3, #2397f3);
          .badge {
            color: #2397f3;
            background: linear-gradient(to bottom, #fefdfe, #d1e5fc);
          }
        }
        &-badge {
          display: inline-block;
          padding: 5px 6px;
          line-height: 1;
          font-size: 12px;
          border-radius: 8px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
