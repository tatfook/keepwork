<template>
  <div class="project-basic-info">
    <div class="project-basic-info-header">
      <p class="project-basic-info-name">{{originProjectDetail.name}}
        <img class="project-basic-info-picked" :title="$t('home.selectedProjects')" v-if="originProjectDetail.choicenessNo" src="@/assets/pblImg/picked.png" alt="">
        <span class="project-basic-info-state" v-if="!isProjectStopRecruit">{{$t("explore.recruiting")}}</span>
      </p>
      <p class="project-basic-info-more">
        <span class="project-basic-info-more-created">{{$t("project.createBy")}}
          <span class="project-basic-info-more-username">{{projectOwnerUsername}}</span>
          {{$t("project.created")}}
        </span>
        <span class="project-basic-info-more-viewcount">
          <i class="icon-browse_fill iconfont"></i>{{originProjectDetail.visit + 1}}
        </span>
        <span class="project-basic-info-more-starcount">
          <i class="icon-like-fill iconfont"></i>{{originProjectDetail.star}}
        </span>
        <span class="project-basic-info-more-commentcount">
          <i class="icon-message_fill iconfont"></i>{{originProjectDetail.comment}}
        </span>
      </p>
    </div>
    <div class="project-basic-info-detail">
      <div class="project-basic-info-detail-cover" v-loading='isCoverZoneLoading'>
        <img v-show="!isVideoShow" class="project-basic-info-detail-cover-image" :src='tempCoverUrl || defaultCoverUrl' alt="" @load="coverImageLoaded">
        <video v-show="isVideoShow" class="project-basic-info-detail-cover-video" :src="tempVideoUrl" controls></video>
        <p v-if="isLoginUserEditable" class="project-basic-info-detail-cover-cursor show-on-hover" @click="showMediaSkyDriveDialog"><i class="el-icon-edit-outline"></i>{{$t("project.changeImageOrVideo")}}</p>
      </div>
      <div class="project-basic-info-detail-message">
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.projectType")}}:</label>{{ projectType | projectTypeFilter(projectTypes) }}</p>
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.projectId")}}:</label>{{originProjectDetail.id}}</p>
        <p class="project-basic-info-detail-message-item"><label>{{$t("project.createTime")}}:</label>{{originProjectDetail.createdAt | formatDate(formatType)}}</p>
        <!-- <p class="project-basic-info-detail-message-item"><label>当前版本:</label>12.1</p> -->
        <project-grade v-if="!isWebType" :projectDetail='originProjectDetail'></project-grade>
        <div class="project-basic-info-detail-operations">
          <el-button type="primary" @click="toProjectPage">{{ buttonName }}</el-button>
          <el-button @click="toEditWebsite" plain v-if="isWebType && (isProjectOwner || isLoginUserEditableForProjectSite)">{{$t("project.edit")}}</el-button>
          <el-button :disabled="isApplied" :loading='isApplyButtonLoading' plain v-show="!isLoginUserEditable && !isLoginUserBeProjectMember && !isProjectStopRecruit" @click="showApplyBox">{{projectApplyState | applyStateFilter(applyStates)}}</el-button>
          <game-entry v-if="projectType === 1 && isLoginUserBeCreator" :projectId='projectId' class="project-basic-info-detail-operations-item"></game-entry>
        </div>
      </div>
    </div>
    <div class="project-basic-info-description" v-loading='isLoading'>
      <div class="project-basic-info-description-title">
        {{$t("project.projectDescription")}}:
        <el-button v-if="isLoginUserEditable" class="project-website-card-button" type="text" @click="toggleIsDescEditing">
          <i class="el-icon-edit-outline" v-show="!isDescriptionEditing"></i>
          <span v-show="isDescriptionEditing"><i class="iconfont icon-save3"></i>{{$t("common.Save")}}</span>
        </el-button>
      </div>
      <div class="project-basic-info-description-content" v-show="!isDescriptionEditing" v-html="tempDesc || $t('project.noDescripton')"></div>
      <div :id="descriptionId" v-show="isDescriptionEditing" class="project-basic-info-description-editor"></div>
    </div>
    <sky-drive-manager-dialog :mediaLibrary='true' :show='isMediaSkyDriveDialogShow' :isVideoTabShow='true' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
    <el-dialog title="提示" v-loading='isBinderDialogLoading' :visible.sync="binderDialogVisible" :before-close="handleBinderDialogClose">
      <website-binder @confirmSiteId='handleConfirmSiteId'></website-binder>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBinderDialogClose">{{$t("common.Cancel")}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="project-basic-info-apply-dialog" :title='$t("project.applyForProject")' :visible.sync="isApplyDialogVisible" width="400px" :before-close="handleApplyDialogClose">
      <el-input type="textarea" :placeholder="$t('project.enterApplicationReason')" resize='none' v-model="applyText">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleApplyDialogClose">{{$t("common.Cancel")}}</el-button>
        <el-button type="primary" @click="applyJoinProject">{{$t("common.Sure")}}</el-button>
      </span>
    </el-dialog>
    <paracraft-info :isDialogVisible='isParacraftInfoDialogVisible' :paracraftUrl='paracraftUrl' @close='handleParacraftInfoDialogClose'></paracraft-info>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import E from 'wangeditor'
