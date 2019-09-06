<template>
  <div class="new-lesson" v-loading='isLoading'>
    <lesson-editor-header :isLinkPageUrlValid='isLinkPageUrlValid' :isCoursewareUrlValid="isCoursewareUrlValid" :isLessonNameEmpty='isLessonNameEmpty' @saveLesson='saveNewLesson'></lesson-editor-header>
    <div class="new-lesson-container">
      <lesson-basic-info ref="basicInfoComponent"></lesson-basic-info>
      <cover-media-setter class="new-lesson-cover" ref="coverUrlComponent"></cover-media-setter>
      <div class="new-lesson-more-info">
        <div class="new-lesson-more-info-button" :class="{'is-append': isMoreInfoShow}" @click="toggleMoreSettingInfo">
          <span v-show="!isMoreInfoShow">{{$t('lesson.lessonManage.moreInfo')}}</span>
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <lesson-more-info-settting v-show="isMoreInfoShow" ref="moreInfoComponent"></lesson-more-info-settting>
      </div>
    </div>
  </div>
</template>
<script>
import CoverMediaSetter from './CoverMediaSetter'
import LessonEditorHeader from './LessonEditorHeader'
import LessonBasicInfo from './LessonBasicInfo'
import LessonMoreInfoSettting from './LessonMoreInfoSettting'
import { mapActions } from 'vuex'
export default {
  name: 'NewLesson',
  mounted() {
    this.isMounted = true
  },
  data() {
    return {
      isLoading: false,
      isMounted: false,
      editingLessonId: undefined,
      isMoreInfoShow: false
    }
  },
  computed: {
    newLessonSelectPackageIds() {
      return this.$refs.basicInfoComponent.belongToPackageIds
    },
    newLessonBasicInfo() {
      return this.$refs.basicInfoComponent.editingLessonDetail
    },
    newLessonCoverUrl() {
      return this.$refs.coverUrlComponent.newPackageCoverUrl
    },
    newLessonMoreInfo() {
      return this.$refs.moreInfoComponent.moreInfoData
    },
    isLinkPageUrlValid() {
      if (!this.isMounted) {
        return true
      }
      return this.$refs.basicInfoComponent.isLinkPageUrlValid
    },
    isCoursewareUrlValid() {
      if (!this.isMounted) {
        return true
      }
      return this.$refs.basicInfoComponent.isCoursewareUrlValid
    },
    isLessonNameEmpty() {
      if (!this.isMounted) {
        return true
      }
      let lessonName = this.newLessonData && this.newLessonData.lessonName
      return !lessonName || lessonName == ''
    },
    newLessonData() {
      return _.assign(
        this.newLessonBasicInfo,
        _.omit(this.newLessonMoreInfo, [
          'videoUrl',
          'teacherVideoUrl',
          'studentVideoUrl',
          'duration'
        ]),
        {
          extra: {
            duration: this.newLessonMoreInfo.duration,
            teacherVideoUrl: this.newLessonMoreInfo.teacherVideoUrl,
            studentVideoUrl: this.newLessonMoreInfo.studentVideoUrl,
            coverUrl: this.newLessonCoverUrl,
            videoUrl: this.newLessonMoreInfo.videoUrl
          }
        }
      )
    }
  },
  methods: {
    ...mapActions({
      createNewLesson: 'lesson/teacher/createNewLesson',
      addLessonToPackage: 'lesson/teacher/addLessonToPackage'
    }),
    toggleMoreSettingInfo() {
      this.isMoreInfoShow = !this.isMoreInfoShow
    },
    async addLessonToPackages() {
      let lessonId = this.editingLessonId
      let packageIds = this.newLessonSelectPackageIds
      let isLastOne = false
      for (let i = 0; i < packageIds.length; i++) {
        let packageId = packageIds[i]
        if (i === packageId.length - 1) {
          isLastOne = true
        }
        await this.addLessonToPackage({
          packageId,
          lessonId,
          isLastOne
        })
          .then(() => {})
          .catch(err => {
            console.error(err)
          })
      }
    },
    async saveNewLesson() {
      if (!this.isLinkPageUrlValid || !this.isCoursewareUrlValid) {
        return
      }
      if (this.isLessonNameEmpty) {
        this.$message({
          message: this.$t('lesson.lessonManage.nameIsRequiredInfo'),
          type: 'warning'
        })
        return
      }
      this.isLoading = true
      let newLessonData = this.newLessonData
      await this.createNewLesson({
        newLessonData
      })
        .then(async lessonDetail => {
          this.isLoading = false
          this.editingLessonId = lessonDetail.id
          this.$message({
            message: this.$t('common.saveSuccess'),
            type: 'success'
          })
          await this.addLessonToPackages()
          this.toLessonManagerPage()
        })
        .catch(error => {
          this.isLoading = false
          let errorMsg = ''
          switch (error.status) {
            case 401:
              errorMsg = this.$t('lesson.lessonManage.pleaseLogin')
              break
            case 409:
              errorMsg = this.$t('lesson.lessonManage.lessonNameConflict')
              break
            default:
              errorMsg = this.$t('common.saveFail')
              break
          }
          this.$message({
            message: errorMsg,
            type: 'error'
          })
          return Promise.reject(new Error('Create new Lesson failed'))
        })
    },
    toLessonManagerPage() {
      this.$router.push('/createPackage/lessonManager')
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
.new-lesson {
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
    &-button {
      cursor: pointer;
      font-size: 14px;
      color: #333;
      font-weight: bold;
      padding-top: 20px;
      border-top: 1px solid #f5f5f5;
      padding-bottom: 100px;
      text-align: left;
      font-size: 14px;
      color: #333;
      .el-icon-d-arrow-right {
        margin-left: 16px;
        transform: rotate(90deg);
        font-weight: bold;
      }
    }
    &-button.is-append {
      padding-bottom: 20px;
      text-align: right;
      color: #409eff;
      font-size: 21px;
      margin-top: 15px;
      border: none;
      .el-icon-d-arrow-right {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .new-lesson {
    &-cover {
      padding: 16px;
    }
    &-more-info {
      padding: 0 16px;
      &-button {
        padding-bottom: 16px;
      }
    }
  }
}
</style>
