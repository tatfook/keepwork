<template>
  <div class="edit-lesson" v-loading='isLoading'>
    <lesson-editor-header v-if="!isGettingData" :isEditable='isEditable' :isEditing='true' :isLinkPageUrlValid='isLinkPageUrlValid' :isLessonNameEmpty='isLessonNameEmpty' :editingLessonDetailProp='editingLessonDetail' :isEditorMod="isEditorMod" @saveLesson='updateLesson' @resetCancel="resetCancel"></lesson-editor-header>
    <div class="edit-lesson-container">
      <lesson-basic-info v-if="!isGettingData" ref="basicInfoComponent" :isEditable='isEditable' :editingLessonDetailProp='editingLessonDetail' :isEditing='true' :isEditorMod="isEditorMod"></lesson-basic-info>
      <cover-media-setter v-if="!isGettingData" :isEditable='isEditable' class="edit-lesson-cover" ref="coverUrlComponent" :editingCoverUrl='editingCoverUrl' :isEditing='true'></cover-media-setter>
      <lesson-more-info-settting class="edit-lesson-more-info" v-if="!isGettingData" ref="moreInfoComponent" :isEditable='isEditable' :editingLessonDetailProp='editingLessonDetail' :isEditing='true'></lesson-more-info-settting>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import CoverMediaSetter from './CoverMediaSetter'
