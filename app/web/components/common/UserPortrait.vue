<template>
  <div class="user-portrait">
    <img class="user-portrait-profile" :style="portraitStyle" :src="portraitUrl" alt="">
    <img v-if="isVip" class="user-portrait-vip" :style="vipStyle" :src="vipIcon" alt="">
    <img v-if="isT" class="user-portrait-tLevel" :style="tLevelStyle" :src="tLevelIcon" alt="">
  </div>
</template>
<script>
export default {
  name: 'UserPortrait',
  props: {
    user: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 96
    },
    isCircleMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      vipIcon: require('@/assets/img/VIP.png'),
      tIcons: [
        require('@/assets/img/T1.png'),
        require('@/assets/img/T2.png'),
        require('@/assets/img/T3.png'),
        require('@/assets/img/T4.png'),
        require('@/assets/img/T5.png')
      ]
    }
  },
  computed: {
    portraitUrl() {
      return _.get(this.user, 'portrait', this.defaultPortrait)
    },
    portraitStyle() {
      let borderRadius = this.isCircleMode ? '50%' : 0
      return `width :${this.width}px; height:${this.width}px;border-radius: ${borderRadius};`
    },
    isVip() {
      return _.get(this.user, 'vip', 0) > 0
    },
    vipStyle() {
      let right = this.width * 0.618
      return `right:${right}px`
    },
    tLevel() {
      return _.get(this.user, 'tLevel', 0)
    },
    isT() {
      return this.tLevel > 0
    },
    tLevelIcon() {
      return this.tIcons[this.tLevel - 1] || ''
    },
    tLevelStyle() {
      let left = this.width * 0.618
      return `left:${left}px`
    }
  }
}
</script>
<style lang="scss" scoped>
.user-portrait {
  display: inline-block;
  position: relative;
  img {
    object-fit: cover;
  }
  &-vip {
    position: absolute;
    top: -8px;
  }
  &-tLevel {
    position: absolute;
    bottom: 0;
  }
}
</style>
