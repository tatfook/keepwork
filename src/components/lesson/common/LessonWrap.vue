<template>
  <div>
    <hint v-if="data.cmd === 'Hint' && isShowHint" :data="data" />
    <quiz v-else-if="data.cmd === 'Quiz'" :data="data" :isPreview="isPreview" :isPrint="isPrint"/>
  </div>
</template>

<script>
import Quiz from './Quiz'
import Hint from './Hint'
import { mapGetters } from 'vuex'
export default {
  name: 'LessonWrap',
  components: {
    quiz: Quiz,
    hint: Hint
  },
  props: {
    data: Object,
    originData: Array,
    isPreview: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isShowHint: 'lesson/teacher/isShowHint'
    })
  }
}
</script>

