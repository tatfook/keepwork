<template>
  <div class="player">
    <video-player ref="videoPlayer" :options="playerOptions" @ready="playerReadies()" @pause="handleStopButton()" @playing="handlePlayButton()" class="vjs-custom-skin"/>
  </div>
</template>

<script>
import videojs from 'video.js'
import { videoPlayer } from 'vue-video-player'
import { setTimeout } from 'timers'

import "video.js/dist/video-js.css"
import "vue-video-player/src/custom-theme.css"

export default {
  name: "VideoPlayer",
  components: {
    videoPlayer
  },
  props: {
    src: String,
    autoplay: Boolean,
    playloop: Boolean
  },
  methods: {
    playerReadies() {
      this.player.removeChild('bigPlayButton')
      this.playerButton = this.player.addChild('button')

      this.playerButton.addClass("iconfont")
      this.playerButton.addClass("icon-video5")
      this.playerButton.addClass("keepwork-play-button")

      this.playerButton.on(
        'click',
        () => {
          this.player.play()
        }
      )
    },
    handleStopButton() {
      this.playerButton.removeClass("keepwork-play-button-hide")
    },
    handlePlayButton() {
      this.playerButton.removeClass("keepwork-play-button-hide")
      this.playerButton.addClass("keepwork-play-button-hide")
    }
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
        sources: [{
          type: "video/mp4",
          src: this.src
        }],
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
      display: flex;
    }

    .keepwork-play-button {
      position: absolute;
      height: auto;
      top: 50%;
      left: 50%;
      font-size: 70px;
      color: #409EFF;
      width: auto!important;
      margin-left: -35px;
      margin-top: -35px;
      opacity: 0.7;
    }

    .keepwork-play-button-hide {
      display: none;
    }
  }
}
</style>
