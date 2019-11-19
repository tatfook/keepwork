<template>
  <div class="user-portrait">
    <img class="user-portrait-profile" :style="portraitStyle" :src="portraitUrl" alt="">
    <span v-if="isVip" class="user-portrait-vip" :style="vipStyle">v</span>
    <span v-if="isT" class="user-portrait-tLevel" :class="[`user-portrait-tLevel-${tLevel}`]" :style="tLevelStyle">T{{tLevel}}</span>
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
      return _.get(this.user, 'portrait') || this.defaultPortrait
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
    font-size: 14px;
    background-color: #363636;
    color: #ffd35e;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border-radius: 2px;
  }
  &-tLevel {
    position: absolute;
    bottom: 0;
    font-size: 12px;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
    border-radius: 2px;
    color: #fff;
    letter-spacing: -1px;
    &-1 {
      background-color: #f9723e;
    }
    &-2 {
      background-color: #f82d1d;
    }
    &-3 {
      background-color: #2390f5;
    }
    &-4 {
      background-color: #20ce7e;
    }
    &-5 {
      background-color: #b81abd;
    }
  }
}
</style>
