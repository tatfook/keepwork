<template>
  <div class="lesson-wrap">
    <lesson-wrap v-for="(item,index) in lesson" :key="index" :data="item" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from './LessonWrap'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap
  },
  mounted() {
    this.copyProhibited()
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.lessonId = this.$route.params.id || 1
    await this.getLessonContent({ lessonId: this.lessonId })
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent'
    }),
    copyProhibited() {
      document.oncontextmenu = new Function('event.returnValue=false')
      document.onselectstart = new Function('event.returnValue=false')
      document.onkeydown = () => {
        if (event.ctrlKey && window.event.keyCode === 67) return false
        if (event.ctrlKey && window.event.keyCode === 86) return false
      }
      document.body.oncopy = () => false
    }
  },
  computed: {
    ...mapGetters({
      lessonContent: 'lesson/student/lessonContent',
      lessonContentFormat: 'lesson/student/lessonContentFormat'
    }),
    alphabet() {
      console.warn('genAlphabet--->')
      return this.genAlphabet()
    },
    lesson() {
      return this.lessonContentFormat(this.lessonId)
    }
  }
}
</script>

<style lang="scss">
.lesson-wrap {
  counter-reset: no;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
</style>