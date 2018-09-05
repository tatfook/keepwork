<template>
  <div class="edit-lesson" v-loading='isLoading'>
    <lesson-editor-header v-if="!isGettingData" :isLessonNameEmpty='isLessonNameEmpty' @saveLesson='updateLesson'></lesson-editor-header>
    <lesson-basic-info v-if="!isGettingData" ref="basicInfoComponent" :editingLessonDetailProp='editingLessonDetail' :isEditing='true'></lesson-basic-info>
    <cover-media-setter v-if="!isGettingData" class="edit-lesson-cover" ref="coverUrlComponent" :editingCoverUrl='editingCoverUrl' :isEditing='true'></cover-media-setter>
    <lesson-more-info-settting class="edit-lesson-more-info" v-if="!isGettingData" ref="moreInfoComponent" :editingLessonDetailProp='editingLessonDetail' :isEditing='true'></lesson-more-info-settting>
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
    this.isGettingData = false
    this.isLoading = false
    this.$nextTick(() => {
      this.isMounted = true
    })
  },
  data() {
    return {
      editingLessonId: _.get(this.$route.params, 'id'),
      isGettingData: true,
      isLoading: false,
      isMounted: false,
      editingLessonDetail: {}
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/lessonDetail'
    }),
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
        _.omit(this.updatingMoreInfo, ['videoUrl']),
        {
          extra: {
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
    toLessonManagerPage() {
      this.$router.push('/teacher/lessonManager')
    },
    async addLessonToPackages() {
      let lessonId = this.editingLessonId
      let packageIds = this.addingPackageIds
      let isLastOne = false
      for (let i = 0; i < packageIds.length; i++) {
        let packageId = packageIds[i]
        if (i === packageId.length - 1) {
          isLastOne = true
        }
        await this.teacherAddLessonToPackage({
          packageId,
          lessonId,
          isLastOne
        })
          .then(() => {
            this.$notify({
              title: '成功',
              message: '这是一条成功的提示消息' + packageId,
              type: 'success'
            })
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '这是一条失败的提示消息' + packageId,
              type: 'error'
            })
          })
      }
    },
    async removeLessonFromPackages() {
      let lessonId = this.editingLessonId
      let packageIds = this.removingPackageIds
      let isLastOne = false
      for (let i = 0; i < packageIds.length; i++) {
        let packageId = packageIds[i]
        if (i === packageId.length - 1) {
          isLastOne = true
        }
        await this.teacherRemoveLessonFromPackage({
          packageId,
          lessonId,
          isLastOne
        })
          .then(() => {
            this.$notify({
              title: '成功',
              message: '这是一条成功的提示消息' + packageId,
              type: 'success'
            })
          })
          .catch(() => {
            this.$notify({
              title: '失败',
              message: '这是一条失败的提示消息' + packageId,
              type: 'error'
            })
          })
      }
    },
    async updateLesson() {
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
          // await this.addLessonToPackages()
          // await this.removeLessonFromPackages()
          this.toLessonManagerPage()
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
          return Promise.reject(new Error('Update lesson failed'))
        })
      this.isLoading = false
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
  &-cover {
    padding: 35px;
  }
  &-more-info {
    background-color: #fff;
    padding: 0 36px 44px;
  }
}
</style>
