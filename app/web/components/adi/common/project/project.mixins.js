import { mapGetters, mapActions } from 'vuex'
import E from 'wangeditor'
import moment from 'moment'
import { locale } from '@/lib/utils/i18n'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import paracraftUtil from '@/lib/utils/paracraft'

import launchUri from '@/lib/utils/launchUri'
import _ from 'lodash'
export default {
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
  watch: {
    originProjectDetail(project) {
      this.initProjectData()
    }
  },
  async mounted() {
    this.initProjectData()
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
      userToken: 'user/token',
      getSiteDetailInfoById: 'user/getSiteDetailInfoById',
      isLogined: 'user/isLogined',
      getUserSitePrivilege: 'user/getUserSitePrivilege'
    }),
    isEn() {
      return locale === 'en-US'
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
      userGetUserPrivilege: 'user/getUserPrivilege',
      pblGetProjectDetail: 'pbl/getProjectDetail'
    }),
    async initProjectData() {
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
      if (this.isLogined && this.projectSiteId) {
        await this.userGetUserPrivilege({
          siteId: this.projectSiteId,
          userId: this.loginUserId
        })
      }
    },
    toProejctHomePage() {
      if (this.projectId) {
        window.location.href = `${window.location.origin}/pbl/project/${
          this.projectId
        }`
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
        this.applyText = _.get(sensitiveResult, '[0].word', this.applyText)
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
      return date ? moment(date).format(formatType) : ''
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
}