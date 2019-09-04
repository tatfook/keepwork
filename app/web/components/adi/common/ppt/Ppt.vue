<template>
  <div class="comp comp-ppt">
    <div class="preview">
      <img v-if="isImg" class="preview-img" :src="URL" :alt="filename">
      <video-player v-else-if="isVideo" :autoplay="false" class="preview-video" :src="URL" />
      <div class="preview-operation">
        <i @click="handleFullScreen" class="preview-operation-icon iconfont icon-full-screen"></i> <span @click="handleFullScreen" class="preview-operation-name">全屏播放</span>
      </div>
    </div>
    <el-dialog custom-class="fullscreen-dialog" :show-close="false" :visible.sync="isFullsreen" :append-to-body="true" :fullscreen="true">
      <fullscreen-PPT :pptList="pptList" v-if="isFullsreen" :visible="isFullsreen" @exitFullscreen="handelCloseFullscreen"></fullscreen-PPT>
    </el-dialog>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import videoPlayer from '@/components/common/VideoPlayer'
import FullscreenPPT from './FullscreenPPT'
import _ from 'lodash'

export default {
  name: 'AdiPpt',
  mixins: [compBaseMixin],
  components: {
    videoPlayer,
    FullscreenPPT
  },
  data() {
    return {
      isFullsreen: false
    }
  },
  methods: {
    handleFullScreen() {
      this.isFullsreen = !this.isFullsreen
    },
    handelCloseFullscreen() {
      this.isFullsreen = false
    }
  },
  computed: {
    pptList() {
      return _.get(this.properties, ['data'], [])
    },
    firstPPT() {
      return _.get(this.pptList, '[0]', {})
    },
    URL() {
      return _.get(this.firstPPT, 'downloadUrl', '')
    },
    filename() {
      return _.get(this.firstPPT, 'filename', '')
    },
    isVideo() {
      return this.firstPPT.type === 'videos'
    },
    isImg() {
      return this.firstPPT.type === 'images'
    }
  }
}
</script>


<style lang="scss" scoped>
/deep/ .fullscreen-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    height: 100vh;
    background: #191919;
  }
}
.comp-ppt {
  .preview {
    width: 100%;
    padding-bottom: 56%;
    position: relative;
    background: #191919;
    &-img,
    &-video {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: contain;
      top: 0;
      left: 0;
      box-sizing: border-box;
      /deep/.vjs-control-bar {
        display: none;
      }
      /deep/ .vjs-big-play-button {
        display: none;
      }
    }
    &-operation {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: rgba($color: #000000, $alpha: 0.5);
      &-icon {
        font-size: 42px;
        cursor: pointer;
      }
      &-name {
        margin-left: 5px;
        cursor: pointer;
        user-select: none;
        font-size: 24px;
      }
    }
  }
}
</style>



