<template>
  <div class="org-admin-courseware">
    <lesson-wrap v-for="mod in lessonMain" :mod="mod" :key="mod.key" :isPreview="true" :isTeacher="true" />
  </div>
</template>

<script>
import LessonWrap from '@/components/org/common/LessonWrap'
import _ from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'OrgAdminCourseware',
  components: {
    LessonWrap
  },
  computed: {
    ...mapGetters({
      orgLessonDetail: 'org/orgLessonDetail'
    }),
    modList() {
      return _.get(this.orgLessonDetail, 'courseware', [])
    },
    lessonMain() {
      return _.filter(this.modList, item => item.cmd !== 'Lesson')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-admin-courseware {
  max-width: 1229px;
  padding: 0 15px;
  margin: 0 auto;
}
</style>