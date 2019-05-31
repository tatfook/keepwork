<template>
  <div class="player">
    <video-player ref="videoPlayer" :options="playerOptions" class="vjs-custom-skin" />
  </div>
</template>

<script>
import videojs from 'video.js'
import { videoPlayer } from 'vue-video-player'
import { setTimeout } from 'timers'

import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  name: 'VideoPlayer',
  components: {
    videoPlayer
  },
  props: {
    src: String,
    autoplay: Boolean,
    playloop: Boolean,
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
      return {
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
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.player {
  .vjs-custom-skin {
    &:hover {
      .vjs-control-bar {
        visibility: visible;
      }
    }
    .vjs-control-bar {
      overflow: hidden;
      position: inherit;
      display: flex;
      bottom: 42px;
      left: 0;
      visibility: hidden;
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
      transform: translate(70px, 35px);
    }
    .vjs-big-play-button:hover {
      text-shadow: 0 0 1em #fff;
    }
    .vjs-big-play-button:before {
      content: '';
      display: block;
      width: 42px;
      height: 42px;
      background: url(../../assets/img/play_0.png);
      background-size: 100%;
    }
    .vjs-big-play-button .vjs-icon-placeholder {
      display: none;
    }
  }
}
</style>
