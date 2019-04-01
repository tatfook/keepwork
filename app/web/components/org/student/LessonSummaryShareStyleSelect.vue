<template>
  <div class="lesson-summary-share-style-select">
    <div class="button" :class="{'is-disabled': currentStyle === 1}" @click="prevStyle">
      <img src="../../../assets/lessonImg/summary/left.png" alt="prev">
    </div>
    <div class="style-preview">
      <lesson-summary-share :styleIndex="currentStyle" :isPreview="true" :isSmall="true" :lessonSummary="lessonSummary" />
    </div>
    <div class="button" :class="{'is-disabled': currentStyle === styles.length}" @click="nextStyle">
      <img src="../../../assets/lessonImg/summary/right.png" alt="next">
    </div>
  </div>
</template>


<script>
import LessonSummaryShare from './LessonSummaryShare'
export default {
  name: 'LessonSummaryShareStyleSelect',
  components: {
    LessonSummaryShare
  },
  props: {
    lessonSummary: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  data() {
    return {
      currentStyle: 1,
      dialogVisible: false,
      styles: [1, 2, 3]
    }
  },
  methods: {
    nextStyle() {
      this.currentStyle !== this.styles.length && this.currentStyle++
    },
    prevStyle() {
      this.currentStyle !== this.styles[0] && this.currentStyle--
    },
    previewCurrentStyle() {
      this.dialogVisible = true
    }
  }
}
</script>


<style lang="scss">
.preview-dialog {
  min-width: 1080px;
  .el-dialog__body {
    padding: 0;
  }
}
.lesson-summary-share-style-select {
  display: flex;
  align-items: center;
  .style-preview {
    flex: 1;
    cursor: pointer;
    &.style-1 {
      background: url('../../../assets/lessonImg/sharePreviewImg/style1.png')
        no-repeat center;
    }
    &.style-2 {
      background: url('../../../assets/lessonImg/sharePreviewImg/style2.png')
        no-repeat center;
    }
    &.style-3 {
      background: url('../../../assets/lessonImg/sharePreviewImg/style3.png')
        no-repeat center;
    }
  }
  .button {
    width: 60px;
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .icon {
      display: line-block;
      height: 34px;
      width: 17px;
      &.left-icon {
        background: url('../../../assets/lessonImg/summary/left.png') no-repeat
          center;
      }
      &.right-icon {
        background: url('../../../assets/lessonImg/summary/right.png') no-repeat
          center;
      }
    }
    &.is-disabled {
      cursor: not-allowed;
      background-color: #fff;
      filter: Alpha(Opacity=40);
      opacity: 0.4;
    }
  }
}
@media screen and (max-width: 768px) {
  .lesson-summary-share-style-select {
    .style-preview {
      width: 267px;
    }
  }
}
</style>




