<template>
  <div class="comp comp-ppt">
    Hello World!!!
    <div class="reveal-t">
      <div class="slides-t">
        <section data-markdown data-separator="---">
          # 主題1
          - 主題1-內容1
          - 主題1-內容2
          ---
          12312312312
          ---
          <!-- <vue-markdown
            :source="'# HAHAHA\n## UUUUUUUU\n ### OOOOOO \n ```@Paracraft```'"/> -->
        </section>

        <section>Vertical Slide 1</section>
        <section>Vertical Slide 2</section>
      </div>
    </div>
  </div>
</template>

<script>
import ppt from 'reveal.js'
import 'reveal.js/css/reveal.scss'

export default {
  name: 'AdiPpt',
  mounted() {
    if (this.$el) {
      const wrapper = this.$el.querySelector('.reveal-t')
      const slides = this.$el.querySelector('.slides-t')
      console.log(wrapper)
      console.log(wrapper.classList)
      console.log(slides)

      ppt.initialize(
        {
          dom: {
            wrapper: wrapper,
            slides: slides
          }
        }
      )
    }
  }
}
</script>

