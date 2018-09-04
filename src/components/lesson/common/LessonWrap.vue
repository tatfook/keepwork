<template>
  <div>
    <Hint v-if="data.cmd === 'Hint' && isShowHint" :data="data" />
    <Quiz v-else-if="data.cmd === 'Quiz'" :data="data" :isPreview="isPreview" :isPrint="isPrint" />
    <Markdown v-else-if="data.cmd === 'Markdown'" :data="data" />
    <BigFile v-else-if="data.cmd === 'BigFile'" :data="data" />
  </div>
</template>

<script>
import Quiz from './Quiz'
import Hint from './Hint'
import Markdown from './Markdown'
import BigFile from './BigFile'
import { mapGetters } from 'vuex'
export default {
  name: 'LessonWrap',
  components: {
    Quiz,
    Hint,
    Markdown,
    BigFile
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

