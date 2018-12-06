<template>
  <div class="shared-course-lecturer">
    <div class="shared-course-lecturer-title">{{$t('lesson.youHaveBecome')}}<span class="extrude">{{$t('lesson.anInstructor')}}</span></div>
    <div class="shared-course-lecturer-contact">{{$t('lesson.getInstructorContact')}}</div>
    <learner-and-teacher></learner-and-teacher>

  </div>
</template>

<script>
import LearnerAndTeacher from '@/components/lesson/common/LearnerAndTeacher'
export default {
  components: {
    LearnerAndTeacher
  }
}
</script>

<style lang="scss">
.shared-course-lecturer {
  .lihgt{
    color: #ff742e;
  }
  &-title {
    text-align: center;
    font-size: 24px;
    line-height: 40px;
    margin: 14px;
    .extrude {
      color: #2397f3;
    }
  }
  &-contact {
    color: #2397f3;
    line-height: 50px;
    text-align: center;
    border: 1px solid #2397f3;
    background-color: rgb(238, 247, 255);
  }
}
</style>

