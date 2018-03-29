<template>
  <div class="comp-button">
    <a v-if="!options.clickEvent" :target='properties.target' :href="properties.link" :style="style">
      {{properties.name}}
    </a>
    <a v-if="options.clickEvent" @click='callback' :style="style">
      {{properties.name}}
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiButton',
  mixins: [compBaseMixin],
  methods: {
    callback() {
      this.options.callback()
    }
  },
  computed: {
    style() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor,
        'background-color': this.options.bgColor
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  a {
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 0px;
    border-radius: 4px;
    touch-action: manipulation;
    user-select: none;
    width: 100%;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
