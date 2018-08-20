<template>
  <el-dialog class="dialog" :title="$t('editor.pptPresentation')" :visible.sync="isDialogShow" :before-close="handleClose" center>0
    <div class="reveal">1
      <div class="slides">2
        <!-- <section>Slide 1</section>
        <section>			
          <section>Vertical Slide 2</section>
          <section>Vertical Slide 2.1</section>
          <section>Vertical Slide 2.2</section>
        </section>
        <section>Slide 3</section> -->

        <section data-markdown>3
          <textarea data-template>
            ## Page title
            A paragraph with some text and a [link](http://hakim.se).
          </textarea>
        </section>

        <section data-markdown>4
          <script type="text/template">
            ## Page title2
            A paragraph with some text and a [link](http://hakim.se).
          </script>
        </section>

        <!-- <section data-markdown data-separator="---" data-separator-vertical="--"> -->
        <section data-markdown data-separator="---">5
          <script type="text/template">
            # 主題1
            - 主題1-內容1
            - 主題1-內容2
            <!-- --
            ## 主題1-內容1
            內容1-細節1
            --
            ## 主題1-內容2
            內容1-細節2 -->
            ---
            # 主題2
            <h1>11111111</h1>
            <h2>2222222</h2>
            <h3>3333333</h3>
            <hr>
            ---
          </script>
        </section>
      </div>
    </div>
  </el-dialog>
</template>

<script>

// import compBaseMixin from '../comp.base.mixin'

// import '/node_modules/reveal.js/css/reveal.css'
// import '/node_modules/reveal.js/css/theme/black.css'

import reveal from 'reveal.js/js/reveal.js'
// import 'reveal.js/lib/js/head.min.js'
// import reveal from 'reveal.js'
window.Reveal = reveal
import Marked from 'reveal.js/plugin/markdown/marked.js'
window.marked = Marked
// import Markdown  from 'reveal.js/plugin/markdown/markdown.js'
// Markdown.initialize()

import classList from 'reveal.js/lib/js/classList.js'
// import highlight from 'reveal.js/plugin/highlight/highlight.js'
// import search from 'reveal.js/plugin/search/search.js'
// import zoom from 'reveal.js/plugin/zoom-js/zoom.js'
// import notes from 'reveal.js/plugin/notes/notes.js'
// import math from 'reveal.js/plugin/math/math.js'

export default {
  // name: '',
  props: {
    isEditorShow: Boolean
  },
  data() {
    return {}
  },
  // mixins: [compBaseMixin],
  components: {},
  computed: {
    isDialogShow() {
      return this.isEditorShow
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
  },
  mounted() {
    Reveal.initialize({
      controls: true,
      progress: true,
      history: true,
      center: true,

      transition: 'slide', // none/fade/slide/convex/concave/zoom

      // More info https://github.com/hakimel/reveal.js#dependencies
      dependencies: [
        { src: classList, condition: function() { return !document.body.classList; } },
        { src: Marked, condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        // { src: markdown, condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        // { src: highlight, async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        // { src: search, async: true },
        // { src: zoom, async: true },
        // { src: notes, async: true },
        // { src: math, async: true }
      ]
    })
  },
  created() {
  }
}
</script>

<style lang="scss">
  @import url('reveal.js/css/reveal.css');
  @import url('reveal.js/css/theme/white.css');
  .reveal {
    width: 750px;
    height: 500px;
  }
</style>
