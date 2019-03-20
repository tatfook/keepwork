<template>
  <div class="org-teacher-lesson-plan" mod-container>
    <lesson-hint-toggle v-if="ishasHint" />
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" :isPreview="true" :isTeacher="true" />
  </div>
</template>

<script>
import LessonHintToggle from './LessonHintToggle'
import LessonWrap from '../common/LessonWrap'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'OrgTeacherLessonPlan',
  components: {
    LessonHintToggle,
    LessonWrap
  },
  computed: {
    ...mapGetters({
      orLessonDetail: 'org/teacher/orgLessonDetail'
    }),
    modList() {
      return _.get(this.orLessonDetail, 'modList', [])
    },
    ishasHint() {
      return _.filter(this.modList, item => item.cmd === 'Hint' ).length > 0
    },
    lessonHeader() {
      return _.find(this.modList, item => item.cmd === 'Lesson')
    },
    lessonMain() {
      return _.filter(this.modList, item => item.cmd !== 'Lesson')
    }
  }
}
</script>

<style lang="scss">
.org-teacher-lesson-plan {
  max-width: 1229px;
  padding: 0 15px;
  margin: 0 auto;
}
</style>


