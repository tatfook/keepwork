<template>
  <div class="org-admin-lesson-content">
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" :isPreview="true" />
  </div>
</template>

<script>
import LessonWrap from '../common/LessonWrap'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'orgAdminLessonContent',
  components: {
    LessonWrap
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'org/orgLessonDetail',
      lessonQuiz: 'org/lessonQuiz'
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


