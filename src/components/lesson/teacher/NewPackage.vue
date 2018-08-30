<template>
  <div class="new-package">
    <div class="new-package-header">
      <el-breadcrumb class="new-package-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{$t('lesson.packageManage.package')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('lesson.newPackage')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-package-header-operations">
        <el-button round @click="toPackageManagerPage">{{$t('common.Cancel')}}</el-button>
        <el-button round @click="savePackage" :class="{'is-disabled': isPackageNameEmpty}">{{$t('common.Save')}}</el-button>
        <el-button round type="primary" :class="{'is-disabled': !isPackageInfoComplete}" @click="submitPackage">{{$t('lesson.packageManage.Submit')}}</el-button>
      </div>
    </div>
    <div class="new-package-tabs">
      <el-button @click="setActiveTab('basic')" class="new-package-tabs-item" :class="{'active': activeTab === 'basic'}">{{$t('lesson.packageManage.basicInfo')}}</el-button>
      <el-button @click="setActiveTab('catalogue')" class="new-package-tabs-item" :class="{'active': activeTab === 'catalogue'}">{{$t('lesson.catalogue')}}</el-button>
    </div>
    <PackageBasicInfo ref="basicInfoComponent" v-show="activeTab === 'basic'"></PackageBasicInfo>
    <CoverMediaSetter ref="coverUrlComponent" v-show="activeTab === 'basic'" class="new-package-media-setter"></CoverMediaSetter>
    <CatalogueManager ref="lessonListComponent" v-show="activeTab === 'catalogue'"></CatalogueManager>
  </div>
</template>
<script>
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
import { mapActions } from 'vuex'
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
      if (!this.isMounted) {
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
      if (type === this.activeTab) {
        return
      }
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
              message: this.$t("common.saveSuccess"),
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
              errorMsg = this.$t("common.saveFail")
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
    PackageBasicInfo,
    CatalogueManager,
    CoverMediaSetter
  }
}
</script>
<style lang="scss">
.new-package {
  padding: 37px 0 0;
  &-header {
    display: flex;
    &-breadcrumb {
      flex: 1;
      .el-breadcrumb__inner {
        color: #b3b3b3;
      }
      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: #333;
      }
    }
    &-operations {
      font-size: 17px;
      .el-button {
        width: 90px;
      }
      .el-button + .el-button {
        margin-left: 7px;
      }
    }
  }
  &-tabs {
    margin: 56px 0 14px;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 50%;
      font-size: 18px;
      background-color: #d2d2d2;
      border-color: #b3b3b3;
      color: #fff;
    }
    .el-button + .el-button {
      margin-left: 27px;
    }
    .el-button.active {
      background-color: #409efe;
    }
  }
  &-media-setter {
    margin-top: 35px;
  }
}
</style>
