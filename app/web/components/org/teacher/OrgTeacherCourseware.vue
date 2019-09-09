<template>
  <div class="org-teacher-courseware" mod-container>
    <lesson-hint-toggle v-if="ishasHint" />
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" :isPreview="true" :isTeacher="true" />
  </div>
</template>

<script>
import LessonHintToggle from '@/components/org/teacher/LessonHintToggle'
import LessonWrap from '@/components/org/common/LessonWrap'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'OrgTeacherCourseware',
  components: {
    LessonHintToggle,
    LessonWrap
  },
  computed: {
    ...mapGetters({
      orgLessonDetail: 'org/teacher/orgLessonDetail',
      isShowLessonHint: 'org/teacher/isShowLessonHint'
    }),
    modList() {
      return _.get(this.orgLessonDetail, 'courseware', [])
    },
    ishasHint() {
      return _.filter(this.modList, item => item.cmd === 'Hint').length > 0
    },
    lessonMain() {
      const _lessonMain = _.filter(this.modList, item => item.cmd !== 'Lesson')
      return this.isShowLessonHint
        ? _lessonMain
        : _.filter(_lessonMain, item => item.cmd !== 'Hint')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-teacher-courseware {
  max-width: 1229px;
  padding: 0 15px;
  margin: 0 auto;
}
</style>