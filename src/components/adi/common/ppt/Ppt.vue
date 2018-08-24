<template>
  <div class="comp-ppt">
    <div class="reveal">
      <div class="slides">
        <section data-markdown data-separator="---">
          # 主題1
          - 主題1-內容1
          - 主題1-內容2
          ---
          {{this.code}}
          ---
          <!-- <vue-markdown
            :source="'# HAHAHA\n## UUUUUUUU\n ### OOOOOO \n ```@Paracraft```'"/> -->
        </section>

        <section>Vertical Slide 1</section>
        <section>Vertical Slide 2</section>

        <!-- <section data-markdown data-separator="---">
          <script type="text/template">
            # 主題1
            - 主題1-內容1
            - 主題1-內容2
            ---
            # 主題2
            <h1>11111111</h1>
            <h2>2222222</h2>
            <h3>3333333</h3>
            <hr>
            ---
          </script>
        </section> -->

      </div>
    </div>
  </div>
</template>

<script>
// import compBaseMixin from '../comp.base.mixin'
// import Reveal from 'reveal.js'
import Reveal from 'reveal.js/js/reveal' //效果一样

// window.Reveal = Reveal
// import Marked from 'reveal.js/plugin/markdown/marked'
// window.marked = Marked
// import Markdown  from 'reveal.js/plugin/markdown/markdown'
// Markdown.initialize()

// import 'reveal.js/lib/js/head.min.js'
// import VueMarkdown from 'vue-markdown'
import 'reveal.js/css/reveal.css'
import 'reveal.js/css/theme/white.css'
import { mapGetters } from 'vuex'

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
  // mixins: [compBaseMixin],
  // components: {
  //   VueMarkdown
  // },
  computed: {
    ...mapGetters({
      code: 'code'
    }),
  },
  methods: {
    cancel() {
      this.isPptShow = false
    }
  },
  mounted() {
    // let wrapper = this.$el.querySelector('.reveal')
    // let slides = this.$el.querySelector('.reveal .slides')

    // console.log(wrapper)
    // console.log(slides)

    Reveal.initialize({
      // markdown: {
      //   // smartypants: true
      // },
      // dom: {
      //   wrapper: wrapper,
      //   slides: slides
      // }
      // dependencies: [
      //   { src: classList, condition: function() { return !document.body.classList; } },
      //   { src: Marked, condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
      //   { src: markdown, condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
      //   { src: highlight, async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
      // ]
    })
  }
}
</script>

<style lang="scss">
.comp-ppt {

  height: 500px;
}
</style>
