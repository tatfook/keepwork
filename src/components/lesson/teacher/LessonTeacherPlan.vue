<template>
  <div class="lesson-plan">
    <lesson-hint-toggle />
    <lesson-wrap v-for="(item,index) in lessonMain" :key="index" :data="item" :isPreview="true" />
  </div>
</template>

<script>
import LessonHintToggle from './LessonHintToggle'
import LessonWrap from '../common/LessonWrap'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonTeacherPlan',
  components: {
    LessonHintToggle,
    LessonWrap
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/teacher/lessonDetail'
    }),
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeader() {
      return this.lesson.filter(({ cmd }) => cmd === 'Lesson')[0]
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    }
  }
}
</script>

<style lang="scss">
.lesson-plan {
  max-width: 1229px;
  padding: 0 15px;
  margin: 0 auto;
}
</style>


