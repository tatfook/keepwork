<template>
  <div class="edit-package" v-loading='isLoading'>
    <package-editor-header :isEditing='true' :editingPackageDetail='editingPackageDetail' :activeTab='activeTab' :isPackageNameEmpty='isPackageNameEmpty' :isEditable='isEditable' :isSubmitable='isSubmitable' :isReleasable='isReleasable' :isPackageInfoComplete='isPackageInfoComplete' @changeActiveType='setActiveTab' @submitPackage='submitPackage' @savePackage='updatePackage' @releasePackage='releasePackage'></package-editor-header>
    <div class="edit-package-container">
      <package-basic-info ref="basicInfoComponent" v-if="!isGettingData" v-show="activeTab === 'basic'" :isEditable='isEditable' :isEditing='true' :editingPackageDetail='editingPackageDetail'></package-basic-info>
      <cover-media-setter ref="coverUrlComponent" v-if="!isGettingData" v-show="activeTab === 'basic'" :isEditable='isEditable' :isEditing='true' :editingPackageDetail='editingPackageDetail' class="edit-package-media-setter"></cover-media-setter>
      <catalogue-manager ref="lessonListComponent" v-if="!isGettingData" :isEditable='isEditable' v-show="activeTab === 'catalogue'" :editingPackageDetail='editingPackageDetail' :isEditing='true'></catalogue-manager>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import PackageEditorHeader from './PackageEditorHeader'
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
export default {
  name: 'EditPackage',
  async mounted() {
    this.isLoading = true
    this.isGettingData = true
    await this.getPackageDetail({ packageId: this.editingPackageId })
    this.editingPackageDetail = this.lessonPackageDetail({
      packageId: this.editingPackageId
    })
    this.isGettingData = false
    this.isLoading = false
    this.$nextTick(() => {
      this.isMounted = true
    })
  },
  data() {
    return {
      editingPackageId: _.get(this.$route.params, 'id'),
      isGettingData: true,
      isLoading: false,
      isMounted: false,
      editingPackageDetail: {},
      activeTab: 'basic' //basic or catalogue
    }
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail',
      userIdenity: 'lesson/userIdenity',
      teacherInfo: 'lesson/teacherInfo',
      allianceInfo: 'lesson/allianceInfo'
    }),
    isTeacher() {
      if (!this.teacherInfo) {
        return this.userIdenity === 2 ? true : false
      }
      let { startTime, endTime } = this.teacherInfo
      return moment(new Date()).isBetween(startTime, endTime, 'minute')
    },
    isAlliance() {
      if (!this.allianceInfo || this.isTeacher) {
        return false
      }
      let { startTime, endTime } = this.allianceInfo
      return moment(new Date()).isBetween(startTime, endTime, 'minute')
    },
    isLearner() {
      return !this.isTeacher && !this.isAlliance
    },
    isEditable() {
      return this.editingPackageDetail.state !== 1
    },
    isSubmitable() {
      return !this.isLearner && (
        this.editingPackageDetail.state === 0 ||
        this.editingPackageDetail.state === 3 ||
        this.editingPackageDetail.state === 4
      )
    },
    isReleasable() {
      return false
      // return this.editingPackageDetail.state === 2 // The first version temporarily removes the release function
    },
    updatingPackageBasicInfo() {
      return this.$refs.basicInfoComponent.newPackageDetail
    },
    updatingPackageCoverUrl() {
      return this.$refs.coverUrlComponent.newPackageCoverUrl
    },
    updatingPackageLessons() {
      return this.$refs.lessonListComponent.selectedLessonIds
    },
    updatingPackageId() {
      return this.editingPackageDetail.id
    },
    updatingPackageData() {
      return _.assign(
        this.updatingPackageBasicInfo,
        {
          extra: { coverUrl: this.updatingPackageCoverUrl }
        },
        { lessons: this.updatingPackageLessons }
      )
    },
    isPackageNameEmpty() {
      if (!this.isMounted) {
        return true
      }
      let packageName =
        this.updatingPackageData && this.updatingPackageData.packageName
      return !packageName || packageName == ''
    },
    isPackageInfoComplete() {
      if (!this.isMounted || this.isPackageNameEmpty) {
        return false
      }
      let {
        subjectId,
        minAge,
        maxAge,
        intro,
        rmb,
        extra,
        lessons
      } = this.updatingPackageData
      if (
        typeof subjectId !== 'number' ||
        typeof minAge !== 'number' ||
        typeof maxAge !== 'number' ||
        typeof rmb !== 'number' ||
        !intro ||
        !extra.coverUrl ||
        !lessons ||
        lessons.length <= 0
      ) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapActions({
      teacherUpdatePackage: 'lesson/teacher/updatePackage',
      lessonAuditPackage: 'lesson/teacher/auditPackage',
      getPackageDetail: 'lesson/getPackageDetail'
    }),
    toPackageManagerPage() {
      this.$router.push('/teacher/packageManager')
    },
    setActiveTab(type) {
      this.activeTab = type
    },
    async updatePackage({ isShowMessage = true }) {
      if (this.isPackageNameEmpty) {
        this.$message({
          message: this.$t('lesson.packageManage.nameIsRequiredInfo'),
          type: 'warning'
        })
        return
      }
      let updatingPackageData = this.updatingPackageData
      this.isLoading = true
      await this.teacherUpdatePackage({
        updatingPackageData
      })
        .then(() => {
          if (isShowMessage) {
            this.$message({
              message: this.$t('common.saveSuccess'),
              type: 'success'
            })
            this.toPackageManagerPage()
          }
          return Promise.resolve()
        })
        .catch(error => {
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.packageManage.pleaseLogin')
              break
            case 409:
              errorMsg = this.$t('lesson.packageManage.packageNameConflict')
              break
            default:
              errorMsg = this.$t('common.saveFail')
              break
          }
          this.$message({
            message: errorMsg,
            type: 'error'
          })
          return Promise.reject(new Error('Create new package failed'))
        })
      this.isLoading = false
    },
    async submitToAudit() {
      await this.lessonAuditPackage({
        packageId: this.updatingPackageId,
        state: 1
      })
        .then(result => {
          this.$message({
            message: this.$t('lesson.successfullySubmitted'),
            type: 'success'
          })
          return Promise.resolve()
        })
        .catch(error => {
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.packageManage.pleaseLogin')
              break
            default:
              errorMsg = this.$t('lesson.failedSubmit')
              break
          }
          this.$message({
            message: errorMsg,
            type: 'error'
          })
          return Promise.reject(new Error('Submit package to audit failed'))
        })
    },
    async beforeSubmitOrRelease() {
      if (!this.isPackageInfoComplete) {
        this.$message({
          message: this.$t('lesson.pleaseCompleteInfo'),
          type: 'warning'
        })
        return Promise.reject(new Error('Package info not complete'))
      }
      await this.updatePackage({ isShowMessage: false })
        .then(() => {
          return Promise.resolve()
        })
        .catch(() => {
          return Promise.reject(new Error('Update package failed'))
        })
    },
    async submitPackage() {
      this.isLoading = true
      await this.beforeSubmitOrRelease()
        .then(async () => {
          await this.submitToAudit()
            .then(() => {
              this.toPackageManagerPage()
            })
            .catch(() => {
              this.isLoading = false
            })
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    async releasePackage() {
      await this.beforeSubmitOrRelease().then(async () => {
        console.log('release package api')
      })
    }
  },
  components: {
    PackageEditorHeader,
    PackageBasicInfo,
    CatalogueManager,
    CoverMediaSetter
  }
}
</script>
<style lang="scss">
.edit-package {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-container {
    flex: 1;
    overflow: auto;
  }
  &-media-setter {
    padding: 26px 36px;
  }
}
</style>
