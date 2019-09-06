<template>
  <div class="player">
    <video-player ref="videoPlayer" :options="playerOptions" class="vjs-custom-skin" />
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  name: 'VideoPlayer',
  components: {
    videoPlayer
  },
  props: {
    src: String,
    poster: String,
    autoplay: Boolean,
    playloop: Boolean,
    autoSize: {
      type: Boolean,
      default: false
    },
    showRates: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    playerOptions() {
      // videojs options
      const options = {
        playbackRates: this.showRates ? [0.7, 1.0, 1.5, 2.0] : [],
        aspectRatio: '16:9',
        muted: false,
        autoplay: this.autoplay || false,
        loop: this.playloop || false,
        inactivityTimeout: 0,
        sources: [
          {
            type: 'video/mp4',
            src: this.src
          }
        ],
        poster: this.poster
      }
      if (this.autoSize) {
        const { aspectRatio, ...rest } = options
        return rest
      }
      return options
    }
  }
}
</script>

<style lang="scss">
.player {
  .vjs-custom-skin {
    .video-js {
      position: relative;
      .vjs-poster {
        background-size: 100%;
      }
      .vjs-big-play-button {
        font-family: 'iconfont' !important;
        font-style: normal;
        background-color: transparent;
        border: none;
        font-size: 70px;
        color: #409eff;
        width: auto !important;
        height: auto !important;
        line-height: 1 !important;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        margin: 0 !important;
      }
    }
    &:hover {
      .vjs-control-bar {
        visibility: visible;
      }
    }
    .vjs-control-bar {
      overflow: hidden;
      display: flex;
      left: 0;
      visibility: hidden;
    }
    .vjs-big-play-button:hover {
      text-shadow: 0 0 1em #fff;
    }
    .vjs-big-play-button:before {
      content: '';
      display: block;
      width: 42px;
      height: 42px;
      background: url(../../assets/contests/handpick/play.svg);
      background-size: 100%;
    }
    .vjs-big-play-button .vjs-icon-placeholder {
      display: none;
    }
  }
}
</style>
