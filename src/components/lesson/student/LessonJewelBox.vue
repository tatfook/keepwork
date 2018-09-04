<template>
  <span v-if="isShowJewel" @mouseover="showTips" @mouseout="closeTips" @click="handleClick" class="jewel-box" :class="{ opened: isJewelOpen  }">
    <div v-if="isJewelOpen" class="jewel-box-coin-wrap">
      <div class="tips">领取成功</div>
      <div class="coin">{{coin}}</div>
    </div>
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
import { lesson } from '@/api'
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
      isShowTips: false,
      needTime: 11,
      time: 0,
      reward: 10,
      _timer: null,
      isReward: true,
      coin: 0
    }
  },
  watch: {
    isConditions(value) {
      if (value && this._learnRecordId) {
        lesson.lessons
          .rewardCoin({ id: this._learnRecordId })
          .then(coin => (this.coin = coin))
          .catch(e => console.error(e))
      }
    }
  },
  async mounted() {
    console.log(this.isShowJewel)
    const { packageId, lessonId } = this.$route.params
    let flag = await lesson.lessons.isReward({ packageId, lessonId })
    if (!flag) {
      console.warn('这个课程包的课程没有领取过知识币')
      this.isReward = false
      this.startTimer()
    }
  },
  computed: {
    ...mapGetters({
      lockCoin: 'lesson/lockCoin',
      lessonUserId: 'lesson/student/lessonUserId',
      userinfo: 'lesson/userinfo',
      isQuizAllRight: 'lesson/student/isQuizAllRight',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      enterClassInfo: 'lesson/student/enterClassInfo',
      learnRecordsId: 'lesson/student/learnRecordsId'
    }),
    _learnRecordId() {
      return this.isBeInClassroom
        ? this.enterClassInfo.learnRecordId
        : this.learnRecordsId
    },
    userId() {
      return this.userinfo.id
    },
    isJewelOpen() {
      return this.coin > 0
    },
    isConditions() {
      return (
        this.time >= this.needTime &&
        this.lockCoin >= this.reward &&
        this.isQuizAllRight &&
        this._learnRecordId
      )
    },
    isShowJewel() {
      return this.lessonUserId !== this.userId && !this.isReward
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
  width: 66px;
  cursor: pointer;
  position: relative;
  background: url('../../../assets/lessonImg/jewelbox.png') no-repeat center
    #fff;
  &.opened {
    background: url('../../../assets/lessonImg/jewelbox2.png') no-repeat center
      #fff;
  }
  &-coin-wrap {
    position: absolute;
    top: -52px;
    left: 0;
    right: -7px;
    font-size: 14px;
    .tips {
      text-align: center;
      margin: 0 auto;
      color: #818181;
    }
    .coin {
      background: #ec761a;
      text-align: center;
      color: white;
      width: 70%;
      margin: 5px auto;
    }
    // width: 46px;
    // font-size: 14px;
    // line-height: 16px;
    // text-align: center;
    // margin: 0 auto;
    // color: white;
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


