<template>
  <div class="comp-button">
    <a v-if="!options.clickEvent" :class="getClassStyle" :target='properties.target' :href="properties.link" :style="buttonStyle">
      <div v-if="options.img && options.img.src" class="img" :style="buttonImgStyle"></div>
      {{properties.name}}
    </a>
    <a v-if="options.clickEvent" :class="getClassStyle" @click='callback' :style="buttonStyle">
      <div v-if="options.img && options.img.src" class="img" :style="buttonImgStyle"></div>
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
    buttonStyle() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor || null,
        'background-color': this.options.bgColor || null
      })
    },
    buttonImgStyle() {
      return this.generateStyleString({
        width: this.options.img.width,
        height: this.options.img.height,
        'background-image': 'url(' + this.options.img.src + ')'
      })
    },
    getClassStyle() {
      switch (this.options.elBtn) {
        case 'default':
          return 'el-button el-button--default'
          break
        case 'primary':
          return 'el-button el-button--primary'
          break
        case 'success':
          return 'el-button el-button--success'
          break
        case 'info':
          return 'el-button el-button--info'
          break
        case 'warning':
          return 'el-button el-button--warning'
          break
        case 'danger':
          return 'el-button el-button--danger'
          break
        default:
          return ''
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  .img {
    margin-right: 10px;
    background-position: center;
    background-size: cover;
  }

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
    line-height: unset;
  }
}
</style>
