<template>
  <div class="org-admin-lesson-plan">
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" :isPreview="true" :isTeacher="true" />
  </div>
</template>

<script>
import LessonWrap from '@/components/org/common/LessonWrap'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'OrgAdminLessonPlan',
  components: {
    LessonWrap
  },
  computed: {
    ...mapGetters({
      orgLessonDetail: 'org/orgLessonDetail'
    }),
    modList() {
      return _.get(this.orgLessonDetail, 'modList', [])
    },
    lessonMain() {
      return _.filter(this.modList, item => item.cmd !== 'Lesson')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-admin-lesson-plan {
  max-width: 1229px;
  padding: 0 15px;
  margin: 0 auto;
}
</style>