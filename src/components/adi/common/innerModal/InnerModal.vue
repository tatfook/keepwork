<template>
  <div class='comp-inner-modal'>
    <div class="innerModal" v-show="isShowInnerModal" v-html="test">
      <!-- <button type="button" class="close close-icon">
        <span aria-hidden="true" ng-click="closeModal()">&times;</span>
      </button>
      <p>{{params.paracraft_info.desc_info ? params.paracraft_info.desc_info : '如果您的设备没有自动使用Paracraft启动3D世界，请安装Paracraft'}}</p>
      <div class="btn btn-lg btn-default" ng-click="clickDownload()">{{ params.paracraft_info.desc_download ? params.paracraft_info.desc_download : '点击下载' }}</div> -->
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiInnerModal',
  mixins: [compBaseMixin],
  data() {
    return {
      isShowInnerModal: true,
      test: '<div>HelloWorld</div>'
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-inner-modal {
  background-color: black;
  opacity: 0.3;
}
</style>
