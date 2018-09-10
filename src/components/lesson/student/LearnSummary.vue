<template>
  <div>
    <student-summary/>
  </div>
</template>

<script>
import StudentSummary from './StudentSummary'
export default {
  name: 'LearnSummary',
  components: {
    'student-summary': StudentSummary
  },
  props: {},
  mounted() {}
}
</script>

<style lang="scss">
</style>


