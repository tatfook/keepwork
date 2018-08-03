<template>
  <div class="lesson-header">
    <div class="lesson-header-nav">
      <div class="lesson-header-nav-box">
        <div class="lesson-header-nav-item">
          ABOUT
        </div>
        <div class="lesson-header-nav-item">
          LESSONS
        </div>
        <div class="lesson-header-nav-item">
          STUDENT COLUMN
        </div>
      </div>
      <div class="lesson-header-toggle-button">View Teacher`s Page</div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Header'
}
</script>
<style lang="scss" scoped>
.lesson-header {
  background-color: #fff;
  border-bottom: 2px solid #bfbfbf;
  padding: 14px 0;
  &-nav {
    max-width: 1150px;
    margin: 0 auto;
    position: relative;
    &-box {
      text-align: center;
    }
    &-item {
      display: inline-block;
      margin: 0 32px;
      cursor: pointer;
      border-radius: 34px;
      padding: 6px 18px;
    }
    &-item:hover {
      background-color: #409efe;
      color: #fff;
      box-shadow: 0 4px 6px 0 rgba(42, 102, 164, 0.38);
    }
  }
  &-toggle-button {
    padding: 11px;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid;
    color: #409efe;
    border-radius: 4px;
    font-size: 12px;
  }
}
</style>

