<template>
  <div class="comp-inner-modal" v-if="options.isShowInnerModal">
    <div class="innerModal" :style="style">
      <a class="el-icon-close close" @click="setInnerModalHide"></a>
      <component :is="innerModalComponent" />
    </div>
  </div>
</template>


<script>
import lodash from 'lodash'
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiInnerModal',
  mixins: [compBaseMixin],
  methods: {
    setInnerModalHide() {
      this.options.hideModal()
    }
  },
  computed: {
    innerModalComponent() {
      return this.options.innerModalComponent
    },
    style() {
      return this.generateStyleString({
        width: this.options.width,
        height: this.options.height,
        'background-color': this.options['background-color']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-inner-modal {
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;

  .innerModal {
    position: relative;

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 20px;
    }

    .content {
      padding: 10px;
    }
  }
}
</style>
