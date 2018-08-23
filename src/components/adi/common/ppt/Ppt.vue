<template>
  <div class="comp-ppt" style="height: 300px;">
    <div class="reveal">
      <div class="slides">
        <section data-markdown>
          <vue-markdown
            :source="'# HAHAHA\n## UUUUUUUU\n ### OOOOOO \n ```@Paracraft```'"/>
        </section>
        <section>Vertical Slide 1</section>
        <section>Vertical Slide 2</section>
      </div>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import Reveal from 'reveal.js'
import VueMarkdown from 'vue-markdown'
import 'reveal.js/css/reveal.css'
import 'reveal.js/css/theme/white.css'

export default {
  name: 'AdiPpt',
  props: {
    originValue: String
  },
  data() {
    return {
      isPptShow: false
    }
  },
  mixins: [compBaseMixin],
  components: {
    VueMarkdown
  },
  computed: {},
  methods: {
    cancel() {
      this.isPptShow = false
    }
  },
  mounted() {
    let wrapper = this.$el.querySelector('.reveal')
    let slides = this.$el.querySelector('.reveal .slides')

    console.log(wrapper)
    console.log(slides)

    Reveal.initialize({
      markdown: {
        smartypants: true
      },
      dom: {
        wrapper: wrapper,
        slides: slides
      }
    })
  }
}
</script>

<style lang="scss">
.comp-ppt {
}
</style>
