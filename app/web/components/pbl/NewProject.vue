<template>
  <div class="new-project container" v-loading='isLoading'>
    <div class="new-project-step-0" v-show="nowStep === 0">
      <h1 class="new-project-title">{{$t("project.newProject")}}</h1>
      <p class="new-project-info">{{$t("create.projectIsWhereWorksStart")}}<br>{{$t("create.whatYouLearnFromProject")}}</p>
      <div class="new-project-name">
        <label for="projectName" class="new-project-label">{{$t("project.projectName")}}</label>
        <el-input id="projectName" maxlength="40" v-model="newProjectData.name"></el-input>
      </div>
      <div class="new-project-type">
        <label for="projectName" class="new-project-label">{{$t("project.projectType")}}</label>
        <div class="new-project-type-box">
          <div class="new-project-type-item" :class="{'active iconfont': projectType.type === newProjectData.type}" v-for="(projectType, index) in projectTypes" :key="index" @click='selectProjectType(projectType.type)'>
            <img class="new-project-type-item-cover" :src="projectType.type === newProjectData.type ?projectType.activeIconImgSrc:projectType.iconImgSrc" alt="">
            <p class="new-project-type-item-label">{{projectType.label}}</p>
            <p class="new-project-type-item-label new-project-type-item-label-sub" v-if="projectType.subLabel">{{projectType.subLabel}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="new-project-step-1" v-show="nowStep === 1">
      <website-binder @confirmSiteId='handleConfirmSiteId'></website-binder>
    </div>
    <el-button v-show="isFinishShow" type="primary" :disabled="isNameEmpty" @click="createNewProject">{{$t("project.createProject")}}</el-button>
    <el-button v-show="isNextShow" type="primary" :disabled="isNameEmpty" @click="goNextStep">{{$t("project.next")}}</el-button>
    <el-button v-show="isPrevShow" type="primary" @click="goPrevStep">{{$t("project.prev")}}</el-button>
  </div>
</template>
<script>
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapActions, mapGetters } from 'vuex'
import WebsiteBinder from './common/WebsiteBinder'
import { keepwork } from '@/api'

export default {
  name: 'NewProject',
  data() {
    return {
      isLoading: false,
      nowStep: 0,
      webFinishStepCount: 1,
      projectTypes: [
        {
          type: 1,
          label: this.$t('common.paracraft'),
          subLabel: this.$t('project.3DGameAndAnim'),
          iconImgSrc: require('@/assets/pblImg/project_paracraft.png'),
          activeIconImgSrc: require('@/assets/pblImg/project_paracraft_active.png')
        },
        {
          type: 0,
          label: this.$t('create.website'),
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
        siteId: null,
        tags: 'Paracraft|3D'
      }
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed'
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
      toggleRealName: 'user/toggleRealName',
      pblCreateNewProject: 'pbl/createNewProject'
    }),
    selectProjectType(type) {
      this.newProjectData.type = type
      this.newProjectData.tags = type == 0 ? '网站' : 'Paracraft|3D'
    },
    handleConfirmSiteId({ siteId }) {
      this.isWebType && siteId && (this.newProjectData.siteId = siteId)
      this.createNewProject()
    },
    async checkProjectName() {
      this.isLoading = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.newProjectData.name
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.isLoading = false
        return false
      }
      let name = this.newProjectData.name
      keepwork.projects
        .getUserProjectsByName({ name })
        .then(res => {
          if (res.count > 0) {
            this.$message.error(this.$t('project.projectAlreadyExists'))
            this.isLoading = false
            return false
          }
        })
        .catch(e => {
          console.error(e)
        })
      this.isLoading = false
      return true
    },
    async createNewProject() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      if (!(await this.checkProjectName())) {
        return
      }
      this.isLoading = true
      await this.pblCreateNewProject(this.newProjectData)
        .then(projectDetail => {
          this.isLoading = false
          this.$message({
            type: 'success',
            message: this.$t('project.projectCreated')
          })
          let projectId = projectDetail.id
          projectId && this.$router.push(`/project/${projectId}`)
        })
        .catch(error => {
          if (error.response.status == 409) {
            this.$message.error(this.$t('project.projectAlreadyExists'))
          } else {
            this.$message.error(this.$t('project.ProjectCreationFailed'))
          }
          this.isLoading = false
        })
    },
    goPrevStep() {
      this.nowStep--
    },
    async goNextStep() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      if (this.nowStep === 0) {
        let isNameValid = await this.checkProjectName()
        if (!isNameValid) {
          return
        }
      }
      this.nowStep++
    }
  },
  components: {
    WebsiteBinder
  }
}
</script>
<style lang="scss">
.new-project {
  padding: 55px 0;
  &-title {
    font-size: 24px;
    color: #303133;
    margin: 0 0 10px 0;
  }
  &-info {
    font-size: 14px;
    color: #909399;
    margin: 10px 0 30px;
    line-height: 24px;
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
      width: 190px;
      height: 186px;
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
        bottom: 32px;
        color: #303133;
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        &-sub {
          font-size: 12px;
          bottom: 16px;
          color: #909399;
          font-weight: normal;
        }
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
