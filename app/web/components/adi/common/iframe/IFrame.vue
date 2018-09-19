<template>
  <div class='comp-iframe' :style='frameStyle'>
    <iframe :src='properties.src' frameborder="0"/>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiIFrame',
  mixins: [compBaseMixin],
  computed: {
    frameStyle() {
      let ratio = this.properties.ratio
      if (Number(ratio)) {
        return {
          'padding-top': Number(ratio) * 100 + '%'
        }
      } else if(ratio.match(/^\d+\/\d+$/gi)) {
        return {
          'padding-top': (100 / eval(ratio)) + '%'
        }
      } else {
        return {
          'width': this.properties.width,
          'height': this.properties.height
        }
      }
    }
  }
}
</script>

<style lang="scss">
.comp-iframe {
  position: relative;
  width: 100%;
  height: 0px;
  > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
