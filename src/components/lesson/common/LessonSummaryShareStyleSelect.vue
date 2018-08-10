<template>
    <div class="lesson-summary-share-style-select">
        <div class="button">
            <span class="icon left-icon"></span>
        </div>
        <div class="style-preview">
            <lesson-summary-share/>
        </div>
        <div class="button">
            <span class="icon right-icon"></span>
        </div>
    </div>
</template>


<script>
import LessonSummaryShare from './LessonSummaryShare'
export default {
  name: 'LessonSummaryShareStyleSelect',
  components: {
    'lesson-summary-share': LessonSummaryShare
  },
  data() {
    return {}
  }
}
</script>


<style lang="scss">
.lesson-summary-share-style-select {
  display: flex;
  align-items: center;
  .style-preview {
    flex: 1;
    margin: 0 10px;
  }
  .button {
    width: 30px;
    background: red;
    height: 360px;
    cursor: pointer;
    .icon {
      display: line-block;
      height: 34px;
      width: 17px;
      background: red;
      &.left-icon {
        background: url('../../../assets/lessonImg/summary/left.png') no-repeat
          center;
      }
      &.right-icon {
        background: url('../../../assets/lessonImg/summary/right.png') no-repeat
          center;
      }
    }
  }
}
</style>




