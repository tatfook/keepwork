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
    playloop: Boolean
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    playerOptions() {
      // videojs options
      return {
        playbackRates: [0.7, 1.0, 1.5, 2.0],
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
    padding-bottom: 42px;
    .vjs-control-bar {
      overflow: hidden;
      position: inherit;
      display: flex;
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
      opacity: 0.7;
    }
    .vjs-big-play-button:hover {
      text-shadow: 0 0 1em #fff;
    }
    .vjs-big-play-button:before {
      content: '\e68c';
    }
    .vjs-big-play-button .vjs-icon-placeholder {
      display: none;
    }
  }
}
</style>
