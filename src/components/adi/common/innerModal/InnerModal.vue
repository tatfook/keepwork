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
  // render(h) {
  //   let self = this

  //   return (
  //     <div class="comp-inner-modal" v-show={self.options.isShowInnerModal}>
  //       <div class="innerModal" style={self.style}>
  //         {(() => {
  //           return h('a', {
  //             on: {
  //               click: self.setInnerModalHide
  //             },
  //             domProps: {
  //               className: 'el-icon-close close'
  //             }
  //           })
  //         })()}

  //         {(() => {
  //           return h(
  //             'component',
  //             {
  //               is: self.innerModalComponent,
  //               domProps: {}
  //             },
  //             []
  //           )
  //         })()}
  //       </div>
  //       {(() => {
  //         // setTimeout(() => {
  //         //   let compInnerModal = document.querySelectorAll('.comp-inner-modal')
  //         //   _.forEach(compInnerModal, element => {
  //         //     element.parentNode.style.height = '100%'
  //         //   })
  //         // }, 0)
  //       })()}
  //     </div>
  //   )
  // },
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
