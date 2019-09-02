<template>
  <div class="comp comp-ppt">
    <div class="render"></div>
    <div class="data">
      <div class="reveal">
        <div class="slides">
          <!-- <section v-for="item in getData" :key="item.key">
            <div data-template>{{ item.val }}</div>
          </section> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import ppt from 'reveal.js'
import markdown from 'reveal.js/plugin/markdown/markdown.js'
import 'reveal.js/css/reveal.scss'
import 'reveal.js/css/theme/source/night.scss'
import { setTimeout } from 'timers'

export default {
  name: 'AdiPpt',
  mixins: [compBaseMixin],
  mounted() {
    this.updatePpt()
  },
  updated() {
    this.updatePpt()
  },
  computed: {
    getData() {
      if (!this.properties.data) {
        return []
      }

      const mdArray = this.properties.data.split('---')
      const renderArray = []

      for (const index in mdArray) {
        const val = mdArray[index]

        renderArray.push({ index, val })
      }

      return renderArray
    }
  },
  methods: {
    async updatePpt() {
      if (this.$el) {
        const render = this.$el.querySelector('.render')
        const data = this.$el.querySelector('.data')

        if (!render || !data) {
          return false
        }

        render.innerHTML = null
        await render.appendChild(data.firstChild.cloneNode(true))

        const wrapper = this.$el.querySelectorAll('.reveal')
        const slides = this.$el.querySelectorAll('.slides')

        if (!wrapper[0] || !slides[0]) {
          return false
        }

        wrapper[0].style.height = (wrapper[0].clientWidth / 16 * 9) + 'px'

        for (const item of slides[0].childNodes) {
          item.setAttribute('data-markdown', '')
        }

        if (!ppt.isReady()) {
          ppt.initialize(
            {
              dom: {
                wrapper: wrapper[0],
                slides: slides[0]
              }
            }
          )

          this.markdown = markdown({ppt})
        } else {
          ppt.updateDom(
            {
              dom: {
                wrapper: wrapper[0],
                slides: slides[0]
              }
            }
          )

          for (const index in slides[0].childNodes) {
            const item = slides[0].childNodes[index]

            if (parseInt(index) !== 0 && typeof item === 'object') {
              item.style.display = null
            }
          }

          this.markdown.processSlides()
				  this.markdown.convertSlides()
        }

        setTimeout(() => {
          ppt.layout()
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-ppt {
  .data {
    display: none;
  }
}
</style>



