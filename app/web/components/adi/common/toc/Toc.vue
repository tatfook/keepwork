<template>
  <div class="comp-toc">
    <div class="title">{{properties.title}}</div>
    <div :id="tocId" class="toc"></div>
    <div class="toc-source">
      <vue-markdown :watches='["toc"]' :show="show" :source="code" :toc-id="tocId" :toc="toc" :toc-first-level="1" :toc-last-level="5" />
    </div>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'AdiToc',
  data() {
    return {
      toc: false,
      show: false
    }
  },
  mixins: [compBaseMixin],
  components: {
    VueMarkdown
  },
  computed: {
    ...mapGetters({
      code: 'code'
    }),
    tocId() {
      return (
        'toc' +
        Math.random()
          .toString(10)
          .substr(2, 4)
      )
    }
  },
  methods: {},
  created() {
    setTimeout(() => {
      this.toc = true
      this.show = true

      const dom = document.querySelector('.toc-source')

      if (dom) {
        document.querySelector('.toc-source').remove()
      }
    }, 0)
  }
}
</script>
<style lang="scss">
.comp-toc {
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .toc {
    ul.table-of-contents {
      padding: 0;
    }

    ul {
      list-style: none;

      li {
        padding-top: 15px;
        font-size: 18px;

        a {
          color: #3977ad;
          text-decoration: none;
        }

        a:hover {
          color: #64adec;
        }
      }
    }
  }
}
</style>