import LessonEditorHeader from './LessonEditorHeader'
import LessonBasicInfo from './LessonBasicInfo'
import LessonMoreInfoSettting from './LessonMoreInfoSettting'
export default {
  name: 'EditLesson',
  async mounted() {
    this.isLoading = true
    this.isGettingData = true
    await this.getLessonDetail({ lessonId: this.editingLessonId })
    this.editingLessonDetail = this.lessonDetail({
      lessonId: this.editingLessonId
    })
    let ids = this.getIdsArray(_.get(this.editingLessonDetail, 'packages', []))
    this.originBelongPackageIds = ids
    this.isGettingData = false
    this.isLoading = false
    this.$nextTick(() => {
      this.isMounted = true
    })
  },
  props: {
    isEditorMod: {
      type: Boolean,
      default: false
    },
    lessonId: ''
  },
  data() {
    return {
      editingLessonId: this.isEditorMod
        ? this.lessonId
        : _.toInteger(_.get(this.$route.params, 'id')),
      isGettingData: true,
      isLoading: false,
      isMounted: false,
      originBelongPackageIds: [],
      editingLessonDetail: {}
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/lessonDetail'
    }),
    isEditable() {
      let { packages } = this.editingLessonDetail
      let pendingReviewPackageIndex = _.findIndex(packages, { state: 1 })
      return pendingReviewPackageIndex === -1
    },
    editingCoverUrl() {
      return _.get(this.editingLessonDetail, 'extra.coverUrl')
    },
    updatingSelectPackageIds() {
      return this.$refs.basicInfoComponent.belongToPackageIds
    },
    updatingBasicInfo() {
      return this.$refs.basicInfoComponent.editingLessonDetail
    },
    updatingCoverUrl() {
      return this.$refs.coverUrlComponent.newPackageCoverUrl
    },
    updatingMoreInfo() {
      return this.$refs.moreInfoComponent.moreInfoData
    },
    addingPackageIds() {
      let newLessonPackageIds = this.updatingSelectPackageIds
      let oldLessonPackageIds = this.originBelongPackageIds
      return _.difference(newLessonPackageIds, oldLessonPackageIds)
    },
    removingPackageIds() {
      let newLessonPackageIds = this.updatingSelectPackageIds
      let oldLessonPackageIds = this.originBelongPackageIds
      return _.difference(oldLessonPackageIds, newLessonPackageIds)
    },
    isLinkPageUrlValid() {
      if (!this.isMounted) {
        return true
      }
      return this.$refs.basicInfoComponent.isLinkPageUrlValid
    },
    isLessonNameEmpty() {
      if (!this.isMounted) {
        return true
      }
      let lessonName =
        this.updatingLessonData && this.updatingLessonData.lessonName
      return !lessonName || lessonName == ''
    },
    updatingLessonData() {
      return _.assign(
        {
          id: this.editingLessonId
        },
        this.updatingBasicInfo,
        _.omit(this.updatingMoreInfo, ['videoUrl', 'duration']),
        {
          extra: {
            duration: this.updatingMoreInfo.duration,
            coverUrl: this.updatingCoverUrl,
            videoUrl: this.updatingMoreInfo.videoUrl
          }
        }
      )
    }
  },
  methods: {
    ...mapActions({
      teacherUpdateLesson: 'lesson/teacher/updateLesson',
      getLessonDetail: 'lesson/getLessonDetail',
      teacherAddLessonToPackage: 'lesson/teacher/addLessonToPackage',
      teacherRemoveLessonFromPackage: 'lesson/teacher/removeLessonFromPackage'
    }),
    getIdsArray(packageObjArray) {
      let packageIds = []
      _.forEach(packageObjArray, packageDetail => {
        let { id } = packageDetail
        packageIds.push(id)
      })
      return packageIds
    },
    toLessonManagerPage() {
      this.$router.push('/createPackage/lessonManager')
    },
    async addLessonToPackages() {
      let lessonId = this.editingLessonId
      let packageIds = this.addingPackageIds
      let isLastOne = false
      for (let i = 0; i < packageIds.length; i++) {
        let packageId = packageIds[i]
        if (i === packageIds.length - 1) {
          isLastOne = true
        }
        await this.teacherAddLessonToPackage({
          packageId,
          lessonId,
          isLastOne
        })
          .then(() => {
            // this.$notify({
            //   title: '成功',
            //   message: '这是一条成功的提示消息' + packageId,
            //   type: 'success'
            // })
          })
          .catch(err => {
            console.error(err)
            // this.$notify({
            //   title: '失败',
            //   message: '这是一条失败的提示消息' + packageId,
            //   type: 'error'
            // })
          })
      }
    },
    async removeLessonFromPackages() {
      let lessonId = this.editingLessonId
      let packageIds = this.removingPackageIds
      let isLastOne = false
      for (let i = 0; i < packageIds.length; i++) {
        let packageId = packageIds[i]
        if (i === packageIds.length - 1) {
          isLastOne = true
        }
        await this.teacherRemoveLessonFromPackage({
          packageId,
          lessonId,
          isLastOne
        })
          .then(() => {
            // this.$notify({
            //   title: '成功',
            //   message: '这是一条成功的提示消息' + packageId,
            //   type: 'success'
            // })
          })
          .catch(err => {
            console.error(err)
            // this.$notify({
            //   title: '失败',
            //   message: '这是一条失败的提示消息' + packageId,
            //   type: 'error'
            // })
          })
      }
    },
    async updateLesson() {
      if (!this.isLinkPageUrlValid) {
        return
      }
      if (this.isLessonNameEmpty) {
        this.$message({
          message: this.$t('lesson.lessonManage.nameIsRequiredInfo'),
          type: 'warning'
        })
        return
      }
      let updatingData = this.updatingLessonData
      this.isLoading = true
      await this.teacherUpdateLesson({
        updatingData
      })
        .then(async () => {
          this.$message({
            message: this.$t('common.saveSuccess'),
            type: 'success'
          })
          await this.removeLessonFromPackages()
          await this.addLessonToPackages()
          this.isEditorMod ? this.resetCancel() : this.toLessonManagerPage()
          this.isLoading = false
          return Promise.resolve()
        })
        .catch(error => {
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.packageManage.pleaseLogin')
              break
            case 409:
              errorMsg = this.$t('lesson.lessonManage.urlConflict')
              break
            default:
              errorMsg = this.$t('common.saveFail')
              break
          }
          this.$message({
            message: errorMsg,
            type: 'error'
          })
          this.isLoading = false
          return Promise.reject(new Error('Update lesson failed'))
        })
    },
    resetCancel() {
      this.$emit('refresh')
      this.$emit('cancel')
    }
  },
  components: {
    LessonEditorHeader,
    LessonBasicInfo,
    CoverMediaSetter,
    LessonMoreInfoSettting
  }
}
</script>
<style lang="scss">
.edit-lesson {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-container {
    flex: 1;
    overflow: auto;
  }
  &-cover {
    padding: 35px;
  }
  &-more-info {
    background-color: #fff;
    padding: 0 36px 44px;
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .edit-lesson {
    &-cover, &-more-info {
      padding: 16px;
    }
  }
}
</style>
