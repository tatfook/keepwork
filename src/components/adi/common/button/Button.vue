<template>
  <div class="comp-button">
    <a>
      <button :style="style" @click="more"> {{data.text}} </button>
      <!-- <router-view></router-view> -->
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiButton',
  mixins: [compBaseMixin],
  methods: {
    more() {
      this.$router.push({ path: '/PageViewer' }) //其中PageViewer是定义的一个路由模块
    }
  },
  computed: {
    style() {
      return (
        'font-size:' +
        this.options.fontSize +
        ';color:' +
        this.options.fontColor +
        ';background:' +
        this.options.bgColor
      )
    },
    data() {
      return JSON.parse(this.source.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  height: 100%;
  a {
    height: 100%;
    button {
      border: none;
      height: 100%;
      // line-height: 20px;
    }
  }
}
</style>