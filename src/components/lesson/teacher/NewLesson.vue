<template>
  <div class="new-lesson">
    <lesson-editor-header></lesson-editor-header>
    <lesson-basic-info ref="basicInfoComponent"></lesson-basic-info>
    <cover-media-setter class="new-lesson-cover" ref="coverUrlComponent"></cover-media-setter>
    <div class="new-lesson-more-info">
      <div class="new-lesson-more-info-button" :class="{'is-append': isMoreInfoShow}" @click="toggleMoreSettingInfo">
        <span v-show="!isMoreInfoShow">更多信息</span>
        <i class="el-icon-d-arrow-right"></i>
      </div>
      <lesson-more-info-settting v-show="isMoreInfoShow" ref="moreInfoComponent"></lesson-more-info-settting>
    </div>
  </div>
</template>
<script>
import CoverMediaSetter from './CoverMediaSetter'
import LessonEditorHeader from './LessonEditorHeader'
import LessonBasicInfo from './LessonBasicInfo'
import LessonMoreInfoSettting from './LessonMoreInfoSettting'
export default {
  name: 'NewLesson',
  data() {
    return {
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
    }
  },
  methods: {
    toggleMoreSettingInfo() {
      this.isMoreInfoShow = !this.isMoreInfoShow
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
