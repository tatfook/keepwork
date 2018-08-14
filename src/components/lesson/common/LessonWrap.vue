<template>
  <div>
    <hint v-if="data.cmd === 'Hint'" :data="data" />
    <quiz v-else-if="data.cmd === 'Quiz'" :data="data" />
  </div>
</template>

<script>
import Quiz from './quiz'
import Hint from './Hint'
export default {
  name: 'LessonWrap',
  components: {
    quiz: Quiz,
    hint: Hint
  },
  props: {
    data: Object,
    originData: Array
  }
}
</script>

