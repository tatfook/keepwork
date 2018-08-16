<template>
  <div class="lesson-teacher-progress">
    <span class="progress-point start pointer">

    </span>
    <el-progress class="progress-line line-1" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="0" status="success"></el-progress>
    <span class="progress-point middle"></span>
    <el-progress class="progress-line line-2" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="0" status="success"></el-progress>
    <span class="progress-point end"></span>
  </div>
</template>

<script>
export default {
  name: 'LessonTeacherProgress',
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.lesson-teacher-progress {
  $green: #66cd2e;
  $grey: #d2d2d2;
  display: flex;
  flex-direction: row;
  align-items: center;
  .progress-point {
    position: relative;
    z-index: 998;
    $size: 33px;
    display: inline-block;
    height: $size;
    width: $size;
    border-radius: 50%;
    background: $grey;
    border: 3px solid white;
    box-shadow: 1px 3px 6px rgb(185, 185, 185);
    &.start {
      position: relative;
      z-index: 9;
      margin-right: -25px;
      cursor: pointer;
    }
    &.middle {
    }
    &.end {
      position: relative;
      margin-left: -25px;
      z-index: 9;
    }
    &.pointer {
      $size: 33px;
      height: $size;
      width: $size;
      border-width: 3px;
      cursor: pointer;
      background: $green;
    }

    &.click {
      $size: 30px;
      $size: 30px;
      height: $size;
      width: $size;
      border-width: 6px;
      cursor: pointer;
      background: $green;
    }
  }
  .progress-line {
    flex: 1;
    &.line-1 {
      margin-right: -25px;
    }
    &.line-2 {
      margin-left: -25px;
    }
  }
  .el-progress-bar__outer {
    background-color: $grey;
  }
}
</style>

