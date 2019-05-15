<template>
  <div class="lesson-package-cell">
    <div class="lesson" @click="goLessonPackage(lessonPackage)">
      <div class="lesson-cover"><img class="lesson-cover-img" :src="lessonPackage.cover" alt=""></div>
      <h4 class="lesson-title" :title="lessonPackage.title" v-html="lessonPackage.title || lessonPackage.packageName"></h4>
      <div class="lesson-desc">
        <p>{{$t('lesson.include')}}：
          <span>{{lessonPackage.total_lessons || 0}}</span>{{$t('lesson.lessonsCount')}}</p>
        <p>{{$t('lesson.ages')}}：{{getPackageSuitableAge(lessonPackage)}}</p>
        <p class="lesson-desc-text" v-html="`${$t('lesson.intro')}：${lessonPackage.description ? lessonPackage.description : ''}`"></p>
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
      if (this.$route.name === 'LessonPackage') {
        return this.$router.push({
          name: 'PackageDetail',
          params: {
            packageId: lessonPackage.id
          }
        })
      }
      window.location.href = `${window.location.origin}/s/lesson/package/${lessonPackage.id}`
    },
    getPackageSuitableAge(lessonPackage) {
      let { age_min, age_max } = lessonPackage
      if (age_min == 0 && age_max == 0) {
        return this.$t('lesson.packageManage.SuitableForAll')
      }
      return `${age_min}-${age_max}`
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
    margin: 0 auto 10px;
    border-radius: 4px;
    transition: all 200ms ease-in;
    cursor: pointer;
    .red {
      color: red;
    }
    &:hover {
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
      transition: all 200ms ease-in;
    }
    &-cover {
      width: 100%;
      height: 143px;
      &-img {
        width: 100%;
        height: 143px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
    &-title {
      font-size: 14px;
      margin: 10px 0;
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-desc {
      font-size: 12px;
      color: #909399;
      &-text {     
        height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-height: 20px;
        -webkit-box-orient: vertical;
        margin-bottom: 0;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .lesson-package-cell {
    .lesson {
      width: 100%;
      max-width: 230px;
      padding: 4px;
      font-size: 12px;
      border: none;
      &-cover {
        width: 100%;
        height: 90px;
        &-img {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 4px;
        }
      }
      &-title {
        font-size: 12px;
      }
      &-desc {
        p {
          margin: 5px 0;
        }
      }
    }
  }
}
</style>