import dayjs from 'dayjs'
import { locale } from '@/lib/utils/i18n'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import paracraftUtil from '@/lib/utils/paracraft'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import ParacraftInfo from '@/components/common/ParacraftInfo'
import WebsiteBinder from './WebsiteBinder'
import ProjectGrade from './ProjectGrade'
import GameEntry from './GameEntry'
import launchUri from '@/lib/utils/launchUri'

export default {
  name: 'ProjectBasicInfo',
  props: {
    originProjectDetail: {
      type: Object,
      required: true
    },
    projectOwnerUsername: {
      type: String,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      required: true
    },
    projectApplyState: Number,
    isProjectStopRecruit: Boolean,
    descriptionId: {
      type: String,
      default: 'projectDescriptoinEditor'
    }
  },
  async mounted() {
    this.copiedProjectDetail = _.cloneDeep(this.originProjectDetail)
    this.tempDesc = this.copiedProjectDetail.description
    this.tempSiteId = this.copiedProjectDetail.siteId
    this.tempCoverUrl = _.get(
      this.copiedProjectDetail,
      'extra.imageUrl',
      undefined
    )
    this.tempVideoUrl = _.get(
      this.copiedProjectDetail,
      'extra.videoUrl',
      undefined
    )
    this.isLogined &&
      (await this.userGetUserPrivilege({
        siteId: this.projectSiteId,
        userId: this.loginUserId
      }))
  },
  data() {
    return {
      projectTypes: [this.$t('explore.websites'), this.$t('common.paracraft')],
      applyStates: [
        this.$t('project.applyJoin'),
        this.$t('project.requested'),
        this.$t('project.joined')
      ],
      binderDialogVisible: false,
      isApplyButtonLoading: false,
      isBinderDialogLoading: false,
      isDescriptionEditing: false,
      descriptionEditor: undefined,
      copiedProjectDetail: {},
      tempSiteId: null,
      tempDesc: '',
      tempCoverUrl: '',
      tempVideoUrl: '',
      isLoading: false,
      isCoverZoneLoading: false,
      isMediaSkyDriveDialogShow: false,
      defaultCoverUrl: require('@/assets/img/pbl_default_cover.png'),
      waitUpdateCover: false,
      applyText: '',
      isApplyDialogVisible: false,
      maxDescWithHtmlLen: 65535,
      isParacraftInfoDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId',
      loginUserDetail: 'user/profile',
      loginUsername: 'user/username',
      userToken: 'user/token',
      getSiteDetailInfoById: 'user/getSiteDetailInfoById',
      isLogined: 'user/isLogined',
      getUserSitePrivilege: 'user/getUserSitePrivilege'
    }),
    isLoginUserBeCreator() {
      return this.isLogined && this.loginUsername === this.projectOwnerUsername
    },
    isEn() {
      return locale === 'en-US' ? true : false
    },
    formatType() {
      return this.isEn ? 'YYYY-MM-DD' : 'YYYY年MM月DD日'
    },
    buttonName() {
      if (this.isWebType) {
        return this.$t('project.visit')
      }
      if (this.isCreating && !this.isProjectOwner) {
        return this.$t('project.creating')
      }
      return this.$t('project.visitWorld')
    },
    isCreating() {
      return !(
        this.originProjectDetail.world &&
        this.originProjectDetail.world.archiveUrl
      )
    },
    loginUserSitePrivilege() {
      return this.getUserSitePrivilege({
        siteId: this.projectSiteId,
        userId: this.loginUserId
      })
    },
    isLoginUserEditableForProjectSite() {
      return this.loginUserSitePrivilege === 64
    },
    isProjectOwner() {
      return this.loginUserId === this.originProjectDetail.userId
    },
    isApplied() {
      return this.projectApplyState === 0
    },
    isLoginUserBeProjectMember() {
      return this.projectApplyState === 1
    },
    originDesc() {
      return this.copiedProjectDetail.description
    },
    originExtra() {
      return this.originProjectDetail.extra
    },
    mergedExtra() {
      let originExtra = _.cloneDeep(this.originExtra)
      return _.merge(originExtra, {
        imageUrl: this.tempCoverUrl,
        videoUrl: this.tempVideoUrl
      })
    },
    updatingProjectData() {
      return _.merge(this.originProjectDetail, {
        siteId: this.tempSiteId,
        description: this.tempDesc,
        extra: this.mergedExtra
      })
    },
    projectType() {
      return this.originProjectDetail.type
    },
    isWebType() {
      return this.projectType === 0
    },
    projectSiteId() {
      // FIXME: 确认清楚是哪个id
      return this.originProjectDetail.siteId || this.originProjectDetail.id
    },
    siteDetailInfo() {
      if (!this.isWebType) {
        return
      }
      return this.getSiteDetailInfoById({ siteId: this.projectSiteId })
    },
    siteUrl() {
      if (!this.isWebType) {
        return
      }
      let { sitename, username } = this.siteDetailInfo
      return `/${username}/${sitename}/index`
    },
    paracraftUrl() {
      if (this.isWebType) {
        return
      }
      if (this.isCreating) {
        return paracraftUtil.getOpenUrl({
          usertoken: this.userToken
        })
      }
      let { archiveUrl } = this.originProjectDetail.world
      return paracraftUtil.getUrl({
        link: `${archiveUrl}`,
        kpProjectId: this.projectId,
        usertoken: this.userToken
      })
    },
    isVideoShow() {
      return this.tempVideoUrl
    }
  },
  methods: {
    ...mapActions({
      pblApplyJoinProject: 'pbl/applyJoinProject',
      pblUpdateProject: 'pbl/updateProject',
      toggleLoginDialog: 'pbl/toggleLoginDialog',
      getWebsiteDetailBySiteId: 'user/getWebsiteDetailBySiteId',
      toggleLoginDialog: 'pbl/toggleLoginDialog',
      userGetUserPrivilege: 'user/getUserPrivilege',
      pblGetProjectDetail: 'pbl/getProjectDetail'
    }),
    async toggleIsDescEditing() {
      if (!this.isDescriptionEditing) {
        this.isDescriptionEditing = true
        this.$nextTick(() => {
          if (!this.descriptionEditor) {
            this.descriptionEditor = new E(`#${this.descriptionId}`)
            this.descriptionEditor.customConfig.menus = [
              'head', // 标题
              'bold', // 粗体
              'fontSize', // 字号
              'fontName', // 字体
              'italic', // 斜体
              'underline', // 下划线
              'strikeThrough', // 删除线
              'foreColor', // 文字颜色
              'backColor', // 背景颜色
              'link', // 插入链接
              'list', // 列表
              'justify', // 对齐方式
              'quote', // 引用
              'emoticon', // 表情
              'undo', // 撤销
              'redo' // 重复
            ]
            this.descriptionEditor.create()
          }
          this.descriptionEditor.txt.html(this.tempDesc)
        })
      } else {
        let editorText = this.descriptionEditor.txt
        this.tempDesc = editorText.text() && this.descriptionEditor.txt.html()
        let descLen = this.tempDesc.length
        if (descLen >= this.maxDescWithHtmlLen) {
          this.$message({
            type: 'error',
            message: '项目描述太长了，请调整'
          })
          return
        }
        let sensitiveResult = await checkSensitiveWords({
          checkedWords: editorText.text()
        }).catch()
        if (sensitiveResult && sensitiveResult.length > 0) {
          return
        }
        this.isLoading = true
        await this.updateDescToBackend()
      }
    },
    async updateDescToBackend() {
      await this.pblUpdateProject({
        projectId: this.projectId,
        updatingProjectData: this.updatingProjectData
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('project.projectInfoUpdated')
          })
          this.isLoading = false
          this.isDescriptionEditing = false
          return Promise.resolve()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '项目信息更新失败,请重试'
          })
          this.isLoading = false
          return Promise.reject()
        })
    },
    handleApplyDialogClose() {
      this.isApplyDialogVisible = false
    },
    showApplyBox() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      this.isApplyDialogVisible = true
    },
    async applyJoinProject() {
      this.isApplyButtonLoading = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.applyText
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.isApplyButtonLoading = false
        return
      }
      await this.pblApplyJoinProject({
        objectType: 5,
        objectId: this.projectId,
        applyType: 0,
        applyId: this.loginUserId,
        legend: this.applyText,
        extra: this.loginUserDetail
      })
        .then(() => {
          this.isApplyButtonLoading = false
          this.$message({
            type: 'success',
            message: '申请成功，等待项目创建者处理'
          })
          this.handleApplyDialogClose()
        })
        .catch(error => {
          let httpCode = _.get(error, 'response.status')
          switch (httpCode) {
            case 401:
              this.toggleLoginDialog(true)
              break
            default:
              break
          }
          this.isApplyButtonLoading = false
          this.handleApplyDialogClose()
          console.error(error)
        })
    },
    toProjectPage() {
      switch (this.projectType) {
        case 0:
          this.toSitePage()
          break
        case 1:
          this.toParacraftPage()
          break
        default:
          break
      }
    },
    async toEditWebsite() {
      if (this.projectSiteId) {
        let tempWin = window.open('_blank')
        await this.getWebsiteDetailBySiteId({
          siteId: this.projectSiteId
        }).catch(e => console.error(e))
        if (this.siteUrl) {
          return (tempWin.location = `/ed${this.siteUrl}`)
        }
        tempWin.close()
      } else {
        this.binderDialogVisible = true
      }
    },
    async toSitePage() {
      let tempWin = window.open('_blank')
      if (this.projectSiteId) {
        await this.getWebsiteDetailBySiteId({ siteId: this.projectSiteId })
        if (this.siteUrl) {
          return (tempWin.location = this.siteUrl)
        }
        tempWin.close()
      } else {
        this.binderDialogVisible = true
      }
    },
    async toParacraftPage() {
      if (this.isCreating && !this.isProjectOwner) {
        return
      }
      if (this.paracraftUrl) {
        launchUri(this.paracraftUrl)
        this.isParacraftInfoDialogVisible = true
      }
    },
    showMediaSkyDriveDialog() {
      this.isMediaSkyDriveDialogShow = true
    },
    async closeSkyDriveManagerDialog({ file, url }) {
      this.isMediaSkyDriveDialogShow = false
      if (url) {
        let fileType = file && file.type
        if (fileType === 'videos') {
          this.tempCoverUrl = undefined
          this.tempVideoUrl = url
          this.isCoverZoneLoading = true
          await this.updateDescToBackend()
          this.isCoverZoneLoading = false
        } else {
          this.isCoverZoneLoading = true
          this.tempVideoUrl = undefined
          this.tempCoverUrl = url
          this.waitUpdateCover = true
        }
      }
    },
    async coverImageLoaded() {
      this.waitUpdateCover &&
        (await this.updateDescToBackend()) &&
        (this.waitUpdateCover = false)
      this.isCoverZoneLoading = false
    },
    async handleConfirmSiteId({ siteId }) {
      if (siteId) {
        this.tempSiteId = siteId
        this.isBinderDialogLoading = true
        await this.updateDescToBackend()
        this.isBinderDialogLoading = false
        this.handleBinderDialogClose()
      }
    },
    handleBinderDialogClose() {
      this.binderDialogVisible = false
    },
    handleParacraftInfoDialogClose() {
      this.isParacraftInfoDialogVisible = false
    }
  },
  filters: {
    projectTypeFilter(typeValue, projectTypes) {
      return projectTypes[typeValue]
    },
    formatDate(date, formatType) {
      return dayjs(date).format(formatType)
    },
    applyStateFilter(applyState, applyStates) {
      let stateText = ''
      switch (applyState) {
        case -1:
          stateText = applyStates[0]
          break
        case 0:
          stateText = applyStates[1]
          break
        case 1:
          stateText = applyStates[2]
          break
        case 2:
          stateText = applyStates[0]
          break
        default:
          stateText = applyStates[0]
          break
      }
      return stateText
    }
  },
  components: {
    SkyDriveManagerDialog,
    ParacraftInfo,
    ProjectGrade,
    GameEntry,
    WebsiteBinder
  }
}
</script>
<style lang="scss">
.project-basic-info {
  background-color: #fff;
  &-header {
    padding: 10px 16px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-name {
    font-size: 20px;
    color: #303133;
    font-weight: bold;
    margin: 0;
  }
  &-picked {
    vertical-align: middle;
    margin: 0 4px;
  }
  &-state {
    background-color: #ef5936;
    font-size: 12px;
    position: relative;
    height: 20px;
    line-height: 20px;
    padding: 0 8px 0 20px;
    border-radius: 20px;
    display: inline-block;
    color: #fff;
  }
  &-state::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 8px;
    top: 8px;
  }
  &-more {
    font-size: 12px;
    color: #909399;
    margin: 9px 0 0;
    &-created {
      padding-right: 16px;
      margin-right: 16px;
      position: relative;
    }
    &-created::after {
      content: '';
      display: inline-block;
      width: 1px;
      height: 10px;
      background-color: #eee;
      position: absolute;
      bottom: 2px;
      right: 0;
    }
    &-starcount {
      margin: 0 10px;
    }
    .iconfont {
      color: #cdcdcd;
      margin-right: 3px;
    }
  }

  &-detail {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    &-cover {
      width: 480px;
      height: 270px;
      background-color: #303133;
      color: #fff;
      text-align: center;
      // line-height: 270px;
      border-radius: 4px;
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      &-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &-video {
        width: 100%;
        height: 100%;
      }
      &-cursor {
        position: absolute;
        margin: 0;
        cursor: pointer;
        display: none;
        z-index: 3000;
        height: 36px;
        line-height: 36px;
        right: 24px;
        top: 18px;
        font-size: 14px;
        background-color: #212121;
        color: #fff;
        border-radius: 36px;
        padding: 0 18px;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
        .el-icon-edit-outline {
          margin-right: 6px;
        }
      }
      .el-loading-spinner {
        line-height: 1;
      }
    }
    &-cover:hover {
      .show-on-hover {
        display: inline-block;
      }
    }
    &-message {
      position: relative;
      padding-bottom: 36px;
      flex: 1;
      &-item {
        font-size: 14px;
        color: #404144;
        margin: 6px 0 0;
        &:first-child {
          margin-top: 0;
        }
        label {
          color: #909399;
          width: 87px;
          display: inline-block;
        }
      }
    }
    &-operations {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      &-item {
        display: inline-block;
        margin-left: 10px;
      }
    }
  }

  &-description {
    padding: 16px;
    &-title {
      margin: 8px 0 16px;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      .el-button {
        position: absolute;
        top: -8px;
        right: 0;
      }
    }
    &-content {
      p {
        word-break: break-all;
      }
    }
    .w-e-toolbar {
      border-color: #e8e8e8 !important;
      border-bottom: none !important;
    }
    .w-e-text-container {
      height: 250px !important;
      border-color: #e8e8e8 !important;
    }
    .w-e-text {
      padding: 0 8px;
    }
    &-editor {
      position: relative;
      z-index: 1;
    }
  }
  &-apply-dialog {
    .el-dialog__header {
      font-size: 16px;
      color: #303133;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 24px;
      height: 60px;
      line-height: 60px;
      font-weight: bold;
    }
    .el-dialog__body {
      padding: 24px;
    }
    .el-textarea__inner {
      resize: none;
      min-height: 33px;
      height: 160px;
      font-size: 14px;
      color: #303133;
    }
    .el-dialog__footer {
      padding: 0 24px 24px;
    }
  }
}

@media (max-width: 768px) {
  .project-basic-info {
    &-detail {
      display: flex;
      flex-direction: column;
      &-cover {
        width: auto;
        height: auto;
        margin-right: 0;
        padding-bottom: 56.25%;
        position: relative;
        &-image {
          position: absolute;
          top: 0;
          left: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        &-video {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      &-operations {
        bottom: -10px;
        display: flex;
        .el-button {
          flex: 1;
          height: 36px;
          font-size: 14px;
          padding: 0;
          line-height: 36px;
        }
      }
    }
    &-description-editor {
      .w-e-toolbar {
        flex-wrap: wrap;
      }
    }
    &-apply-dialog {
      .el-dialog {
        width: 94% !important;
      }
    }
  }
  .el-message {
    min-width: 90%;
  }
}
</style>

