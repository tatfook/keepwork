<template>
  <div>
    <lesson v-if="data.cmd === 'Lesson'" :data="data"   />
    <hint v-else-if="data.cmd === 'Hint'" :data="data" />
    <quiz v-else-if="data.cmd === 'Quiz'" :data="data" />
  </div>
</template>

<script>
import Quiz from './quiz'
import Lesson from './Lesson'
import Hint from './Hint'
export default {
  name: 'LessonWrap',
  components: {
    quiz: Quiz,
    lesson: Lesson,
    hint: Hint
  },
  props: {
    data: Object,
    originData: Array
  }
}
</script>

