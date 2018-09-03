<template>
  <span v-if="isShowJewel" @mouseover="showTips" @mouseout="closeTips" @click="handleClick" class="jewel-box" :class="{ opened: isJewelOpen  }">
    <div v-show="isShowTips" @click.stop class="tips-wrap">
      <span class="tips">
        <div class="tips-row">{{$t('lesson.jewelTipsTitle')}}</div>
        <div class="tips-row">{{$t('lesson.jewelTips1')}}
          <span class="tips-time">{{time | toMinute}}</span>
        </div>
        <div class="tips-row">{{$t('lesson.jewelTips2')}}</div>
        <div class="tips-row" v-html="$t('lesson.jewelTips3', {reward: `<sapn class='tips-coin'>${reward}</sapn>`, lockCoin: `<span class='tips-coin'>${lockCoin}</span>`})"></div>
      </span>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'JewelBox',
  props: {
    data: Object
  },
  filters: {
    toMinute(time) {
      let minute = Math.floor(time / 60)
        .toString()
        .padStart(2, '0')
      let second = (time % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    }
  },
  data() {
    return {
      isClicked: false,
      isShowTips: false,
      needTime: 300,
      time: 0,
      reward: 10,
      _timer: null
    }
  },
  mounted() {
    this.startTimer()
  },
  computed: {
    ...mapGetters({
      lockCoin: 'lesson/lockCoin',
      lessonUserId: 'lesson/student/lessonUserId',
      userinfo: 'lesson/userinfo',
      isQuizAllRight: 'lesson/student/isQuizAllRight'
    }),
    userId() {
      return this.userinfo.id
    },
    isJewelOpen() {
      return this.time >= this.needTime && this.lockCoin >= this.reward && this.isQuizAllRight
    },
    isShowJewel() {
      return this.lessonUserId !== this.userId
    }
  },
  methods: {
    handleClick() {
      this.isClicked = !this.isClicked
    },
    startTimer() {
      this.time++
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.startTimer()
      }, 1000)
    },
    showTips() {
      this.isShowTips = true
    },
    closeTips() {
      this.isShowTips = false
    }
  }
}
</script>

<style lang="scss">
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.jewel-box {
  display: inline-block;
  height: 38px;
  width: 49px;
  cursor: pointer;
  background: url('../../../assets/lessonImg/jewelbox.png') no-repeat center
    #fff;
  &.opened {
    background: url('../../../assets/lessonImg/jewelbox2.png') no-repeat center
      #fff;
  }
  .tips-wrap {
    $shadow: 1px 10px 40px rgb(170, 170, 170);
    display: block;
    position: absolute;
    animation: fade-in;
    animation-duration: 0.5s;
    top: 110px;
    left: -26px;
    z-index: 998;
    min-height: 60px;
    width: 800px;
    background: white;
    border: #cacaca;
    box-shadow: $shadow;
    .tips {
      z-index: 34;
      padding: 40px;
      font-size: 16px;
      display: inline-block;
      background-color: #fff;
      word-wrap: break-word;
      .tips-time,
      .tips-coin {
        color: #ec761a;
        font-weight: bold;
      }
      .tips-row {
        line-height: 30px;
      }
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: -14px;
      left: 60px;
      z-index: -1;
      transform: rotate(45deg);
      height: 40px;
      width: 40px;
      background: white;
      box-shadow: $shadow;
    }
  }
}
</style>


