<template>
  <div class="lesson-package-cell">
    <div class="lesson">
      <img class="lesson-cover" :src="lessonPackage.coverUrl" alt="" @click="goLessonPackage(lessonPackage)">
      <h4 class="lesson-title" @click="goLessonPackage(lessonPackage)" :title="lessonPackage.title" v-html="lessonPackage.name_title"></h4>
      <div class="lesson-desc">
        <p>包含：
          <span>{{lessonPackage.total_lessons}}</span>个课程</p>
        <p>年龄：{{lessonPackage.age_min}}-{{lessonPackage.age_max}}</p>
        <p>简介：{{lessonPackage.intro}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LessonPackageCell',
  props: {
    lessonPackage: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    goLessonPackage(lessonPackage) {
      window.open(`/l/student/package/${lessonPackage.id}`)
    }
  }
}
</script>
<style lang='scss'>
.lesson-package-cell {
  .lesson {
    width: 290px;
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    background: #fff;
    &-cover {
      width: 100%;
      height: 143px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
    }
    &-title {
      font-size: 14px;
      margin: 10px 0;
      cursor: pointer;
      .red {
        color: red;
      }
    }
    &-desc {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>


