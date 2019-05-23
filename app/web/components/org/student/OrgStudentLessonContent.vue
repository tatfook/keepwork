<template>
  <div class="org-student-lesson-content">
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" />
  </div>
</template>

<script>
import LessonWrap from '../common/LessonWrap'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'orgStudentLessonContent',
  components: {
    LessonWrap
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'org/student/orgLessonDetail',
      lessonQuiz: 'org/student/lessonQuiz'
    }),
    modList() {
      return _.get(this.lessonDetail, 'modList', [])
    },
    lessonMain() {
      return _.filter(
        this.modList,
        item => item.cmd !== 'Lesson' && item.cmd !== 'Hint'
      )
    }
  }
}
</script>


