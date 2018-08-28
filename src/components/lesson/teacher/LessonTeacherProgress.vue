<template>
  <div class="lesson-teacher-progress">
    <span class="progress-point start">
      <div class="name">{{$t('lesson.lessonPlan')}}</div>
      <div :class="['pointer','light',{'selected': isShowPlan}]" @click="handleChangeView('plan')"></div>
    </span>
    <el-progress class="progress-line line-1" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="!reset && isBeInClass ? 100 : 0" status="success"></el-progress>
    <span class="progress-point middle">
      <div class="name">
        {{$t('lesson.performance')}}
      </div>
      <div :class="['pointer',{'selected': !reset && isShowPerformance, 'light': !reset && isBeInClass}]" @click="handleChangeView('performance')"></div>
    </span>
    <el-progress class="progress-line line-2" :text-inside="true" :show-text="false" :stroke-width="18" :percentage=" !reset && isClassIsOver ? 100 : 0" status="success"></el-progress>
    <span class="progress-point end">
      <div class="name">
        {{$t('lesson.summary')}}
      </div>
      <div :class="['pointer',{'selected': !reset && isShowSummary, 'light': !reset && isClassIsOver}]" @click="handleChangeView('summary')"></div>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonTeacherProgress',
  props: {
    reset: false
  },
  data() {
    return {
      isShowPlan: true,
      isShowPerformance: false,
      isShowSummary: false
    }
  },
  computed: {
    ...mapGetters({
      isBeInClass: 'lesson/teacher/isBeInClass',
      isClassIsOver: 'lesson/teacher/isClassIsOver'
    })
  },
  watch: {
    $route({ name }) {
      this[
        `isShow${name.toLowerCase().replace(/\b[a-z]/g, s => s.toUpperCase())}`
      ] = true
    }
  },
  methods: {
    handleChangeView(name) {
      if (this.reset) return
      this.isShowPlan = false
      this.isShowPerformance = false
      this.isShowSummary = false
      if (!this.isClassIsOver && name === 'summary') return
      if (!this.isBeInClass && name === 'performance') return
      'plan' === name && this.$router.push({ name })
      this.isBeInClass && 'performance' === name && this.$router.push({ name })
      this.isClassIsOver && 'summary' === name && this.$router.push({ name })
    }
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
    color: #818181;
    display: flex;
    height: 44px;
    &.start {
      position: relative;
      z-index: 9;
      margin-right: -25px;
      cursor: pointer;
    }
    &.end {
      position: relative;
      margin-left: -25px;
      z-index: 9;
    }
    .name {
      position: absolute;
      width: 100px;
      text-align: center;
      top: -24px;
      left: -27px;
    }
    .pointer {
      $size: 33px;
      height: $size;
      width: $size;
      background: $green;
      position: relative;
      z-index: 998;
      height: $size;
      width: $size;
      border-radius: 50%;
      background: $grey;
      border: 3px solid white;
      box-shadow: 1px 3px 6px rgb(185, 185, 185);
      &.light {
        background: $green;
        cursor: pointer;
      }
      &.selected {
        $size: 30px;
        height: $size;
        width: $size;
        border: 6px solid white;
        cursor: pointer;
        background: $green;
      }
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
}
</style>

