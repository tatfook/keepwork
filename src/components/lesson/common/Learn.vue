<template>
  <div class="learn-container">
    <quiz/>
      {{ lesson }}
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import Quiz from './Quiz'
import Lesson from './Lesson'
export default {
  name: 'Learn',
  components: {
    'quiz': Quiz,
    'lesson': Lesson
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.lessonId = this.$route.params.id || 1
    await this.getLessonContent({ lessonId: this.lessonId })
    console.log(this.lesson)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent'
    })
  },
  computed: {
    ...mapGetters({
      lessonContent: 'lesson/student/lessonContent',
      lessonContentFormat: 'lesson/student/lessonContentFormat'
    }),
    lesson() {
      return this.lessonContentFormat(this.lessonId)
    }
  }
}
</script>


<style lang="scss">
.learn-container {
  width: 1024px;
  margin: 0 auto;
}
</style>

