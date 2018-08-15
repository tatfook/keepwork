<template>
  <el-dialog class="dialog" :title="$t('editor.pptPresentation')" :visible.sync="isDialogShow" :before-close="handleClose" center>
    <div class="reveal">
      <div class="slides">
        <!-- <section>Slide 1</section>
        <section>			
          <section>Vertical Slide 2</section>
          <section>Vertical Slide 2.1</section>
          <section>Vertical Slide 2.2</section>
        </section>
        <section>Slide 3</section> -->

        <section data-markdown>
          <textarea data-template>
            ## Page title
            A paragraph with some text and a [link](http://hakim.se).
          </textarea>
        </section>

        <section data-markdown>
            <script type="text/template">
                ## Page title2
                A paragraph with some text and a [link](http://hakim.se).
            </script>
        </section>

        <!-- <section data-markdown data-separator="---" data-separator-vertical="--"> -->
        <section data-markdown data-separator="---">
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

import Reveal from 'reveal.js/js/reveal'
import 'reveal.js/lib/js/head.min.js'

// import Reveal from 'reveal.js'
import Marked from 'reveal.js/plugin/markdown/marked.js'
window.Reveal = Reveal
window.marked = Marked
// import Markdown  from 'reveal.js/plugin/markdown/markdown.js'
// Markdown.initialize()

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
      // dependencies: [
      //   { src: 'plugin/markdown/marked.js' },
      //   { src: 'plugin/markdown/markdown.js' },
      //   { src: 'plugin/notes/notes.js', async: true },
      //   { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
      // ]
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
