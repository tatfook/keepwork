<template>
  <div class="new-package">
    <package-editor-header :activeTab='activeTab' :isLearner='isLearner' :isPackageNameEmpty='isPackageNameEmpty' :isPackageInfoComplete='isPackageInfoComplete' @changeActiveType='setActiveTab' @submitPackage='submitPackage' @savePackage='savePackage'></package-editor-header>
    <div class="new-package-container">
      <package-basic-info ref="basicInfoComponent" v-show="activeTab === 'basic'"></package-basic-info>
      <cover-media-setter ref="coverUrlComponent" v-show="activeTab === 'basic'" class="new-package-media-setter"></cover-media-setter>
      <catalogue-manager ref="lessonListComponent" v-show="activeTab === 'catalogue'"></catalogue-manager>
    </div>
  </div>
</template>
<script>
import PackageEditorHeader from './PackageEditorHeader'
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NewPackage',
  mounted() {
    this.isMounted = true
  },
  data() {
    return {
      isMounted: false,
      newSavingPackageId: null,
      activeTab: 'basic' //basic or catalogue
    }
  },
  computed: {
    ...mapGetters({
      userIsTeacher: 'lesson/isTeacher',
      userIsAlliance: 'lesson/isAlliance'
    }),
    isTeacher() {
      return this.userIsTeacher
    },
    isAlliance() {
      return this.userIsAlliance
    },
    isLearner() {
      return !this.isTeacher && !this.isAlliance
    },
    newPackageBasicInfo() {
      return this.$refs.basicInfoComponent.newPackageDetail
    },
    newPackageCoverUrl() {
      return this.$refs.coverUrlComponent.newPackageCoverUrl
    },
    newPackageLessons() {
      return this.$refs.lessonListComponent.selectedLessonIds
    },
    newPackageData() {
      return _.assign(
        this.newPackageBasicInfo,
        {
          extra: { coverUrl: this.newPackageCoverUrl }
        },
        { lessons: this.newPackageLessons }
      )
    },
    isPackageNameEmpty() {
      if (!this.isMounted) {
        return true
      }
      let packageName = this.newPackageData && this.newPackageData.packageName
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
      } = this.newPackageData
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
      lessonAuditPackage: 'lesson/teacher/auditPackage',
      createNewPackage: 'lesson/teacher/createNewPackage'
    }),
    setActiveTab(type) {
      this.activeTab = type
    },
    toPackageManagerPage() {
      this.$router.push('/teacher/packageManager')
    },
    async savePackage({ isShowMessage = true }) {
      if (this.isPackageNameEmpty) {
        this.$message({
          message: this.$t('lesson.packageManage.nameIsRequiredInfo'),
          type: 'warning'
        })
        return
      }
      let newPackageData = this.newPackageData
      await this.createNewPackage({
        newPackageData
      })
        .then(newPackageDetail => {
          this.newSavingPackageId = newPackageDetail.id
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
    },
    async submitToAudit() {
      await this.lessonAuditPackage({
        packageId: this.newSavingPackageId,
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
    async submitPackage() {
      if (this.isLearner) {
        return
      }
      if (!this.isPackageInfoComplete) {
        this.$message({
          message: this.$t('lesson.pleaseCompleteInfo'),
          type: 'warning'
        })
        return
      }
      await this.savePackage({ isShowMessage: false }).then(async () => {
        await this.submitToAudit().then(() => {
          this.toPackageManagerPage()
        })
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
.new-package {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-container {
    flex: 1;
    overflow: auto;
  }
  &-media-setter {
    padding: 35px;
  }
}
</style>
<style lang="scss">
.new-package {
  &-media-setter {
    padding: 16px;
  }
}
</style>
