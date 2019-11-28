<template>
  <div class="user-portrait">
    <img class="user-portrait-profile" :style="portraitStyle" :src="portraitUrl" alt="" @error="showDefaultPortrait">
    <span v-if="isVip" class="user-portrait-vip" :class="[`user-portrait-vip-${size}`, `user-portrait-vip-${badgePosition}`]" :style="vipStyle">V</span>
    <span v-if="isT" class="user-portrait-tLevel" :class="[`user-portrait-tLevel-${tLevel}`, `user-portrait-tLevel-${size}`, `user-portrait-tLevel-${badgePosition}`]" :style="tLevelStyle">T{{tLevel}}</span>
  </div>
</template>
<script>
export default {
  name: 'UserPortrait',
  props: {
    user: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 96,
    },
    size: {
      default: 'medium',
      validator: function(value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1
      },
    },
    badgePosition: {
      default: 'absolute',
      validator: function(value) {
        return ['none', 'relative', 'absolute'].indexOf(value) !== -1
      },
    },
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
        require('@/assets/img/T5.png'),
      ],
    }
  },
  computed: {
    portraitUrl() {
      return _.get(this.user, 'portrait') || this.defaultPortrait
    },
    portraitStyle() {
      return `width :${this.width}px; height:${this.width}px`
    },
    isVip() {
      return _.get(this.user, 'vip', 0) > 0
    },
    vipStyle() {
      if (this.badgePosition !== 'absolute') return ''
      let badgeHeight = this.size == 'small' ? 16 : this.size == 'medium' ? 20 : 24
      let distance = (0.292 * this.width - badgeHeight) / 2
      return `top: ${distance}px;left: ${distance}px;`
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
      if (this.badgePosition !== 'absolute') return ''
      let badgeHeight = this.size == 'small' ? 16 : this.size == 'medium' ? 20 : 24
      let badgeWith = this.size == 'small' ? 24 : this.size == 'medium' ? 30 : 36
      let r = this.width / 2
      let distance = r - badgeHeight - (Math.sqrt(r * r - 2 * badgeWith * badgeHeight) * 5) / 8
      return `right: ${distance}px;`
    },
  },
  methods: {
    showDefaultPortrait(e) {
      const img = e.srcElement
      img.src = this.defaultPortrait
      img.onerror = null
    },
  },
}
</script>
<style lang="scss" scoped>
.user-portrait {
  display: inline-block;
  position: relative;
  line-height: 1;
  &-profile {
    border-radius: 50%;
    object-fit: cover;
    vertical-align: middle;
  }
  &-vip {
    position: absolute;
    background-color: #363636;
    color: #ffd35e;
    text-align: center;
    border-radius: 4px;
    font-weight: bold;
    border: 1px solid #fff;
    padding: 0;
    &-none {
      display: none;
    }
    &-relative {
      position: relative;
      display: inline-block;
    }
    &-small {
      line-height: 14px;
      width: 14px;
      height: 14px;
      font-size: 12px;
    }
    &-medium {
      line-height: 18px;
      width: 18px;
      height: 18px;
      font-size: 14px;
    }
    &-large {
      line-height: 22px;
      width: 22px;
      height: 22px;
      font-size: 16px;
    }
  }
  &-tLevel {
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    border: 1px solid #fff;
    padding: 0;
    &-none {
      display: none;
    }
    &-relative {
      position: relative;
      display: inline-block;
    }
    &-small {
      width: 22px;
      height: 14px;
      line-height: 14px;
      font-size: 12px;
    }
    &-medium {
      width: 28px;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
    }
    &-large {
      width: 34px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
    }
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
